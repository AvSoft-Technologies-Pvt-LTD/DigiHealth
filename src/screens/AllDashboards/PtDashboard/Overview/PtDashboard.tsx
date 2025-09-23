import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import { COLORS } from "../../../../constants/colors";
import { PAGES } from "../../../../constants/pages";
import { useNavigation } from "@react-navigation/native";
import PatientModals from "./index";
import AvImage from "../../../../elements/AvImage";
import { IMAGES } from "../../../../assets";

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
    phone: "9370672873",
    bloodGroup: "O+",
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
          <TouchableOpacity onPress={() => navigation.navigate(PAGES.PATIENT_SETTINGS)}>
            <Icon name="pencil" size={20} color={COLORS.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <AvImage
          source={{ uri:IMAGES.PROFILE }}
          style={styles.profileImage}
        />
        <AvText type="title_6" style={{ color: COLORS.PRIMARY }}>
          {formData.name}
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
              {formData.bloodGroup}
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.buttonsContainer}>
        <AvButton
          mode="contained"
          style={styles.actionButton}
          buttonColor={COLORS.PRIMARY}
          onPress={() => {}}
        >
          <View style={styles.buttonContent}>
            <Icon name="account-details" size={16} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>
              Basic Details
            </AvText>
            {completion.basicDetails && <Icon name="check-circle" size={16} color={COLORS.SECONDARY} style={{ marginLeft: 8 }} />}
          </View>
        </AvButton>
        <AvButton
          mode="contained"
          style={styles.actionButton}
          buttonColor={COLORS.PRIMARY}
          onPress={() => openModal("personalHealth")}
        >
          <View style={styles.buttonContent}>
            <Icon name="heart-pulse" size={16} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>
              Personal Health
            </AvText>
            {completion.personalHealth && <Icon name="check-circle" size={16} color={COLORS.SECONDARY} style={{ marginLeft: 8 }} />}
          </View>
        </AvButton>
        <AvButton
          mode="contained"
          style={styles.actionButton}
          buttonColor={COLORS.PRIMARY}
          onPress={() => openModal("family")}
        >
          <View style={styles.buttonContent}>
            <Icon name="account-group" size={16} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>
              Family
            </AvText>
            {completion.family && <Icon name="check-circle" size={16} color={COLORS.SECONDARY} style={{ marginLeft: 8 }} />}
          </View>
        </AvButton>
        <AvButton
          mode="contained"
          style={styles.actionButton}
          buttonColor={COLORS.PRIMARY}
          onPress={() => openModal("additionalDetails")}
        >
          <View style={styles.buttonContent}>
            <Icon name="file-document-edit" size={16} color={COLORS.WHITE} />
            <AvText type="buttonText" style={styles.buttonText}>
              Additional Details
            </AvText>
            {completion.additionalDetails && <Icon name="check-circle" size={16} color={COLORS.SECONDARY} style={{ marginLeft: 8 }} />}
          </View>
        </AvButton>
      </ScrollView>

      {/* Modals */}
      <PatientModals
        modalVisible={modalVisible}
        closeModal={closeModal}
        handleSave={handleSave}
        formData={formData}
        handleInputChange={handleInputChange}
        handleToggleChange={handleToggleChange}
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
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
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
    flexDirection: "row",
    paddingVertical: 8,
    gap: 8,
  },
  actionButton: {
    borderRadius: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});

export default PatientOverview;
