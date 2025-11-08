import { createContext, useEffect, useMemo, useState } from "react";
import { iAppContext, Tanks } from "../types";
import { useUser } from "@clerk/clerk-expo";
import TankService from "../services/tankService";
import { LocalStorage } from "../services";

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
        setAppLoading(true)
        if (isSignedIn) {
            const storedValues = await LocalStorage.getData('@tanks')
            if (storedValues !== null) {
                setTanks(storedValues)
            } else {
                TankService.getAllTanks(user.id)
                .then(async ({ data }) => {
                    await LocalStorage.setData('@tanks', data)
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