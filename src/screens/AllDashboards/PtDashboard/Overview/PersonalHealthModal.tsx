import React, { useEffect, useState } from "react";
import { AvButton, AvModal, AvSelect, AvText, AvTextInput } from "../../../../elements";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../../constants/colors";
import { Switch } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchPatientPersonalHealthData, updatePatientPersonalHealthData } from "../../../../store/thunks/patientThunks";
import { normalize } from "../../../../constants/platform";

const PersonalHealthModal = ({
  modalVisible,
  closeModal,
  formData,
  handleInputChange,
  handleToggleChange,
}: any) => {
  const BloodGroupData = useAppSelector((state) => state?.patientBloodGroupData?.patientBloodGroupData);

  const [bloodGroups, setBloodGroups] = useState<Array<{ label: string, value: string }>>([]);
  const [surgeriesOptions, setSurgeriesOptions] = useState<Array<{ label: string, value: string }>>([]);

  const [allergiesOptions, setAllergiesOptions] = useState<Array<{ label: string, value: string }>>([]);

  // Track original form data to detect changes
  const [originalFormData, setOriginalFormData] = useState<any>([]);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (modalVisible && formData) {
      setOriginalFormData({ ...formData });
      setHasChanges(false);
    }
  }, [modalVisible, formData]);

  useEffect(() => {
    if (originalFormData && formData) {
      const changed = JSON.stringify(originalFormData) !== JSON.stringify(formData);
      setHasChanges(changed);
    }
  }, [formData, originalFormData]);

  useEffect(() => {
    if (BloodGroupData && BloodGroupData.length > 0) {
      const formattedBloodGroups = BloodGroupData.map((item: any) => ({
        label: item.bloodGroupName,
        value: item.id
      }));
      setBloodGroups(formattedBloodGroups);
    }
  }, [BloodGroupData]);
  const id = useAppSelector((state) => state.user.userProfile.patientId);
  const payload = {
    patientId: id,
    height: Number(formData.height),
    weight: Number(formData.weight),
    bloodGroupId: formData.bloodGroup,
    allergyIds: formData.allergies ? [formData.allergies] : [],
    surgeryIds: formData.surgeries ? [formData.surgeries] : [],
    isAlcoholic: formData.drinkAlcohol,
    isSmoker: formData.smoke,
    isTobacco: formData.tobaccoUse,
    yearsAlcoholic: Number(formData.alcoholSinceYears),
    yearsSmoking: Number(formData.smokeSinceYears),
    yearsTobacco: Number(formData.tobaccoSinceYears),
    allergySinceYears: Number(formData.allergySinceYears),
    surgerySinceYears: Number(formData.surgerySinceYears),
  }
  const dispatch = useAppDispatch();
  const savePersonalHealth = () => {
    if (id) {
      dispatch(updatePatientPersonalHealthData(id, payload))
    }
    closeModal();
  };

  const refreshData = () => {
    // Refresh the data after update
    if (id) {
      dispatch(fetchPatientPersonalHealthData(id));
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    if (originalFormData) {
      Object.keys(originalFormData).forEach(key => {
        handleInputChange(key, originalFormData[key]);
      });
    }
    closeModal();
  };

  const handleUpdate = () => {
    // if (hasChanges) {
    savePersonalHealth();
    // }
  };
  const allergies = useAppSelector((state) => state.allergiesData.allergiesData);
  const surgeries = useAppSelector((state) => state.surgeriesData.surgeriesData);
  useEffect(() => {
    setAllergiesOptions(allergies)
    setSurgeriesOptions(surgeries)
  }, [allergies, surgeries]);
  {/* Personal Health Modal */ }
  return (
    <AvModal
      isModalVisible={modalVisible}
      setModalVisible={closeModal}
      title="Personal Health Details"

    >
      <View style={styles.modalContent}>
        <View style={styles.habitRow}>
          <View style={styles.halfWidth}>
            <AvTextInput
              label="Height (cm)"
              value={formData.height}
              onChangeText={(text) => handleInputChange("height", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
          <View style={styles.halfWidth}>
            <AvTextInput
              label="Weight (kg)"
              value={formData.weight}
              onChangeText={(text) => handleInputChange("weight", text)}
              style={styles.input}
              mode="outlined"
              keyboardType="numeric"
              theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
            />
          </View>
        </View>
        <View style={styles.habitRow}>
          <View style={styles.halfWidth}>
            <AvSelect
              items={surgeriesOptions}
              selectedValue={formData.surgeries}
              onValueChange={(text) => handleInputChange("surgeries", text)}
              placeholder="Select surgeries"
              required
            />
          </View>
          <View style={styles.halfWidth}>
            {formData.surgeries && (
              <AvTextInput
                label="Since Years"
                value={formData.surgerySinceYears}
                onChangeText={(text) => handleInputChange("surgerySinceYears", text)}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            )}
          </View>
        </View>

        <View style={styles.habitRow}>
          <View style={styles.halfWidth}>
            <AvSelect
              items={allergiesOptions}
              selectedValue={formData.allergies}
              onValueChange={(text) => handleInputChange("allergies", text)}
              placeholder="Select allergies"
              required
            />
          </View>
          <View style={styles.halfWidth}>
            {formData.allergies && (
              <AvTextInput
                label="Since Years"
                value={formData.allergySinceYears}
                onChangeText={(text) => handleInputChange("allergySinceYears", text)}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            )}
          </View>
        </View>
        <AvSelect
          items={bloodGroups}
          selectedValue={formData.bloodGroup}
          onValueChange={(value) => handleInputChange("bloodGroup", value)}
          placeholder="Select blood group"
          // label="Blood Group"
          required
          style={{marginBottom:normalize(16)}}
        />
        <View style={styles.habitContainer}>
          <View style={styles.habitRow}>
            <View style={styles.halfWidth}>
              <View style={styles.toggleItem}>
                <AvText type="body" style={styles.toggleLabel}>
                  Drink alcohol?
                </AvText>
                <Switch
                  value={formData.drinkAlcohol}
                  onValueChange={() => handleToggleChange("drinkAlcohol")}
                  trackColor={{ false: COLORS.LIGHT_GREY, true: COLORS.PRIMARY }}
                />
              </View>
            </View>
            <View style={styles.halfWidth}>
              {formData.drinkAlcohol && (
                <AvTextInput
                  label="Since Years"
                  value={formData.alcoholSinceYears}
                  onChangeText={(text) => handleInputChange("alcoholSinceYears", text)}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                  theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
                />
              )}
            </View>
          </View>

          <View style={styles.habitRow}>
            <View style={styles.halfWidth}>
              <View style={styles.toggleItem}>
                <AvText type="body" style={styles.toggleLabel}>
                  Do you smoke?
                </AvText>
                <Switch
                  value={formData.smoke}
                  onValueChange={() => handleToggleChange("smoke")}
                  trackColor={{ false: COLORS.LIGHT_GREY, true: COLORS.PRIMARY }}
                />
              </View>
            </View>
            <View style={styles.halfWidth}>
              {formData.smoke && (
                <AvTextInput
                  label="Since Years"
                  value={formData.smokeSinceYears}
                  onChangeText={(text) => handleInputChange("smokeSinceYears", text)}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                  theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
                />
              )}
            </View>
          </View>

          <View style={styles.habitRow}>
            <View style={styles.halfWidth}>
              <View style={styles.toggleItem}>
                <AvText type="body" style={styles.toggleLabel}>
                  Tobacco Use?
                </AvText>
                <Switch
                  value={formData.tobaccoUse}
                  onValueChange={() => handleToggleChange("tobaccoUse")}
                  trackColor={{ false: COLORS.LIGHT_GREY, true: COLORS.PRIMARY }}
                />
              </View>
            </View>
            <View style={styles.halfWidth}>
              {formData.tobaccoUse && (
                <AvTextInput
                  label="Since Years"
                  value={formData.tobaccoSinceYears}
                  onChangeText={(text) => handleInputChange("tobaccoSinceYears", text)}
                  style={styles.input}
                  mode="outlined"
                  keyboardType="numeric"
                  theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
                />
              )}
            </View>
          </View>
        </View>
        <View style={styles.modalButtons}>
          <AvButton
            mode="outlined"
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            buttonColor={COLORS.WHITE}
          >
            <AvText type="buttonText" style={{ color: COLORS.PRIMARY }}>
              Cancel
            </AvText>
          </AvButton>
          <AvButton
            mode="contained"
            style={[styles.button, styles.updateButton]}
            onPress={handleUpdate}
            // disabled={!hasChanges}
            buttonColor={COLORS.SUCCESS}
          >
            <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
              Update
            </AvText>
          </AvButton>
        </View>
      </View>
    </AvModal>

  );
};
const styles = StyleSheet.create({
  modalContent: { padding: normalize(16) },
  inputRow: { marginBottom: normalize(8) },
  inputHalf: { flex: 1, marginRight: normalize(8) },
  input: {
    marginBottom: normalize(4),
    backgroundColor: COLORS.WHITE,
    height: normalize(45),
  },
  habitContainer: {
    marginBottom: normalize(16),
  },
  habitRow: {
    flexDirection: 'row',
    marginBottom: normalize(8),
    alignItems: 'flex-start',
  },
  halfWidth: {
    flex: 1,
    marginRight: normalize(8),
  },
  toggleContainer: { marginBottom: normalize(16) },
  toggleItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: normalize(4),
  },
  toggleLabel: { color: COLORS.PRIMARY_TXT, flex: 1 },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: normalize(24),
    gap: normalize(12),
  },
  button: {
    flex: 1,
    borderRadius: normalize(8),
    height: normalize(48),
  },
  cancelButton: {
    borderColor: COLORS.PRIMARY,
    borderWidth: 1,
  },
  updateButton: {
    borderRadius: normalize(8),
  },
  dateInputContainer: {
    position: 'relative',
  },
});

export default PersonalHealthModal;
