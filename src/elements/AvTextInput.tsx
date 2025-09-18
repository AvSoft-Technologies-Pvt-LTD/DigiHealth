import React from "react"
import { StyleSheet, TextStyle, NativeSyntheticEvent, TextInputContentSizeChangeEventData } from "react-native"
import { TextInput, TextInputProps } from "react-native-paper"
import { COLORS } from "../constants/colors"
import { normalize } from "../constants/platform"

interface AvTextInputProps extends Omit<TextInputProps, 'style'> {
  type?: "textarea" | "default"
  style?: TextStyle | TextStyle[]
  right?: React.ReactNode
}

export default function AvTextInput(props: AvTextInputProps): React.JSX.Element {
  const [dynamicHeight, setDynamicHeight] = React.useState<number | undefined>(undefined)
  
  const handleContentSizeChange = (event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>) => {
    setDynamicHeight(event.nativeEvent.contentSize.height)
  }

  const { right, ...restProps } = props;
  
  return props.type === "textarea" ? (
    <TextInput
      multiline
      onContentSizeChange={handleContentSizeChange}
      {...restProps}
      style={[props.style, { backgroundColor: COLORS.TRANSPARENT, height: dynamicHeight }]}
    />
  ) : (
    <TextInput 
      {...restProps} 
      style={[styles.textInput, props.style]} 
      right={right}
    />
  )
}
const styles = StyleSheet.create({
  textInput: {
    height: normalize(50),
    backgroundColor: COLORS.TRANSPARENT,
    color: COLORS.PRIMARY,
  },
})
