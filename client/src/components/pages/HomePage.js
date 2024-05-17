import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { post } from "../../utils/utilities";

const HomePage = () => {
    const currentUser = useStore((state) => state.currentUser);
    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();

    const [attendingEvents, setAttendingEvents] = useState([]);
    const [organizingEvents, setOrganizingEvents] = useState([]);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        console.log(currentUser);
        if (currentUser?.attendingEvents?.length > 0) {
            getEvents(currentUser.attendingEvents, true);
        }
        if (currentUser?.organizingEvents?.length > 0) {
            getEvents(currentUser.organizingEvents, false);
        }
    }, [currentUser]);

    const getEvents = async (ids, isAttending) => {
        const response = await post("/api/event/events", {
            ids: ids,
        });
        if (isAttending) {
            setAttendingEvents(response);
        } else {
            console.log(response);
            setOrganizingEvents(response);
        }
    };

    const handleLogin = async () => {
        if (username?.length === 0 || password?.length === 0) {
            alert("Please enter username and password");
            return;
        }

        const response = await post("/api/username", {
            username: username,
            password: password,
        });
        setCurrentUser(response);
    };

    return (
        <Container>
            <h5 className="mb-4 mt-5">Events you are attending</h5>
            <Row className="mb-5">
                {attendingEvents?.map((event) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={event._id}>
                        <a href={`/t?id=${event._id}`} className="event">
                            {event.title}
                            <small className="text-muted">
                                {event.numAttendees} / {event.total} responded
                            </small>
                        </a>
                    </Col>
                ))}
                {attendingEvents?.length === 0 ? (
                    <p className="text-muted">
                        No event for now. Join an event via link!
                    </p>
                ) : (
                    ""
                )}
            </Row>
            <h5 className="mb-4 mt-5">Events you are organizing</h5>
            <Row>
                <Col xs={12} sm={6} md={4} lg={3}>
                    <Link to="/new" className="event info">
                        + Add New Event
                    </Link>
                </Col>
                {organizingEvents?.map((event) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={event._id}>
                        <a href={`/t?id=${event._id}`} className="event">
                            {event.title}
                            <small className="text-muted">
                                {event.numAttendees} / {event.total} responded
                            </small>
                        </a>
                    </Col>
                ))}
            </Row>

            {currentUser ? (
                ""
            ) : (
                <>
                    <h5 className="mb-4 mt-5">
                        Please log in if you have an account
                    </h5>
                    <Col xs="12" md="6">
                        <Form.Label for="username">Username</Form.Label>
                        <Form.Control
                            id="username"
                            type="text"
                            placeholder="username"
                            className="mb-3"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Form.Label for="password">Password</Form.Label>
                        <Form.Control
                            id="password"
                            type="password"
                            placeholder="password"
                            className="mb-3"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button onClick={handleLogin}>Log In</Button>
                    </Col>
                </>
            )}
        </Container>
    );
};

export default HomePage;
