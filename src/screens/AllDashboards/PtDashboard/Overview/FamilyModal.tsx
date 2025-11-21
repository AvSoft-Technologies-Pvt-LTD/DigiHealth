import React, { useEffect, useState } from 'react';
import { AvButton, AvModal, AvSelect, AvText, AvTextInput } from '../../../../elements';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { COLORS } from '../../../../constants/colors';
import { deleteFamilyMember, fetchFamilyHealthData, fetchHealthConditionData, fetchRelationData, saveFamilyHealthData } from '../../../../store/thunks/patientThunks';
import { useAppSelector } from '../../../../store/hooks';
import { AvIcons } from '../../../../elements';
interface FamilyMemberForm {
    id?: string;
    familyRelation: string;
    familyName: string;
    familyPhone: string;
    familyHealthConditions: string[];
}

const FamilyModal = ({ modalVisible, closeModal, dispatch }: any) => {
    const [formState, setFormState] = useState<FamilyMemberForm>({
        familyRelation: '',
        familyName: '',
        familyPhone: '',
        familyHealthConditions: [],
    });
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);


    const handleInputChange = (field: keyof FamilyMemberForm, value: any) => {
        setFormState(prev => ({
            ...prev,
            [field]: value
        }));
    };
    const onSnackbarDismiss = () => {
        setSnackbarVisible(false);
    };
    const hCData = useAppSelector((state) => state.healthConditionData.healthConditionData);
    const relData = useAppSelector((state) => state.relationData.relationData);
    const [healthConditionData, setHealthConditionData] = useState<Array<{ label: string, value: string }>>([]);
    const [relationData, setRelationData] = useState<Array<{ label: string, value: string }>>([]);
    const patientId = useAppSelector((state) => state.user.userProfile.patientId);
    const familyMemberData = useAppSelector((state) => state.familyMemberData.familyMemberData);
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
        fetchFamilyMembersData();
    }, [dispatch]);

    const handleEdit = (item: any) => {
        console.log("EDITING", item);

        // Map the health conditions to match the expected format
        const healthConditions = item.healthConditions?.map((hc: any) => hc.id) || [];

        setFormState({
            familyRelation: item.relation?.id || item.relationId || '',
            familyName: item.memberName || '',
            familyPhone: item.phoneNumber || '',
            familyHealthConditions: healthConditions,
        });

        setEditingId(item.id);
        setIsEditing(true);
    };


    const handleDelete = async (item: any) => {
        try {
            // Call your delete API here
            await dispatch(deleteFamilyMember(item));
            setSnackbarMessage('Family member deleted successfully');
            setSnackbarVisible(true);
        } catch (error) {
            setSnackbarMessage('Failed to delete family member');
            setSnackbarVisible(true);
        }
    };

    const handleCancelEdit = () => {
        setFormState({
            familyRelation: '',
            familyName: '',
            familyPhone: '',
            familyHealthConditions: [],
        });
        setEditingId(null);
        setIsEditing(false);
    };


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
    const { currentPatient } = useAppSelector((state) => state.currentPatient || {});
    const fetchFamilyMembersData = async () => {
        try {
            if (currentPatient?.id) {
                await dispatch(fetchFamilyHealthData(currentPatient?.id));
            }

        } catch (error) {
            console.log("Error fetching relation data", error);

        }
    }
    const payload = {
        patientId: patientId?.toString(),
        relationId: formState.familyRelation,
        memberName: formState.familyName,
        phoneNumber: formState.familyPhone,
        healthConditionIds: formState.familyHealthConditions,
    }

    const saveFamilyHealth = async () => {
        try {
            const payload = {
                id: editingId,
                patientId: patientId?.toString(),
                relationId: formState.familyRelation,
                memberName: formState.familyName,
                phoneNumber: formState.familyPhone,
                healthConditionIds: formState.familyHealthConditions,
            };
            console.log("PAYLOAD", payload)
            await dispatch(saveFamilyHealthData(payload, isEditing));
            setSnackbarMessage(isEditing ? 'Family member updated successfully!' : 'Family member added successfully!');

            setSnackbarVisible(true);
            handleCancelEdit();
        } catch (error) {
            setSnackbarMessage('An error occurred. Please try again.');
            setSnackbarVisible(true);
        }
    };
    // const saveFamilyHealth = async () => {
    //     try {
    //         await dispatch(saveFamilyHealthData(payload));
    //         setSnackbarMessage('Family member added successfully!');
    //         setSnackbarVisible(true);
    //         closeModal();
    //     } catch (error) {
    //         console.log("Error Saving family health data", error);
    //         setSnackbarMessage('Failed to add family member. Please try again.');
    //         setSnackbarVisible(true);
    //     }
    // }
    const handleClearForm = () => {
        setFormState({
            familyRelation: '',
            familyName: '',
            familyPhone: '',
            familyHealthConditions: [],
        });
        setEditingId(null);
        setIsEditing(false);
    };
    return (
        <AvModal
            isModalVisible={modalVisible}
            setModalVisible={closeModal}
            title="Add Family Member"
            // modalStyles={{ maxHeight: '90%' }}
        >
            <View style={styles.modalContent}>
                <View style={styles.inputRow}>
                    <AvSelect
                        items={relationData}
                        selectedValue={formState.familyRelation}
                        onValueChange={(text) => handleInputChange("familyRelation", text)}
                        placeholder="Select relation"
                        required
                    />
                </View>
            </View>
            <View style={styles.inputRow}>
                <AvTextInput
                    label="Name"
                    value={formState.familyName}
                    onChangeText={(text) => handleInputChange("familyName", text)}
                    style={styles.input}
                    mode="outlined"
                    theme={{ colors: { primary: COLORS.SECONDARY, outline: COLORS.LIGHT_GREY } }}
                />
            </View>
            <View style={styles.inputRow}>
                <AvTextInput
                    label="Phone Number"
                    value={formState.familyPhone}
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
                    selectedValue={formState.familyHealthConditions}
                    onValueChange={(selectedItems) => {
                        // Ensure we're always working with an array
                        const selectedValues = Array.isArray(selectedItems)
                            ? selectedItems
                            : selectedItems ? [selectedItems] : [];
                        handleInputChange("familyHealthConditions", selectedValues);
                    }}
                    placeholder="Select health conditions"
                    required
                />
            </View>
            <View style={styles.modalButtons}>
                <AvButton
                    mode="outlined"
                    onPress={handleClearForm}
                    style={[styles.button, styles.clearButton]}
                >
                    <AvText type="buttonText" style={{ color: COLORS.ERROR }}>
                        Clear
                    </AvText>
                </AvButton>
                <AvButton
                    mode="contained"
                    style={[styles.button, styles.saveButton]}
                    onPress={saveFamilyHealth}
                    buttonColor={isEditing ? COLORS.SUCCESS : COLORS.SUCCESS}
                >
                    <AvText type="buttonText" style={{ color: COLORS.WHITE }}>
                        {isEditing ? 'Update' : 'Save'}
                    </AvText>
                </AvButton>
            </View>

            {/* Family Members Table */}

            <View style={styles.sectionContainer}>
                <AvText type="Subtitle_2" style={styles.sectionTitle}>
                    Saved Family Members
                </AvText>

                <ScrollView
                    style={{ maxHeight: 200, overflow: 'scroll' }} // adjust 200 to fit your design
                    contentContainerStyle={{ paddingBottom: 10 }}
                >
                    <View style={styles.membersList}>
                    {familyMemberData && familyMemberData.length > 0 ? (
                        familyMemberData.map((item: any, index: number) => (
                            <View key={index} style={styles.card}>
                                {/* Delete Button */}
                                <AvIcons
                                    type="MaterialCommunityIcons"
                                    name="close"
                                    size={20}
                                    color={COLORS.ERROR}
                                    onPress={() => handleDelete(item)}
                                    style={styles.deleteIcon}
                                />

                                {/* Member Info */}
                                <View style={styles.cardContent}>
                                    <AvText type="heading_8" style={styles.cardTitle}>
                                        {item.memberName || 'N/A'}
                                    </AvText>
                                    <AvText type="body" style={styles.cardText}>
                                        {item.relationName || 'N/A'}
                                    </AvText>
                                    <AvText type="body" style={styles.cardText}>
                                        {item.phoneNumber || 'N/A'}
                                    </AvText>

                                    {item.healthConditions?.length > 0 && (
                                        <View style={styles.conditionsContainer}>
                                            <AvText type="body" style={styles.conditionsText}>
                                                {item.healthConditions
                                                    .map((hc: any) => hc.healthConditionName || hc.name)
                                                    .join(', ')}
                                            </AvText>
                                        </View>
                                    )}
                                </View>

                                {/* Edit Button */}
                                <View style={styles.editButtonContainer}>
                                    <AvIcons
                                        type="MaterialCommunityIcons"
                                        name="pencil"
                                        size={15}
                                        onPress={() => handleEdit(item)}
                                        color={COLORS.PRIMARY}
                                    />
                                </View>
                            </View>
                        ))
                    ) : (
                        <View style={styles.noData}>
                            <AvText>No family members found</AvText>
                        </View>
                    )}
                    </View>
                </ScrollView>

            </View>

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
            {/* </View > */}
        </AvModal >

    )
}
const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        padding: 4,
    },
    inputRow: {
        marginBottom: 12
    },
    formSection: {
        marginBottom: 20
    },
    savedMembersSection: {
        flex: 1,
        marginTop: 16,
    },
    sectionTitle: {
        marginBottom: 12,
        marginTop: 20,
        color: COLORS.PRIMARY,
    },

    cardsScrollView: {
        flex: 1,
    },
    cardsContentContainer: {
        paddingBottom: 16, // Add some padding at the bottom
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
        justifyContent: 'space-between',
        marginTop: 10
    },
    saveButton: {
        borderRadius: 8
    },
    snackbar: {
        backgroundColor: COLORS.SUCCESS,
        margin: 16,
        borderRadius: 8,
    },
    // Table styles
    tableContainer: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLORS.GREY,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: COLORS.WHITE,
    },
    tableTitle: {
        padding: 5,
        backgroundColor: COLORS.SECONDARY,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: COLORS.PRIMARY_BG,
        paddingVertical: 5,
    },
    headerCell: {
        color: COLORS.SECONDARY,
        fontWeight: '600',
        paddingHorizontal: 8,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GREY,
        minHeight: 28,
        alignItems: 'center',
    },
    cell: {
        padding: 5,
        color: COLORS.PRIMARY,
    },
    serialCell: {
        width: 60,
        textAlign: 'center',
    },

    actionCell: {
        flexDirection: 'row',
        width: 100,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    icon: {
        padding: 8,
    },
    button: {
        marginLeft: 10,
        minWidth: 100,
    },
    cancelButton: {
        borderColor: COLORS.SECONDARY,
    },
    // Update these widths to accommodate the action buttons
    relationCell: {
        width: 100,
    },
    descCell: {
        width: 90,
    },
    clearButton: {
        borderColor: COLORS.ERROR,
    },
    cardsContainer: {
        flex: 1,
        marginTop: 10,
    },
    
    deleteIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 1,
    },
    cardContent: {
        marginBottom: 12,
    },
    cardTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: COLORS.PRIMARY,
    },
    cardText: {

        marginBottom: 4,
        color: COLORS.PRIMARY,
    },
    conditionsContainer: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.LIGHT_GREY,
    },
    conditionsText: {

        color: COLORS.SECONDARY,
        fontStyle: 'italic',
    },
    editButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: -30,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
    },
    editButtonText: {
        marginLeft: 4,
        color: COLORS.PRIMARY,

    },
    noData: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
     sectionContainer: {
    marginTop: 16,
    width: '100%',
  },
  membersList: {
    maxHeight: 300, // Adjust based on your needs
    width: '100%',
  },
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    position: 'relative',
  },
  noDataText: {
    textAlign: 'center',
    color: COLORS.GREY,
    marginTop: 16,
  },
});

export default FamilyModal
