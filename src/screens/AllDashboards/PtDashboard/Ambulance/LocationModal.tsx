import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AvTextInput from "../../../../elements/AvTextInput";
import AvButton from "../../../../elements/AvButton";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ visible, onClose }) => {
  const [searchValue, setSearchValue] = useState("");

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Enter complete address</Text>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Icon name="close" size={normalize(16)} color={COLORS.GREY} />
          </TouchableOpacity>
        </View>
        {/* Search Bar with Search Button */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchInputContainer}>
            <Icon name="search" size={normalize(20)} color={COLORS.GREY} style={styles.searchIcon} />
            <TextInput
              style={styles.searchBar}
              placeholder="Search location..."
              placeholderTextColor={COLORS.GREY}
              value={searchValue}
              onChangeText={setSearchValue}
            />
          </View>
          <AvButton
            mode="contained"
            buttonColor={COLORS.PRIMARY_BLUE}
            style={styles.searchButton}
            onPress={() => {}}
          >
            <Icon name="search" size={normalize(20)} color={COLORS.WHITE} style={styles.searchIcon} />
          </AvButton>
        </View>
        <View style={styles.mapPreviewContainer}>
          <View style={styles.mapPlaceholder}>
            <Text>Map Preview Placeholder</Text>
          </View>
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Padmarao Nagar, Leaflet © OpenStreetMap contributors</Text>
          <Text style={styles.formSubLabel}>Add New Address</Text>
          <AvTextInput
            style={styles.formInput}
            placeholder="Flat / House no / Building name *"
            placeholderTextColor={COLORS.GREY}
          />
          <AvTextInput
            style={styles.formInput}
            placeholder="Floor (optional)"
            placeholderTextColor={COLORS.GREY}
          />
          <AvTextInput
            style={styles.formInput}
            placeholder="Area / Sector / Locality *"
            placeholderTextColor={COLORS.GREY}
          />
          <AvTextInput
            style={styles.formInput}
            placeholder="Nearby landmark (optional)"
            placeholderTextColor={COLORS.GREY}
          />
          <Text style={styles.formSectionLabel}>Enter your details for seamless delivery experience</Text>
          <AvTextInput
            style={styles.formInput}
            placeholder="Your name *"
            placeholderTextColor={COLORS.GREY}
          />
          <AvTextInput
            style={styles.formInput}
            placeholder="Your phone number *"
            placeholderTextColor={COLORS.GREY}
            keyboardType="phone-pad"
          />
        </View>
        <AvButton
          mode="contained"
          buttonColor={COLORS.BRIGHT_ORANGE}
          style={styles.saveBtn}
          onPress={() => {}}
          labelStyle={styles.saveBtnText}
        >
          Save Address
        </AvButton>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: normalize(20),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(15),
  },
  modalTitle: {
    fontSize: normalize(18),
    fontWeight: "600",
    color: COLORS.PRIMARY,
  },
  modalCloseBtn: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(12),
    width: normalize(24),
    height: normalize(24),
    justifyContent: "center",
    alignItems: "center",
  },
  searchBarContainer: {
    flexDirection: "row",
    marginBottom: normalize(15),
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: normalize(1),
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(10),
    backgroundColor: COLORS.WHITE,
  },
  searchIcon: {
    marginRight: normalize(8),
  },
  searchBar: {
    flex: 1,
    paddingVertical: normalize(10),
    fontSize: normalize(14),
    color: COLORS.PRIMARY,
  },
  searchButton: {
    width: normalize(80),
    marginLeft: normalize(10),
    borderRadius: normalize(8),
    justifyContent: "center",
    height: normalize(44),
  },
  mapPreviewContainer: {
    height: normalize(150),
    borderRadius: normalize(8),
    overflow: "hidden",
    marginBottom: normalize(15),
    backgroundColor: COLORS.LIGHT_GREY,
    justifyContent: "center",
    alignItems: "center",
  },
  mapPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    marginBottom: normalize(20),
  },
  formLabel: {
    fontSize: normalize(12),
    color: COLORS.GREY,
    marginBottom: normalize(5),
  },
  formSubLabel: {
    fontSize: normalize(14),
    fontWeight: "600",
    color: COLORS.PRIMARY,
    marginBottom: normalize(10),
  },
  formInput: {
    marginBottom: normalize(10),
  },
  formSectionLabel: {
    fontSize: normalize(12),
    color: COLORS.GREY,
    marginBottom: normalize(10),
    marginTop: normalize(10),
  },
  saveBtn: {
    paddingVertical: normalize(6),
    borderRadius: normalize(8),
    marginBottom: normalize(20),
  },
  saveBtnText: {
    color: COLORS.WHITE,
    fontWeight: "600",
    fontSize: normalize(16),
  },
});

export default LocationModal;
