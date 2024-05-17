import React, { useState, useEffect } from "react";
import { Router, Switch, Route } from "react-router-dom";
import { get, post } from "../utils/utilities";
import { useStore } from "../store";

import NotFound from "./pages/NotFound.js";
import MainPage from "./pages/MainPage";
import HomePage from "./pages/HomePage.js";
import SettingsPage from "./pages/SettingsPage.js";
import Navigation from "./modules/Navigation.js";
import NewPage from "./pages/NewPage.js";
import OrganizerPage from "./pages/OrganizerPage.js";

/**
 * Define the "App" component
 */
const App = () => {
    const currentUser = useStore((state) => state.currentUser);
    const [loading, setLoading] = useState(true);
    const [stage, setStage] = useState(0);

    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();
    const setCurrentUser = useStore((state) => state.setCurrentUser);

    useEffect(() => {
        handleAuth();
    }, []);

    const handleAuth = async () => {
        try {
            const userId = localStorage.getItem("currentUserId");
            if (userId?.length > 0) {
                const user = await post("/api/login", {
                    userId: userId,
                });
                if (user?._id) {
                    setCurrentUser(user);
                    console.log(user);
                }
                setLoading(false);
            } else {
                const user = await get("/api/whoami");
                if (user?._id) {
                    setCurrentUser(user);
                    localStorage.setItem("currentUserId", user._id);
                    console.log(user);
                }
                setLoading(false);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogin = async (name) => {
        try {
            const user = await post("/api/signup", { name: name });
            handleAfterLogin(user);
            console.log(`Logged in as ${name}`);
        } catch (err) {
            console.log(err);
            alert("Login Failed");
        }
    };

    const handleAfterLogin = (user) => {
        setCurrentUser(user);
        if (user?.stage && user?.stage !== 0) {
            setStage(user?.stage);
        } else {
            handleNext();
        }
    };

    const handleNext = async () => {
        setStage(stage + 1);

        const response = await post(`/api/stage/${stage + 1}`);
        console.log(response);
    };

    return (
        <Router history={history}>
            <Navigation />
            {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                    Loading...
                </div>
            ) : (
                <Switch>
                    <Route path="/" exact>
                        <HomePage />
                    </Route>

                    <Route path="/t" exact>
                        <MainPage />
                    </Route>

                    <Route path="/o" exact>
                        <OrganizerPage />
                    </Route>

                    <Route path="/new" exact>
                        <NewPage />
                    </Route>

                    <Route path="/settings" exact>
                        <SettingsPage />
                    </Route>

                    <Route default>
                        <NotFound />
                    </Route>
                </Switch>
            )}
        </Router>
    );
};

export default App;
