// https://github.com/bibekg/react-schedule-selector
import React, { useEffect, useRef, useState } from "react";

import formatDate from 'date-fns/format';
import isSameMinute from 'date-fns/isSameMinute';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import startOfDay from 'date-fns/startOfDay';
import square from "./square";
import { utcToZonedTime } from "date-fns-tz";

import { Grid, GridCell, DateCell } from "../../utils/grid";
import { convertTZ } from "../../utils/utilities";

const preventScroll = (e) => {
    e.preventDefault()
}

const Selector = (props) => {
    const gridRef = useRef(null);
    const [state, setState] = useState({
        selectionType: null,
        selectionStart: null,
    });
    const [counter, setCounter] = useState(0);
    const mySelection = useRef([...props.selection]);
    const myMaybe = useRef([...props.maybe]);
    const mode = useRef(props.selectMode);

    const [isDragging, setIsDragging] = useState(false);
    const [dates, setDates] = useState([]);
    const cellToDate = new Map();

    useEffect(() => {
        document.getElementById("selector").addEventListener("mouseup", endSelection);

        cellToDate.forEach((_, dateCell) => {
            if (dateCell && dateCell.addEventListener) {
                dateCell.addEventListener("touchmove", preventScroll, { passive: false });
            }
        });

        return () => {
            // Anything in here is fired on component unmount.
            document.getElementById("selector").removeEventListener('mouseup', endSelection);
            cellToDate.forEach((_, dateCell) => {
                if (dateCell && dateCell.removeEventListener) {
                    dateCell.removeEventListener("touchmove", preventScroll);
                }
            });
        }
    }, []);

    useEffect(() => {
        renderMatrix();
    }, [props.selection]);

    useEffect(() => {
        mode.current = props.selectMode;
    }, [props.selectMode]);

    const renderMatrix = () => {
        if (state.selectionStart == null) {
            setDates(computeDatesMatrix(props));
            mySelection.current = [...props.selection];
            myMaybe.current = [...props.maybe];
        }
    }

    const computeDatesMatrix = (props) => {
        const matrix = [];
        const minutesInChunk = Math.floor(60 / props.hourlyChunks);

        for (let index = 0; index < props.selectableDates.length; index += 1) {
            const currentDay = [];
            // const startTime = startOfDay(utcToZonedTime(props.selectableDates[index], "America/New_York"));
            const startTime = props.selectableDates[index];
            for (let h = props.minTime; h < props.maxTime; h += 1) {
                if (!props.omitTimes.includes(h)) {
                    for (let c = 0; c < props.hourlyChunks; c += 1) {
                        currentDay.push(addMinutes(addHours(startTime, h), c * minutesInChunk));
                    }
                }
            }
            matrix.push(currentDay);
        }
        // console.log(matrix);
        return matrix;
    }

    const endSelection = () => {
        props.onChange(mySelection.current);
        props.onMaybeChange(myMaybe.current);

        setState({
            selectionType: null,
            selectionStart: null,
        });
    }

    const handleSelectionStartEvent = (startTime) => {
        const currentDates = mode.current === 0 ? props.selection : props.maybe;
        const timeSelected = currentDates.find(a => isSameMinute(a, startTime));

        setState({
            ...state,
            selectionType: timeSelected ? "remove" : "add",
            selectionStart: startTime,
        });
    }

    const handleMouseEnterEvent = (time) => {
        updateAvailabilityDraft(time);
    }

    const handleMouseUpEvent = (time) => {
        updateAvailabilityDraft(time);
    }

    const handleTouchMoveEvent = (event) => {
        setIsDragging(true);
        const cellTime = getTimeFromTouchEvent(event)
        if (cellTime) {
          updateAvailabilityDraft(cellTime)
        }
    }
    const handleTouchEndEvent = () => {
        if (!isDragging) {
            updateAvailabilityDraft(null);
            // endSelection called in useEffect
        }
        else {
            endSelection();
        }
        setIsDragging(false);
    }

    const getTimeFromTouchEvent = (event) => {
        const { touches } = event;

        if (!touches || touches.length === 0) return null;

        const { clientX, clientY } = touches[0];
        const targetElement = document.elementFromPoint(clientX, clientY);
        if (targetElement) {
            const cellTime = cellToDate.get(targetElement);
            return cellTime ?? null;
        }
        return null;
    }

    const updateAvailabilityDraft = (selectionEnd) => {
        const { selectionType, selectionStart } = state;

        if (selectionType === null || selectionStart === null) return;

        let newDates = [];
        if (selectionStart && selectionEnd && selectionType) {
            newDates = square(selectionStart, selectionEnd, dates);
        }

        let nextSelection = [...props.selection];
        let nextMaybe = [...props.maybe];
        
        if (mode.current === 0) {
            if (selectionType === "add") {
                nextSelection = Array.from(new Set([...nextSelection, ...newDates]));
                nextMaybe = nextMaybe.filter(a => !nextSelection.find(b => isSameMinute(a, b)));
                myMaybe.current = nextMaybe;
            }
            else if (selectionType === "remove") {
                nextSelection = nextSelection.filter(a => !newDates.find(b => isSameMinute(a, b)));
            }
            mySelection.current = nextSelection;
        }
        else {
            if (selectionType === "add") {
                nextMaybe = Array.from(new Set([...nextMaybe, ...newDates]));
                nextSelection = nextSelection.filter(a => !nextMaybe.find(b => isSameMinute(a, b)));
                mySelection.current = nextSelection;
            }
            else if (selectionType === "remove") {
                nextMaybe = nextMaybe.filter(a => !newDates.find(b => isSameMinute(a, b)));
            }
            myMaybe.current = nextMaybe;
        }
        setCounter(Math.random() * 10);

        // only when 
        if (selectionEnd === null) {
            endSelection();
        }
    };

    const renderDateCell = (time, selected, selectedMaybe, popular) => {
        const refSetter = (dateCell) => {
            if (dateCell) {
                cellToDate.set(dateCell, time)
            }
        }

        let color = props.selectedColor;
        if (selectedMaybe) {
            color = props.maybeColor;
        }

        return (
            <DateCell
                selected={selected || selectedMaybe}
                ref={refSetter}
                selectedColor={color}
                unselectedColor={props.unselectedColor}
                hoveredColor={props.hoveredColor}
            >
                {popular ? "popular" : ""}
            </DateCell>
        )
    }

    const renderDateCellWrapper = (time) => {
        const startHandler = () => {
            handleSelectionStartEvent(time);
        }

        const selected = mySelection.current.find(a => isSameMinute(a, time));
        const selectedMaybe = myMaybe.current.find(a => isSameMinute(a, time));
        const num = props.selections[time.getTime()]?.length;
        const popular = num >= props.maxNumSelected - 1 && num >= 2;

        return (
            <GridCell
                className="rgdp__grid-cell"
                role="presentation"
                key={time.toISOString()}
                // Mouse handlers
                onMouseDown={startHandler}
                onMouseEnter={() => {
                    handleMouseEnterEvent(time)
                }}
                onMouseUp={() => {
                    handleMouseUpEvent(time)
                }}

                // Touch handlers
                // Since touch events fire on the event where the touch-drag started, there's no point in passing
                // in the time parameter, instead these handlers will do their job using the default Event
                // parameters
                onTouchStart={startHandler}
                onTouchMove={handleTouchMoveEvent}
                onTouchEnd={handleTouchEndEvent}
            >
                {renderDateCell(time, selected, selectedMaybe, popular)}
            </GridCell>
        )
    }

    const renderTimeLabel = (time) => {
        if (time === "") {
            return <p className="time-label"></p>;
        }
        const newTime = new Date(convertTZ(time, "America/New_York"));
        return <p className="time-label">{formatDate(newTime, props.timeFormat)}</p>
    }

    const renderDateLabel = (date) => {
        const newDate = new Date(convertTZ(date, "America/New_York"));
        return <p className="date-label">{formatDate(newDate, props.dateFormat)}</p>
    }

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
            const index = i * numDays
            const time = dates[0][i]
            // Inject the time label at the start of every row
            if (props.hourlyChunks === 1 || i % props.hourlyChunks === 0) {
                dateGridElements.splice(index + i, 0, renderTimeLabel(time))
            }
            else {
                dateGridElements.splice(index + i, 0, renderTimeLabel(""))
            }
        }

        return [
            // Empty top left corner
            <div key="topleft" />,
            // Top row of dates
            ...dates.map((dayOfTimes, index) =>
                React.cloneElement(renderDateLabel(dayOfTimes[0]), { key: `date-${index}` })
            ),
            // Every row after that
            ...dateGridElements.map((element, index) => React.cloneElement(element, { key: `time-${index}` }))
        ]
    }

    return (
        <>
        <div id="selector" className="grid-wrapper">
            <Grid
                columns={dates.length}
                rows={dates[0]?.length}
                columnGap={props.columnGap}
                rowGap={props.rowGap}
                ref={gridRef}
            >
                {renderFullDateGrid()}
            </Grid>
        </div>
        <div className="opacity-0">{counter}</div>
        </>
    );
};

Selector.defaultProps = {
    selection: [],
    selections: {},

    maybe: [],
    maybes: {},

    selectionScheme: "square",
    selectMode: 0,
    minTime: 9,
    maxTime: 23,
    omitTimes: [],

    hourlyChunks: 2,
    selectableDates: [new Date()],
    timeFormat: 'ha',
    dateFormat: 'M/d (eee)',
    columnGap: '2px',
    rowGap: '2px',
    selectedColor: "#95e48d",
    maybeColor: "#ffdc72",
    unselectedColor: "#ddd",
    hoveredColor: "#ccc",
    maxNumSelected: 0,

    onChange: () => { },
    onMaybeChange: () => { },
}

export default Selector;
