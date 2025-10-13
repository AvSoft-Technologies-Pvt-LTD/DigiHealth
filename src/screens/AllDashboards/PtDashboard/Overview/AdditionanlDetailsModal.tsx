import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { AvModal, AvTextInput, AvButton, AvText, AvSelect } from "../../../../elements";
import { COLORS } from "../../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchCoverageTypes,
  fetchPatientAdditionalData,
  savePatientAdditionalData,
} from "../../../../store/thunks/patientThunks";

type Coverage = { id: string; coverageTypeName: string };

interface AdditionalDetailsModalProps {
  modalVisible: boolean;
  closeModal: () => void;
  formData: {
    insuranceProvider: string;
    policyNumber: string;
    coverageAmount: string;
    coverageType: string;
    isPrimaryHolder: boolean;
    startDate?: Date | null;
    endDate?: Date | null;
  };
  handleInputChange: (field: string, value: any) => void;
}

const AdditionalDetailsModal: React.FC<AdditionalDetailsModalProps> = ({
  modalVisible,
  closeModal,
  formData,
  handleInputChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<{ [key: string]: boolean }>({});
  const [coverageTypes, setCoverageTypes] = useState<Array<{ label: string; value: string }>>([]);
  
  const dispatch = useAppDispatch();
  
  const coverageData: Coverage[] = useAppSelector((state) => state?.coverageData?.coverageData || []);
  const patientId = useAppSelector((state) => state.user.userProfile.patientId);
  const patientAdditionalData = useAppSelector(
    (state) => state?.patient?.patientAdditionalData
  );

  useEffect(() => {
    if (modalVisible) {
      dispatch(fetchCoverageTypes());
    }
  }, [dispatch, modalVisible]);

  useEffect(() => {
    if (modalVisible && patientId) {
      dispatch(fetchPatientAdditionalData(patientId));
    }
  }, [dispatch, patientId, modalVisible]);

  // Map backend response to form fields
  useEffect(() => {
    if (patientAdditionalData) {
      // Handle insuranceProviderName
      if (patientAdditionalData.insuranceProviderName) {
        handleInputChange("insuranceProvider", patientAdditionalData.insuranceProviderName);
      }
      
      // Handle policyNum
      if (patientAdditionalData.policyNum) {
        handleInputChange("policyNumber", patientAdditionalData.policyNum);
      }
      
      // Handle coverageAmount
      if (patientAdditionalData.coverageAmount !== undefined) {
        handleInputChange("coverageAmount", patientAdditionalData.coverageAmount.toString());
      }
      
      // Handle coverageTypeId
      if (patientAdditionalData.coverageTypeId) {
        handleInputChange("coverageType", patientAdditionalData.coverageTypeId.toString());
      }
      
      // Handle primaryHolder
      if (patientAdditionalData.primaryHolder !== undefined) {
        handleInputChange("isPrimaryHolder", patientAdditionalData.primaryHolder);
      }
      
      // Handle policyStartDate (array format [year, month, day])
      if (patientAdditionalData.policyStartDate && Array.isArray(patientAdditionalData.policyStartDate)) {
        const [year, month, day] = patientAdditionalData.policyStartDate;
        handleInputChange("startDate", new Date(year, month - 1, day));
      }
      
      // Handle policyEndDate (array format [year, month, day])
      if (patientAdditionalData.policyEndDate && Array.isArray(patientAdditionalData.policyEndDate)) {
        const [year, month, day] = patientAdditionalData.policyEndDate;
        handleInputChange("endDate", new Date(year, month - 1, day));
      }
    }
  }, [patientAdditionalData]);

  useEffect(() => {
    if (coverageData && coverageData.length > 0) {
      const formatted = coverageData.map((item) => ({
        label: item.coverageTypeName,
        value: item.id,
      }));
      setCoverageTypes(formatted);
    }
  }, [coverageData]);

  const handleDateChange = (field: "startDate" | "endDate", event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker((prev) => ({ ...prev, [field]: false }));
    }
    if (selectedDate) {
      handleInputChange(field, selectedDate);
    }
  };

  const saveAdditionalDetails = async () => {
    if (!patientId) {
      console.error("❌ Missing patientId!");
      return;
    }

    // Format dates as array [year, month, day] to match backend format
    const formatDateToArray = (date: Date | null | undefined): number[] | undefined => {
      if (!date) return undefined;
      return [date.getFullYear(), date.getMonth() + 1, date.getDate()];
    };

    const payload = {
      insuranceProviderName: formData.insuranceProvider?.trim() || "",
      policyNum: formData.policyNumber?.trim() || "",
      coverageAmount: parseFloat(formData.coverageAmount || "0"),
      coverageTypeId: parseInt(formData.coverageType) || null,
      primaryHolder: !!formData.isPrimaryHolder,
      policyStartDate: formatDateToArray(formData.startDate),
      policyEndDate: formatDateToArray(formData.endDate),
    };

    console.log("📤 Saving Additional Details Payload:", payload);

    try {
      const response = await dispatch(savePatientAdditionalData(patientId, payload));
      console.log("✅ Additional details saved successfully:", response);
      closeModal();
    } catch (error) {
      console.error("❌ Failed to save additional details:", error);
    }
  };

  return (
    <AvModal
      isModalVisible={modalVisible}
      setModalVisible={closeModal}
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
          <AvTextInput
            label="Policy Number"
            value={formData.policyNumber}
            onChangeText={(text) => handleInputChange("policyNumber", text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
        </View>
        
        <View style={styles.inputRow}>
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
        
        <AvSelect
          items={coverageTypes}
          selectedValue={formData.coverageType}
          onValueChange={(value) => handleInputChange("coverageType", value)}
          placeholder="Select coverage type"
          required
        />
        
        <View style={styles.toggleContainer}>
          <AvText type="body" style={styles.toggleLabel}>
            Primary Holder
          </AvText>
          <View style={styles.radioGroup}>
            {["Yes", "No"].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => handleInputChange("isPrimaryHolder", val === "Yes")}
                style={styles.radioContainer}
              >
                <Icon
                  name={
                    (val === "Yes" && formData.isPrimaryHolder) ||
                    (val === "No" && !formData.isPrimaryHolder)
                      ? "radiobox-marked"
                      : "radiobox-blank"
                  }
                  size={20}
                  color={
                    (val === "Yes" && formData.isPrimaryHolder) ||
                    (val === "No" && !formData.isPrimaryHolder)
                      ? COLORS.PRIMARY
                      : COLORS.LIGHT_GREY
                  }
                />
                <AvText type="body" style={styles.radioLabel}>
                  {val}
                </AvText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <TouchableOpacity
          onPress={() => setShowDatePicker((prev) => ({ ...prev, startDate: true }))}
          style={styles.dateInputContainer}
        >
          <AvTextInput
            label="Start Date"
            value={formData.startDate ? formData.startDate.toLocaleDateString() : ""}
            editable={false}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
          <Icon name="calendar" size={24} color={COLORS.PRIMARY} style={styles.calendarIcon} />
        </TouchableOpacity>
        
        {showDatePicker.startDate && (
          <DateTimePicker
            value={formData.startDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => handleDateChange("startDate", e, date)}
          />
        )}
        
        <TouchableOpacity
          onPress={() => setShowDatePicker((prev) => ({ ...prev, endDate: true }))}
          style={styles.dateInputContainer}
        >
          <AvTextInput
            label="End Date"
            value={formData.endDate ? formData.endDate.toLocaleDateString() : ""}
            editable={false}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
          <Icon name="calendar" size={24} color={COLORS.PRIMARY} style={styles.calendarIcon} />
        </TouchableOpacity>
        
        {showDatePicker.endDate && (
          <DateTimePicker
            value={formData.endDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => handleDateChange("endDate", e, date)}
          />
        )}
        
        <View style={styles.modalButtons}>
          <AvButton
            mode="contained"
            style={styles.saveButton}
            onPress={saveAdditionalDetails}
            buttonColor={COLORS.SUCCESS}
          >
            <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
              Save
            </AvText>
          </AvButton>
        </View>
      </View>
    </AvModal>
  );
};

const styles = StyleSheet.create({
  modalContent: { padding: 16 },
  inputRow: { marginBottom: 12 },
  input: {
    marginBottom: 4,
    backgroundColor: COLORS.WHITE,
    height: 50,
  },
  toggleContainer: { marginBottom: 16 },
  toggleLabel: { color: COLORS.PRIMARY_TXT, marginBottom: 8 },
  radioGroup: { flexDirection: "row", alignItems: "center" },
  radioContainer: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  radioLabel: { marginLeft: 8, color: COLORS.PRIMARY_TXT },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  saveButton: { borderRadius: 8 },
  dateInputContainer: { position: "relative" },
  calendarIcon: { position: "absolute", right: 18, top: 22, zIndex: 1 },
});

export default AdditionalDetailsModal;
