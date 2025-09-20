import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { COLORS } from "../../../../constants/colors";
import AvText from "../../../../elements/AvText";
import AvCard from "../../../../elements/AvCards";
import AvButton from "../../../../elements/AvButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { subscriptionPlans, SubscriptionPlan } from "../../../../constants/data";
import { PAGES } from "../../../../constants/pages";
import Header from "../../../../components/Header";
import {
  generateHealthId,
  formatDate,
  handlePlanSelect,
  handleActivatePlan,
  handleChangePlan,
} from "./index";

const HealthCard: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(subscriptionPlans[2]);
  const [isCardActivated, setIsCardActivated] = useState(false);
  const [showPlansView, setShowPlansView] = useState(true);

  const userData = {
    firstName: "John",
    lastName: "Doe",
    dob: "1990-01-15",
    gender: "Male",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    photo: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
    aadhaar: "1234567890123456",
    state: "Maharashtra",
    city: "Mumbai",
  };

  const healthId = generateHealthId(userData);
  const qrCodeData = `HEALTHID:${healthId}`;

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isSelected = selectedPlan?.id === plan.id;
    return (
      <AvCard
        key={plan.id}
        title={
          <View style={styles.planHeader}>
            <View style={[styles.planIconContainer, { backgroundColor: `${plan.color}20` }]}>
              <Icon name={plan.icon} size={24} color={plan.color} />
            </View>
            <View style={styles.planTitleContainer}>
              <AvText type="title_7" style={[styles.planName, { color: COLORS.PRIMARY_TXT }]}>
                {plan.name}
              </AvText>
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <AvText type="caption" style={styles.popularBadgeText}>
                    Most Popular
                  </AvText>
                </View>
              )}
            </View>
            <View style={styles.planPriceContainer}>
              <AvText type="title_3" style={[styles.planPrice, { color: plan.color }]}>
                {plan.price}
              </AvText>
              <AvText type="caption" style={[styles.planPeriod, { color: COLORS.SECONDARY }]}>
                {plan.period}
              </AvText>
            </View>
          </View>
        }
        cardStyle={[
          styles.planCard,
          {
            borderColor: isSelected ? plan.color : COLORS.LIGHT_GREY,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
        onPress={() => handlePlanSelect(plan, setSelectedPlan)}
      >
        <View style={styles.planBenefits}>
          {plan.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <Icon name="check-circle" size={16} color={plan.color} />
              <AvText type="caption" style={styles.benefitText}>
                {benefit}
              </AvText>
            </View>
          ))}
        </View>
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <View style={[styles.selectedDot, { backgroundColor: plan.color }]} />
            <AvText type="caption" style={styles.selectedText}>
              Selected
            </AvText>
          </View>
        )}
      </AvCard>
    );
  };

  const renderPlansView = () => {
    return (
      <View style={styles.plansContainer}>
        <AvText type="heading_2" style={styles.plansHeader}>
          Choose Your Health Plan
        </AvText>
        <AvText type="caption" style={styles.plansSubheader}>
          Select the perfect plan for your healthcare needs
        </AvText>
        <View style={styles.plansColumn}>
          {subscriptionPlans.map((plan) => renderPlanCard(plan))}
        </View>
        <AvButton
          mode="contained"
          onPress={() => handleActivatePlan(selectedPlan, setIsCardActivated, setShowPlansView)}
          style={[
            styles.activateButton,
            { backgroundColor: selectedPlan?.color },
          ]}
          disabled={!selectedPlan}
        >
          Activate {selectedPlan?.name} Plan
        </AvButton>
      </View>
    );
  };

  const renderHealthCardView = () => {
    if (!selectedPlan) return null;
    return (
      <>
     
        {/* Removed AvCard wrapper, replaced with a simple View */}
        <View style={[styles.planBadge, { backgroundColor: `${selectedPlan.color}20` }]}>
          <View style={styles.planBadgeContent}>
            <AvText type="title_7" style={[styles.planBadgeText, { color: selectedPlan.color }]}>
              {selectedPlan.name} Member
            </AvText>
            <AvButton
              mode="outlined"
              onPress={() => handleChangePlan(setShowPlansView)}
              style={styles.changePlanButton}
            >
              Change Plan
            </AvButton>
          </View>
        </View>

        {/* Health Card (with larger logo) */}
        <View style={[styles.healthCard, { backgroundColor: selectedPlan.color }]}>
          <View style={styles.cardContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../../assets/images/logo.png')}
                style={[styles.logoImage, { width: 120, height: 72 }]} // Increased size
                resizeMode="contain"
              />
            </View>
            <View style={styles.userSection}>
              <Image source={{ uri: userData.photo }} style={styles.userPhoto} />
              <View style={styles.userInfo}>
                <AvText type="title_3" style={styles.userName}>
                  {userData.firstName} {userData.lastName}
                </AvText>
                <View style={styles.userDetails}>
                  <AvText type="caption" style={styles.userDetailText}>
                    DOB: {formatDate(userData.dob)}
                  </AvText>
                  <AvText type="caption" style={styles.userDetailText}>
                    Gender: {userData.gender}
                  </AvText>
                </View>
              </View>
            </View>
            <View style={styles.qrHealthIdSection}>
              <View style={styles.healthIdInfo}>
                <AvText type="caption" style={styles.healthIdLabel}>
                  Health ID
                </AvText>
                <AvText type="title_4" style={styles.healthIdText}>
                  {healthId}
                </AvText>
                <AvText type="caption" style={styles.validityText}>
                  Valid Until: 12/28
                </AvText>
              </View>
              <View style={styles.qrCodeContainer}>
                <Icon name="qrcode" size={60} color={COLORS.WHITE} />
              </View>
            </View>
          </View>
        </View>

        {/* Download Button */}
        <TouchableOpacity
          style={[
            styles.downloadButton,
            {
              backgroundColor: COLORS.WHITE,
              borderColor: selectedPlan.color,
            }
          ]}
        >
          <Icon name="download" size={16} color={selectedPlan.color} />
          <AvText type="caption" style={[styles.downloadButtonText, { color: selectedPlan.color }]}>
            Download Card
          </AvText>
        </TouchableOpacity>
        </>
    );
  };

  return (
    <>
     <Header
                title={PAGES.PATIENT_HEALTHCARD}
                showBackButton={true}
                backgroundColor={COLORS.WHITE}
                titleColor={COLORS.BLACK}
            />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {showPlansView ? renderPlansView() : renderHealthCardView()}
    </ScrollView>
      </>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: 16,
  },
 
  plansHeader: {
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.PRIMARY_TXT,
    fontWeight: "bold",
    fontSize: 24,
  },
  plansSubheader: {
    textAlign: "center",
    marginBottom: 24,
    color: COLORS.SECONDARY,
  },
  plansColumn: {
    marginBottom: 24,
  },
  planCard: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  planTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  planIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  planName: {
    fontWeight: "600",
  },
  popularBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularBadgeText: {
    color: COLORS.PRIMARY_TXT,
    fontSize: 10,
    fontWeight: "bold",
  },
  planPriceContainer: {
    alignItems: "flex-end",
  },
  planPrice: {
    fontWeight: "bold",
  },
  planPeriod: {
    fontSize: 12,
  },
  planBenefits: {
    marginTop: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  benefitText: {
    marginLeft: 8,
    flex: 1,
    color: COLORS.PRIMARY_TXT,
  },
  selectedIndicator: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  selectedText: {
    fontSize: 12,
    color: COLORS.PRIMARY_TXT,
  },
  activateButton: {
    marginBottom: 50,
  },
  planBadge: {
    marginBottom: 16,
    borderRadius: 8,
    padding: 12,
  },
  planBadgeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planBadgeText: {
    fontWeight: "600",
  },
  changePlanButton: {
    minWidth: 100,
  },
  healthCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    position: 'relative',
  },
  cardContent: {
    padding: 16,
  },
  logoContainer: {
    position: 'absolute',
    
    top: 10,
    right: 10,
    zIndex: 1,
  },
  logoImage: {
    width: 120,  // Increased from 100
    height: 72,  // Increased from 60
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 20,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
    fontSize: 20,
  },
  userDetails: {
    flexDirection: "row",
    gap: 8,
  },
  userDetailText: {
    color: COLORS.WHITE,
    opacity: 0.9,
    fontSize: 15,
    marginTop: 5,
  },
  qrHealthIdSection: {
    borderRadius: 8,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  healthIdInfo: {
    flex: 1,
  },
  healthIdLabel: {
    color: COLORS.WHITE,
    opacity: 0.8,
    marginBottom: 5,
    fontSize: 14,
  },
  healthIdText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 10,
    fontSize: 18,
  },
  validityText: {
    color: COLORS.WHITE,
    opacity: 0.8,
    fontSize: 12,
  },
  qrCodeContainer: {
    marginLeft: 8,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  downloadButtonText: {
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default HealthCard;
