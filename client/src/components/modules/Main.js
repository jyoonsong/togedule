import React, { useEffect, useState } from "react";
import { Row, Col, Tab, Tabs } from "react-bootstrap";
import { useStore } from "../../store";

import Viewer from "../matrix/Viewer";
import Scale from "./Scale";
import Priority from "./Priority";
import Rank from "../rank/Rank";
import PollOrganizer from "../poll/PollOrganizer";

const Main = ({ matrix, mode, setMode, setHideLessOptions }) => {
    const currentUser = useStore((state) => state.currentUser);
    const [showGuide, setShowGuide] = useState(true);
    const [priority, setPriority] = useState({});
    const [names, setNames] = useState([]);
    const [ids, setIds] = useState([]);

    const [selection, setSelection] = useState([]); // changes whenever user drags new time
    const [selections, setSelections] = useState({}); // changes only once when matrix loads
    const [allSelections, setAllSelections] = useState({}); // changes whenever user drags new time

    const [selectionsWithId, setSelectionsWithId] = useState({}); // changes only once when matrix loads

    const [maybe, setMaybe] = useState([]);
    const [maybes, setMaybes] = useState({});
    const [allMaybes, setAllMaybes] = useState({});

    const [dates, setDates] = useState([]);

    useEffect(() => {
        setTimeout(() => {
            setShowGuide(false);
        }, 3 * 1000);
    }, []);

    useEffect(() => {
        if (!matrix) return;

        if (matrix.priority) {
            setPriority(matrix.priority);
        }

        // set my selection, others' selections, and others' names
        const { otherSelections, mySelection, newNames } = processSelections(
            matrix.selections
        );
        console.log(mySelection);
        setSelections(otherSelections);
        setSelection(mySelection);
        setNames(newNames);

        const result = processSelections(matrix.maybes);
        setMaybes(result["otherSelections"]);
        setMaybe(result["mySelection"]);

        // decide the mode
        setMode(1);
    }, [matrix]);

    useEffect(() => {
        const {
            otherSelections,
            selectionsById,
            mySelection,
            newNames,
            newIds,
        } = processSelections(matrix?.selections);
        setSelections(otherSelections);
        setSelectionsWithId(selectionsById);
        setSelection(mySelection);
        setNames(newNames);
        setIds(newIds);

        setMode(1);
    }, [currentUser]);

    useEffect(() => {
        const newSelections = processAllSelections(selections, selection);
        setAllSelections(newSelections);
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
                newSelections[key] = [...newSelections[key], currentUser?.name];
            } else {
                newSelections[key] = [currentUser?.name];
            }
        }
        return newSelections;
    };

    const processSelections = (selections) => {
        // data structure
        // date: [name, name]
        const result = {};
        const resultById = {};
        const newNames = [];
        const newIds = [];
        let mySelection = [];
        if (selections && selections.length > 0) {
            for (let attendee of selections) {
                if (attendee.name !== currentUser?.name) {
                    for (let time of attendee.selection) {
                        // other
                        if (!(time in result)) {
                            result[time] = [];
                            resultById[time] = [];
                        }
                        result[time].push(attendee.name);
                        resultById[time].push(attendee.user_id);
                    }
                    newNames.push(attendee.name);
                    newIds.push(attendee.user_id);
                } else {
                    mySelection = attendee.selection.map((s) => new Date(s));
                }
            }
        }
        return {
            otherSelections: result,
            selectionsById: resultById,
            mySelection: mySelection,
            newNames: newNames.sort(),
            newIds: newIds,
        };
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

    const selectableDates = matrix?.dates.map(
        (date) => new Date(parseInt(date))
    );
    const maxNumSelected = getMaxNumSelected(allSelections);

    return (
        <Row className="admin">
            <Col
                xs={12}
                md={4}
                style={{ overflowX: "scroll", fontSize: "87%" }}
            >
                <Tabs
                    defaultActiveKey={"second"}
                    activeKey={"second"}
                    className="mt-md-3 first"
                >
                    <Tab eventKey="second" title="Everyone's Availability">
                        {/* view matrix */}
                        <div
                            className={`px-3 ${
                                mode === 0 ? "mode-matrix" : "mode-poll"
                            }`}
                        >
                            <h4 className="tab-title">
                                Everyone's Availability
                            </h4>
                            {mode === 0 && (
                                <Scale maxSelected={maxNumSelected} />
                            )}
                            <div className="matrix">
                                <Viewer
                                    selectableDates={selectableDates}
                                    minTime={matrix.startTime}
                                    maxTime={matrix.endTime}
                                    selection={selection}
                                    allSelections={selectionsWithId}
                                    allNames={ids}
                                    maxNumSelected={maxNumSelected}
                                />
                            </div>
                            <div className="poll small-text mb-5 pb-5">
                                <PollOrganizer
                                    selections={selections}
                                    otherSelections={selections}
                                    maybes={allMaybes}
                                    allNames={names}
                                    maxNumSelected={maxNumSelected}
                                    priority={priority}
                                    dates={dates}
                                    setDates={setDates}
                                    defaultMode={1}
                                />
                            </div>
                        </div>
                    </Tab>
                </Tabs>
            </Col>

            <Col xs={12} md={4}>
                <Tabs defaultActiveKey="first" className="mt-md-3">
                    <Tab
                        eventKey="first"
                        title="Recommendations"
                        className="px-3 small-text"
                    >
                        <Rank
                            selections={allSelections}
                            maybes={allMaybes}
                            allNames={names}
                            priority={priority}
                        />
                    </Tab>
                </Tabs>
            </Col>
            <Col xs={12} md={4}>
                <Tabs defaultActiveKey="first" className="mt-md-3">
                    <Tab
                        eventKey="first"
                        title="Participants"
                        className="small-text"
                    >
                        <Priority
                            matrixId={matrix._id}
                            otherNames={names}
                            priority={priority}
                            setPriority={setPriority}
                        />
                    </Tab>
                </Tabs>
            </Col>
        </Row>
    );
};

export default Main;
