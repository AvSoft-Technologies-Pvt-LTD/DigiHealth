// LocationPickerModal.tsx
import React from "react";
import { View, StyleSheet, Modal, FlatList, TouchableOpacity } from "react-native";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import { PostOffice } from "../../../../constants/data";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

interface LocationPickerModalProps {
  isVisible: boolean;
  onClose: () => void;
  locations: PostOffice[];
  onSelectLocation: (postOffice: PostOffice) => void;
}

const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isVisible,
  onClose,
  locations,
  onSelectLocation,
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <AvText type="title_2" style={styles.modalTitle}>
            Select Location
          </AvText>
          <FlatList
            data={locations}
            keyExtractor={(item, index) => `${item.Name}-${index}`} // Safer key
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => onSelectLocation(item)}
              >
                <AvText>
                  {item.Name}, {item.District}, {item.State}
                </AvText>
              </TouchableOpacity>
            )}
          />
          <AvButton
            mode="contained"
            onPress={onClose}
            labelStyle={{ color: COLORS.WHITE }}
            buttonColor={COLORS.SECONDARY}
            style={styles.modalCloseButton}
          >
            Close
          </AvButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.TRANSPARENT, // Semi-transparent overlay
  },
  modalContent: {
    backgroundColor: COLORS.WHITE,
    padding: normalize(20),
    borderRadius: normalize(8),
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    marginBottom: normalize(16),
    textAlign: "center",
    color: COLORS.PRIMARY, // Added for consistency
  },
  modalItem: {
    padding: normalize(14),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  modalCloseButton: {
    marginTop: normalize(16),
  },
});

export default LocationPickerModal;
