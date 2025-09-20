import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle, TextStyle, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";
import AvText from "./AvText";

interface AvCardProps {
  title: React.ReactNode | string;
  icon?: React.ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  children?: React.ReactNode;
}

const AvCard: React.FC<AvCardProps> = ({
  title,
  icon,
  cardStyle,
  titleStyle,
  onPress,
  children,
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <CardComponent style={[styles.card, cardStyle]} onPress={onPress}>
      <View style={styles.contentContainer}>
        {icon && <View style={styles.icon}>{icon}</View>}
        <View style={styles.titleContainer}>
          {typeof title === 'string' ? (
            <AvText type="body" style={[styles.title, titleStyle]}>
              {title}
            </AvText>
          ) : (
            title
          )}
        </View>
      </View>
      {children && <View style={styles.childrenContainer}>{children}</View>}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 10,
    padding: 15,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
  },
  childrenContainer: {
    marginTop: 8,
  },
});

export default AvCard;