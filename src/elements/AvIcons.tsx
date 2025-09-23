import React from "react"
import {
  TouchableWithoutFeedback,
  StyleProp,
  TextStyle,
  ImageStyle,
  ImageSourcePropType,
  StyleSheet,
} from "react-native"

import AntDesign from "react-native-vector-icons/AntDesign"
import Entypo from "react-native-vector-icons/Entypo"
import EvilIcons from "react-native-vector-icons/EvilIcons"
import Feather from "react-native-vector-icons/Feather"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import Fontisto from "react-native-vector-icons/Fontisto"
import Foundation from "react-native-vector-icons/Foundation"
import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Octicons from "react-native-vector-icons/Octicons"
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons"
import Zocial from "react-native-vector-icons/Zocial"

import { normalize } from "../constants/platform"
import AvImage from "./AvImage"

const styles = StyleSheet.create({
  image: {
    width: normalize(20),
    height: normalize(20),
    resizeMode: "contain",
  },
})

// ---- Icon component type ----
type IconComponent = React.ComponentType<{
  name: string
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
}>

// ---- Map of available vector icons ----
const iconComponents = {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
}

// ---- Base props ----
interface BaseProps {
  style?: StyleProp<TextStyle | ImageStyle>
  onPress?: () => void
  size?: number
  color?: string
}

// ---- Vector icon props ----
interface VectorIconProps extends BaseProps {
  type: keyof typeof iconComponents
  name: string
}

// ---- Image icon props ----
interface ImageIconProps extends Omit<BaseProps, "style"> {
  type: "Image"
  name: ImageSourcePropType
  style?: StyleProp<ImageStyle>
  leftIconStyle?: StyleProp<ImageStyle>
}

// ---- Union props ----
export type AvIconsProps = VectorIconProps | ImageIconProps

// ---- Implementation ----
const getIcon = (props: AvIconsProps) => {
  if (props.type === "Image") {
    const { name, style, leftIconStyle, onPress } = props
    const image = (
      <AvImage
        source={name}
        style={[styles.image, style, leftIconStyle]}
      />
    )
    return onPress ? (
      <TouchableWithoutFeedback onPress={onPress}>
        {image}
      </TouchableWithoutFeedback>
    ) : (
      image
    )
  }

  // Vector icons
  const IconComponent = iconComponents[props.type]
  if (!IconComponent) return null

  const { name, style, size, color, onPress } = props
  return (
    <IconComponent
      name={name}
      size={size}
      color={color}
      style={style as StyleProp<TextStyle>}
      onPress={onPress}
      accessibility={true}
    />
  )
}

const AvIcons: React.FC<AvIconsProps> = (props) => {
  return getIcon(props)
}

export default AvIcons
