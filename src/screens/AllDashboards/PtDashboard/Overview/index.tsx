import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import AvModal from "../../../../elements/AvModal";
import AvTextInput from "../../../../elements/AvTextInput";
import AvButton from "../../../../elements/AvButton";
import AvText from "../../../../elements/AvText";
import { COLORS } from "../../../../constants/colors";
import { Switch } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { RootState } from "../../../../store";
import { AvSelect } from "../../../../elements";
import { pickupLocationData } from "../../../../constants/data";
import { fetchPatientPersonalDataStart } from "../../../../store/slices/patientPersonalDataSlice";
import { fetchPatientBloodGroupDataStart } from "../../../../store/slices/patientBloodGroupSlice";
import { fetchPatientBloodGroupData, fetchPatientPersonalHealthData } from "../../../../store/thunks/patientThunks";
import PersonalHealthModal from "./PersonalHealthModal";

type ModalNames = "personalHealth" | "family" | "additionalDetails";

type PatientModalsProps = {
  modalVisible: {
    personalHealth: boolean;
    family: boolean;
    additionalDetails: boolean;
  };
  closeModal: (modalName: ModalNames) => void;
  handleSave: (section: ModalNames) => void;
  formData: any;
  handleInputChange: (field: string, value: string | boolean | Date) => void;
  handleToggleChange: (field: string) => void;
};

