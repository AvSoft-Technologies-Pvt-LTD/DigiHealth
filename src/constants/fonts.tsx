import { StyleSheet, TextStyle } from "react-native";
import { isIos, normalize } from "../constants/platform";

export const Typography = StyleSheet.create({
    heading_1: {
        fontSize: normalize(36),
        lineHeight: normalize(55),
    },
    heading_2: {
        fontSize: normalize(26),
        lineHeight: normalize(30),
    },
    heading_3: {
        fontSize: normalize(18),
        lineHeight: normalize(18),
        fontWeight: "500" as TextStyle['fontWeight'],
    },
    heading_4: {
        fontSize: normalize(18),
        lineHeight: normalize(21),
    },
    heading_5: {
        fontSize: normalize(14),
        lineHeight: normalize(17.33),
    },
    heading_6: {
        fontSize: normalize(14),
        lineHeight: normalize(16),
    },
    heading_7: {
        fontSize: normalize(10),
        lineHeight: normalize(12),
        fontWeight: "bold" as TextStyle['fontWeight'],
    },

    heading_8: {
        fontSize: normalize(10),
        lineHeight: normalize(12),
        fontWeight: "bold" as TextStyle['fontWeight'],
        letterSpacing: normalize(0.5),
    },
    buttonText: {
        fontSize: normalize(17),
        lineHeight: normalize(19),
        fontWeight: "600" as TextStyle['fontWeight'],
    },
    title_1: {
        fontSize: normalize(18),
        lineHeight: normalize(21),
        letterSpacing: normalize(0.5),
    },
    title_2: {
        fontSize: normalize(16),
        lineHeight: normalize(19),
        letterSpacing: normalize(0.5),
    },
    title_3: {
        fontSize: normalize(12),
        lineHeight: normalize(14),
        fontWeight: "500" as TextStyle['fontWeight'],
    },
    title_4: {

        fontSize: normalize(10),
        lineHeight: normalize(12),
        // fontWeight: "600" as TextStyle['fontWeight'],
    },
    title_5: {

        fontSize: normalize(10),
        lineHeight: normalize(12),
        fontWeight: "500" as TextStyle['fontWeight'],
        letterSpacing: normalize(0.5),
    },
    title_6: {

        fontSize: normalize(18),
        lineHeight: normalize(21),
        letterSpacing: normalize(0.5),
        fontWeight: "bold" as TextStyle['fontWeight'],
    },
    title_7: {

        fontSize: normalize(16),
        lineHeight: normalize(19),
        letterSpacing: normalize(0.5),
        fontWeight: "bold" as TextStyle['fontWeight'],
    },
    navText: {

        fontSize: normalize(10),
        lineHeight: normalize(12),
        fontWeight: "500" as TextStyle['fontWeight'],
        letterSpacing: normalize(0.5),
    },
    description: {

        fontSize: normalize(16),
        lineHeight: normalize(19),
        fontWeight: "500" as TextStyle['fontWeight'],
    },
    placeholderText: {

        fontSize: normalize(14),
        lineHeight: normalize(16),
        fontWeight: "500" as TextStyle['fontWeight'],
    },
    tagsText: {

        fontSize: normalize(5),
        lineHeight: normalize(6),
        fontWeight: "800" as TextStyle['fontWeight'],
    },
    body: {
        fontSize: normalize(12),
        lineHeight: normalize(14),
    },
    secondaryButtonText: {
        fontSize: normalize(14),
        lineHeight: normalize(16),
    },
    mainTitle: {
        fontSize: normalize(20),
        lineHeight: normalize(23),
    },
    bottomDrawerText: {
        fontSize: normalize(12),
        lineHeight: normalize(14),
        letterSpacing: normalize(4),
        textTransform: "uppercase" as TextStyle['textTransform'],
    },
    smallText: {
        fontSize: normalize(3),
        lineHeight: normalize(4),
        fontWeight: "800" as TextStyle['fontWeight'],
    },
    caption: {
        fontSize: normalize(12),
        lineHeight: normalize(14),
        letterSpacing: normalize(0.4),
    },
    Subtitle_1: {
        fontSize: normalize(10),
        lineHeight: normalize(12),
        letterSpacing: normalize(0.5),
    },
    Subtitle_2: {
        fontSize: normalize(10),
        lineHeight: normalize(16),
        letterSpacing: normalize(0.5),
    },
    overline: {

        fontSize: normalize(6),
        lineHeight: normalize(7.43),
        letterSpacing: normalize(0.3),
    },
    link: {
        fontSize: normalize(10),
        lineHeight: normalize(12),
        letterSpacing: normalize(0.5),
    },
    filter: {
        fontSize: normalize(12),
        lineHeight: normalize(15),
    },
    popupText: {
        fontSize: normalize(8),
        lineHeight: normalize(9),
        letterSpacing: normalize(0.3),
    },
})
