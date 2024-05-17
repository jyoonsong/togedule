import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { post } from "../../utils/utilities";

const Priority = ({ matrixId, otherNames, priority, setPriority }) => {
    useEffect(() => {
        setAllValues(0, true);
    }, [otherNames]);

    const setAllValues = (val, initial) => {
        const newPriority = {};
        const numOthers = otherNames ? otherNames.length : 0;
        for (let i = 0; i < numOthers; i++) {
            const name = otherNames[i];
            if (name in priority && initial) {
                newPriority[name] = priority[name];
            } else {
                newPriority[name] = val;
            }
        }
        setPriority(newPriority);
        savePriority(newPriority);
    };

    const handleChange = (e) => {
        const name = e.target.id.substr(3);
        const val = parseInt(e.target.id.substr(1, 2));

        if (name === "All") {
            setAllValues(val, false);
        } else {
            const newPriority = {
                ...priority,
                [name]: val,
            };
            setPriority(newPriority);

            savePriority(newPriority);
        }
    };

    const savePriority = async (newPriority) => {
        const response = await post(`/api/event/priority/${matrixId}`, {
            priority: newPriority,
        });
        console.log(response);
    };

    const getText = (index) => {
        switch (index) {
            case 0:
                return "Important";
            case 1:
                return "Optional";
            case 2:
                return "Not coming";
            default:
                return "click";
        }
    };

    return (
        <div>
            {priority ? (
                <div className="ps-4 mt-5 vertical-align-bottom">
                    <Row>
                        <Col xs={3}></Col>
                        {[
                            "Must be present",
                            "Optional to attend",
                            "Do not consider",
                        ].map((option, i) => (
                            <Col key={i} xs={3} className="pb-2 text-muted">
                                <b>{option}</b>
                            </Col>
                        ))}
                    </Row>

                    {["All", ...otherNames].map((name, i) => (
                        <Row key={i}>
                            <Col
                                xs={3}
                                className="d-flex align-items-center justify-content-end pe-4"
                            >
                                {i === 0 ? "" : name}
                            </Col>
                            {[0, 1, 2].map((index) => (
                                <Col className="p-1" key={index} xs={3}>
                                    <div
                                        id={`l${index}-${name}`}
                                        htmlFor={`o${index}-${name}`}
                                        onClick={handleChange}
                                        className={`choice py-2 text-center ${
                                            name in priority &&
                                            index === priority[name] &&
                                            "bg-green text-success"
                                        } ${i === 0 && "bg-light"}`}
                                    >
                                        {name in priority &&
                                            index === priority[name] &&
                                            "✅"}{" "}
                                        {i === 0 ? "Check All" : getText(index)}
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    ))}
                </div>
            ) : (
                <div className="d-flex align-items-center justify-content-center">
                    Loading...
                </div>
            )}
        </div>
    );
};
export default Priority;
