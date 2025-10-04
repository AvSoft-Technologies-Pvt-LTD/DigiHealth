import React, { useEffect, useState } from 'react';
import { AvButton, AvModal, AvSelect, AvText, AvTextInput } from '../../../../elements';
import { StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { COLORS } from '../../../../constants/colors';
import { fetchHealthConditionData, fetchRelationData, saveFamilyHealthData } from '../../../../store/thunks/patientThunks';
import { useAppSelector } from '../../../../store/hooks';


const FamilyModal = ({ modalVisible, closeModal, dispatch, formData, handleInputChange, handleSave }: any) => {
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const onSnackbarDismiss = () => {
        setSnackbarVisible(false);
    };
    const hCData = useAppSelector((state) => state.healthConditionData.healthConditionData);
    const relData = useAppSelector((state) => state.relationData.relationData);
    const [healthConditionData, setHealthConditionData] = useState<Array<{ label: string, value: string }>>([]);
    const [relationData, setRelationData] = useState<Array<{ label: string, value: string }>>([]);
    const patientId = useAppSelector((state) => state.user.userProfile.patientId);
    useEffect(() => {
        if (hCData && hCData.length > 0) {
            const formattedBloodGroups = hCData.map((item: any) => ({
                label: item.healthConditionName,
                value: item.id
            }));
            setHealthConditionData(formattedBloodGroups);
        }

        if (relData && relData.length > 0) {
            const formattedBloodGroups = relData.map((item: any) => ({
                label: item.relationName,
                value: item.id
            }));
            setRelationData(formattedBloodGroups);
        }
    }, [hCData, relData]);

    useEffect(() => {
        fetchHCondition();
        fetchRelData();
    }, [dispatch]);

    const fetchHCondition = async () => {
        try {
            await dispatch(fetchHealthConditionData());

        } catch (error) {
            console.log("Error fetching health condition data", error);

        }
    }
    const fetchRelData = async () => {
        try {
            await dispatch(fetchRelationData());

        } catch (error) {
            console.log("Error fetching relation data", error);

        }
    }
    const payload = {
        patientId: patientId?.toString(),
        relationId: formData.familyRelation,
        memberName: formData.familyName,
        phoneNumber: formData.familyPhone,
        healthConditionIds: formData.familyHealthConditions,
    }

    const saveFamilyHealth = async () => {
        try {
            await dispatch(saveFamilyHealthData(payload));
            setSnackbarMessage('Family member added successfully!');
            setSnackbarVisible(true);
            closeModal();
        } catch (error) {
            console.log("Error Saving family health data", error);
            setSnackbarMessage('Failed to add family member. Please try again.');
            setSnackbarVisible(true);
        }
    }
    return (
        <View style={{flex: 1}}>
            <AvModal
            isModalVisible={modalVisible}
            setModalVisible={closeModal}
            title="Add Family Member"

        >
            <View style={styles.modalContent}>
                <View style={styles.inputRow}>
                    <AvSelect
                        items={relationData}
                        selectedValue={formData.familyRelation}
                        onValueChange={(text) => handleInputChange("familyRelation", text)}
                        placeholder="Select relation"
                        required
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
                    <AvSelect
                        multiselect={true}
                        items={healthConditionData}
                        selectedValue={formData.familyHealthConditions}
                        onValueChange={(text) => handleInputChange("familyHealthConditions", text)}
                        placeholder="Select health condtion"
                        required
                    />
                </View>
                <View style={styles.modalButtons}>
                    <AvButton
                        mode="contained"
                        style={styles.saveButton}
                        onPress={() => saveFamilyHealth()}
                        buttonColor={COLORS.SUCCESS}
                    >
                        <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
                            Save
                        </AvText>
                    </AvButton>
                </View>
            </View>
        </AvModal>
        <Snackbar
            visible={snackbarVisible}
            onDismiss={onSnackbarDismiss}
            duration={3000}
            style={styles.snackbar}
            action={{
                label: 'OK',
                onPress: onSnackbarDismiss,
            }}>
            {snackbarMessage}
        </Snackbar>
    </View>
    )
}
const styles = StyleSheet.create({
    modalContent: { 
        padding: 16 
    },
    inputRow: { 
        marginBottom: 12 
    },
    input: {
        marginBottom: 4,
        backgroundColor: COLORS.WHITE,
        height: 50,
    },
    radioContainer: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginRight: 16 
    },
    modalButtons: { 
        flexDirection: 'row', 
        justifyContent: 'flex-end', 
        marginTop: 16 
    },
    saveButton: { 
        borderRadius: 8 
    },
    snackbar: {
        backgroundColor: COLORS.SUCCESS,
        margin: 16,
        borderRadius: 8,
    },
});

export default FamilyModal
