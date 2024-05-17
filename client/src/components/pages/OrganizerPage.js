import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form } from "react-bootstrap";

import { get, post } from "../../utils/utilities";
import { useStore } from "../../store";

import Main from "../modules/Main";
import { Link } from "react-router-dom";

const OrganizerPage = () => {
    const currentUser = useStore((state) => state.currentUser);
    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();

    const [matrix, setMatrix] = useState(null);
    const [mode, setMode] = useState(0); // 0: matrix 1: poll
    const [password, setPassword] = useState("");

    useEffect(() => {
        const id = history?.location?.search?.split("=")[1];

        if (!matrix && id?.length > 0) {
            getMatrix(id);
        }
    }, [history]);

    const getMatrix = async (id) => {
        try {
            const response = await get(`/api/event/get/${id}`);

            console.log(response);
            setMatrix(response);
            saveMatrix(id);
        } catch (err) {
            console.log(err);
            history.push("/404");
        }
    };

    const saveMatrix = (id) => {
        const matrices = localStorage.getItem("matrices");
        const parsedMatrices = matrices ? JSON.parse(matrices) : [];
        if (!parsedMatrices.includes(id)) {
            const newMatrices = [...parsedMatrices, id];
            localStorage.setItem("matrices", JSON.stringify(newMatrices));
        }
    };

    const handleSubmit = async () => {
        if (password?.length === 0) {
            alert("Please enter password");
            return;
        } else if (password !== matrix?.password) {
            alert("Password does not match");
            return;
        }

        const response = await post("/api/organizer", {
            eventId: matrix?._id,
        });
        setCurrentUser(response);
    };

    if (!currentUser || !currentUser.organizingEvents.includes(matrix?._id)) {
        return (
            <Container>
                <Col xs={12} md={6}>
                    <h5 className="mb-3">Enter the organizer password:</h5>
                    <Form.Control
                        type="password"
                        placeholder="password"
                        className="mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleSubmit}>Submit</Button>
                </Col>
            </Container>
        );
    }

    return (
        <Container>
            {/* TODO: show this only when there are less than N promising candidates */}
            <div className="d-flex mt-md-3 mt-2">
                <Button
                    variant="outline-primary"
                    className="me-3"
                    onClick={() => setMode(mode === 0 ? 1 : 0)}
                >
                    🔁 {mode === 0 ? "See LESS options" : "See FULL options"}
                </Button>

                <Button
                    variant="outline-primary"
                    as={Link}
                    to={`/t?id=${matrix?._id}`}
                >
                    I am an attendee
                </Button>
            </div>

            {matrix ? (
                <Main matrix={matrix} mode={mode} setMode={setMode} />
            ) : (
                "Loading..."
            )}
        </Container>
    );
};

export default OrganizerPage;
