import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { get, post } from "../../utils/utilities";

import TaskTogedule from "../task/TaskTogedule";
import { useStore } from "../../store";

const MainPage = ({ group, total }) => {
    const [note, setNote] = useState("");
    const [matrix, setMatrix] = useState(undefined);
    const [valid, setValid] = useState(false);

    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();

    useEffect(() => {
        const id = history?.location?.search?.split("=")[1];

        if (!matrix && id?.length > 0) {
            getMatrix(id);
        }
    }, [history]);

    const getMatrix = async (id) => {
        const response = await get(`/api/event/get/${id}`);
        console.log(response);
        setMatrix(response);
    };

    return (
        <Container id="draggable" className="pt-5">
            <Row>
                <Col xs={12}>
                    {matrix ? (
                        <TaskTogedule
                            setValid={setValid}
                            matrix={matrix}
                            note={note}
                            setNote={setNote}
                            total={matrix?.total}
                        />
                    ) : (
                        <div className="d-flex align-items-center justify-content-center">
                            Loading...
                        </div>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default MainPage;
