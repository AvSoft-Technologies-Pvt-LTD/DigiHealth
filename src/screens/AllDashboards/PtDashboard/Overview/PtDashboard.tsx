import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Avatar } from 'react-native-paper';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import { COLORS } from "../../../../constants/colors";
import { PAGES } from "../../../../constants/pages";
import { useNavigation } from "@react-navigation/native";
import PatientModals from "./index";
import AvImage from "../../../../elements/AvImage";
import { IMAGES } from "../../../../assets";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchAllPatients, fetchPatientBloodGroupData, fetchPatientDashboardData, fetchPatientPersonalHealthData, fetchPatientPhoto } from "../../../../store/thunks/patientThunks";
import { setUserProfile } from "../../../../store/slices/userSlice";
import { setCurrentPatient } from "../../../../store/slices/allPatientSlice";

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
    name: "Trupti Chavan",
    gender: "Female",
    dob: "2001-03-09",
    email: "",
    phone: "9370672873",
    bloodGroup: "",
    height: "",
    weight: "",
    surgeries: "",
    allergies: "",
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
  });

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
    setCompletion((prev) => ({ ...prev, [section]: true }));
    if (section === "personalHealth" || section === "family" || section === "additionalDetails") {
      closeModal(section);
    }
  };

  const completedSections = Object.values(completion).filter(Boolean).length;
  const progress = (completedSections / 4) * 100;
  const { allPatients } = useAppSelector((state) => state.patient);
  const { patientDashboardData } = useAppSelector((state) => state.patientDashboardData);
  const { patientPersonalData } = useAppSelector((state) => state.patientPersonalData);
  const dispatch = useAppDispatch();
  
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
  const fetchPtImage = async () => {
    try {
      if (currentPatient?.photo) {
        await dispatch(fetchPatientPhoto(currentPatient.photo));
      }
    } catch (error) {
      console.log("Error fetching photo", error);
    }
  };
  useEffect(() => {
    fetchPtImage();
  }, []); // Add empty dependency array to prevent rerendering

  const { photo } = useAppSelector((state) => state.patientSettingData || { photo: null, loading: true });
  const [profileImage, setProfileImage] = useState<string>(photo || '');

  // Generate initials from name
  const getInitials = (name: string) => {
    if (!name) return 'US';
    return name
      .split(' ')
      .filter(part => part.length > 0) // Filter out any empty strings
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
console.log("userInitials", formData);
  const userInitials = getInitials(formData.firstName+" "+formData.lastName);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientPersonalHealthData(id));
    }
  }, [dispatch, id]);

  // Update formData when patientPersonalData is available
  useEffect(() => {
    if (patientPersonalData) {
      setFormData(prev => ({
        ...prev,
        bloodGroup: patientPersonalData?.bloodGroupName || "",
        height: patientPersonalData?.height?.toString() || "",
        weight: patientPersonalData?.weight?.toString() || "",
        surgeries: patientPersonalData?.surgeries || "",
        allergies: patientPersonalData?.allergies || "",
        drinkAlcohol: patientPersonalData?.isAlcoholic || false,
        smoke: patientPersonalData?.isSmoker || false,
        tobaccoUse: patientPersonalData?.isTobacco || false,
        alcoholSinceYears: patientPersonalData?.yearsAlcoholic?.toString() || "",
        smokeSinceYears: patientPersonalData?.yearsSmoking?.toString() || "",
        tobaccoSinceYears: patientPersonalData?.yearsTobacco?.toString() || ""
      }));
    }
    setProfileImage(photo || '');
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
        <Icon name={item.icon} size={16} color={COLORS.WHITE} />
        <AvText type="buttonText" style={styles.buttonText}>
          {item.label}
        </AvText>
        {item.completed && (
          <Icon
            name="check-circle"
            size={16}
            color={COLORS.SECONDARY}
            style={{ marginLeft: 8 }}
          />
        )}
      </View>
    </AvButton>
  );
  return (
    <View style={[styles.card, styles.cardShadow]}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <AvText type="title_7" style={{ color: COLORS.PRIMARY }}>
          Patient Info
        </AvText>
        <View style={styles.headerButtons}>
          <AvButton
            onPress={() => navigation.navigate(PAGES.PATIENT_HEALTHCARD as never)}
            mode="contained"
            contentStyle={styles.viewHealthCardButtonContent}
            buttonColor={COLORS.PRIMARY}
          >
            <AvText type="buttonText" style={{ color: COLORS.WHITE, fontSize: 14, fontWeight: "500" }}>
              View Health Card
            </AvText>
          </AvButton>
          <TouchableOpacity onPress={() => navigation.navigate(PAGES.PATIENT_SETTINGS as never)}>
            <Icon name="pencil" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {(photo === null) && (
            <Avatar.Text
              size={80}
              label={userInitials}
              style={{ backgroundColor: COLORS.PRIMARY }}
              color={COLORS.WHITE}
              labelStyle={{ fontSize: 32, fontWeight: 'bold' }}
            />
          )}
          {photo && (
            <AvImage
              source={{ uri: profileImage }}
              style={{ width: 80, height: 80, borderRadius: 100 }}
            />

          )}
        </View>
        <AvText type="title_6" style={{ color: COLORS.PRIMARY, marginTop: 8 }}>
          {formData.email || formData.name}
        </AvText>
      </View>

      {/* Details Section */}
      <View style={styles.detailsSection}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={styles.detailValueRow}>
              <Icon name="gender-female" size={16} color={COLORS.PRIMARY} />
              <AvText type="caption" style={styles.detailLabel}>
                Gender
              </AvText>
            </View>
            <AvText type="body" style={styles.detailValue}>
              {formData.gender}
            </AvText>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailValueRow}>
              <Icon name="phone" size={16} color={COLORS.PRIMARY} />
              <AvText type="caption" style={styles.detailLabel}>
                Phone No.
              </AvText>
            </View>
            <AvText type="body" style={styles.detailValue}>
              {formData.phone}
            </AvText>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <View style={styles.detailValueRow}>
              <Icon name="cake" size={16} color={COLORS.PRIMARY} />
              <AvText type="caption" style={styles.detailLabel}>
                Date Of Birth
              </AvText>
            </View>
            <AvText type="body" style={styles.detailValue}>
              {formData.dob}
            </AvText>
          </View>
          <View style={styles.detailItem}>
            <View style={styles.detailValueRow}>
              <Icon name="water" size={16} color={COLORS.PRIMARY} />
              <AvText type="caption" style={styles.detailLabel}>
                Blood Group
              </AvText>
            </View>
            <AvText type="body" style={styles.detailValue}>
              {formData.bloodGroup || "N/A"}
            </AvText>
          </View>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBar}>
          <View style={{ height: "100%", backgroundColor: COLORS.SECONDARY, borderRadius: 3, width: `${progress}%` }} />
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
        indicatorStyle="black" // or "white" for dark backgrounds
        contentContainerStyle={[styles.buttonsContainer, { paddingBottom: 10 }]} // Add some padding
        keyExtractor={(item) => item.id}
        renderItem={renderActionButton}
        style={{ height: 'auto' }} // Ensure height is properly set
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardShadow: {
    shadowColor: COLORS.SECONDARY,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
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
  profileImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 40,
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
    fontWeight: "900",
    fontSize: 17,
  },
  detailValue: {
    marginLeft: 24,
    color: COLORS.PRIMARY_TXT,
    fontSize: 15,
    fontWeight: "600",
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
});

export default PatientOverview;
