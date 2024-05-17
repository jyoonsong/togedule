import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import { get } from "../../utils/utilities";
import { useStore } from "../../store";

import { t } from "i18next";
import Main from "../modules/Main";

const MainPage = () => {
    const currentUser = useStore((state) => state.currentUser);
    const getHistory = useStore((state) => state.getHistory);
    const history = getHistory();

    const [matrix, setMatrix] = useState(null);
    const [mode, setMode] = useState(0); // 0: matrix 1: poll

    useEffect(() => {
        const id = history.location.search.split("=")[1];

        if (!matrix) {
            getMatrix(id);
        }
    }, []);

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

    return (
        <>
            {/* TODO: show this only when there are less than N promising candidates */}
            <div className="d-flex mt-md-3 mt-2">
                <Button
                    variant="outline-primary"
                    onClick={() => setMode(mode === 0 ? 1 : 0)}
                >
                    🔁 {t(mode === 0 ? "See LESS options" : "See FULL options")}
                </Button>
            </div>

            {matrix ? (
                <Main matrix={matrix} mode={mode} setMode={setMode} />
            ) : (
                "Loading..."
            )}
        </>
    );
};

export default MainPage;
