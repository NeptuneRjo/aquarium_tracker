import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '../constants/colors'

interface Props {
    variant?: 'primary' | 'secondary' | 'warn' | undefined,
    children: any,
    onPress?: () => any
}

const Button = ({ variant = "primary", children, onPress }: Props) => {
    let buttonStyles: {} = {}
    const textStyles = [styles.text]

	switch (variant) {
		case 'primary':
			buttonStyles = { backgroundColor: Colors.accent }
			break;
		case 'secondary':
			buttonStyles = { backgroundColor: Colors.secondary }
			break;
		case 'warn':
			buttonStyles = { backgroundColor: Colors.warn }
			break;
	}

    return (
    	<Pressable onPress={onPress} style={[styles.base, buttonStyles]}>
			<View style={styles.container}>
            	<Text style={textStyles}>{children}</Text>
			</View>
        </Pressable>
    )
}

export default Button

const styles = StyleSheet.create({
    base: {
        shadowRadius: 12,
        shadowColor: 'black',
        elevation: 4,
		alignItems: 'center',
		padding: 12,
		paddingVertical: 8,
		borderRadius: 4,
		height: 52,
		minWidth: 96
    },
	container: {
		justifyContent: 'center',
		flex: 1
	},
	text: {
		color: Colors.secondary,
		fontWeight: 600,
		fontSize: 16
	},
})