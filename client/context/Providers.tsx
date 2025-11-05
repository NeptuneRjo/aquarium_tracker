import { ClerkProvider } from "@clerk/clerk-expo"
import { tokenCache } from "@clerk/clerk-expo/token-cache"
import { AppProvider } from "./"

export const Providers = ({ children }: { children: any }) => {
    return (
        <ClerkProvider tokenCache={tokenCache}>
            <AppProvider>
                { children }
            </AppProvider>
        </ClerkProvider>
    )
}