import React, { useEffect, useRef, useState } from "react";
import { Col, Form, Row, Button, Container } from "react-bootstrap";
import { useStore } from "../../store";
import { get, post } from "../../utils/utilities";
import Selector from "../matrix/Selector";
import Viewer from "../matrix/Viewer";
import Select from "../modules/Select";
import PollSelector from "../poll/PollSelector";

import dragImage from "../../images/drag-left.gif";
import Poll from "../poll/Poll";
import Scale from "../modules/Scale";
import { notification } from "antd-notifications-messages";
import { Link } from "react-router-dom";

const TaskTogedule = ({ setValid, matrix, setNote, note, total }) => {
    const initialDates = matrix.dates.map((date) => new Date(date));
    const currentUser = useStore((state) => state.currentUser);
    const setCurrentUser = useStore((state) => state.setCurrentUser);

    const [loading, setLoading] = useState(true);

    const [selectableDates, setSelectableDates] = useState(initialDates);
    const [omitTimes, setOmitTimes] = useState([]);

    const [selection, setSelection] = useState([]); // changes whenever user drags new time
    const [selections, setSelections] = useState({}); // changes only once when matrix loads
    const [allSelections, setAllSelections] = useState([]); // changes whenever user drags new time

    const [maybe, setMaybe] = useState([]);
    const [maybes, setMaybes] = useState({});
    const [allMaybes, setAllMaybes] = useState({});

    const [names, setNames] = useState([]);
    const [allNames, setAllNames] = useState([]);
    const [priority, setPriority] = useState({});

    const [selectMode, setSelectMode] = useState(0); // 0: sure 1: maybe
    const [mode, setMode] = useState(0); // 0: matrix 1: poll
    const [hideLessOptions, setHideLessOptions] = useState(false);
    const [score, setScore] = useState(null); // [1, 4]

    const [showSelector, setShowSelector] = useState(true);
    const [showGuide, setShowGuide] = useState(true);

    const [dates, setDates] = useState([]);
    const [pollDates, setPollDates] = useState({});

    const [name, setName] = useState(currentUser ? currentUser.name : "");
    const nameRef = useRef();

    let isWaiting = false;
    let isMaybeWaiting = false;

    const alertError = (text) => {
        notification({
            type: "error",
            title: text,
        });
    };

    useEffect(() => {
        // show guide for 3 seconds
        if (!loading) {
            setTimeout(() => {
                setShowGuide(false);
            }, 3 * 1000);
        }
    }, [loading]);

    useEffect(() => {
        console.log(currentUser);
        setAllNames([...names, currentUser?._id]);
    }, [currentUser, names]);

    useEffect(() => {
        if (!matrix) return;

        if (matrix.priority) {
            setPriority(matrix.priority);
        }

        // set my selection, others' selections, and others' names
        const { otherSelections, mySelection, newNames } = processSelections(
            matrix.selections
        );
        setSelections(otherSelections);
        setSelection(mySelection);
        setNames(newNames);

        const result = processSelections(matrix.maybes);
        setMaybes(result["otherSelections"]);
        setMaybe(result["mySelection"]);

        // decide the mode
        decideMode(matrix, mySelection, otherSelections);
    }, [matrix]);

    useEffect(() => {
        const newSelections = processAllSelections(selections, selection);
        setAllSelections(newSelections);

        if (selection.length > 0) {
            setValid(true);
        }
    }, [selections, selection]);

    useEffect(() => {
        const newMaybes = processAllSelections(maybes, maybe);
        setAllMaybes(newMaybes);
    }, [maybes, maybe]);

    const processAllSelections = (selections, selection) => {
        const newSelections = { ...selections };
        for (let date of selection) {
            const key = date.getTime();
            if (key in newSelections) {
                newSelections[key] = [...newSelections[key], currentUser?._id];
            } else {
                newSelections[key] = [currentUser?._id];
            }
        }
        return newSelections;
    };

    const decideMode = async (matrix, mySelection, otherSelections) => {
        if (!matrix) {
            setLoading(false);
            return;
        }

        const numExpectedTotal = total;

        // the very first first attendee
        const numFinished = matrix?.selections.filter(
            (s) => s.selection?.length > 0 && s.user_id !== currentUser?._id
        ).length;
        if (numFinished === 0) {
            setHideLessOptions(true);

            setLoading(false);
            return;
        }

        // calculate promising (max) & possible (max - 1) times
        let numPromising = 0;

        const max = getMaxNumSelected(otherSelections);
        const maxFiltered = Object.keys(otherSelections).filter(
            (s) =>
                otherSelections[s].length +
                    0.5 * (maybes[s] ? maybes[s].length : 0) >=
                max
        );
        const maxMinusOneFiltered = Object.keys(otherSelections).filter(
            (s) =>
                otherSelections[s].length +
                    0.5 * (maybes[s] ? maybes[s].length : 0) >=
                max - 1
        );
        numPromising = maxFiltered.length;
        console.log(numPromising);

        // use GPT-4 to determine the format
        try {
            const response = await post(`/api/decide`, {
                numExpectedTotal: numExpectedTotal,
                numFinished: numFinished,
                numMostPromising: numPromising, // max
                numPromising: maxMinusOneFiltered.length, // max - 1
                numMax: max,
                selections: otherSelections,
            });
            console.log(response);

            // score is 1 or 2
            setScore(response.score);
            if (response.score <= 2) {
                setMode(1);

                setLoading(false);
                return;
            }
            // score is 3 or 4
            else {
                console.log("stat", numFinished, max);
                let threshold = 0; // do not omit at all (0 or 1 respondants so far)
                if (numFinished >= 8 && max > 4) {
                    threshold = 4; // if no one or 1 or 2 or 3 are available, omit the row or column (8 or more respondants so far)
                } else if (numFinished >= 6 && max > 3) {
                    threshold = 3; // if no one or 1 or 2 are available, omit the row or column (6 or 7 respondants so far)
                } else if (numFinished >= 4 && max > 2) {
                    threshold = 2; // if no one or only 1 is available, omit the row or column (4 or 5 respondants so far)
                } else if (numFinished >= 2 && max > 1) {
                    threshold = 1; // if no one is available, omit the row or column (2 or 3 respondants so far)
                }
                console.log("threshold", threshold);

                // reduce the number of cols
                const newOmitDays = [];
                for (let day of initialDates) {
                    let omit = true;
                    const keys = Object.keys(otherSelections).filter(
                        (k) => k >= day && k < day + 86400000 // 1000 ms * 60 s * 60 m * 24 h (1 day)
                    );
                    if (threshold === 0 && keys?.length === 0) {
                        omit = false;
                    }
                    for (let time of keys) {
                        if (
                            (threshold === 0 && !otherSelections[time]) ||
                            otherSelections[time]?.length >= threshold
                        ) {
                            omit = false;
                            break;
                        }
                    }
                    if (omit) {
                        newOmitDays.push(day);
                    }
                }
                const newSelectableDates = selectableDates.filter(
                    (d) => !newOmitDays.includes(d)
                );
                setSelectableDates(newSelectableDates);

                // reduce the number of rows
                const newOmitTimes = [];
                let previous = true;
                for (
                    let time = matrix?.startTime;
                    time < matrix?.endTime;
                    time++
                ) {
                    let omit = true;
                    for (let day of initialDates) {
                        const key = day + time * 1000 * 60 * 60;
                        const key2 = day + time * 1000 * 60 * 60;
                        if (
                            (threshold === 0 && !otherSelections[key]) ||
                            (threshold === 0 && !otherSelections[key2]) ||
                            otherSelections[key]?.length >= threshold ||
                            otherSelections[key2]?.length >= threshold
                        ) {
                            omit = false;
                            previous = false;
                            break;
                        }
                    }
                    if (omit && previous) {
                        newOmitTimes.push(time + 4);
                        console.log(newOmitTimes);
                    }
                }
                previous = true;
                for (let time = 20; time >= 9; time--) {
                    let omit = true;
                    for (let day of initialDates) {
                        const key = day + time * 1000 * 60 * 60;
                        const key2 = day + time * 1000 * 60 * 60;
                        if (
                            (threshold === 0 && !otherSelections[key]) ||
                            (threshold === 0 && !otherSelections[key2]) ||
                            otherSelections[key]?.length >= threshold ||
                            otherSelections[key2]?.length >= threshold
                        ) {
                            omit = false;
                            previous = false;
                            break;
                        }
                    }
                    if (omit && previous) {
                        newOmitTimes.push(time + 4);
                        console.log(newOmitTimes);
                    }
                }

                setOmitTimes(newOmitTimes);

                setLoading(false);
                return;
            }
        } catch (err) {
            console.log(err);
            alert("Please set up Open AI API keys in the settings page");
        }
    };

    const processSelections = (selections) => {
        // data structure
        // date: [name, name]
        const result = {};
        const newNames = [];
        let mySelection = [];
        if (selections && selections.length > 0) {
            for (let attendee of selections) {
                if (attendee.user_id !== currentUser?._id) {
                    for (let time of attendee.selection) {
                        // other
                        if (!(time in result)) {
                            result[time] = [];
                        }
                        result[time].push(attendee.user_id);
                    }
                    newNames.push(attendee.user_id);
                } else {
                    mySelection = attendee.selection.map((s) => new Date(s));
                }
            }
        }
        return {
            otherSelections: result,
            mySelection: mySelection,
            newNames: newNames.sort(),
        };
    };

    const handleMaybe = async (value) => {
        if (!nameRef.current.value || nameRef.current.value?.length === 0) {
            alertError("Please enter your name first");
            return;
        }

        const newSelection = Array.from(new Set(value.map((v) => v.getTime())));
        const unique = newSelection.map((v) => new Date(v));
        setMaybe(unique);
        // save maybe selection
        if (!isMaybeWaiting) {
            // && newSelection.toString() !== selection.toString()) {
            isMaybeWaiting = true;
            await saveMaybe(newSelection);

            isMaybeWaiting = false;
        }
    };

    const saveMaybe = async (newSelection) => {
        try {
            const response = await post(`api/event/maybes/${matrix._id}`, {
                selection: newSelection,
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSelection = async (value) => {
        if (!nameRef.current.value || nameRef.current.value?.length === 0) {
            alertError("Please enter your name first");
            return;
        }

        const newSelection = Array.from(new Set(value.map((v) => v.getTime())));
        const unique = newSelection.map((v) => new Date(v));
        setSelection(unique);
        // save selection
        if (!isWaiting) {
            // && newSelection.toString() !== selection.toString()) {
            isWaiting = true;
            await saveSelection(newSelection);

            isWaiting = false;
        }
    };

    const saveSelection = async (newSelection) => {
        try {
            const response = await post(`/api/event/selections/${matrix._id}`, {
                selection: newSelection,
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    };

    const getMaxNumSelected = (allSelections) => {
        if (allSelections) {
            const lengths = Object.keys(allSelections).map(
                (key) => allSelections[key].length
            );
            if (lengths.length === 0) {
                return 0;
            }
            return Math.max(...lengths);
        }
        return 0;
    };

    const handleChange = (e) => {
        setNote(e.target.value);
    };

    const changeMode = async () => {
        setMode(mode === 0 ? 1 : 0);
    };

    const handleNameBlur = async (e) => {
        if (name?.length > 0) {
            if (currentUser) {
                // update name
                const response = await post("/api/event/name", {
                    name: name,
                    eventId: matrix?._id,
                });
                console.log(response);
            } else {
                // create user
                const user = await post("/api/signup", {
                    name: name,
                    eventId: matrix?._id,
                });
                if (user?._id) {
                    setCurrentUser(user);
                    localStorage.setItem("currentUserId", user._id);
                    console.log(user);
                }
            }
        }
    };

    const maxNumSelected = getMaxNumSelected(allSelections);

    if (loading) {
        return (
            <div className="d-flex align-items-center justify-content-center">
                Loading...
            </div>
        );
    }

    return (
        <>
            <Row>
                <Col xs={12} className="d-flex flex-row">
                    <div className="me-3 mb-3 d-flex align-items-center">
                        Name:
                        <Form.Control
                            className="my-3 ms-1"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            onBlur={handleNameBlur}
                            ref={nameRef}
                        />
                    </div>

                    {mode === 0 ? (
                        <div className="me-3 mb-3">
                            <Select
                                title={"Possibility Mode"}
                                options={["✅ Sure", "🤔 Maybe"]}
                                mode={selectMode}
                                setMode={setSelectMode}
                            />
                        </div>
                    ) : (
                        ""
                    )}
                    <div className="me-3 mb-3">
                        <Scale maxSelected={maxNumSelected} />
                    </div>

                    {!hideLessOptions && (
                        <div className="me-3 mb-3">
                            <Button
                                className="w-100 my-3"
                                variant="outline-primary"
                                onClick={changeMode}
                            >
                                {mode === 0
                                    ? "I want to see FEWER options"
                                    : "I want to see MORE options"}
                            </Button>
                        </div>
                    )}

                    {(!currentUser ||
                        currentUser.organizingEvents.includes(matrix?._id)) && (
                        <div className="me-3 mb-3">
                            <Button
                                className="w-100 my-3"
                                variant="outline-primary"
                                as={Link}
                                to={`/o?id=${matrix?._id}`}
                            >
                                I'm the organizer
                            </Button>
                        </div>
                    )}
                </Col>
            </Row>
            <Row>
                <Col xs={12} md={6}>
                    {mode === 0 ? (
                        <div className="matrix">
                            <Selector
                                selectableDates={selectableDates}
                                minTime={matrix?.startTime}
                                maxTime={matrix?.endTime}
                                selection={selection}
                                selections={selections}
                                maybe={maybe}
                                maybes={maybes}
                                omitTimes={omitTimes}
                                selectMode={selectMode}
                                maxNumSelected={maxNumSelected}
                                onChange={handleSelection}
                                onMaybeChange={handleMaybe}
                                maybeColor="#ffdc72" // yellow
                                selectedColor="#95e48d" // green
                            />
                            <div className={`guide ${!showGuide && "hidden"}`}>
                                <img src={dragImage} />
                                <b>Drag to select times</b>
                            </div>
                        </div>
                    ) : (
                        <div className="poll small-text">
                            <PollSelector
                                selection={selection}
                                selections={allSelections}
                                otherSelections={selections}
                                handleSelection={handleSelection}
                                maybe={maybe}
                                maybes={allMaybes}
                                handleMaybe={handleMaybe}
                                maxNumSelected={maxNumSelected}
                                myName={currentUser?._id}
                                names={names}
                                priority={priority}
                                score={score}
                                dates={pollDates}
                                setDates={setPollDates}
                            />
                        </div>
                    )}
                </Col>
                <Col xs={12} md={6}>
                    {mode === 0 ? (
                        <Viewer
                            selectableDates={selectableDates}
                            minTime={matrix?.startTime}
                            maxTime={matrix?.endTime}
                            selection={selection}
                            allSelections={allSelections}
                            omitTimes={omitTimes}
                            allNames={allNames}
                        />
                    ) : (
                        <div className="poll small-text">
                            <Poll
                                selections={allSelections}
                                otherSelections={selections}
                                maybes={allMaybes}
                                allNames={allNames}
                                maxNumSelected={maxNumSelected}
                                priority={priority}
                                score={score}
                                dates={dates}
                                setDates={setDates}
                            />
                        </div>
                    )}
                </Col>
            </Row>
            <Form.Control
                type="text"
                as="textarea"
                placeholder="Leave a note for the organizer. (e.g., I am available at ... I prefer to meet at ... I am not sure if ...)"
                value={note}
                onChange={handleChange}
                rows={6}
                required
                className="mt-5"
            />
        </>
    );
};

export default TaskTogedule;
