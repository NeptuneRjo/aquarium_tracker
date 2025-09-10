import { Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { Link, router } from 'expo-router'
import { useSSO } from '@clerk/clerk-expo'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import Colors from '../constants/colors'

export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

const SignInButton = () => {
    useWarmUpBrowser()
  
    // Use the `useSSO()` hook to access the `startSSOFlow()` method
    const { startSSOFlow } = useSSO()
  
    const onPress = useCallback(async () => {
      try {
        // Start the authentication process by calling `startSSOFlow()`
        const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
          strategy: 'oauth_google',
          // For web, defaults to current path
          // For native, you must pass a scheme, like AuthSession.makeRedirectUri({ scheme, path })
          // For more info, see https://docs.expo.dev/versions/latest/sdk/auth-session/#authsessionmakeredirecturioptions
          redirectUrl: AuthSession.makeRedirectUri(),
        })
  
        // If sign in was successful, set the active session
        if (createdSessionId) {
          setActive!({
            session: createdSessionId,
            navigate: async ({ session }) => {
              if (session?.currentTask) {
                // Check for tasks and navigate to custom UI to help users resolve them
                // See https://clerk.com/docs/custom-flows/overview#session-tasks
                console.log(session?.currentTask)
                return
              }
  
              router.push('/')
            },
          })
        } else {
          // If there is no `createdSessionId`,
          // there are missing requirements, such as MFA
          // Use the `signIn` or `signUp` returned from `startSSOFlow`
          // to handle next steps
        }
      } catch (err) {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(err, null, 2))
      }
    }, [])

  return (
    <Pressable style={styles.btn} onPress={onPress}>
        <Text style={styles.btnText}>Sign in with Google</Text>
    </Pressable>
  )
}

export default SignInButton

const styles = StyleSheet.create({
    btn: {
        backgroundColor: Colors.accent,
        padding: 12,
        shadowRadius: 12,
        shadowColor: 'black',
        elevation: 4,
        borderRadius: 4
    },
    btnText: {
        color: Colors.secondary,
        fontWeight: 700,
        fontSize: 18
    }
})