import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, TouchableWithoutFeedback, Platform, ScrollView } from 'react-native';
import AvText from './AvText';
import { COLORS } from '../constants/colors';
import { isIos, normalize } from '../constants/platform';

interface SelectItem {
  label: string;
  value: any;
}

interface AvSelectProps {
  items: SelectItem[];
  selectedValue?: any;
  onValueChange: (value: any) => void;
  placeholder?: string;
  style?: object;
  error?: boolean;
  errorText?: string;
  label?: string;
  required?: boolean;
}

export const AvSelect: React.FC<AvSelectProps> = ({
  items,
  selectedValue,
  onValueChange,
  placeholder = 'Select an option',
  style = {},
  error = false,
  errorText = '',
  label = '',
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width) => {
        setDropdownPosition({
          left: x,
          top: y + (isIos() ? 40 : 45), // Adjust based on your button height
          width,
        });
        setModalVisible(true);
      });
    }
  };

  const handleSelect = (value: any) => {
    onValueChange(value);
    setModalVisible(false);
  };

  const selectedItem = items.find(item => item.value === selectedValue);
  const displayText = selectedItem ? selectedItem.label : placeholder;

  return (
    <View style={[styles.container, style]}>
      {label ? (
        <View style={styles.labelContainer}>
          <AvText type="Subtitle_1" style={styles.label}>
            {label}
            {required && <AvText type="caption" style={styles.mandatory}> *</AvText>}
          </AvText>
        </View>
      ) : null}
      
      <TouchableOpacity
        ref={buttonRef}
        style={[
          styles.selectButton,
          error && styles.inputError,
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <AvText 
          type="body" 
          style={[
            styles.buttonText, 
            ...(!selectedItem ? [styles.placeholderText] : [])
          ]}
        >
          {displayText}
        </AvText>
        <AvText style={styles.arrow}>▼</AvText>
      </TouchableOpacity>

      {error && errorText ? (
        <AvText type="caption" style={styles.errorText}>
          {errorText}
        </AvText>
      ) : null}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View 
              style={[
                styles.dropdown,
                {
                  position: 'absolute',
                  top: dropdownPosition.top,
                  left: dropdownPosition.left,
                  width: dropdownPosition.width,
                  maxHeight: 200,
                },
              ]}
            >
              <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={true}
                nestedScrollEnabled={true}
              >
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownItem,
                      selectedValue === item.value && styles.selectedItem,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <AvText
                      style={[
                        styles.dropdownItemText,
                        ...(selectedValue === item.value ? [styles.selectedItemText] : []),
                      ]}
                    >
                      {item.label}
                    </AvText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(16),
  },
  labelContainer: {
    marginBottom: normalize(4),
  },
  label: {
    color: COLORS.PRIMARY_TXT,
  },
  mandatory: {
    color: COLORS.ERROR,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    backgroundColor: COLORS.WHITE,
  },
  buttonText: {
    flex: 1,
    color: COLORS.PRIMARY_TXT,
  },
  placeholderText: {
    color: COLORS.GREY,
  },
  arrow: {
    marginLeft: normalize(8),
    color: COLORS.PRIMARY_TXT,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  errorText: {
    color: COLORS.ERROR,
    marginTop: normalize(4),
    fontSize: normalize(12),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  scrollView: {
    maxHeight: 200, // Fixed height for the scrollable area
  },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  selectedItem: {
    backgroundColor: COLORS.PRIMARY_BACKGROND,
  },
  dropdownItemText: {
    color: COLORS.PRIMARY_TXT,
  },
  selectedItemText: {
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
});
