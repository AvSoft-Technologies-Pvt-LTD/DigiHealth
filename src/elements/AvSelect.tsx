import React, { useState, useRef, useEffect } from 'react';
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
  multiselect?: boolean;
}

export const AvSelect: React.FC<AvSelectProps> = ({
  items,
  selectedValue,
  onValueChange,
  multiselect = false,
  placeholder = 'Select an option',
  style = {},
  error = false,
  errorText = '',
  label = '',
  required = false,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const buttonRef = useRef<View>(null);

  // Initialize selected values based on props
  useEffect(() => {
    if (multiselect) {
      setSelectedValues(Array.isArray(selectedValue) ? selectedValue : (selectedValue ? [selectedValue] : []));
    }
  }, [selectedValue, multiselect]);

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
    if (multiselect) {
      const newSelectedValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    } else {
      onValueChange(value);
      setModalVisible(false);
    }
  };

  const handleClose = () => {
    // if (multiselect) {
      setModalVisible(false);
    // }
  };

  const getDisplayText = () => {
    if (multiselect) {
      if (selectedValues.length === 0) return placeholder;
      if (selectedValues.length === 1) {
        const item = items.find(i => i.value === selectedValues[0]);
        return item ? item.label : placeholder;
      }
      return `${selectedValues.length} items selected`;
    } else {
      const selectedItem = items.find(item => item.value === selectedValue);
      return selectedItem ? selectedItem.label : placeholder;
    }
  };

  const displayText = getDisplayText();

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
            ...((multiselect ? selectedValues.length === 0 : !selectedValue) ? [styles.placeholderText] : [])
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
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
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
                {items.map((item) => {
                  const isSelected = multiselect 
                    ? selectedValues.includes(item.value)
                    : selectedValue === item.value;
                  
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.dropdownItem,
                        isSelected && styles.selectedItem,
                      ]}
                      onPress={() => handleSelect(item.value)}
                    >
                      {multiselect && (
                        <View style={[
                          styles.checkbox,
                          isSelected && styles.checkboxSelected
                        ]}>
                          {isSelected && <View style={styles.checkboxInner} />}
                        </View>
                      )}
                      <AvText
                        style={[
                          styles.dropdownItemText,
                          isSelected && styles.selectedItemText,
                        ]}
                      >
                        {item.label}
                      </AvText>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              {multiselect && (
                <View style={styles.multiSelectFooter}>
                  <TouchableOpacity onPress={handleClose} style={styles.doneButton}>
                    <AvText style={styles.doneButtonText}>Done</AvText>
                  </TouchableOpacity>
                </View>
              )}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: COLORS.PRIMARY_BACKGROND,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.GREY,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: COLORS.PRIMARY,
    backgroundColor: COLORS.PRIMARY,
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.WHITE,
    borderRadius: 2,
  },
  multiSelectFooter: {
    padding: normalize(12),
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
    alignItems: 'flex-end',
  },
  doneButton: {
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: 4,
    backgroundColor: COLORS.PRIMARY,
  },
  doneButtonText: {
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  dropdownItemText: {
    color: COLORS.PRIMARY_TXT,
    flex: 1,
  },
  selectedItemText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
  }
})