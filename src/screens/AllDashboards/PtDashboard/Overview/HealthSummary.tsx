import React, { useState } from "react";
import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import AvCard from "../../../../elements/AvCards";
import AvModal from "../../../../elements/AvModal";
import { COLORS } from "../../../../constants/colors";

interface Vital {
  id: string;
  type: string;
  value: string;
  unit: string;
  icon: string;
}

const HealthSummary = () => {
  const [vitals, setVitals] = useState<Vital[]>([
    { id: '1', type: 'Temperature', value: '98.6', unit: '°F', icon: 'thermometer' },
    { id: '2', type: 'SpO2', value: '98', unit: '%', icon: 'waveform' },
    { id: '3', type: 'Blood Pressure', value: '120/80', unit: 'mmHg', icon: 'heart-pulse' },
    { id: '4', type: 'Heart Rate', value: '72', unit: 'bpm', icon: 'heart' },
    { id: '5', type: 'Respiratory Rate', value: '16', unit: 'rpm', icon: 'lungs' },
    { id: '6', type: 'Blood Sugar', value: '95', unit: 'mg/dL', icon: 'test-tube' },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [vitalValues, setVitalValues] = useState<Record<string, string>>({});

  const handleUpdateVitals = () => {
    // Initialize form values when opening modal
    const initialValues = vitals.reduce((acc, vital) => {
      acc[vital.id] = vital.value;
      return acc;
    }, {} as Record<string, string>);

    setVitalValues(initialValues);
    setModalVisible(true);
  };

  const handleValueChange = (id: string, value: string) => {
    setVitalValues(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSaveVitals = () => {
    // Update all vitals with new values
    const updatedVitals = vitals.map(vital => ({
      ...vital,
      value: vitalValues[vital.id] || vital.value
    }));

    setVitals(updatedVitals);
    setModalVisible(false);
  };

  return (
    <View style={[styles.healthSummary, styles.cardShadow]}>
      <View style={styles.healthSummaryHeader}>
        <AvText type="title_6" style={{ color: COLORS.PRIMARY }}>Health Summary</AvText>
        <AvButton
          mode="contained"
          style={styles.addVitalsButton}
          buttonColor={COLORS.SECONDARY}
          icon={() => <Icon name="pencil" size={16} color={COLORS.WHITE} />}
          onPress={handleUpdateVitals}
        >
          <AvText type="buttonText" style={{ color: COLORS.WHITE, fontSize: 16, fontWeight: '500' }}>
            Update Vitals
          </AvText>
        </AvButton>
      </View>

      <View style={styles.vitalsContainer}>
        {vitals.map(vital => (
          <AvCard
            key={vital.id}
            title={<AvText type="body" style={{ color: COLORS.PRIMARY_TXT, fontWeight: "500" }}>{vital.type}</AvText>}
            icon={<Icon name={vital.icon} size={20} color={COLORS.PRIMARY} />}
            cardStyle={[styles.vitalCard, { borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4 }]}
          >
            <AvText type="title_2" style={{ color: COLORS.PRIMARY, marginTop: 4 }}>
              {vital.value} {vital.unit}
            </AvText>
          </AvCard>
        ))}
      </View>

      {/* Modal for updating all vitals */}
      <AvModal
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Update Vitals" 
        
      >
        <ScrollView style={styles.modalContent}>
          {vitals.map(vital => (
            <View key={vital.id} style={styles.vitalInputContainer}>
              <View style={styles.vitalInputHeader}>
                <Icon name={vital.icon} size={20} color={COLORS.PRIMARY} style={styles.vitalIcon} />
                <AvText type="body" style={styles.vitalInputLabel}>
                  {vital.type}
                </AvText>
              </View>

              <View style={styles.inputRow}>
                <TextInput
                  style={styles.input}
                  value={vitalValues[vital.id]}
                  onChangeText={(text) => handleValueChange(vital.id, text)}
                  keyboardType="numeric"
                  placeholder="Enter value"
                />
                <AvText type="body" style={styles.unitText}>
                  {vital.unit}
                </AvText>
              </View>
            </View>
          ))}

          <AvButton
            mode="contained"
            style={styles.saveButton}
            buttonColor={COLORS.PRIMARY}
            onPress={handleSaveVitals}
          >
            <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
              Save All Changes
            </AvText>
          </AvButton>
        </ScrollView>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  healthSummary: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16
  },
  cardShadow: {
    shadowColor: COLORS.SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3
  },
  healthSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16
  },
  addVitalsButton: {
    borderRadius: 20,
  },
  vitalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8
  },
  vitalCard: {
    width: "48%",
    marginVertical: 4
  },
  modalContent: {
    width: '100%',
    padding: 16,
    maxHeight: '100%' // Limit modal height
  },
  vitalInputContainer: {
    marginBottom: 16,
    
  },
  vitalInputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vitalIcon: {
    marginRight: 8,
  },
  vitalInputLabel: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: '300',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  unitText: {
    color: COLORS.PRIMARY_TXT,
    marginLeft: 8,
    fontWeight: '500',
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 8,
  },
});

export default HealthSummary;
