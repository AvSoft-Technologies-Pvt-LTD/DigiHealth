import React, { useEffect, useState } from "react";
import { View, StyleSheet, TextInput, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../../../store";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import AvCard from "../../../../elements/AvCards";
import AvModal from "../../../../elements/AvModal";
import { COLORS } from "../../../../constants/colors";
import {
  healthSummaryData,
  updatePatientVitals,
  createPatientVitals,
} from "../../../../store/thunks/patientThunks";

interface Vital {
  id: string;
  type: string;
  value: number | string;
  unit: string;
  icon: string;
}

interface VitalData {
  temperature?: number;
  spo2?: number;
  blood_pressure?: string;
  heart_rate?: number;
  respiratory_rate?: number;
  blood_sugar?: number;
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
    { id: "1", type: "Temperature", value: "", unit: "°F", icon: "thermometer" },
    { id: "2", type: "SpO2", value: "", unit: "%", icon: "waveform" },
    { id: "3", type: "Blood Pressure", value: "", unit: "mmHg", icon: "heart-pulse" },
    { id: "4", type: "Heart Rate", value: "", unit: "bpm", icon: "heart" },
    { id: "5", type: "Respiratory Rate", value: "", unit: "rpm", icon: "lungs" },
    { id: "6", type: "Blood Sugar", value: "", unit: "mg/dL", icon: "test-tube" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
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
      { id: "1", type: "Temperature", value: data.temperature !== undefined ? data.temperature : "", unit: "°F", icon: "thermometer" },
      { id: "2", type: "SpO2", value: data.spo2 !== undefined ? data.spo2 : "", unit: "%", icon: "waveform" },
      { id: "3", type: "Blood Pressure", value: data.blood_pressure ? data.blood_pressure : "", unit: "mmHg", icon: "heart-pulse" },
      { id: "4", type: "Heart Rate", value: data.heart_rate !== undefined ? data.heart_rate : "", unit: "bpm", icon: "heart" },
      { id: "5", type: "Respiratory Rate", value: data.respiratory_rate !== undefined ? data.respiratory_rate : "", unit: "rpm", icon: "lungs" },
      { id: "6", type: "Blood Sugar", value: data.blood_sugar !== undefined ? data.blood_sugar : "", unit: "mg/dL", icon: "test-tube" },
    ];
  };

  useEffect(() => {
    if (!effectivePatientId || !isPatient) return;
    const fetchData = async () => {
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
    const initialValues = vitals.reduce((acc, vital) => {
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
      patientId:"2",
      temperature: vitalValues["1"] ? Number(vitalValues["1"]) : undefined,
      spo2: vitalValues["2"] ? Number(vitalValues["2"]) : undefined,
      blood_pressure: vitalValues["3"] || undefined,
      heart_rate: vitalValues["4"] ? Number(vitalValues["4"]) : undefined,
      respiratory_rate: vitalValues["5"] ? Number(vitalValues["5"]) : undefined,
      blood_sugar: vitalValues["6"] ? Number(vitalValues["6"]) : undefined,
    };
    try {
      setIsLoading(true);
      if (effectivePatientId) {
        if (hasNoData) {
          await dispatch(createPatientVitals(effectivePatientId, vitalsData));
        } else {
          await dispatch(updatePatientVitals(effectivePatientId, vitalsData));
        }
        Alert.alert("Success", "Vitals saved successfully");
      }
      setModalVisible(false);
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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AvText type="title_6" style={{ color: COLORS.ERROR }}>{error}</AvText>
        <AvButton mode="contained" onPress={() => setError(null)} style={styles.retryButton}>Try Again</AvButton>
      </View>
    );
  }

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
          icon={() => <Icon name={hasNoData ? "plus" : "pencil"} size={16} color={COLORS.WHITE} />}
          onPress={handleUpdateVitals}
          disabled={isLoading}
        >
          <AvText type="buttonText" style={{ color: COLORS.WHITE, fontSize: 16, fontWeight: "500" }}>
            {isLoading ? "Loading..." : hasNoData ? "Add Vitals" : "Update Vitals"}
          </AvText>
        </AvButton>
      </View>
      <View style={styles.vitalsContainer}>
        {vitals.some(vital => vital.value) ? (
          vitals.map((vital) => (
            <AvCard
              key={vital.id}
              title={<AvText type="body" style={{ color: COLORS.PRIMARY_TXT, fontWeight: "500" }}>{vital.type}</AvText>}
              icon={<Icon name={vital.icon} size={20} color={COLORS.PRIMARY} />}
              cardStyle={[styles.vitalCard, { borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4 }]}
            >
              <AvText type="title_2" style={{ color: COLORS.PRIMARY, marginTop: 4 }}>
                {vital.value || "N/A"} {vital.unit}
              </AvText>
            </AvCard>
          ))
        ) : (
          <AvText type="body" style={{ color: COLORS.PRIMARY_TXT, textAlign: "center", width: "100%" }}>
            No vitals data available. Tap "Add Vitals" to begin.
          </AvText>
        )}
      </View>
      <AvModal isModalVisible={modalVisible} setModalVisible={setModalVisible} title={hasNoData ? "Add Vitals" : "Update Vitals"}>
        <ScrollView style={styles.modalContent}>
          {vitals.map((vital) => (
            <View key={vital.id} style={styles.vitalInputContainer}>
              <View style={styles.vitalInputHeader}>
                <Icon name={vital.icon} size={20} color={COLORS.PRIMARY} style={styles.vitalIcon} />
                <AvText type="body" style={styles.vitalInputLabel}>{vital.type}</AvText>
              </View>
              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={vitalValues[vital.id] || ''}
                  onChangeText={(text) => handleValueChange(vital.id, text)}
                  keyboardType="numeric"
                  placeholder={`Enter ${vital.type}`}
                  editable={!isLoading}
                />
                <AvText type="body" style={styles.unitText}>{vital.unit}</AvText>
              </View>
            </View>
          ))}
          <AvButton
            mode="contained"
            style={styles.saveButton}
            buttonColor={COLORS.PRIMARY}
            onPress={handleSaveVitals}
            disabled={isLoading}
          >
            <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
              {isLoading ? "Saving..." : hasNoData ? "Add Vitals" : "Save All Changes"}
            </AvText>
          </AvButton>
        </ScrollView>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  healthSummary: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16 },
  cardShadow: { shadowColor: COLORS.SECONDARY, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
  healthSummaryHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  addVitalsButton: { borderRadius: 20 },
  vitalsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 8 },
  vitalCard: { width: "48%", marginVertical: 4 },
  modalContent: { width: "100%", padding: 16, maxHeight: "100%" },
  vitalInputContainer: { marginBottom: 16 },
  vitalInputHeader: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  vitalIcon: { marginRight: 8 },
  vitalInputLabel: { color: COLORS.PRIMARY_TXT, fontWeight: "300" },
  inputRow: { flexDirection: "row", alignItems: "center" },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.LIGHT_GREY, borderRadius: 8, padding: 12, fontSize: 16 },
  unitText: { color: COLORS.PRIMARY_TXT, marginLeft: 8, fontWeight: "500" },
  saveButton: { marginTop: 20, borderRadius: 8, paddingVertical: 8 },
  noPatientContainer: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', height: 100 },
  loadingContainer: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', height: 100 },
  errorContainer: { backgroundColor: COLORS.WHITE, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', height: 150 },
  retryButton: { marginTop: 16, borderRadius: 8 },
});

export default HealthSummary;
