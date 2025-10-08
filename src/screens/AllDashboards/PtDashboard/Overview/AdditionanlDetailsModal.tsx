import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import AvModal from "../../../../elements/AvModal";
import AvTextInput from "../../../../elements/AvTextInput";
import AvButton from "../../../../elements/AvButton";
import AvText from "../../../../elements/AvText";
import { COLORS } from "../../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AvSelect } from "../../../../elements/AvSelect";
import { useAppSelector, useAppDispatch } from "../../../../store/hooks";
import {
  fetchCoverageTypes,
  savePatientAdditionalDetails,
} from "../../../../store/thunks/patientThunks";

type Coverage = { id: string; coverageTypeName: string };

type AdditionalDetailsModalProps = {
  modalVisible: boolean;
  closeModal: () => void;
  formData: {
    insuranceProvider: string;
    policyNumber: string;
    coverageAmount: string;
    coverageType: string;
    isPrimaryHolder: boolean;
    startDate?: Date;
    endDate?: Date;
    patientId?: string; // ✅ include patientId
    [key: string]: any;
  };
  handleInputChange: (field: string, value: string | boolean | Date) => void;
};

const AdditionalDetailsModal: React.FC<AdditionalDetailsModalProps> = ({
  modalVisible,
  closeModal,
  formData,
  handleInputChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState<{ [key: string]: boolean }>({});
  const [coverageTypes, setCoverageTypes] = useState<Array<{ label: string; value: string }>>([]);
  const dispatch = useAppDispatch();

  // ✅ Fetch coverage types from Redux
  const coverageData: Coverage[] = useAppSelector(
    (state) => state?.coverageData?.coverageData || []
  );

  // ✅ Fetch coverage data once on mount
  useEffect(() => {
    dispatch(fetchCoverageTypes());
  }, [dispatch]);

  useEffect(() => {
    if (coverageData && coverageData.length > 0) {
      const formattedCoverage = coverageData.map((item) => ({
        label: item.coverageTypeName,
        value: item.id,
      }));
      setCoverageTypes(formattedCoverage);
    }
  }, [coverageData]);

  const handleDateChange = (field: string, event: any, selectedDate?: Date) => {
    setShowDatePicker({ ...showDatePicker, [field]: false });
    if (selectedDate) handleInputChange(field, selectedDate);
  };


  const onSave = async () => {
    const payload = {
      patientId: 2, // ✅ Make sure this is passed from parent
      insuranceProvider: formData.insuranceProvider?.trim(),
      policyNumber: formData.policyNumber?.trim(),
      coverageAmount: parseFloat(formData.coverageAmount || "0"),
      coverageType: formData.coverageType,
      isPrimaryHolder: formData.isPrimaryHolder,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    console.log("🔹 Saving Additional Details Payload:", payload);

    try {
      await dispatch(savePatientAdditionalDetails(payload));
      closeModal();
    } catch (error) {
      console.error("❌ Error saving additional details:", error);
    }
  };

  return (
    <AvModal isModalVisible={modalVisible} setModalVisible={closeModal} title="Additional Details">
      <View style={styles.modalContent}>
        {/* Insurance Provider */}
        <AvTextInput
          label="Insurance Provider"
          value={formData.insuranceProvider}
          onChangeText={(text) => handleInputChange("insuranceProvider", text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
        />

        {/* Policy Number */}
        <AvTextInput
          label="Policy Number"
          value={formData.policyNumber}
          onChangeText={(text) => handleInputChange("policyNumber", text)}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
        />

        {/* Coverage Amount */}
        <AvTextInput
          label="Coverage Amount"
          value={formData.coverageAmount}
          onChangeText={(text) => handleInputChange("coverageAmount", text)}
          style={styles.input}
          mode="outlined"
          keyboardType="numeric"
          theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
        />

        {/* Coverage Type Dropdown */}
        <AvSelect
          items={coverageTypes}
          selectedValue={formData.coverageType}
          onValueChange={(value) => handleInputChange("coverageType", value)}
          placeholder="Select coverage type"
          required
        />

        {/* Primary Holder */}
        <View style={{ marginTop: 10 }}>
          <AvText type="caption" style={styles.label}>
            Primary Holder
          </AvText>
          <View style={styles.radioGroup}>
            {["Yes", "No"].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => handleInputChange("isPrimaryHolder", val === "Yes")}
              >
                <View style={styles.radioContainer}>
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
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Date */}
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
          <Icon name="calendar" size={24} color={COLORS.PRIMARY} style={styles.calendarIcon} />
        </TouchableOpacity>
        {showDatePicker.startDate && (
          <DateTimePicker
            value={formData.startDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => handleDateChange("startDate", e, date)}
            accentColor={COLORS.PRIMARY}
          />
        )}

        {/* End Date */}
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
          <Icon name="calendar" size={24} color={COLORS.PRIMARY} style={styles.calendarIcon} />
        </TouchableOpacity>
        {showDatePicker.endDate && (
          <DateTimePicker
            value={formData.endDate || new Date()}
            mode="date"
            display="default"
            onChange={(e, date) => handleDateChange("endDate", e, date)}
            accentColor={COLORS.PRIMARY}
          />
        )}

        {/* Save Button */}
        <View style={styles.modalButtons}>
          <AvButton
            mode="contained"
            style={styles.saveButton}
            onPress={onSave}
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
  input: { marginBottom: 8, backgroundColor: COLORS.WHITE, height: 50 },
  label: { marginVertical: 10, fontSize: 15, color: COLORS.PRIMARY_TXT },
  radioGroup: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  radioContainer: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  radioLabel: { marginLeft: 8, color: COLORS.PRIMARY_TXT },
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 20 },
  saveButton: { borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  dateInputContainer: { position: "relative" },
  calendarIcon: { position: "absolute", right: 18, top: 22, zIndex: 1 },
});

export default AdditionalDetailsModal;
