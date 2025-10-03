import React, { useEffect, useState } from "react";
import { AvButton, AvModal, AvSelect, AvText, AvTextInput } from "../../../../elements";
import { StyleSheet, View } from "react-native";
import { COLORS } from "../../../../constants/colors";
import { Switch } from "react-native-paper";
import { useAppSelector } from "../../../../store/hooks";

const PersonalHealthModal = ({
    modalVisible,
    closeModal,
    formData,
    handleInputChange,
    handleToggleChange,
}: any) => {
      const BloogGroupData = useAppSelector((state) => state?.patientBloodGroupData?.patientBloodGroupData);
    
      const [bloodGroups, setBloodGroups] = useState<Array<{label: string, value: string}>>([]);
    
      useEffect(() => {
        if (BloogGroupData && BloogGroupData.length > 0) {
          const formattedBloodGroups = BloogGroupData.map((item: any) => ({
            label: item.bloodGroupName,
            value: item.bloodGroupName
          }));
          setBloodGroups(formattedBloodGroups);
        }
      }, [BloogGroupData]);
      const id = useAppSelector((state) => state.user.userProfile.userId);
    // const id = 1;
      const payload = {
        patientId:id,
        height: Number(formData.height),
        weight: Number(formData.weight),
        surgeries: formData.surgeries,
        allergies: formData.allergies,
        isAlcoholic: formData.drinkAlcohol,
        isSmoker: formData.smoke,
        isTobacco: formData.tobaccoUse,
        yearsAlcoholic: Number(formData.alcoholSinceYears),
        yearsSmoking: Number(formData.smokeSinceYears),
        yearsTobacco: Number(formData.tobaccoSinceYears),
      }
    const savePersonalHealth = () => {
        console.log("Updating Personal Health Data",payload);
      closeModal();
    //   Backend Work pending on Update API
    //   dispatch(updatePatientPersonalHealthData(id as string,payload));
    };
    {/* Personal Health Modal */}
    return (
      <AvModal
      isModalVisible={modalVisible}
      setModalVisible={closeModal}
      title="Personal Health Details"
      
    >
      <View style={styles.modalContent}>
        <View style={styles.inputRow}>
          <View style={styles.inputHalf}>
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
          <View style={styles.inputHalf}>
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
        <View style={styles.inputRow}>
          <AvTextInput
            label="Surgeries"
            value={formData.surgeries}
            onChangeText={(text) => handleInputChange("surgeries", text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
        </View>
        <View style={styles.inputRow}>
          <AvTextInput
            label="Allergies"
            value={formData.allergies}
            onChangeText={(text) => handleInputChange("allergies", text)}
            style={styles.input}
            mode="outlined"
            theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
          />
        </View>
        <AvSelect
          items={bloodGroups}
          selectedValue={formData.bloodGroup}
          onValueChange={(text) => handleInputChange("bloodGroup", text)}
          placeholder="Select blood group"
          // label="Blood Group"
          required
        />
        <View style={styles.toggleContainer}>
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
          {formData.drinkAlcohol && (
            <View style={styles.inputRow}>
              <AvTextInput
                label="Since Years"
                value={formData.alcoholSinceYears}
                onChangeText={(text) => handleInputChange("alcoholSinceYears", text)}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            </View>
          )}
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
          {formData.smoke && (
            <View style={styles.inputRow}>
              <AvTextInput
                label="Since Years"
                value={formData.smokeSinceYears}
                onChangeText={(text) => handleInputChange("smokeSinceYears", text)}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            </View>
          )}
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
          {formData.tobaccoUse && (
            <View style={styles.inputRow}>
              <AvTextInput
                label="Since Years"
                value={formData.tobaccoSinceYears}
                onChangeText={(text) => handleInputChange("tobaccoSinceYears", text)}
                style={styles.input}
                mode="outlined"
                keyboardType="numeric"
                theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
              />
            </View>
          )}
        </View>
        <View style={styles.modalButtons}>
          <AvButton
            mode="contained"
            style={styles.saveButton}
            onPress={() => savePersonalHealth()}
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
 
  modalButtons: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16 },
  saveButton: { borderRadius: 8 },
  dateInputContainer: {
    position: 'relative',
  },
});

export default PersonalHealthModal;
