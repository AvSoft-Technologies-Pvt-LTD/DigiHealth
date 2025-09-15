import React from "react";
import { Linking, TextStyle, TouchableOpacity } from "react-native";
import { Text, HelperText } from "react-native-paper";
import { Typography } from "../constants/fonts";

type TypographyType = 
  | "heading_1" | "heading_2" | "heading_3" | "heading_4" | "heading_5" | "heading_6" | "heading_7" | "heading_8"
  | "title_1" | "title_2" | "title_3" | "title_4" | "title_5" | "title_6" | "title_7"
  | "Subtitle_1" | "Subtitle_2" | "body" | "bottomDrawerText" | "buttonText" | "caption"
  | "description" | "filter" | "mainTitle" | "navText" | "overline" | "placeholderText"
  | "popupText" | "secondaryButtonText" | "smallText" | "tagsText" | "Link";

interface AvTextProps {
  type?: TypographyType;
  style?: TextStyle | TextStyle[];
  children: React.ReactNode;
  accessible?: boolean;
  onPress?: () => void;
  url?: string;
  [key: string]: any;
}

const textComponent = (props: AvTextProps) => {
  return props.type === "heading_1" ? (
    <Text accessible={true} style={[{ ...Typography.heading_1 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_2" ? (
    <Text accessible={true} style={[{ ...Typography.heading_2 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_3" ? (
    <Text accessible={true} style={[{ ...Typography.heading_3 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_4" ? (
    <Text accessible={true} style={[{ ...Typography.heading_4 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_5" ? (
    <Text accessible={true} style={[{ ...Typography.heading_5 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_6" ? (
    <Text accessible={true} style={[{ ...Typography.heading_6 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_7" ? (
    <Text accessible={true} style={[{ ...Typography.heading_7 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "heading_8" ? (
    <Text accessible={true} style={[{ ...Typography.heading_8 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_1" ? (
    <Text accessible={true} style={[{ ...Typography.title_1 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_2" ? (
    <Text accessible={true} style={[{ ...Typography.title_2 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_3" ? (
    <Text accessible={true} style={[{ ...Typography.title_3 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_4" ? (
    <Text accessible={true} style={[{ ...Typography.title_4 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_5" ? (
    <Text accessible={true} style={[{ ...Typography.title_5 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_6" ? (
    <Text accessible={true} style={[{ ...Typography.title_6 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "title_7" ? (
    <Text accessible={true} style={[{ ...Typography.title_7 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "Subtitle_1" ? (
    <Text accessible={true} style={[{ ...Typography.Subtitle_1 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "Subtitle_2" ? (
    <Text accessible={true} style={[{ ...Typography.Subtitle_2 }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "body" ? (
    <Text accessible={true} style={[{ ...Typography.body }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "bottomDrawerText" ? (
    <Text
      accessible={true}
      style={[{ ...Typography.bottomDrawerText }, props.style]}
    >
      {props.children}
    </Text>
  ) : props.type === "buttonText" ? (
    <Text accessible={true} style={[{ ...Typography.buttonText }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "caption" ? (
    <Text accessible={true} style={[{ ...Typography.caption }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "description" ? (
    <Text
      accessible={true}
      style={[{ ...Typography.description }, props.style]}
    >
      {props.children}
    </Text>
  ) : props.type === "filter" ? (
    <Text accessible={true} style={[{ ...Typography.filter }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "mainTitle" ? (
    <Text accessible={true} style={[{ ...Typography.mainTitle }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "navText" ? (
    <Text accessible={true} style={[{ ...Typography.navText }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "overline" ? (
    <Text accessible={true} style={[{ ...Typography.overline }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "placeholderText" ? (
    <Text
      accessible={true}
      {...props}
      style={[{ ...Typography.placeholderText }, props.style]}
    >
      {props.children}
    </Text>
  ) : props.type === "popupText" ? (
    <Text accessible={true} style={[{ ...Typography.popupText }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "secondaryButtonText" ? (
    <Text
      accessible={true}
      style={[{ ...Typography.secondaryButtonText }, props.style]}
    >
      {props.children}
    </Text>
  ) : props.type === "smallText" ? (
    <Text accessible={true} style={[{ ...Typography.smallText }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "tagsText" ? (
    <Text accessible={true} style={[{ ...Typography.tagsText }, props.style]}>
      {props.children}
    </Text>
  ) : props.type === "Link" ? (
    <TouchableOpacity
      accessible={true}
      onPress={() => {
        if (props.url) {
          Linking.openURL(props.url);
        } else if (props.onPress) {
          props.onPress();
        }
      }}
    >
      <Text style={[{ color: "#2980b9", textDecorationLine: 'underline' }, props.style]}>
        {props.children}
      </Text>
    </TouchableOpacity>
  ) : (
    <Text {...props} accessible={true} style={props.style}>
      {props.children}
    </Text>
  )
}

export default function AvText(props: AvTextProps) {
  return textComponent(props);
}
