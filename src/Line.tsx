import React from "react";

interface LineProps {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width?: number;
    stroke?: string;
    shadow?: boolean;
}

const Line = (props: LineProps) => {
    const width = props.width ?? 1;
    const stroke = props.stroke ?? 'black';

    const { x1, y1, x2, y2 } = props;

    const style = props.shadow ? { filter: 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))' } : {};

    return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={width} style={style} />
}

export default Line;