const PatientModals: React.FC<PatientModalsProps> = ({
  modalVisible,
  closeModal,
  handleSave,
  formData,
  handleInputChange,
  handleToggleChange,
  personalHealthData,
  setPersonalHealthData,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<{ [key: string]: boolean }>({});

  const handleDateChange = (field: string, event: any, selectedDate?: Date) => {
    setShowDatePicker({ ...showDatePicker, [field]: false });
    if (selectedDate) {
      handleInputChange(field, selectedDate);
    }
  };
  const dispatch = useAppDispatch();

  return (
    <>
      {/* Personal Health Modal */}
      <PersonalHealthModal
        modalVisible={modalVisible.personalHealth}
        closeModal={() => closeModal("personalHealth")}
        dispatch={dispatch}
        formData={formData}
        handleInputChange={handleInputChange}
        handleToggleChange={handleToggleChange}
        personalHealthData={personalHealthData}
        setPersonalHealthData={setPersonalHealthData}
      />

      {/* Family Modal */}
      <AvModal
        isModalVisible={modalVisible.family}
        setModalVisible={() => closeModal("family")}
        title="Add Family Member"

      >
        <View style={styles.modalContent}>
          <View style={styles.inputRow}>
            <AvTextInput
              label="Relation"
              value={formData.relation}
              onChangeText={(text) => handleInputChange("relation", text)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
          <View style={styles.inputRow}>
            <AvTextInput
              label="Name"
              value={formData.familyName}
              onChangeText={(text) => handleInputChange("familyName", text)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
          <View style={styles.inputRow}>
            <AvTextInput
              label="Phone Number"
              value={formData.familyPhone}
              onChangeText={(text) => handleInputChange("familyPhone", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
          <View style={styles.inputRow}>
            <AvTextInput
              label="Health Conditions"
              value={formData.familyHealthConditions}
              onChangeText={(text) => handleInputChange("familyHealthConditions", text)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
          <View style={styles.modalButtons}>
            <AvButton
              mode="contained"
              style={styles.saveButton}
              onPress={() => handleSave("family")}
              buttonColor={COLORS.SUCCESS}
            >
              <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
                Save
              </AvText>
            </AvButton>
          </View>
        </View>
      </AvModal>

      {/* Additional Details Modal */}
      <AvModal
        isModalVisible={modalVisible.additionalDetails}
        setModalVisible={() => closeModal("additionalDetails")}
        title="Additional Details"

      >
        <View style={styles.modalContent}>
          <View style={styles.inputRow}>
            <AvTextInput
              label="Insurance Provider"
              value={formData.insuranceProvider}
              onChangeText={(text) => handleInputChange("insuranceProvider", text)}
              style={styles.input}
              mode="outlined"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <AvTextInput
                label="Policy Number"
                value={formData.policyNumber}
                onChangeText={(text) => handleInputChange("policyNumber", text)}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            </View>
            <View style={styles.inputHalf}>
              <AvTextInput
                label="Coverage Type"
                value={formData.coverageType}
                onChangeText={(text) => handleInputChange("coverageType", text)}
                style={styles.input}
                mode="outlined"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <AvTextInput
                label="Coverage Amount"
                value={formData.coverageAmount}
                onChangeText={(text) => handleInputChange("coverageAmount", text)}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            </View>
            <View style={styles.inputHalf}>
              <AvText type="caption" style={styles.label}>
                Primary Holder
              </AvText>
              <View style={styles.radioGroup}>
                <TouchableOpacity onPress={() => handleInputChange("isPrimaryHolder", true)}>
                  <View style={styles.radioContainer}>
                    <Icon
                      name={formData.isPrimaryHolder ? "radiobox-marked" : "radiobox-blank"}
                      size={20}
                      color={formData.isPrimaryHolder ? COLORS.PRIMARY : COLORS.LIGHT_GREY}
                    />
                    <AvText type="body" style={styles.radioLabel}>
                      Yes
                    </AvText>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleInputChange("isPrimaryHolder", false)}>
                  <View style={styles.radioContainer}>
                    <Icon
                      name={!formData.isPrimaryHolder ? "radiobox-marked" : "radiobox-blank"}
                      size={20}
                      color={!formData.isPrimaryHolder ? COLORS.PRIMARY : COLORS.LIGHT_GREY}
                    />
                    <AvText type="body" style={styles.radioLabel}>
                      No
                    </AvText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <TouchableOpacity
                onPress={() => setShowDatePicker({ ...showDatePicker, startDate: true })}
                style={styles.dateInputContainer}
              >
                <AvTextInput
                  label="Start Date"
                  value={formData.startDate ? new Date(formData.startDate).toLocaleDateString() : ""}
                  style={styles.input}
                  mode="outlined"
                  editable={false}
                  theme={{ colors: { primary: COLORS.PRIMARY, outline: COLORS.LIGHT_GREY } }}
                />
                <Icon
                  name="calendar"
                  size={24}
                  color={COLORS.PRIMARY}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              {showDatePicker.startDate && (
                <DateTimePicker
                  value={formData.startDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange("startDate", event, selectedDate)}
                  accentColor={COLORS.PRIMARY}
                />
              )}
            </View>
            <View style={styles.inputHalf}>
              <TouchableOpacity
                onPress={() => setShowDatePicker({ ...showDatePicker, endDate: true })}
                style={styles.dateInputContainer}
              >
                <AvTextInput
                  label="End Date"
                  value={formData.endDate ? new Date(formData.endDate).toLocaleDateString() : ""}
                  style={styles.input}
                  mode="outlined"
                  editable={false}
                  theme={{ colors: { primary: COLORS.PRIMARY, outline: COLORS.LIGHT_GREY } }}
                />
                <Icon
                  name="calendar"
                  size={24}
                  color={COLORS.PRIMARY}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              {showDatePicker.endDate && (
                <DateTimePicker
                  value={formData.endDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => handleDateChange("endDate", event, selectedDate)}
                  accentColor={COLORS.PRIMARY}
                />
              )}
            </View>
          </View>

          <View style={styles.modalButtons}>
            <AvButton
              mode="contained"
              style={styles.saveButton}
              onPress={() => handleSave("additionalDetails")}
              buttonColor={COLORS.SUCCESS}
            >
              <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
                Save
              </AvText>
            </AvButton>
          </View>
        </View>
      </AvModal>
    </>
  );
};

const styles = StyleSheet.create({
  modalContent: { padding: 16 },
  inputRow: { marginBottom: 12 },
  inputHalf: { flex: 1, marginRight: 8 },
  input: {
    marginBottom: 4,
    backgroundColor: COLORS.WHITE,
    height: 50,
  },
  toggleContainer: { marginBottom: 16 },
  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  toggleLabel: { color: COLORS.PRIMARY_TXT, flex: 1 },
  label: { marginVertical: 10, fontSize: 15, color: COLORS.PRIMARY_TXT },
  radioGroup: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  radioContainer: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  radioLabel: { marginLeft: 8, color: COLORS.PRIMARY_TXT },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  saveButton: { borderRadius: 8 },
  dateInputContainer: {
    position: 'relative',
  },
  calendarIcon: {
    position: 'absolute',
    right: 18,
    top: 22,
    zIndex: 1,
  },

});

export default PatientModals;
