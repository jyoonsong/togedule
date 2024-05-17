import React, { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import { notification } from "antd-notifications-messages";

import { copyTextToClipboard, handleLogin, post } from "../../utils/utilities";
import { useStore } from "../../store";

import NonUser from "../auth/NonUser";
import { t } from 'i18next';

const SignInMatrix = ({ matrixId }) => {

    const setCurrentUser = useStore(state => state.setCurrentUser);

    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleCopy = () => {
        copyTextToClipboard(`${window.location.origin}/t?id=${matrixId}`);
        notification({
            type: "success",
            title: "Successfully copied!",
        });

    }

    const handleSubmit = async () => {
        if (inputs.email?.length > 0 && inputs.password?.length > 0) {
            // TODO: check with DB to find a matching user or sign up
            // set current user
        }
        else if (inputs.name?.length > 0) {
            const user = await handleLogin(inputs.name, matrixId);
            if (user) {
                setCurrentUser(user);
                localStorage.setItem("name", user.name);
            }
        }
        else {
            notification({
                type: "error",
                title: "Please enter either your name or email/password!",
            });
        }
    }

    return (
        <div className="px-3">
            <h4 className="tab-title">{t("Sign In")}</h4>
            <Alert variant="info">
                <div className="d-inline-block me-3">
                    <b>{t("Link to share")}:  <a href={`${window.location.origin}/t?id=${matrixId}`}>{`${window.location.origin}/t?id=${matrixId}`}</a></b>
                </div>
                <Button variant="outline-primary" onClick={handleCopy}>{t("Copy Link")}</Button>
            </Alert>
            <NonUser 
                inputs={inputs}
                setInputs={setInputs}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default SignInMatrix;
