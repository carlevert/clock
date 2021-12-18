import * as React from "react";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { Dimension } from "./Misc";

export type ClockState = {
    canvasSize: Dimension;
    radius: number;
}

const ClockStateContext = React.createContext<ClockState | undefined>(undefined);

interface ClockContextProviderProps {
    children: React.ReactNode;
}

function ClockContextProvider({ children }: ClockContextProviderProps) {

    let baseSize = 800;

    const [canvasSize, setCanvasSize] = useState<Dimension>({ w: baseSize, h: baseSize });
    const [radius, setRadius] = useState<number>(baseSize * 0.5 * 0.9)

    const value: ClockState = {
        canvasSize,
        radius
    };

    return <ClockStateContext.Provider value={value}>
        {children}
    </ClockStateContext.Provider>
}

function useClockContext() {
    const context = React.useContext(ClockStateContext)
    if (context === undefined) {
        throw new Error("useClockContext must be used within a ClockContextProvider")
    }
    return context
}

export { ClockContextProvider, useClockContext }