import React, { useEffect, useState } from "react";
import formatDate from "date-fns/format";
import {
    Grid,
    GridCell,
    PollCell,
    PollDateCell,
    PollNameCell,
} from "../../utils/grid";
import Select from "../modules/Select";
import { compareDate, post } from "../../utils/utilities";
import { useStore } from "../../store";

const PollOrganizer = ({
    selections,
    otherSelections,
    maybes,
    allNames,
    maxNumSelected,
    priority,
    score,
    dates,
    setDates,
    defaultMode,
}) => {
    const currentUser = useStore((state) => state.currentUser);
    const [sortMode, setSortMode] = useState(defaultMode ? defaultMode : 0);

    useEffect(() => {
        if (dates?.length === 0) {
            // if the score is 1, show promising times
            // if the score is 2, show possible times
            let threshold = score === 1 ? maxNumSelected : maxNumSelected - 1;
            let filteredSelections = Object.keys(otherSelections).filter(
                (s) =>
                    otherSelections[s].length +
                        0.5 * (maybes[s] ? maybes[s].length : 0) >=
                    threshold
            );
            // if there are too many options to show, slightly increase the threshold
            if (filteredSelections.length > 16) {
                threshold = threshold + 1;
                filteredSelections = Object.keys(otherSelections).filter(
                    (s) =>
                        otherSelections[s].length +
                            0.5 * (maybes[s] ? maybes[s].length : 0) >=
                        threshold
                );
            }
            // if there are too few options to show, slightly decrease the threshold
            if (filteredSelections.length <= 1) {
                threshold = threshold - 1;
                filteredSelections = Object.keys(otherSelections).filter(
                    (s) =>
                        otherSelections[s].length +
                            0.5 * (maybes[s] ? maybes[s].length : 0) >=
                        threshold
                );
            }
            const newDates = filteredSelections
                .map((key) => parseInt(key))
                .sort(sortMode === 0 ? compareDate : comparePopularity);
            console.log(newDates);
            setDates(newDates);
        }
    }, [selections, sortMode, otherSelections]);

    useEffect(() => {
        console.log(new Date(dates[0]));
    }, [dates]);

    const changeMode = (newMode) => {
        setSortMode(newMode);

        if (dates?.length > 0) {
            if (newMode === 0) {
                const newDates = dates.sort(compareDate);
                setDates(newDates);
            } else {
                const newDates = dates.sort(comparePopularity);
                setDates(newDates);
            }
        }
    };

    const comparePopularity = (a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        const selA = numA in selections ? selections[numA].length : 0;
        const selB = numB in selections ? selections[numB].length : 0;
        const maybeA = numA in maybes ? maybes[numA].length : 0;
        const maybeB = numB in maybes ? maybes[numB].length : 0;

        const result = selB - selA; // (selB + 0.5 * maybeB + 0.25 * secondSelB) - (selA + 0.5 * maybeA + 0.25 * secondSelA);

        if (result === 0) {
            if (selB === selA) {
                return maybeB - maybeA;
            }

            return selB - selA;
        }

        return result;
    };

    return (
        <>
            <Select
                title={"Sort"}
                options={["Early Date First", "Popular First"]}
                mode={sortMode}
                setMode={changeMode}
            />
            <Grid
                columns={allNames.length}
                rows={Object.keys(selections).length}
                columnGap="0"
                rowGap="0"
                style={{
                    overflowX: "visible",
                }}
            >
                <GridCell></GridCell>
                {allNames.map((userId, index) => (
                    <GridCell key={index}>
                        <PollNameCell>
                            {userId === currentUser?._id
                                ? "You"
                                : allNames[index]}
                        </PollNameCell>
                    </GridCell>
                ))}

                {dates.map((numKey) => {
                    const numSelected = selections[numKey]
                        ? selections[numKey].length
                        : 0;

                    return (
                        <React.Fragment key={numKey}>
                            <GridCell>
                                <PollDateCell
                                    id={`d${numKey}`}
                                    className="poll-date"
                                    numSelected={numSelected}
                                    maxNumSelected={maxNumSelected}
                                >
                                    {formatDate(new Date(numKey), "M/d (eee)")}{" "}
                                    &nbsp;
                                    <b>
                                        {formatDate(new Date(numKey), "h:mm a")}
                                    </b>
                                </PollDateCell>
                            </GridCell>
                            {allNames.map((name, i) => {
                                const isSelected =
                                    selections[numKey]?.includes(name);
                                const isMaybe = maybes[numKey]?.includes(name);
                                return (
                                    <GridCell
                                        key={i}
                                        className={`text-${
                                            isSelected
                                                ? "success"
                                                : isMaybe
                                                ? "warning"
                                                : "secondary"
                                        }`}
                                    >
                                        <PollCell
                                            selected={isSelected}
                                            maybe={isMaybe}
                                        >
                                            {isSelected
                                                ? "O"
                                                : isMaybe
                                                ? "△"
                                                : "X"}
                                        </PollCell>
                                    </GridCell>
                                );
                            })}
                        </React.Fragment>
                    );
                })}
            </Grid>
        </>
    );
};

export default PollOrganizer;
