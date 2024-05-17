import styled from "styled-components";

const GREENS = {
    0: "#95e48d",
    1: "#67c85d",
};
const BLUES = {
    0: "#ffffff",
    1: "#e7f5ff",
    2: "#c2e5ff",
    3: "#a5d8ff",
    4: "#74c0fc",
    5: "#4dabf7",
    6: "#339af0",
    7: "#228be6",
    8: "#1c7ed6",
    9: "#1971c2",
    10: "#1864ab",
    11: "#08559b",
    12: "#042748",
};

const getColor = (numSelected, maxSelected) => {
    if (numSelected === 0) {
        return "#fff";
    } else if (maxSelected + 1 <= 6) {
        return BLUES[numSelected * 2];
    } else if (maxSelected <= 10) {
        return BLUES[numSelected];
    }
    return BLUES[9];
};

export const Grid = styled.div`
    display: grid;
    grid-template-columns: auto repeat(${(props) => props.columns}, 1fr);
    grid-template-rows: auto repeat(${(props) => props.rows}, 1fr);
    column-gap: ${(props) => props.columnGap};
    row-gap: ${(props) => props.rowGap};
    width: 100%;
`;
export const GridCell = styled.div`
    place-self: stretch;
    touch-action: none;
`;
export const DateCell = styled.div`
    width: 100%;
    height: 20px;
    background-color: ${(props) =>
        props.selected ? props.selectedColor : props.unselectedColor};
    border: 1px solid #ddd;
    font-size: 85%;
    color: ${(props) => (props.selected ? props.selectedColor : "#aaa")};
    text-align: center;
`;

export const ViewerDateCell = styled.div`
    width: 100%;
    height: 20px;
    background-color: ${(props) =>
        getColor(props.numSelected, props.maxNumSelected)};
    border: 1px solid #ddd;
    cursor: pointer;
`;

export const PollDateCell = styled.div`
    width: 100%;
    background-color: ${(props) =>
        getColor(props.numSelected, props.maxNumSelected)};
    border: 1px solid #fff;
    border-radius: 5px;
    padding: 0.37rem 1rem;
    color: #333;
    font-size: 95%;
    text-align: right;
    white-space: nowrap;
`;

export const PollCell = styled.div`
    height: 100%;
    background-color: ${(props) =>
        props.selected ? GREENS[0] : props.maybe ? "#ffdc72" : "#eee"};
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #fff;
    width: ${(props) => (props.width ? `${props.width}%` : "inherit")};
`;

export const SelectCell = styled.div`
    height: 100%;
    background-color: ${(props) =>
        props.selected ? GREENS[0] : props.maybe ? "#ffdc72" : "transparent"};
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid
        ${(props) => (props.selected || props.maybe ? "transparent" : "#ddd")};
    border-radius: 5px;
    cursor: pointer;
    width: ${(props) => (props.width ? `${props.width}%` : "inherit")};
`;

export const PollNameCell = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem 0.5rem;
    font-weight: 700;
    color: #999;
    width: ${(props) => (props.width ? `${props.width}%` : "inherit")};
`;
