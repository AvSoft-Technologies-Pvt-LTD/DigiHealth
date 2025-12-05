import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-paper";
import moment from 'moment';
import { COLORS } from "../../../../constants/colors";
import { PAGES } from "../../../../constants/pages";
import { useNavigation } from "@react-navigation/native";
import PatientModals from "./index";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchAllPatients, fetchPatientBloodGroupData, fetchPatientPersonalHealthData, fetchPatientPhoto } from "../../../../store/thunks/patientThunks";
import { AvButton, AvIcons, AvImage, AvText } from "../../../../elements";
import { setCurrentPatient } from "../../../../store/slices/allPatientSlice";
import { getImageSource, getInitials } from "../../../../services/apiHelpers";

interface ActionButtonProps {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
  completed: boolean;
}

const PatientOverview = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState({
    personalHealth: false,
    family: false,
    additionalDetails: false,
  });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    bloodGroup: null as number | null,
    height: "",
    weight: "",
    surgeries: null as number | null,
    allergies: null as number | null,
    surgerySinceYears: "",
    allergySinceYears: "",
    drinkAlcohol: false,
    alcoholSinceYears: "",
    smoke: false,
    smokeSinceYears: "",
    tobaccoUse: false,
    tobaccoSinceYears: "",
    relation: "",
    familyName: "",
    familyPhone: "",
    familyHealthConditions: "",
    insuranceProvider: "",
    policyNumber: "",
    coverageType: "",
    coverageAmount: "",
    startDate: new Date(),
    endDate: new Date(),
    isPrimaryHolder: false,
    photo: null as string | null, // Changed to string for base64
  });
  const patientAdditionalData = useAppSelector((state) => state?.patientAdditionalData?.additionalDetails);
  const familyMemberData = useAppSelector((state) => state.familyMemberData.familyMemberData);


  const [completion, setCompletion] = useState({
    basicDetails: true,
    personalHealth: false,
    family: false,
    additionalDetails: false,
  });

  const openModal = (modalName: keyof typeof modalVisible) => {
    if (modalName === "personalHealth") {
      dispatch(fetchPatientBloodGroupData());
    }
    setModalVisible((prev) => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName: keyof typeof modalVisible) => {
    setModalVisible((prev) => ({ ...prev, [modalName]: false }));
  };

  const handleInputChange = (field: string, value: string | boolean | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleChange = (field: string) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const handleSave = (section: keyof typeof completion) => {
    console.log("UPDATE HANDLE SAVE", section, "Completion", completion)
    // setCompletion((prev) => ({ ...prev, [section]: true }));
    // if (section === "personalHealth" || section === "family" || section === "additionalDetails") {
    //   closeModal(section);
    // }
  };

  const completedSections = Object.values(completion).filter(Boolean).length;
  const progress = (completedSections / 4) * 100;

  // Animated progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate progress bar to target value
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1500, // 1.5 seconds animation
      useNativeDriver: false, // For width animation
    }).start();
  }, [progress]);
  const { allPatients } = useAppSelector((state) => state.patient);
  const { patientDashboardData } = useAppSelector((state) => state.patientDashboardData);
  const { patientPersonalData } = useAppSelector((state) => state.patientPersonalData);
  const dispatch = useAppDispatch();


  useEffect(() => {
    if (patientAdditionalData) {
      setCompletion((prev) => ({ ...prev, additionalDetails: true }));
    }
    if (familyMemberData) {
      setCompletion((prev) => ({ ...prev, family: true }));
    }
    if (patientPersonalData) {
      setCompletion((prev) => ({ ...prev, personalHealth: true }));
    }
  }, [patientAdditionalData, familyMemberData, patientPersonalData])

  useEffect(() => {
    if (patientDashboardData) {
      const newData = Array.isArray(patientDashboardData)
        ? patientDashboardData[0] || {}
        : patientDashboardData;

      setFormData(prev => ({
        ...prev,
        ...newData
      }));
    }
  }, [patientDashboardData]);


  const id = useAppSelector((state) => state.user.userProfile.patientId);
  const { currentPatient } = useAppSelector((state) => state.currentPatient || {});


  // Get user initials for avatar fallback
  const userInitials = getInitials(`${formData.firstName} ${formData.lastName}`);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientPersonalHealthData(id));
      dispatch(fetchAllPatients());
      // Optionally fetch photo separately if needed
      // dispatch(fetchPatientPhoto(id));
    }
  }, [dispatch, id]);

  // Update formData when patientPersonalData is available
  useEffect(() => {
    if (patientPersonalData) {
      setFormData(prev => ({
        ...prev,
        bloodGroup: patientPersonalData?.bloodGroupId || "",
        height: patientPersonalData?.height?.toString() || "",
        weight: patientPersonalData?.weight?.toString() || "",
        surgeries: patientPersonalData?.surgeryIds?.[0] || null,
        allergies: patientPersonalData?.allergyIds?.[0] || null,
        drinkAlcohol: patientPersonalData?.isAlcoholic || false,
        smoke: patientPersonalData?.isSmoker || false,
        tobaccoUse: patientPersonalData?.isTobacco || false,
        alcoholSinceYears: patientPersonalData?.yearsAlcoholic?.toString() || "",
        smokeSinceYears: patientPersonalData?.yearsSmoking?.toString() || "",
        tobaccoSinceYears: patientPersonalData?.yearsTobacco?.toString() || "",
        allergySinceYears: patientPersonalData?.allergySinceYears?.toString() || "",
        surgerySinceYears: patientPersonalData?.surgerySinceYears?.toString() || ""
      }));
    }
  }, [patientPersonalData]);

  const actionButtons: ActionButtonProps[] = [
    {
      id: 'basic',
      icon: 'account-details',
      label: 'Basic Details',
      onPress: () => { },
      completed: completion.basicDetails
    },
    {
      id: 'health',
      icon: 'heart-pulse',
      label: 'Personal Health',
      onPress: () => openModal('personalHealth'),
      completed: completion.personalHealth
    },
    {
      id: 'family',
      icon: 'account-group',
      label: 'Family',
      onPress: () => openModal('family'),
      completed: completion.family
    },
    {
      id: 'additional',
      icon: 'file-document-edit',
      label: 'Additional Details',
      onPress: () => openModal('additionalDetails'),
      completed: completion.additionalDetails
    }
  ];

  const renderActionButton = ({ item }: { item: ActionButtonProps }) => (
    <AvButton
      mode="contained"
      style={styles.actionButton}
      buttonColor={COLORS.PRIMARY}
      onPress={item.onPress}
    >
      <View style={styles.buttonContent}>
        <AvIcons type="MaterialCommunityIcons" name={item.icon} size={16} color={COLORS.WHITE} />
        <AvText type="buttonText" style={styles.buttonText}>
          {item.label}
        </AvText>
        {item.completed && (
          <AvIcons type="MaterialCommunityIcons"
            name="check-circle"
            size={16}
            color={COLORS.SECONDARY}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </AvButton>
  );



  const imageSource = getImageSource(formData);

  const handleNavigation = ({ button }: { button: string }) => {
    if (allPatients?.length > 0) {
      const currentPatient = allPatients.find(
        (item: any) => formData.email === item.email
      );
      if (currentPatient) {
        dispatch(setCurrentPatient(currentPatient));
      } else {
        console.log("No patient found with email:", formData.email);
      }
    }
    if (button === "viewHealthCard") {
      navigation.navigate(PAGES.PATIENT_HEALTHCARD as never);
    }
    if (button === "editProfile") {
      navigation.navigate(PAGES.PATIENT_SETTINGS as never);
    }
  }

  return (
    <>
      <View style={[styles.card, styles.cardShadow]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <AvText type="title_7" style={{ color: COLORS.PRIMARY }}>
            Patient Info
          </AvText>
          <View style={styles.headerButtons}>
            <AvButton
              onPress={() => handleNavigation({ button: "viewHealthCard" })}
              mode="contained"
              contentStyle={styles.viewHealthCardButtonContent}
              buttonColor={COLORS.PRIMARY}
            >
              <AvText type="buttonText" style={{ color: COLORS.WHITE, fontSize: 14, fontWeight: "500" }}>
                View Health Card
              </AvText>
            </AvButton>
            <TouchableOpacity onPress={() => handleNavigation({ button: "editProfile" })}>
              <AvIcons type="MaterialCommunityIcons" name="pencil" size={20} color={COLORS.PRIMARY} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {imageSource ? (
              <AvImage
                source={imageSource}
                style={styles.profileImage}
                resizeMode="cover" // Add a default profile image to your IMAGES constant
              />
            ) : (
              <Avatar.Text
                size={80}
                label={userInitials}
                style={{ backgroundColor: COLORS.PRIMARY }}
                color={COLORS.WHITE}
                labelStyle={{ fontSize: 32, fontWeight: 'bold' }}
              />
            )}
          </View>
          <AvText type="title_6" style={{ color: COLORS.PRIMARY, marginTop: 8 }}>
            {formData.firstName + " " + formData.lastName || formData.email}
          </AvText>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailValueRow}>
                <AvIcons type="MaterialCommunityIcons" name="gender-female" size={16} color={COLORS.PRIMARY} />
                <AvText type="caption" style={styles.detailLabel}>
                  Gender
                </AvText>
              </View>
              <AvText type="heading_5" style={styles.detailValue}>
                {formData.gender}
              </AvText>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailValueRow}>
                <AvIcons type="MaterialCommunityIcons" name="phone" size={16} color={COLORS.PRIMARY} />
                <AvText type="caption" style={styles.detailLabel}>
                  Phone No.
                </AvText>
              </View>
              <AvText type="heading_5" style={styles.detailValue}>
                {formData.phone}
              </AvText>
            </View>
          </View>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <View style={styles.detailValueRow}>
                <AvIcons type="MaterialCommunityIcons" name="cake" size={16} color={COLORS.PRIMARY} />
                <AvText type="caption" style={styles.detailLabel}>
                  Date Of Birth
                </AvText>
              </View>
              <AvText type="heading_5" style={styles.detailValue}>
                {formData.dob ? moment(formData.dob).format('MMM DD YYYY') : ''}
              </AvText>
            </View>
            <View style={styles.detailItem}>
              <View style={styles.detailValueRow}>
                <AvIcons type="MaterialCommunityIcons" name="water" size={16} color={COLORS.PRIMARY} />
                <AvText type="caption" style={styles.detailLabel}>
                  Blood Group
                </AvText>
              </View>
              <AvText type="heading_5" style={styles.detailValue}>
                {patientPersonalData && patientPersonalData ? patientPersonalData?.bloodGroupName || "N/A" : "N/A"}
              </AvText>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <Animated.View
              style={{
                height: "100%",
                backgroundColor: COLORS.SECONDARY,
                borderRadius: 3,
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ['0%', '100%'],
                  extrapolate: 'clamp'
                })
              }}
            />
          </View>
          <AvText type="caption" style={styles.progressText}>
            {Math.round(progress)}% Profile Complete
          </AvText>
        </View>

        {/* Action Buttons */}
        <FlatList
          data={actionButtons}
          horizontal
          showsHorizontalScrollIndicator={true}
          indicatorStyle="black"
          contentContainerStyle={[styles.buttonsContainer, { paddingBottom: 10 }]}
          keyExtractor={(item) => item.id}
          renderItem={renderActionButton}
          style={{ height: 'auto' }}
        />

        {/* Modals */}
        <PatientModals
          modalVisible={modalVisible}
          closeModal={closeModal}
          dispatch={dispatch}
          formData={formData}
          handleInputChange={handleInputChange}
          handleToggleChange={handleToggleChange}
          handleSave={handleSave}
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 0,
    padding: 20,
  },
  cardShadow: {
    // shadow styles...
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  viewHealthCardButtonContent: {
    height: 36,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailsSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
    marginHorizontal: 8,
  },
  detailValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailLabel: {
    marginLeft: 8,
    color: COLORS.PRIMARY,
    fontWeight: "600",
  },
  detailValue: {
    marginLeft: 24,
    color: COLORS.PRIMARY_TXT,
    fontWeight: "900",
  },
  progressSection: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressText: {
    textAlign: "right",
    marginTop: 6,
    color: COLORS.SECONDARY,
    fontWeight: "500",
  },
  buttonsContainer: {
    paddingVertical: 6,
    paddingRight: 5,
  },
  actionButton: {
    borderRadius: 20,
    marginRight: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});

export default PatientOverview;