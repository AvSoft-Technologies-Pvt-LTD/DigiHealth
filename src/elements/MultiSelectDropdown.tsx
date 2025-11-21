import React, { useState, useRef } from 'react';
import { View, TouchableOpacity,  StyleSheet, TouchableWithoutFeedback, FlatList } from 'react-native';
import AvText from '../elements/AvText';
import { COLORS } from '../constants/colors';
import { normalize, widthPercentageToDP as wp } from '../constants/platform';
import AvIcons from './AvIcons';
import AvModal from './AvModal';

interface MultiSelectItem {
  id: string;
  label: string;
}

interface MultiSelectDropdownProps {
  items: MultiSelectItem[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  placeholder?: string;
  label?: string;
}

export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  items,
  selectedIds,
  onSelect,
  placeholder = 'Select options',
  label = '',
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<View>(null);

  const handlePress = () => {
    if (buttonRef.current) {
      buttonRef.current.measureInWindow((x, y, width, height) => {
        setDropdownPosition({
          left: x,
          top: y + height,
          width,
        });
        setModalVisible(true);
      });
    }
  };

const selectedItems = items.filter((item) => (selectedIds || []).includes(item.id));
  const displayText =
    selectedItems.length > 0
      ? `${selectedItems.length} condition(s) selected`
      : placeholder;

  return (
    <View style={styles.container}>
      {label ? <AvText style={styles.label}>{label}</AvText> : null}
      <TouchableOpacity
        ref={buttonRef}
        style={styles.selectButton}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <AvText style={styles.buttonText}>{displayText}</AvText>
        <AvIcons type={"MaterialIcons"} name="chevron-down" size={20} color={COLORS.BLACK} />
      </TouchableOpacity>
      <AvModal
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
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
                },
              ]}
            >
              <FlatList
                data={items}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => onSelect(item.id)}
                  >
                    <View style={styles.checkboxContainer}>
                      <View
                        style={[
                          styles.checkbox,
                          {
                            backgroundColor: selectedIds.includes(item.id)
                              ? COLORS.PRIMARY
                              : COLORS.WHITE,
                          },
                        ]}
                      >
                        {selectedIds.includes(item.id) && (
                          <AvIcons type={"MaterialIcons"} name="check" size={16} color={COLORS.WHITE} />
                        )}
                      </View>
                      <AvText>{item.label}</AvText>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: normalize(18),
  },
  label: {
    fontSize: normalize(14),
    color: COLORS.BLACK,
    marginBottom: normalize(6),
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdown: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.GREY,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(16),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(2),
  },
});
