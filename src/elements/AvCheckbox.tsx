import { StyleSheet } from 'react-native';
import React from 'react';
import { Checkbox } from 'react-native-paper';
import { COLORS } from '../constants/colors';

interface AvCheckboxProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Callback to be invoked when checkbox state changes */
  setChecked: (checked: boolean) => void;
  /** Color of the checkbox when checked */
  checkedColor?: string;
  /** Color of the checkbox when unchecked */
  uncheckedColor?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Size of the checkbox */
  size?: number;
  /** Additional styles */
  style?: object;
  /** Test ID for testing */
  testID?: string;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * A customizable checkbox component that wraps react-native-paper's Checkbox.Android
 * with TypeScript support and additional props.
 * 
 * @example
 * ```tsx
 * const [isChecked, setIsChecked] = useState(false);
 * 
 * <AvCheckbox 
 *   checked={isChecked}
 *   setChecked={setIsChecked}
 *   checkedColor={COLORS.PRIMARY}
 *   uncheckedColor={COLORS.LIGHT_GREY}
 *   disabled={false}
 * />
 * ```
 */
const AvCheckbox: React.FC<AvCheckboxProps> = ({
  checked,
  setChecked,
  checkedColor = COLORS.PRIMARY,
  uncheckedColor = COLORS.LIGHT_GREY,
  disabled = false,
  size = 24,
  style,
  testID,
  accessibilityLabel,
}) => {
  const handlePress = () => {
    if (!disabled) {
      setChecked(!checked);
    }
  };

  return (
    <Checkbox.Android
      status={checked ? 'checked' : 'unchecked'}
      color={checkedColor}
      uncheckedColor={uncheckedColor}
      disabled={disabled}
      onPress={handlePress}
      style={[styles.checkbox, { width: size, height: size }, style]}
      testID={testID}
      accessibilityLabel={accessibilityLabel || (checked ? 'Checked' : 'Unchecked')}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    />
  );
};

const styles = StyleSheet.create({
  checkbox: {
    margin: 0,
    padding: 0,
  },
});

export default React.memo(AvCheckbox);
