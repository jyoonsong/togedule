import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useStore } from "../../store";
import { post } from "../../utils/utilities";

const SettingsPage = () => {
    const currentUser = useStore((state) => state.currentUser);
    const setCurrentUser = useStore((state) => state.setCurrentUser);

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSave = async () => {
        if (username?.length === 0 || password?.length === 0) {
            alert("Please enter username and password");
            return;
        }
        const response = await post("/api/update", {
            username: username,
            password: password,
        });
        setCurrentUser(response);
    };

    return (
        <Container>
            <h5 className="mt-5">Open AI API Key (required)</h5>
            <p>We do not see nor save your API key</p>
            <Form.Control
                className="mb-4"
                type="text"
                placeholder="ORG ID (e.g., org-1kfjasfokg)"
            />
            <Form.Control
                className="mb-4"
                type="text"
                placeholder="API KEY (e.g., sk-fafjkasjfoqog)"
            />
            {currentUser && currentUser.username ? (
                <>
                    <h5 className="mt-5 mb-4">
                        You are logged in as {currentUser.username}
                    </h5>
                </>
            ) : (
                <>
                    <h5 className="mt-5 mb-4">
                        Sign up to save your information
                    </h5>
                    <Form.Control
                        className="mb-4"
                        type="text"
                        placeholder="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <Form.Control
                        className="mb-4"
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button onClick={handleSave}>Save</Button>
                </>
            )}
        </Container>
    );
};

export default SettingsPage;
