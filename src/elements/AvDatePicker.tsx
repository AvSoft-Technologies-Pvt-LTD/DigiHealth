import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Text } from 'react-native-paper';
import { COLORS } from '../constants/colors';
import { format } from 'date-fns';
import { isIos } from '../constants/platform';

type AvDatePickerProps = {
  value?: Date | string | null;
  onChange?: (date: string) => void;
  onDateChange?: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  display?: 'default' | 'spinner' | 'compact' | 'inline';
  minimumDate?: Date;
  maximumDate?: Date;
  is24Hour?: boolean;
  locale?: string;
  style?: any;
  textStyle?: any;
  placeholder?: string;
  disabled?: boolean;
};

export default function AvDatePicker({
  value = null,
  onChange,
  onDateChange,
  mode = 'date',
  display = Platform.OS === 'ios' ? 'spinner' : 'default',
  minimumDate,
  maximumDate,
  is24Hour = true,
  locale = 'en-US',
  style,
  textStyle,
  placeholder = 'Select Date',
  disabled = false,
}: AvDatePickerProps) {
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState<Date>(
    value 
      ? typeof value === 'string' 
        ? new Date(value) 
        : value 
      : new Date()
  );

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    // Close the date picker
    setShow(false);

    // If user cancels (clicks outside or presses back on Android), don't update the date
    if (event.type === 'dismissed') {
      return;
    }

    // If no date is selected (shouldn't happen, but just in case)
    if (!selectedDate) {
      return;
    }

    const currentDate = selectedDate;
    setDate(currentDate);
    
    if (onChange) {
      onChange(format(currentDate, 'yyyy-MM-dd'));
    }
    if (onDateChange) {
      onDateChange(currentDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity 
        onPress={showDatepicker} 
        disabled={disabled}
        style={[styles.dateButton, disabled && styles.disabled]}
      >
        <Text style={[styles.dateText, textStyle, !value && styles.placeholderText]}>
          {value 
            ? format(
                typeof value === 'string' ? new Date(value) : value, 
                'dd MMM yyyy'
              )
            : placeholder}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display={display}
          onChange={handleChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
          is24Hour={is24Hour}
          locale={locale}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderWidth:1,
    borderColor:COLORS.LIGHT_GREY,
    borderRadius:4,
    justifyContent:'center',
  },
  dateButton: {

    borderColor: COLORS.GREY,
    borderRadius: 4,
    padding: 12,
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
  },
  placeholderText: {
    color: COLORS.GREY,
  },
  disabled: {
    opacity: 0.5,
  },
});
