import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { iAppContext, Tanks } from "../types";
import { useUser } from "@clerk/clerk-expo";
import { LocalStorage, TankService } from "../services";

export const AppContext = createContext<iAppContext>({
    tanks: [],
    error: null,
    loading: true,
    setLoading: () => console.error('setLoading was called without AppContext.Provider'),
    setTanks: () => console.error('setTanks was called without AppContext.Provider')
})

export const AppProvider = ({ children }: { children: any }) => {
    // useCallback when passing functions to child components
    // useMemo when computing derived values that are expensive to calculate
    const { isSignedIn, user, isLoaded } = useUser()

    const [tanks, setTanks] = useState<Tanks[]>([])
    const [error, setError] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const getAndSetTanks = useCallback(async () => {
        setLoading(true)
        if (isSignedIn) {
            const storedValues = await LocalStorage.getData('@tanks')
            if (storedValues !== null) {
                setTanks(storedValues)
                console.log('stored')
            } else {
                TankService.getAllTanks(user.id)
                .then(async ({ data }) => {
                    await LocalStorage.setData('@tanks', data)
                    setTanks(data)
                    console.log('api')
                })
                .catch((err) => setError(err))
            }
        }
        setLoading(false)
    }, [isSignedIn, setLoading, setTanks, setError])

    useEffect(() => {
        if (isLoaded) {
            ;(async () => await getAndSetTanks())()
        }
    }, [isLoaded, isSignedIn])

    const contextValue = useMemo(() => ({
        tanks,
        loading,
        error,
        setLoading,
        setTanks
    }), [tanks, loading, error, setLoading, setTanks])

    return (
        <AppContext.Provider value={contextValue}>
            { children }
        </AppContext.Provider>
    )
}