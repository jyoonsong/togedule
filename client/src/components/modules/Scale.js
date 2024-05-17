import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";

const Scale = ({ maxSelected }) => {
    return (
        <div className="my-3">
            Popularity scale: &nbsp;
            <ButtonGroup
                className={`${
                    maxSelected + 1 <= 6 ? "small-scale" : "large-scale"
                }`}
            >
                {[
                    ...Array(
                        maxSelected === 0 ? maxSelected + 2 : maxSelected + 1
                    ).keys(),
                ].map((num) => (
                    <Button key={num}>{num}</Button>
                ))}
            </ButtonGroup>
        </div>
    );
};

export default Scale;
