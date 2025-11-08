import { createContext, useEffect, useMemo, useState } from "react";
import { iAppContext, Tanks } from "../types";
import { useUser } from "@clerk/clerk-expo";
import TankService from "../services/tankService";
import { LocalStorage } from "../services";

export const AppContext = createContext<iAppContext>({
    tanks: [],
    error: null,
    loading: true,
    setLoading: () => console.error('setLoading was called without AppContext.Provider')
})

export const AppProvider = ({ children }: { children: any }) => {
    // useCallback when passing functions to child components
    // useMemo when computing derived values that are expensive to calculate
    const { isSignedIn, user, isLoaded } = useUser()

    const [tanks, setTanks] = useState<Tanks[]>([])
    const [error, setError] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const getAndSetTanks = async () => {
        setLoading(true)
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
        setLoading(false)
    }

    useEffect(() => {
        if (isLoaded) {
            ;(async () => await getAndSetTanks())()
        }
    }, [isLoaded, isSignedIn])

    const contextValue = useMemo(() => ({
        tanks,
        loading,
        error,
        setLoading
    }), [tanks, loading, error, setLoading])

    return (
        <AppContext.Provider value={contextValue}>
            { children }
        </AppContext.Provider>
    )
}