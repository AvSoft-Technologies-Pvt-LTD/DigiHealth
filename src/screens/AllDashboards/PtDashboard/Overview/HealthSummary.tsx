import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";

import AvModal from "../../../../elements/AvModal";
import { COLORS } from "../../../../constants/colors";
import {
  healthSummaryData,
  updatePatientVitals,
  createPatientVitals,
} from "../../../../store/thunks/patientThunks";
import { AvButton, AvCards, AvIcons, AvText, AvTextInput } from "../../../../elements";
import { normalize } from "../../../../constants/platform";

interface Vital {
  id: string;
  type: string;
  value: number | string;
  unit: string;
  icon: string;
}

interface VitalData {
  patientId?: string;
  temperature?: number;
  spo2?: number;
  bloodPressure?: string;
  heartRate?: number;
  respiratoryRate?: number;
  bloodSugar?: number;
  steps?:number;
}

const HealthSummary = () => {
  const dispatch: AppDispatch = useDispatch();
  const { healthSummaryData: reduxVitals, loading, error: reduxError } = useSelector(
    (state: RootState) => state.healthSummaryData
  );
  const patientId = useSelector((state: RootState) => state.user.userProfile.patientId);
  const userId = useSelector((state: RootState) => state.user.userProfile.userId);
  const userRole = useSelector((state: RootState) => state.user.userProfile.role);

  const isPatient = userRole?.toLowerCase() === 'patient';
  const effectivePatientId = patientId || (isPatient ? userId : null);

  const [vitals, setVitals] = useState<Vital[]>([
    { id: "1", type: "Heart Rate", value: "", unit: "bpm", icon: "heart" },
    { id: "2", type: "Temperature", value: "", unit: "°C", icon: "thermometer" },
    { id: "3", type: "Blood Sugar", value: "", unit: "mg/dL", icon: "test-tube" },
    { id: "4", type: "Blood Pressure", value: "", unit: "mmHg", icon: "heart-pulse" },
    { id: "5", type: "Respiratory Rate", value: "", unit: "rpm", icon: "lungs" },
    { id: "6", type: "SpO2", value: "", unit: "%", icon: "waveform" },
    { id: "7", type: "Steps", value: "", unit: "", icon: "walk" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [vitalValues, setVitalValues] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(loading);
  const [error, setError] = useState<string | null>(reduxError || null);

  const hasNoData = vitals.every(vital => !vital.value || vital.value === "N/A");

  const transformVitalsData = (data: VitalData) => {
    if (!data) {
      console.log("No data to transform");
      return [];
    }
    return [
      { id: "1", type: "Heart Rate", value: data?.heartRate !== undefined ? data?.heartRate : "", unit: "bpm", icon: "heart" },
      { id: "2", type: "Temperature", value: data?.temperature !== undefined ? data?.temperature : "", unit: "°C", icon: "thermometer" },
      { id: "3", type: "Blood Sugar", value: data?.bloodSugar !== undefined ? data?.bloodSugar : "", unit: "mg/dL", icon: "test-tube" },
      { id: "4", type: "Blood Pressure", value: data?.bloodPressure ? data?.bloodPressure : "", unit: "mmHg", icon: "heart-pulse" },
      { id: "5", type: "Respiratory Rate", value: data?.respiratoryRate !== undefined ? data?.respiratoryRate : "", unit: "rpm", icon: "lungs" },
      { id: "6", type: "SpO2", value: data?.spo2 !== undefined ? data?.spo2 : "", unit: "%", icon: "waveform" },
      { id: "7", type: "Steps", value: data?.steps !== undefined ? data?.steps : "", unit: "", icon: "walk" },
    ];
  };

  useEffect(() => {
    if (!effectivePatientId || !isPatient) return;  const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await dispatch(healthSummaryData(effectivePatientId));
      } catch (err) {
        setError("Failed to load health data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [dispatch, effectivePatientId, isPatient]);

  useEffect(() => {
    if (reduxVitals) {
      const transformedVitals = transformVitalsData(reduxVitals);
      setVitals(transformedVitals);
    }
  }, [reduxVitals]);

  useEffect(() => {
    setIsLoading(loading);
    if (reduxError) setError(reduxError);
  }, [loading, reduxError]);

  const handleUpdateVitals = () => {
    const initialValues = vitals?.reduce((acc, vital) => {
      acc[vital.id] = String(vital.value);
      return acc;
    }, {} as Record<string, string>);
    setVitalValues(initialValues);
    setModalVisible(true);
  };

  const handleValueChange = (id: string, value: string) => {
    setVitalValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveVitals = async () => {
    const vitalsData: VitalData = {
      patientId:effectivePatientId,
      temperature: vitalValues["2"] ? Number(vitalValues["2"]) : undefined,
      spo2: vitalValues["6"] ? Number(vitalValues["6"]) : undefined,
  
      bloodPressure: vitalValues["4"] || undefined,
      heartRate: vitalValues["1"] ? Number(vitalValues["1"]) : undefined,
      respiratoryRate: vitalValues["5"] ? Number(vitalValues["5"]) : undefined,
      bloodSugar: vitalValues["3"] ? Number(vitalValues["3"]) : undefined,
      steps:vitalValues["7"] ? Number(vitalValues["7"]) : undefined,
    };
    console.log("HSUMMARY PAYLOAD",vitalsData,"ID",effectivePatientId)
    console.log("IS NEW",hasNoData)
    // return;
    try {
      setIsLoading(true);    if (effectivePatientId) {
        if (hasNoData) {
          await dispatch(createPatientVitals(vitalsData));
        } else {
          await dispatch(updatePatientVitals(effectivePatientId, vitalsData));
        }
        setModalVisible(false);
        setSuccessModalVisible(true);
        
        // Auto-hide success modal after 3 seconds
        setTimeout(() => {
          setSuccessModalVisible(false);
        }, 1000);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to save vitals. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!effectivePatientId) {
    return (
      <View style={styles.noPatientContainer}>
        <AvText type="title_6" style={{ color: COLORS.PRIMARY }}>No patient selected</AvText>
      </View>
    );
  }

  if (!isPatient) {
    return (
      <View style={styles.noPatientContainer}>
        <AvText type="title_6" style={{ color: COLORS.PRIMARY }}>Not authorized to view this data</AvText>
      </View>
    );
  }

  if (isLoading && vitals.every(vital => !vital.value)) {
    return (
      <View style={styles.loadingContainer}>
        <AvText type="title_6" style={{ color: COLORS.PRIMARY }}>Loading health data...</AvText>
      </View>
    );
  }

  // if (error) {
  //   return (
  //     <View style={styles.errorContainer}>
  //       <AvText type="title_6" style={{ color: COLORS.ERROR }}>{error}</AvText>
  //       <AvButton mode="contained" onPress={() => setError(null)} style={styles.retryButton}>Try Again</AvButton>
  //     </View>
  //   );
  // }

  return (
    <View style={[styles.healthSummary, styles.cardShadow]}>
      <View style={styles.healthSummaryHeader}>
        <AvText type="title_6" style={{ color: COLORS.PRIMARY }}>
          Health Summary
        </AvText>
        <AvButton
          mode="contained"
          style={styles.addVitalsButton}
          buttonColor={COLORS.SECONDARY}
          icon={() => <AvIcons type="MaterialCommunityIcons"  name={hasNoData ? "plus" : "pencil"} size={16} color={COLORS.WHITE} />}
          onPress={handleUpdateVitals}
          disabled={isLoading}
        >
          <AvText type="buttonText" style={{ color: COLORS.WHITE, fontSize: 16, fontWeight: "500" }}>
            {isLoading ? "Loading..." : hasNoData ? "Add Vitals" : "Update Vitals"}
          </AvText>
        </AvButton>
      </View>
      <View style={styles.vitalsContainer}>
        {vitals?.some(vital => vital.value) ? (
          vitals?.map((vital) => (
            <AvCards
              key={vital.id}
              title={<AvText type="body" style={{ color: COLORS.PRIMARY_TXT, fontWeight: "500" }}>{vital.type}</AvText>}
              icon={<AvIcons type="MaterialCommunityIcons" name={vital.icon} size={20} color={COLORS.PRIMARY} />}
              cardStyle={[styles.vitalCard, { borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4 }]}
            >
              <AvText type="title_2" style={{ color: COLORS.PRIMARY, marginTop: 4 }}>
                {vital.value || "N/A"} {vital.unit}
              </AvText>
            </AvCards>
          ))
        ) : (
          <AvText type="body" style={{ color: COLORS.PRIMARY_TXT, textAlign: "center", width: "100%" }}>
            No vitals data available. Tap "Add Vitals" to begin.
          </AvText>
        )}
      </View>
      <AvModal isModalVisible={modalVisible} setModalVisible={setModalVisible} title={hasNoData ? "Add Vitals" : "Update Vitals"}>
        <ScrollView style={styles.modalContent}>
          <View style={styles.vitalsGrid}>
            {vitals.map((vital) => (
              <View key={vital.id} style={styles.vitalInputContainer}>
                <View style={styles.vitalInputHeader}>
                  <AvIcons type="MaterialCommunityIcons" name={vital.icon} size={16} color={COLORS.PRIMARY} style={styles.vitalIcon} />
                  <AvText type="caption" style={styles.vitalInputLabel}>{vital.type}</AvText>
                </View>
                <View style={styles.inputRow}>
                  <AvTextInput
                    style={styles.compactInput}
                    value={vitalValues[vital.id] || ''}
                    onChangeText={(text) => handleValueChange(vital.id, text)}
                    keyboardType={vital.type === "Blood Pressure" ? "default" : "numeric"}
                    placeholder={`Enter ${vital.type}`}
                    editable={!isLoading}
                  />
                  <AvText type="caption" style={styles.unitText}>{vital.unit}</AvText>
                </View>
              </View>
            ))}
          </View>
          <AvButton
            mode="contained"
            style={styles.saveButton}
            buttonColor={COLORS.PRIMARY}
            onPress={handleSaveVitals}
            disabled={isLoading}
          >
            <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
              {isLoading ? "Saving..." : hasNoData ? "Add Vitals" : "Update Changes"}
            </AvText>
          </AvButton>
        </ScrollView>
      </AvModal>
      
      {/* Success Modal */}
      <AvModal 
        isModalVisible={successModalVisible} 
        setModalVisible={() => {}} 
        title=""
        showCloseButton={false}
      >
        <View style={styles.successModalContent}>
          <View style={styles.successIconContainer}>
            <AvIcons type="MaterialCommunityIcons" name="check-circle" size={48} color={COLORS.SUCCESS} />
          </View>
          <AvText type="heading_6" style={styles.successTitle}>Vitals Saved Successfully!</AvText>
          <AvText type="body" style={styles.successMessage}>
            Your vital information has been updated successfully.
          </AvText>
        </View>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  healthSummary: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16 },
  cardShadow: { shadowColor: COLORS.SECONDARY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  healthSummaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: normalize(16) },
  addVitalsButton: { borderRadius: normalize(20) },
  vitalsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: normalize(8) },
  vitalCard: { width: "48%", marginVertical: normalize(4) },
  modalContent: { width: "100%", padding: normalize(16), maxHeight: "100%" },
  vitalsGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 0},
  vitalInputContainer: { width: "48%", marginBottom: 0},
  vitalInputHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  vitalIcon: { marginRight: 6 },
  vitalInputLabel: { color: COLORS.PRIMARY_TXT, fontWeight: "300", fontSize: 12 },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.LIGHT_GREY, borderRadius: 8, padding: normalize(12), fontSize: normalize(16) },
  compactInput: { flex: 1, borderWidth: 1, borderColor: COLORS.LIGHT_GREY, borderRadius: 6, padding: 8, fontSize: normalize(14), height: normalize(36) },
  unitText: { color: COLORS.PRIMARY_TXT, marginLeft: 6, fontWeight: "500", fontSize: normalize(12) },
  saveButton: { marginTop: normalize(8), borderRadius: 8, paddingVertical: normalize(8) },
  successModalContent: { alignItems: "center", padding: normalize(20) },
  successIconContainer: { marginBottom: normalize(16) },
  successTitle: { color: COLORS.SUCCESS, textAlign: "center", marginBottom: normalize(8) },
  successMessage: { color: COLORS.PRIMARY_TXT, textAlign: "center", fontSize: normalize(14) },
  noPatientContainer: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: normalize(16), alignItems: 'center', justifyContent: 'center', height: normalize(100) },
  loadingContainer: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: normalize(16), alignItems: 'center', justifyContent: 'center', height: normalize(100) },
  errorContainer: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: normalize(16), alignItems: 'center', justifyContent: 'center', height: normalize(150) },
  retryButton: { marginTop: normalize(16), borderRadius: 8 },
});

export default HealthSummary;
