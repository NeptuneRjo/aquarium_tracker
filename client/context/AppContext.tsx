import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { iAppContext, Tanks } from "../types";
import { useUser } from "@clerk/clerk-expo";
import TankStorage from "../services/tankStorage";
import TankService from "../services/tankService";

export const AppContext = createContext<iAppContext>({
    tanks: [],
    appLoading: false,
    error: null
})

export const AppProvider = ({ children }: { children: any }) => {
    // useCallback when passing functions to child components
    // useMemo when computing derived values that are expensive to calculate
    const { isSignedIn, user, isLoaded } = useUser()

    const [tanks, setTanks] = useState<Tanks[]>([])
    const [error, setError] = useState<any>(null)
    const [appLoading, setAppLoading] = useState<boolean>(false)

    const getAndSetTanks = async () => {
        if (isSignedIn) {
            setAppLoading(true)
            const jsonValue = await TankStorage.getAllTanks()
            if (jsonValue !== null) {
                setTanks(jsonValue)
            } else {
                TankService.getAllTanks(user.id)
                .then(async ({ data }) => {
                    await TankStorage.storeAllTanks(data)
                    setTanks(data)
                })
                .catch((err) => setError(err))
            }
        }
        setAppLoading(false)
    }

    useEffect(() => {
        if (isLoaded) {
        ;(async () => await getAndSetTanks())()
        }
    }, [isLoaded, isSignedIn])

    const contextValue = useMemo(() => ({
        tanks,
        appLoading,
        error
    }), [tanks, appLoading, error])

    return (
        <AppContext.Provider value={contextValue}>
            { children }
        </AppContext.Provider>
    )
}