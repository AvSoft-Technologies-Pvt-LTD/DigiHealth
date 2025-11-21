import React, { forwardRef } from 'react';
import { StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { TextInput as PaperTextInput, TextInputProps as PaperTextInputProps } from 'react-native-paper';
import { COLORS } from '../constants/colors';
import { normalize } from '../constants/platform';

type AvTextInputProps = PaperTextInputProps & {
  type?: 'text' | 'textarea';
  containerStyle?: StyleProp<ViewStyle>;
  mode?: 'flat' | 'outlined';
  right?: React.ReactNode;
  left?: React.ReactNode;
};

const AvTextInput = forwardRef<any, AvTextInputProps>(({ 
  type = 'text',
  mode = 'outlined',
  containerStyle,
  style,
  right,
  left,
  ...restProps 
}, ref) => {
  // Handle textarea specific props
  const textAreaProps = type === 'textarea' ? {
    multiline: true,
    numberOfLines: 4,
    style: [styles.input, styles.textarea, style],
  } : {
    style: [styles.input, style],
  };

  // Handle right/left icons
// Handle right/left icons
  const renderIcon = (icon: React.ReactNode) => {
    if (!icon) return undefined;
    
    // If it's a string, use it as an icon name
    if (typeof icon === 'string') {
      return <PaperTextInput.Icon icon={icon} />;
    }
    
    // If it's already a React element, return it as is
    return icon;
  };
  return (
    <PaperTextInput
      ref={ref}
      mode={mode}
      right={renderIcon(right)}
        left={renderIcon(left)}
      theme={{
        colors: {
          primary: COLORS.PRIMARY,
          accent: COLORS.SECONDARY,
          placeholder: COLORS.GREY,
          text: COLORS.BLACK,
          background: COLORS.WHITE,
          surface: COLORS.WHITE,
        },
        roundness: 8,
      }}
      {...textAreaProps}
      {...restProps}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.WHITE,
    marginBottom: normalize(16),
    fontSize: normalize(16),
    height: Platform.OS === 'ios' ? normalize(50) : normalize(50),
    paddingHorizontal: 0,
  },
  textarea: {
    minHeight: normalize(100),
    textAlignVertical: 'top',
    paddingTop: normalize(12),
    paddingBottom: normalize(12),
  },
  container: {
    width: '100%',
    marginBottom: normalize(16),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightContainer: {
    position: 'absolute',
    right: normalize(10),
  },
  outlined: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  focused: {
    borderColor: COLORS.PRIMARY,
  },
  label: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
});

AvTextInput.displayName = 'AvTextInput';

export default AvTextInput;