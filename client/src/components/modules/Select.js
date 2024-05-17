import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const Select = ({ title, options, mode, setMode }) => {
    const getVariant = (mode, title, index) => {
        if (title === "Sort") {
            return mode === index ? "primary" : "outline-secondary";
        } else {
            if (index === 0) {
                return mode === index ? "success" : "outline-success";
            } else if (index === 1) {
                return mode === index ? "warning" : "outline-warning";
            }
        }
    };

    const changeMode = (e) => {
        const newMode = parseInt(e.target.id.substr(1));
        console.log("newMode", newMode);
        setMode(newMode);
    };
    return (
        <div className="my-3">
            {title}:{" "}
            <ButtonGroup>
                {options.map((option, i) => (
                    <Button
                        key={i}
                        id={`m${i}`}
                        variant={getVariant(mode, title, i)}
                        onClick={changeMode}
                    >
                        {option}
                    </Button>
                ))}
            </ButtonGroup>
        </div>
    );
};

export default Select;
