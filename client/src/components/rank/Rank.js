import React, { useEffect, useState } from "react";
import formatDate from "date-fns/format";

const Rank = ({ selections, maybes, allNames, priority }) => {
    const [dates, setDates] = useState([]);

    useEffect(() => {
        const newDates = Object.keys(selections).map((key) => parseInt(key));
        setDates(newDates);
    }, [selections]);

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

    const handleClick = (numKey) => {
        const els = Array.from(document.querySelectorAll(".poll-date"));
        els.forEach((el) => {
            if (el.id === `d${numKey}`) {
                el.style.border = "2px solid red";
            } else {
                el.style.border = "";
            }
        });
    };

    const generateText = (numKey) => {
        const numSure = numKey in selections ? selections[numKey].length : 0;
        const numMaybe = numKey in maybes ? maybes[numKey].length : 0;

        let start = "";
        if (numSure < allNames.length - 3) {
            // more than 3 cannot come
            start = `${selections[numKey]?.join(", ")} can come for sure`;
        } else if (numSure > 0) {
            // less than 3 cannot come
            const notcoming = allNames.filter(
                (name) => !selections[numKey]?.includes(name)
            );
            if (notcoming?.length > 0) {
                start = `Everyone except ${notcoming.join(
                    ", "
                )} can come for sure`;
            } else {
                start = `Everyone can come for sure`;
            }
        } else {
            // nobody can come
            start = "No one can come for sure";
        }

        let end = "";
        if (numMaybe > 0) {
            end = `, and ${maybes[numKey].join(", ")} might be available.`;
        } else {
            end = ".";
        }

        return `${start}${end}`;
    };

    return (
        <div className="ps-3">
            <div className="text-muted mb-3">
                The recommendations will get adjusted with regards to the
                priority settings on the right.
            </div>
            {dates
                .sort(comparePopularity)
                .slice(0, 3)
                .map((numKey, index) => {
                    return (
                        <div
                            key={numKey}
                            className="border mb-2 p-2 pointer"
                            onClick={() => handleClick(numKey)}
                        >
                            <b className="text-primary">
                                {index + 1}.{" "}
                                {formatDate(
                                    new Date(numKey),
                                    "M/d (eee) h:mm a"
                                )}
                            </b>
                            <p>{generateText(numKey)}</p>
                        </div>
                    );
                })}
        </div>
    );
};

export default Rank;
