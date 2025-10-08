import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import AvCard from "../../../../elements/AvCards";
import AvModal from "../../../../elements/AvModal";
import { TextInput } from "react-native-paper";
import { COLORS } from "../../../../constants/colors";
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

interface Vital {
  id: string;
  type: string;
  value: string;
  unit: string;
  icon: string;
}

const HealthSummary = () => {
  const [vitals, setVitals] = useState<Vital[]>([
    { id: "1", type: "Temperature", value: "98.6", unit: "°F", icon: "thermometer" },
    { id: "2", type: "SpO2", value: "98", unit: "%", icon: "waveform" },
    { id: "3", type: "Blood Pressure", value: "120/80", unit: "mmHg", icon: "heart-pulse" },
    { id: "4", type: "Heart Rate", value: "72", unit: "bpm", icon: "heart" },
    { id: "5", type: "Respiratory Rate", value: "16", unit: "rpm", icon: "lungs" },
    { id: "6", type: "Blood Sugar", value: "95", unit: "mg/dL", icon: "test-tube" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [vitalValues, setVitalValues] = useState<Record<string, string>>({});
  const [isListening, setIsListening] = useState(false);
  const [currentListeningField, setCurrentListeningField] = useState<string | null>(null);
  const [recordedText, setRecordedText] = useState('');

  useEffect(() => {
    // Set up voice recognition
    Voice.onSpeechStart = onSpeechStart;
    Voice.onSpeechEnd = onSpeechEnd;
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const onSpeechStart = () => {
    setIsListening(true);
  };

  const onSpeechEnd = () => {
    setIsListening(false);
  };

  const onSpeechResults = (event: SpeechResultsEvent) => {
    const text = event.value?.[0] || '';
    setRecordedText(text);

    if (currentListeningField) {
      // Extract numbers from speech
      const numbers = text.match(/\d+(\.\d+)?(\/\d+(\.\d+)?)?/g) || [];
      if (numbers.length > 0) {
        handleValueChange(currentListeningField, numbers[0]);
      }
    }
  };

  const onSpeechError = (event: SpeechErrorEvent) => {
    console.error('Speech error:', event.error);
    setIsListening(false);
  };

  const startListening = async (fieldId: string) => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'This app needs access to your microphone to record audio',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Microphone permission denied');
          return;
        }
      }

      setCurrentListeningField(fieldId);
      setRecordedText('');
      await Voice.start('en-US');
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping voice recognition:', error);
    }
  };

  const handleUpdateVitals = () => {
    const initialValues = vitals.reduce((acc, vital) => {
      acc[vital.id] = vital.value;
      return acc;
    }, {} as Record<string, string>);
    setVitalValues(initialValues);
    setModalVisible(true);
  };

  const handleValueChange = (id: string, value: string) => {
    setVitalValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSaveVitals = () => {
    const updatedVitals = vitals.map((vital) => ({
      ...vital,
      value: vitalValues[vital.id] || vital.value,
    }));
    setVitals(updatedVitals);
    setModalVisible(false);
  };

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
          icon={() => <Icon name="pencil" size={16} color={COLORS.WHITE} />}
          onPress={handleUpdateVitals}
        >
          <AvText
            type="buttonText"
            style={{ color: COLORS.WHITE, fontSize: 14, fontWeight: "500" }}
          >
            Update Vitals
          </AvText>
        </AvButton>
      </View>

      <View style={styles.vitalsContainer}>
        {vitals.map((vital) => (
          <AvCard
            key={vital.id}
            title={
              <AvText
                type="body"
                style={{ color: COLORS.PRIMARY_TXT, fontWeight: "500" }}
              >
                {vital.type}
              </AvText>
            }
            icon={<Icon name={vital.icon} size={20} color={COLORS.PRIMARY} />}
            cardStyle={[
              styles.vitalCard,
              { borderLeftColor: COLORS.PRIMARY, borderLeftWidth: 4 },
            ]}
          >
            <View style={styles.valueUnitContainer}>
              <AvText
                type="title_2"
                style={{ color: COLORS.PRIMARY }}
              >
                {vital.value}
              </AvText>
              <AvText
                type="body"
                style={{ color: COLORS.PRIMARY, marginLeft: 2 }}
              >
                {vital.unit}
              </AvText>
            </View>
          </AvCard>
        ))}
      </View>

      <AvModal
        isModalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Update Vitals"
      >
        <ScrollView style={styles.modalContent}>
          {vitals.map((vital) => (
            <View key={vital.id} style={styles.vitalInputContainer}>
              <TextInput
                mode="outlined"
                label={vital.type}
                value={vitalValues[vital.id]}
                onChangeText={(text) => handleValueChange(vital.id, text)}
                keyboardType="numeric"
                style={styles.input}
                theme={{
                  colors: {
                    primary: COLORS.SECONDARY,
                    outline: COLORS.LIGHT_GREY,
                  },
                }}
                left={
                  <TextInput.Icon
                    name={vital.icon}
                    color={COLORS.PRIMARY}
                  />
                }
                right={
                  <>
                    <TextInput.Affix
                      text={vital.unit}
                      textStyle={styles.unitText}
                    />
                    <TouchableOpacity
                      onPress={() => isListening && currentListeningField === vital.id
                        ? stopListening()
                        : startListening(vital.id)}
                      style={styles.micButton}
                    >
                      <Icon
                        name={isListening && currentListeningField === vital.id ? "microphone" : "microphone-outline"}
                        size={24}
                        color={isListening && currentListeningField === vital.id ? COLORS.SECONDARY : COLORS.PRIMARY}
                      />
                    </TouchableOpacity>
                  </>
                }
                contentStyle={styles.inputContent}
              />
              {isListening && currentListeningField === vital.id && (
                <View style={styles.listeningIndicator}>
                  <AvText type="caption" style={{ color: COLORS.SECONDARY }}>
                    Listening... {recordedText}
                  </AvText>
                </View>
              )}
            </View>
          ))}

          <View style={styles.voiceControlContainer}>
            <AvText type="caption" style={styles.voiceInstruction}>
              Tap the microphone to speak your values
            </AvText>
          </View>

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
    padding: 16,
  },
  cardShadow: {
    shadowColor: COLORS.SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  healthSummaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  addVitalsButton: {
    borderRadius: 20,
  },
  vitalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  vitalCard: {
    width: "48%",
    marginVertical: 4,
  },
  valueUnitContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  modalContent: {
    width: "100%",
    padding: 16,
    maxHeight: "100%",
  },
  vitalInputContainer: {
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.WHITE,
    marginBottom: 0,
  },
  inputContent: {
    paddingRight: 0,
  },
  unitText: {
    paddingLeft: 0,
    paddingRight: 4,
    marginLeft: 0,
    marginRight: 0,
  },
  micButton: {
    padding: 8,
    marginLeft: 4,
  },
  listeningIndicator: {
    marginTop: 4,
    marginLeft: 8,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 8,
    paddingVertical: 8,
  },
  voiceControlContainer: {
    marginVertical: 12,
    alignItems: 'center',
  },
  voiceInstruction: {
    color: COLORS.PRIMARY_TXT,
    fontStyle: 'italic',
  },
});

export default HealthSummary;
