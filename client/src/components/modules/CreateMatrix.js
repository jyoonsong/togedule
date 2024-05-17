import React, { useEffect, useState } from "react";
import {
    Row,
    Col,
    Button,
    ButtonGroup,
    Container,
    Form,
} from "react-bootstrap";
import { notification } from "antd-notifications-messages";
import DatePicker, { Calendar } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import "react-multi-date-picker/styles/layouts/mobile.css";
import { get, post } from "../../utils/utilities";
import { useStore } from "../../store";

const CreateMatrix = () => {
    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();
    const setCurrentUser = useStore((state) => state.setCurrentUser);
    const currentUser = useStore((state) => state.currentUser);

    const [dates, setDates] = useState([]);
    const [startTime, setStartTime] = useState(new Date("2022-08-11T09:00:00"));
    const [endTime, setEndTime] = useState(new Date("2022-08-11T17:00:00"));
    const [duration, setDuration] = useState(30);

    const [title, setTitle] = useState("");
    const [password, setPassword] = useState("");
    const [total, setTotal] = useState(6);

    const alertError = (text) => {
        notification({
            type: "error",
            title: text,
        });
    };

    const handleDuration = (e) => {
        const newDuration = parseInt(e.target.id.substr(1));
        if (newDuration === 60) {
            alert("Sorry, we only support 30 minute event for now.");
        } else {
            setDuration(newDuration);
        }
    };

    const handleSubmit = async () => {
        if (dates.length === 0) {
            alertError(
                "Please select the dates you want to suggest to the invitees."
            );
            return;
        } else if (title.length === 0) {
            alertError("Please submit the title of the event.");
            return;
        } else if (password.length === 0) {
            alertError(
                "Please submit the password you will use as an organizer."
            );
            return;
        } else if (total <= 0) {
            alertError("Please select a positive number as attendance.");
            return;
        }

        const startHour = startTime.hour || startTime.getHours();
        const endHour = endTime.hour || endTime.getHours();

        if (startHour >= endHour) {
            alertError("The start time has to be before the end time");
            return;
        }
        const processedDates = dates.map((val) =>
            new Date(`${val.month.number}/${val.day}/${val.year}`).getTime()
        );

        // save the matrix info to DB
        try {
            const response = await post("/api/event/create", {
                startTime: startHour,
                endTime: endHour,
                dates: processedDates,
                duration: duration,
                title: title,
                password: password,
                total: total,
            });

            if (currentUser) {
                setCurrentUser({
                    ...currentUser,
                    organizingEvents: [
                        ...currentUser.organizingEvents,
                        response._id,
                    ],
                });
                localStorage.setItem("currentUserId", currentUser._id);
            } else {
                try {
                    const user = await get("/api/whoami");

                    if (user?._id) {
                        // they are registed in the database, and currently logged in.
                        setCurrentUser(user);
                        localStorage.setItem("currentUserId", user._id);
                        console.log(user);
                    }
                } catch (err) {
                    console.error(err);
                }
            }

            console.log(response);

            // redirect to the link showing the newly created matrix
            if (response.success) {
                history.push(`/t?id=${response._id}`);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={6}>
                    <h4 className="my-4">⏰ What times might work?</h4>

                    {/* TODO: specific dates vs days of the week */}
                    <Calendar
                        value={dates}
                        onChange={setDates}
                        multiple={true}
                        className="rmdp-mobile mb-4"
                        calendar={true}
                        plugins={[<DatePanel sort="date" />]}
                    />

                    <Row className="mb-4">
                        <Col xs={12} lg={4}>
                            No earlier than
                        </Col>
                        <Col xs={12} lg={8}>
                            <DatePicker
                                value={startTime}
                                onChange={setStartTime}
                                disableDayPicker
                                format="HH:00 A"
                                plugins={[<TimePicker hideSeconds />]}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col xs={12} lg={4}>
                            No later than
                        </Col>
                        <Col xs={12} lg={8}>
                            <DatePicker
                                value={endTime}
                                onChange={setEndTime}
                                disableDayPicker
                                format="HH:00 A"
                                plugins={[<TimePicker hideSeconds />]}
                            />
                        </Col>
                    </Row>

                    {/* Ask 1 hour or 30 minutes */}
                    <Row className="mb-4">
                        <Col xs={12} lg={4}>
                            Duration
                        </Col>
                        <Col xs={12} lg={8}>
                            <ButtonGroup>
                                {[30, 60].map((val) => (
                                    <Button
                                        id={`d${val}`}
                                        key={val}
                                        variant={
                                            duration === val
                                                ? "primary"
                                                : "outline-secondary"
                                        }
                                        onClick={handleDuration}
                                    >
                                        {val} Minutes
                                    </Button>
                                ))}
                            </ButtonGroup>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col xs={12} lg={4}>
                            Event title
                        </Col>
                        <Col xs={12} lg={8}>
                            <Form.Control
                                type="text"
                                placeholder="e.g., Lab Dinner"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col xs={12} lg={4}>
                            Organizer password
                        </Col>
                        <Col xs={12} lg={8}>
                            <Form.Control
                                type="password"
                                placeholder="8 or more characters required"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col xs={12} lg={4}>
                            Expected attendance
                        </Col>
                        <Col xs={12} lg={8}>
                            <Form.Control
                                type="number"
                                placeholder="How many attendees do you expect?"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                            />
                        </Col>
                    </Row>
                </Col>

                <Col xs={12}>
                    <Button onClick={handleSubmit}>Find a Time</Button>
                </Col>
            </Row>
        </Container>
    );
};

export default CreateMatrix;
