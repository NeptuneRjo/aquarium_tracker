import { createContext } from "react";
import { iAppContext } from "../types";

export const AppContext = createContext<iAppContext>({})

export const AppProvider = ({ children }: { children: any }) => {
    return (
        <AppContext.Provider value={{}}>
            { children }
        </AppContext.Provider>
    )
}