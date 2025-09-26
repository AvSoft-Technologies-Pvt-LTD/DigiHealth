// SpecialtyModal.tsx
import React from "react";
import { View, StyleSheet, Modal, TouchableOpacity } from "react-native";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

interface SpecialtyModalProps {
  isVisible: boolean;
  onClose: () => void;
  specialties: string[];
  onSelectSpecialty: (specialty: string) => void;
}

const SpecialtyModal: React.FC<SpecialtyModalProps> = ({
  isVisible,
  onClose,
  specialties,
  onSelectSpecialty
}) => {
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <AvText type="title_2" style={styles.modalTitle}>
            All Suggested Specialties
          </AvText>
          {specialties.map((specialty, index) => (
            <TouchableOpacity
              key={index}
              style={styles.modalItem}
              onPress={() => {
                onSelectSpecialty(specialty);
                onClose();
              }}
            >
              <AvText>{specialty}</AvText>
            </TouchableOpacity>
          ))}
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
  },
  modalItem: {
    padding: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  modalCloseButton: {
    marginTop: normalize(16),
  },
});

export default SpecialtyModal;
