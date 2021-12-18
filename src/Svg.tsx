import React from "react";

export interface ViewBox {
    minX: number;
    minY: number;
    width: number;
    height: number;
}

interface SvgProps {
    viewBox: ViewBox;
    w: number;
    h: number;
}

const Svg = (props: React.PropsWithChildren<SvgProps>) => {
    const { minX, minY, width, height } = props.viewBox;
    const viewBox = minX + ' ' + minY + ' ' + width + ' ' + height;

    return <svg xmlns='http://www.w3.org/2000/svg' viewBox={viewBox} width={props.w} height={props.h}>
        {props.children}
    </svg>
}

export default Svg;