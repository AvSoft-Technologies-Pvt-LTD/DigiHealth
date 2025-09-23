import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
  Animated,
  Dimensions,
  Easing,
} from 'react-native';
import AvButton from '../../elements/AvButton';
import AvText from '../../elements/AvText';
import { COLORS } from '../../constants/colors';
import { normalize } from '../../constants/platform';
import AvIcons from '../../elements/AvIcons';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface FilterOption {
  id: string;
  displayName: string;
}

export interface SearchFilterBarProps<T extends FilterOption> {
  searchValue: string;
  onSearchChange: (text: string) => void;
  placeholder?: string;
  filterOptions?: T[];
  onFiltersApplied: (selectedFilters: Record<string, boolean>) => void;
  filterModalTitle?: string;
  applyButtonText?: string;
  resetButtonText?: string;
}

export function SearchFilterBar<T extends FilterOption>({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  filterOptions = [],
  onFiltersApplied,
  filterModalTitle = "Filter",
  applyButtonText = "Apply",
  resetButtonText = "Reset",
}: SearchFilterBarProps<T>) {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const slideAnimation = useRef(new Animated.Value(screenWidth)).current;

  const toggleFilterModal = () => {
    const toValue = isFilterModalVisible ? screenWidth : 0;
    slideAnimation.setValue(isFilterModalVisible ? 0 : screenWidth);
    Animated.timing(slideAnimation, {
      toValue,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsFilterModalVisible(!isFilterModalVisible);
  };

  useEffect(() => {
    setSelectedFilters(
      filterOptions.reduce((acc, option) => ({ ...acc, [option.id]: false }), {})
    );
  }, [filterOptions]);

  const handleFilterOptionPress = (filterId: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterId]: !prev[filterId],
    }));
  };

  const handleApplyFiltersPress = () => {
    onFiltersApplied(selectedFilters);
    toggleFilterModal();
  };

  const handleResetFiltersPress = () => {
    setSelectedFilters(
      filterOptions.reduce((acc, option) => ({ ...acc, [option.id]: false }), {})
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchInputContainer}>
        <AvIcons
          type={"Ionicons"}
          name={"search-outline"}
          size={normalize(18)}
          color={COLORS.GREY}
        />
        <TextInput
          style={styles.searchInput}
          value={searchValue}
          onChangeText={onSearchChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.GREY}
          returnKeyType="search"
        />
      </View>
      <AvIcons
        onPress={toggleFilterModal}
        type={"MaterialIcons"}
        name={"tune"}
        size={normalize(20)}
        style={styles.filterButton}
        color={COLORS.PRIMARY}
      />

      {/* Filter Modal */}
      <Modal visible={isFilterModalVisible} transparent={true} animationType="none">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={toggleFilterModal}
        >
          <Animated.View
            style={[
              styles.filterModalContainer,
              { transform: [{ translateX: slideAnimation }] },
            ]}
          >
            <View style={styles.modalHeader}>
              <AvText type="title_6" style={styles.modalTitle}>{filterModalTitle}</AvText>
              
                <AvIcons
                  onPress={toggleFilterModal}
                  type={"Ionicons"}
                  name={"close-outline"}
                  size={normalize(24)}
                  color={COLORS.GREY}
                />
              
            </View>
            <View style={styles.filterOptionsContainer}>
              {filterOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.filterOption}
                  onPress={() => handleFilterOptionPress(option.id)}
                >
                  <View style={styles.checkboxContainer}>
                    <View
                      style={[
                        styles.checkbox,
                        selectedFilters[option.id] && styles.selectedCheckbox,
                      ]}
                    >
                      {selectedFilters[option.id] && (
                        <AvIcons
                          type={"MaterialIcons"}
                          name={"check"}
                          size={normalize(16)}
                          color={COLORS.WHITE}
                        />
                      )}
                    </View>
                    <AvText type="body" style={styles.filterOptionText}>{option.displayName}</AvText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalFooter}>
              <AvButton
                style={styles.resetButton}
                onPress={handleResetFiltersPress}
                buttonColor={COLORS.WHITE}
              >
                <AvText type="buttonText" style={styles.resetButtonText}>{resetButtonText}</AvText>
              </AvButton>
              <AvButton
                style={styles.applyButton}
                onPress={handleApplyFiltersPress}
                mode="contained"
                buttonColor={COLORS.PRIMARY}
              >
                <AvText type="buttonText" style={styles.applyButtonText}>{applyButtonText}</AvText>
              </AvButton>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.WHITE,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_OFF_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 6 : 3,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.PRIMARY,
  },
  filterButton: {
    backgroundColor: COLORS.BG_OFF_WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  filterModalContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: screenWidth * 0.85,
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    padding: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,

  },
  modalTitle: {
    color: COLORS.PRIMARY,
    marginBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  filterOptionsContainer: {
    flex: 1,
  },
  filterOption: {
    paddingVertical: 12,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedCheckbox: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  filterOptionText: {
    color: COLORS.PRIMARY,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: COLORS.LIGHT_GREY,
  },
  resetButtonText: {
    color: COLORS.GREY,
  },
  applyButton: {
    flex: 1,
    paddingVertical: 8,
  },
  applyButtonText: {
    color: COLORS.WHITE,
  },
});