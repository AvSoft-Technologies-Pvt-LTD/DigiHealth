import React from "react"
import { StyleSheet, ViewStyle } from "react-native"
import { Button, ButtonProps } from "react-native-paper"
import { COLORS } from "../constants/colors"
import { normalize } from "../constants/platform"

interface AvButtonProps extends Omit<ButtonProps, 'children'> {
  children: React.ReactNode;
  mode?: 'text' | 'outlined' | 'contained' | 'elevated' | 'contained-tonal';
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function AvButton(props: AvButtonProps) {
  const { children, mode, style, onPress, loading, disabled } = props
  return (
    <Button
    {...props}
            mode={mode}
            onPress={onPress}
            loading={loading}
            disabled={disabled}
            style={[
              styles.buttonStyle,
              {
                borderWidth: mode == "outlined" ? 1 : 0,
                borderColor: mode == "outlined" ? COLORS.PRIMARY_TXT : undefined,
                zIndex: 2000,
              },
              style,
            ]}
            buttonColor={COLORS.SECONDARY}
          >
            {children}
          </Button>
  )
}
const styles = StyleSheet.create({
  buttonStyle: {
    textAlign: "center",
    justifyContent: "center",
    borderRadius: normalize(24),
  },
})
