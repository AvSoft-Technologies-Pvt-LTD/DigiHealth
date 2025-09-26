import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, TextStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize, widthPercentageToDP, heightPercentageToDP } from '../../../../constants/platform';

type EquipmentItem = {
  label: string;
  value: string;
  price: number;
};

type AvCustomMultiSelectProps = {
  placeholder: string;
  value: string[];
  onSelect: (value: string[]) => void;
  data: EquipmentItem[];
  style?: any;
  error?: boolean;
  errorText?: string;
  label?: string;
  required?: boolean;
};

const AvCustomMultiSelect: React.FC<AvCustomMultiSelectProps> = ({
  placeholder,
  value,
  onSelect,
  data,
  style,
  error = false,
  errorText = '',
  label = '',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>(value);
  const [searchQuery, setSearchQuery] = useState("");

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setSearchQuery("");
  };

  const handleSelect = (item: EquipmentItem) => {
    const newSelectedItems = selectedItems.includes(item.value)
      ? selectedItems.filter((val: string) => val !== item.value)
      : [...selectedItems, item.value];
    setSelectedItems(newSelectedItems);
    onSelect(newSelectedItems);
  };

  const getEquipmentIcon = (label: string) => {
    switch (label) {
      case "Oxygen Cylinder": return <MCI name="oxygen" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "Stretcher": return <MCI name="bed" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "First Aid Kit": return <MCI name="first-aid" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "Ventilator": return <MCI name="fan" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "Defibrillator": return <MCI name="heart-pulse" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "ECG Monitor": return <MCI name="heart" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "Suction Machine": return <MCI name="vacuum" size={normalize(16)} color={COLORS.SECONDARY} />;
      case "Spinal Board": return <MCI name="bed-empty" size={normalize(16)} color={COLORS.SECONDARY} />;
      default: return null;
    }
  };

  const filteredData = data.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        style={[
          styles.selectButton,
          error && styles.inputError,
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <AvText
          type="body"
          style={[
            styles.buttonText,
            ...(selectedItems.length === 0 ? [styles.placeholderText] : [])
          ] as TextStyle[]}
          numberOfLines={1}
        >
          {selectedItems.length > 0
            ? selectedItems.map(val => data.find(item => item.value === val)?.label).join(", ")
            : placeholder}
        </AvText>
        <Icon
          name="keyboard-arrow-down"
          size={normalize(20)}
          color={error ? COLORS.ERROR : COLORS.PRIMARY_TXT}
          style={{ transform: [{ rotate: isOpen ? "180deg" : "0deg" }] }}
        />
      </TouchableOpacity>

      {error && errorText ? (
        <AvText type="caption" style={styles.errorText}>
          {errorText}
        </AvText>
      ) : null}

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.dropdown,
            {
              width: widthPercentageToDP(90),
              maxHeight: heightPercentageToDP(50),
            }
          ]}>
            <View style={styles.searchBarContainer}>
              <Icon name="search" size={normalize(20)} color={COLORS.GREY} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search equipment..."
                placeholderTextColor={COLORS.GREY}
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>

            <ScrollView
              style={styles.dropdownOptions}
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
            >
              {filteredData.length > 0 ? (
                filteredData.map((item: EquipmentItem, index: number) => (
                  <TouchableOpacity
                    key={item.value}
                    style={[
                      styles.dropdownItem,
                      index === filteredData.length - 1 ? styles.lastItem : {},
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    {selectedItems.includes(item.value) ? (
                      <Icon name="check-box" size={normalize(18)} color={COLORS.SECONDARY} />
                    ) : (
                      <Icon name="check-box-outline-blank" size={normalize(18)} color={COLORS.LIGHT_GREY} />
                    )}
                    <View style={styles.equipmentInfo}>
                      {getEquipmentIcon(item.label)}
                      <AvText type="body" style={styles.dropdownItemText}>{item.label}</AvText>
                    </View>
                    <AvText type="body" style={styles.equipmentPrice}>₹{item.price}</AvText>
                  </TouchableOpacity>
                ))
              ) : (
                <AvText type="caption" style={styles.noResultsText}>No equipment found</AvText>
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
    borderColor: COLORS.GREY,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.GREY,
    padding: normalize(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    marginBottom: normalize(8),
  },
  searchIcon: {
    marginRight: normalize(8),
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(14),
    color: COLORS.PRIMARY_TXT,
  },
  dropdownOptions: {
    maxHeight: heightPercentageToDP(30),
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  equipmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: normalize(8),
  },
  dropdownItemText: {
    fontSize: normalize(12),
    lineHeight: normalize(14),
    marginLeft: normalize(8),
    color: COLORS.PRIMARY_TXT,
  },
  equipmentPrice: {
    fontSize: normalize(12),
    lineHeight: normalize(14),
    fontWeight: '500',
    color: COLORS.PRIMARY_TXT,
  },
  noResultsText: {
    padding: normalize(12),
    textAlign: 'center',
    color: COLORS.GREY,
    fontStyle: 'italic',
    fontSize: normalize(12),
    lineHeight: normalize(14),
  },
});

export default AvCustomMultiSelect;
