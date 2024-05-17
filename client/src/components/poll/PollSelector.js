import React, { useEffect, useState } from "react";
import formatDate from "date-fns/format";
import {
    Grid,
    GridCell,
    PollCell,
    PollDateCell,
    PollNameCell,
    SelectCell,
} from "../../utils/grid";
import { compareDate } from "../../utils/utilities";

const PollSelector = ({
    selection,
    handleSelection,
    selections,
    otherSelections,
    maybe,
    handleMaybe,
    maybes,
    maxNumSelected,
    myName,
    names,
    priority,
    score,
    dates,
    setDates,
}) => {
    // const [dates, setDates] = useState({});

    useEffect(() => {
        if (Object.keys(dates).length === 0) {
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
            const numDates = filteredSelections.map((key) => parseInt(key));
            const newDates = {};
            for (let date of numDates) {
                const iSelected = selections[date]?.includes(myName);
                const iMaybe = maybes[date]?.includes(myName);
                newDates[date] = iSelected ? 0 : iMaybe ? 1 : 2;
            }
            setDates(newDates);
        }
    }, [selections, maybes, otherSelections]);

    const comparePopularity = (a, b) => {
        const numA = parseInt(a);
        const numB = parseInt(b);
        const selA =
            numA in selections
                ? selections[numA].filter((name) => priority[name] === 0).length
                : 0;
        const selB =
            numB in selections
                ? selections[numB].filter((name) => priority[name] === 0).length
                : 0;
        const maybeA =
            numA in maybes
                ? maybes[numA].filter((name) => priority[name] === 0).length
                : 0;
        const maybeB =
            numB in maybes
                ? maybes[numB].filter((name) => priority[name] === 0).length
                : 0;
        const secondSelA =
            numA in selections
                ? selections[numA].filter((name) => priority[name] === 1).length
                : 0;
        const secondSelB =
            numB in selections
                ? selections[numB].filter((name) => priority[name] === 1).length
                : 0;

        const result =
            selB +
            0.5 * maybeB +
            0.25 * secondSelB -
            (selA + 0.5 * maybeA + 0.25 * secondSelA);

        if (result === 0) {
            if (selB === selA) {
                if (maybeB === maybeA) {
                    if (secondSelA === secondSelB) {
                        const secondMaybeA =
                            numA in maybes
                                ? maybes[numA].filter(
                                      (name) => priority[name] === 1
                                  ).length
                                : 0;
                        const secondMaybeB =
                            numB in maybes
                                ? maybes[numB].filter(
                                      (name) => priority[name] === 1
                                  ).length
                                : 0;

                        return secondMaybeB - secondMaybeA;
                    }
                    return secondSelB - secondSelA;
                }

                return maybeB - maybeA;
            }

            return selB - selA;
        }

        return result;
    };

    const handleClick = (e) => {
        e.preventDefault();
        const currentValue = parseInt(e.target.id.substr(1, 2));
        const nextValue = currentValue === 2 ? 0 : currentValue + 1;
        const key = parseInt(e.target.id.substr(3));
        if (!isNaN(key)) {
            const newDates = { ...dates, [key]: nextValue };
            setDates(newDates);

            let newSelection = selection;
            let newMaybe = maybe;
            switch (nextValue) {
                case 0:
                    newSelection = [...selection, new Date(key)];
                    break;
                case 1:
                    newSelection = selection.filter((s) => s.getTime() !== key);
                    newMaybe = [...maybe, new Date(key)];
                    break;
                case 2:
                default:
                    newMaybe = maybe.filter((m) => m.getTime() !== key);
                    break;
            }
            handleSelection(newSelection);
            handleMaybe(newMaybe);
        }
    };

    return (
        <>
            <Grid
                columns={1}
                rows={selections.length}
                columnGap="0"
                rowGap="0"
                className="px-5"
                style={{
                    overflowX: "visible",
                    marginTop: 100,
                }}
            >
                {Object.keys(dates)
                    .sort(compareDate)
                    .map((key) => {
                        const numKey = parseInt(key);
                        const numSelected = selections[numKey]
                            ? selections[numKey].length
                            : 0;

                        return (
                            <React.Fragment key={numKey}>
                                <GridCell>
                                    <PollDateCell
                                        numSelected={numSelected}
                                        maxNumSelected={maxNumSelected}
                                        title={
                                            numSelected >= maxNumSelected - 2
                                                ? "popular"
                                                : ""
                                        }
                                    >
                                        {formatDate(
                                            new Date(numKey),
                                            "M/d (eee)"
                                        )}{" "}
                                        &nbsp;
                                        <b>
                                            {formatDate(
                                                new Date(numKey),
                                                "h:mm a"
                                            )}
                                        </b>
                                    </PollDateCell>
                                </GridCell>
                                <GridCell
                                    className={`text-${
                                        ["success", "warning", "gray"][
                                            dates[numKey]
                                        ]
                                    }`}
                                    onClick={handleClick}
                                >
                                    <SelectCell
                                        id={`c${dates[key]}-${key}`}
                                        onClick={handleClick}
                                        width={100 / (names.length + 1)}
                                        selected={dates[key] === 0}
                                        maybe={dates[key] === 1}
                                        title={
                                            [
                                                "For sure",
                                                "Maybe",
                                                "Unavailable",
                                            ][dates[key]]
                                        }
                                    >
                                        {["O", "△", "X"][dates[key]]}
                                    </SelectCell>
                                </GridCell>
                            </React.Fragment>
                        );
                    })}
            </Grid>
            <div className="ms-5 my-2">
                Click on X to change availability. Click twice if not sure.
            </div>
        </>
    );
};

export default PollSelector;
