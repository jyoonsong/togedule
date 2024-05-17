// https://github.com/bibekg/react-schedule-selector
import React, { useEffect, useRef, useState } from "react";

import formatDate from "date-fns/format";
import isSameMinute from "date-fns/isSameMinute";
import addMinutes from "date-fns/addMinutes";
import addHours from "date-fns/addHours";
import startOfDay from "date-fns/startOfDay";
import { Grid, GridCell, DateCell, ViewerDateCell } from "../../utils/grid";
import { Col, Row, Tooltip } from "react-bootstrap";
import { utcToZonedTime } from "date-fns-tz";
import { convertTZ, post } from "../../utils/utilities";

const preventScroll = (e) => {
    e.preventDefault();
};

const Viewer = (props) => {
    const gridRef = useRef(null);
    const mySelection = useRef([...props.selection]);
    const myMaybe = useRef([...props.myMaybe]);

    const [dates, setDates] = useState([]);
    const [availables, setAvailables] = useState([]);
    const [unavailables, setUnavailables] = useState([]);
    const [tooltip, setTooltip] = useState({ top: 800, left: 0 });
    const cellToDate = new Map();

    useEffect(() => {
        document.addEventListener("click", unclickHandler);
        cellToDate.forEach((_, dateCell) => {
            if (dateCell && dateCell.addEventListener) {
                dateCell.addEventListener("touchmove", preventScroll, {
                    passive: false,
                });
            }
        });

        return () => {
            // Anything in here is fired on component unmount.
            document.removeEventListener("click", unclickHandler);
            cellToDate.forEach((_, dateCell) => {
                if (dateCell && dateCell.removeEventListener) {
                    dateCell.removeEventListener("touchmove", preventScroll);
                }
            });
        };
    }, []);

    useEffect(() => {
        renderMatrix();
    }, [props.selection]);

    const renderMatrix = () => {
        mySelection.current = [...props.selection];
        setDates(computeDatesMatrix(props));
    };

    const computeDatesMatrix = (props) => {
        const matrix = [];
        const minutesInChunk = Math.floor(60 / props.hourlyChunks);

        for (let index = 0; index < props.selectableDates.length; index += 1) {
            const currentDay = [];
            // const startTime = startOfDay(props.selectableDates[index]);
            const startTime = props.selectableDates[index];
            for (let h = props.minTime; h < props.maxTime; h += 1) {
                if (!props.omitTimes.includes(h)) {
                    for (let c = 0; c < props.hourlyChunks; c += 1) {
                        currentDay.push(
                            addMinutes(
                                addHours(startTime, h),
                                c * minutesInChunk
                            )
                        );
                    }
                }
            }
            matrix.push(currentDay);
        }
        // console.log(matrix);
        return matrix;
    };

    const unclickHandler = (event) => {
        if (!event.target?.classList.contains("candidate")) {
            setAvailables([]);
            setUnavailables([]);
        }
    };
    const clickHandler = async (event, timeNum) => {
        event.preventDefault();
        setTooltip({
            top: event.clientY,
            left: event.clientX,
        });
        if (timeNum in props.allSelections) {
            const newAvailables = [...props.allSelections[timeNum]];
            console.log(newAvailables);
            const response = await post("/api/names", {
                ids: newAvailables,
            });
            setAvailables(response.names);

            const newUnavailables = props.allNames.filter(
                (id) => !newAvailables.includes(id)
            );
            console.log(props.allNames);
            console.log(newUnavailables);
            const response2 = await post("/api/names", {
                ids: newUnavailables,
            });
            setUnavailables(response2.names);
        } else {
            setAvailables([]);
            const response = await post("/api/names", {
                ids: props.allNames,
            });
            setUnavailables(response.names);
        }
    };

    const renderDateCell = (time, numSelected) => {
        const refSetter = (dateCell) => {
            if (dateCell) {
                cellToDate.set(dateCell, time);
            }
        };
        return (
            <ViewerDateCell
                numSelected={numSelected}
                maxNumSelected={props.maxNumSelected}
                ref={refSetter}
                selectedColor={props.selectedColor}
                unselectedColor={props.unselectedColor}
                hoveredColor={props.hoveredColor}
                className="candidate"
            />
        );
    };

    const renderDateCellWrapper = (time) => {
        const timeNum = time.getTime();
        let numSelected = 0;
        if (timeNum in props.allSelections) {
            numSelected += props.allSelections[timeNum].length;
        }
        return (
            <GridCell
                className="rgdp__grid-cell"
                role="presentation"
                key={time.toISOString()}
                // on click
                onClick={(event) => {
                    clickHandler(event, timeNum);
                }}
            >
                {renderDateCell(time, numSelected)}
            </GridCell>
        );
    };

    const renderTimeLabel = (time) => {
        if (time === "") {
            return <p className="time-label"></p>;
        }
        const newTime = new Date(convertTZ(time, "America/New_York"));
        return (
            <p className="time-label">
                {formatDate(newTime, props.timeFormat)}
            </p>
        );
    };

    const renderDateLabel = (date) => {
        const newDate = new Date(convertTZ(date, "America/New_York"));
        return (
            <p className="date-label">
                {formatDate(newDate, props.dateFormat)}
            </p>
        );
    };

    const renderFullDateGrid = () => {
        const flattenedDates = [];
        const numDays = dates.length; // cols
        const numTimes = dates[0]?.length; // rows

        for (let j = 0; j < numTimes; j += 1) {
            for (let i = 0; i < numDays; i += 1) {
                flattenedDates.push(dates[i][j]);
            }
        }

        const dateGridElements = flattenedDates.map(renderDateCellWrapper);
        for (let i = 0; i < numTimes; i += 1) {
            const index = i * numDays;
            const time = dates[0][i];
            // Inject the time label at the start of every row
            if (props.hourlyChunks === 1 || i % props.hourlyChunks === 0) {
                dateGridElements.splice(index + i, 0, renderTimeLabel(time));
            } else {
                dateGridElements.splice(index + i, 0, renderTimeLabel(""));
            }
        }

        return [
            // Empty top left corner
            <div key="topleft" />,
            // Top row of dates
            ...dates.map((dayOfTimes, index) =>
                React.cloneElement(renderDateLabel(dayOfTimes[0]), {
                    key: `date-${index}`,
                })
            ),
            // Every row after that
            ...dateGridElements.map((element, index) =>
                React.cloneElement(element, { key: `time-${index}` })
            ),
        ];
    };

    return (
        <>
            <div className="grid-wrapper">
                <Grid
                    columns={dates.length}
                    rows={dates[0]?.length}
                    columnGap={props.columnGap}
                    rowGap={props.rowGap}
                    ref={gridRef}
                >
                    {renderFullDateGrid()}
                </Grid>
                <Tooltip
                    className={
                        (availables?.length > 0 || unavailables?.length > 0) &&
                        "show"
                    }
                    placement="bottom"
                    style={{
                        position: "fixed",
                        top: tooltip.top,
                        left: tooltip.left,
                    }}
                >
                    <Row className="tooltip-row">
                        <Col className="col" xs={12} md={5}>
                            <div className="text-primary">
                                <b>Available</b>
                            </div>
                            {availables?.length > 0 ? (
                                availables.map((a, i) => <div key={i}>{a}</div>)
                            ) : (
                                <i className="text-muted">None</i>
                            )}
                        </Col>
                        <Col className="col" xs={12} md={7}>
                            <div className="text-danger">
                                <b>Unavailable</b>
                            </div>
                            {unavailables?.length > 0 ? (
                                unavailables.map((a, i) => (
                                    <div key={i}>{a}</div>
                                ))
                            ) : (
                                <i className="text-muted">None</i>
                            )}
                        </Col>
                    </Row>
                </Tooltip>
            </div>
            <div className="opacity-0">0</div>
        </>
    );
};

Viewer.defaultProps = {
    selection: [], // my selection
    allSelections: [], // everyone' selections

    myMaybe: [], // my maybe
    otherMaybes: [], // others' maybes

    allNames: [],

    selectionScheme: "square",
    minTime: 9,
    maxTime: 23,
    omitTimes: [],

    hourlyChunks: 2,
    selectableDates: [new Date()],
    timeFormat: "ha",
    dateFormat: "M/d (eee)",
    columnGap: "2px",
    rowGap: "2px",
    selectedColor: "#a5d8ff",
    unselectedColor: "#fff",
    hoveredColor: "#d0ebff",
    maxNumSelected: 1,
    onChange: () => {},
};

export default Viewer;
