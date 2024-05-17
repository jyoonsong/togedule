import React, { useEffect, useState } from "react";
import { Navbar, Container } from "react-bootstrap";
import { useStore } from "../../store";
import { Link } from "react-router-dom";

const Navigation = () => {
    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();
    const [pathname, setPathname] = useState("/");

    useEffect(() => {
        if (history) {
            setPathname(history.location?.pathname);

            // whenever pathname changes
            history.listen((location) => {
                setPathname(location.pathname);
            });
        }
    }, []);

    return (
        <>
            <Navbar expand="md" className="border-bottom">
                <Container>
                    <Link to="/">Togedule</Link>
                    <Link to="/settings">⚙️ Settings</Link>
                </Container>
            </Navbar>
        </>
    );
};

export default Navigation;
