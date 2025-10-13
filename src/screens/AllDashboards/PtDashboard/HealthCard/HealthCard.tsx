// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../../../../store";
// import { fetchPlans } from "../../../../store/thunks/patientThunks";
// import { COLORS } from "../../../../constants/colors";
// import AvText from "../../../../elements/AvText";
// import AvCard from "../../../../elements/AvCards";
// import AvButton from "../../../../elements/AvButton";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { PAGES } from "../../../../constants/pages";
// import Header from "../../../../components/Header";
// import {
//   generateHealthId,
//   formatDate,
//   handlePlanSelect,
//   handleActivatePlan,
//   handleChangePlan,
// } from "./index";
// import AvImage from "../../../../elements/AvImage";
// import { IMAGES } from "../../../../assets";

// const HealthCard: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const { plans, loading } = useSelector((state: RootState) => state.plans);

//   const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
//   const [isCardActivated, setIsCardActivated] = useState(false);
//   const [showPlansView, setShowPlansView] = useState(true);

//   useEffect(() => {
//     dispatch(fetchPlans());
//   }, [dispatch]);

//   useEffect(() => {
//     if (plans.length > 0) setSelectedPlan(plans[0]);
//   }, [plans]);

//   const userData = {
//     firstName: "John",
//     lastName: "Doe",
//     dob: "1990-01-15",
//     gender: "Male",
//     phone: "+91 9876543210",
//     email: "john.doe@example.com",
//     photo:
//       "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
//     aadhaar: "1234567890123456",
//     state: "Maharashtra",
//     city: "Mumbai",
//   };

//   const healthId = generateHealthId(userData);

//   const renderPlanCard = (plan: any) => {
//     const isSelected = selectedPlan?.id === plan.id;
//     return (
//       <AvCard
//         key={plan.id}
//         title={
//           <View style={styles.planHeader}>
//             <View
//               style={[
//                 styles.planIconContainer,
//                 { backgroundColor: `${plan.color || COLORS.PRIMARY}20` },
//               ]}
//             >
//               <Icon
//                 name={plan.icon || "shield-check"}
//                 size={24}
//                 color={plan.color || COLORS.PRIMARY}
//               />
//             </View>
//             <View style={styles.planTitleContainer}>
//               <AvText type="title_7" style={styles.planName}>
//                 {plan.name}
//               </AvText>
//               {plan.isPopular && (
//                 <View style={styles.popularBadge}>
//                   <AvText type="caption" style={styles.popularBadgeText}>
//                     Most Popular
//                   </AvText>
//                 </View>
//               )}
//             </View>
//             <View style={styles.planPriceContainer}>
//               <AvText
//                 type="title_3"
//                 style={[styles.planPrice, { color: plan.color || COLORS.PRIMARY }]}
//               >
//                 ₹{plan.price}
//               </AvText>
//               <AvText type="caption" style={styles.planPeriod}>
//                 {plan.period || "Monthly"}
//               </AvText>
//             </View>
//           </View>
//         }
//         cardStyle={[
//           styles.planCard,
//           {
//             borderColor: isSelected
//               ? plan.color || COLORS.PRIMARY
//               : COLORS.LIGHT_GREY,
//             borderWidth: isSelected ? 2 : 1,
//           },
//         ]}
//         onPress={() => handlePlanSelect(plan, setSelectedPlan)}
//       >
//         <View style={styles.planBenefits}>
//           {(plan.benefits || []).map((benefit: string, index: number) => (
//             <View key={index} style={styles.benefitItem}>
//               <Icon
//                 name="check-circle"
//                 size={16}
//                 color={plan.color || COLORS.PRIMARY}
//               />
//               <AvText type="caption" style={styles.benefitText}>
//                 {benefit}
//               </AvText>
//             </View>
//           ))}
//         </View>
//       </AvCard>
//     );
//   };

//   const renderPlansView = () => {
//     if (loading)
//       return <ActivityIndicator size="large" color={COLORS.PRIMARY} style={{ marginTop: 50 }} />;

//     return (
//       <View style={{ paddingBottom: 80 }}>
//         <AvText type="heading_2" style={styles.plansHeader}>
//           Choose Your Health Plan
//         </AvText>
//         <AvText type="caption" style={styles.plansSubheader}>
//           Select the perfect plan for your healthcare needs
//         </AvText>
//         <View style={styles.plansColumn}>{plans.map((p) => renderPlanCard(p))}</View>
//       </View>
//     );
//   };

//   const renderHealthCardView = () => {
//     if (!selectedPlan) return null;
//     return (
//       <>
//         {/* Plan Badge */}
//         <View style={[styles.planBadge, { backgroundColor: `${selectedPlan.color || COLORS.PRIMARY}20` }]}>
//           <View style={styles.planBadgeContent}>
//             <AvText type="title_7" style={[styles.planBadgeText, { color: selectedPlan.color || COLORS.PRIMARY }]}>
//               {selectedPlan.name} Member
//             </AvText>
//             <AvButton
//               mode="outlined"
//               onPress={() => handleChangePlan(setShowPlansView)}
//               style={styles.changePlanButton}
//             >
//               Change Plan
//             </AvButton>
//           </View>
//         </View>

//         {/* Health Card */}
//         <View style={[styles.healthCard, { backgroundColor: selectedPlan.color || COLORS.PRIMARY }]}>
//           <View style={styles.cardContent}>
//             <View style={styles.logoContainer}>
//               <AvImage
//                 source={IMAGES.LOGO}
//                 style={[styles.logoImage, { width: 120, height: 72 }]}
//                 resizeMode="contain"
//               />
//             </View>
//             <View style={styles.userSection}>
//               <AvImage source={{ uri: userData.photo }} style={styles.userPhoto} />
//               <View style={styles.userInfo}>
//                 <AvText type="title_3" style={styles.userName}>
//                   {userData.firstName} {userData.lastName}
//                 </AvText>
//                 <View style={styles.userDetails}>
//                   <AvText type="caption" style={styles.userDetailText}>
//                     DOB: {formatDate(userData.dob)}
//                   </AvText>
//                   <AvText type="caption" style={styles.userDetailText}>
//                     Gender: {userData.gender}
//                   </AvText>
//                 </View>
//               </View>
//             </View>
//             <View style={styles.qrHealthIdSection}>
//               <View style={styles.healthIdInfo}>
//                 <AvText type="caption" style={styles.healthIdLabel}>
//                   Health ID
//                 </AvText>
//                 <AvText type="title_4" style={styles.healthIdText}>
//                   {healthId}
//                 </AvText>
//                 <AvText type="caption" style={styles.validityText}>
//                   Valid Until: 12/28
//                 </AvText>
//               </View>
//               <View style={styles.qrCodeContainer}>
//                 <Icon name="qrcode" size={60} color={COLORS.WHITE} />
//               </View>
//             </View>
//           </View>
//         </View>
//       </>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <Header
//         title={PAGES.PATIENT_HEALTHCARD}
//         showBackButton={true}
//         backgroundColor={COLORS.WHITE}
//         titleColor={COLORS.BLACK}
//       />
//       <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
//         {showPlansView ? renderPlansView() : renderHealthCardView()}
//       </ScrollView>

//       {/* Floating Buttons */}
//       <View style={styles.floatingButtonContainer}>
//         {showPlansView ? (
//           <AvButton
//             mode="contained"
//             onPress={() => handleActivatePlan(selectedPlan, setIsCardActivated, setShowPlansView)}
//             style={[styles.floatingButton, { backgroundColor: selectedPlan?.color || COLORS.PRIMARY }]}
//             disabled={!selectedPlan}
//           >
//             Activate {selectedPlan?.name} Plan
//           </AvButton>
//         ) : (
//           <View style={{ flexDirection: "row", gap: 12 }}>
//             <AvButton
//               mode="outlined"
//               onPress={() => handleChangePlan(setShowPlansView)}
//               style={[styles.floatingButton, { borderColor: selectedPlan?.color || COLORS.PRIMARY }]}
//             >
//               Change Plan
//             </AvButton>
//             <AvButton
//               mode="contained"
//               onPress={() => console.log("Download Card")}
//               style={[styles.floatingButton, { backgroundColor: selectedPlan?.color || COLORS.PRIMARY }]}
//             >
//               Download Card
//             </AvButton>
//           </View>
//         )}
//       </View>
//     </View>
//   );
// };

// // ✅ Styles (same as before)
// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: COLORS.WHITE },
//   plansHeader: { textAlign: "center", marginBottom: 8, color: COLORS.PRIMARY_TXT, fontWeight: "bold", fontSize: 24 },
//   plansSubheader: { textAlign: "center", marginBottom: 24, color: COLORS.SECONDARY },
//   plansColumn: { marginBottom: 24, paddingHorizontal: 16 },
//   planCard: { marginBottom: 12, padding: 16, borderRadius: 12 },
//   planHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
//   planTitleContainer: { flexDirection: "row", alignItems: "center" },
//   planIconContainer: { width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginRight: 8 },
//   planName: { fontWeight: "600" },
//   popularBadge: { backgroundColor: "#FFD700", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginLeft: 8 },
//   popularBadgeText: { color: COLORS.PRIMARY_TXT, fontSize: 10, fontWeight: "bold" },
//   planPriceContainer: { alignItems: "flex-end" },
//   planPrice: { fontWeight: "bold" },
//   planPeriod: { fontSize: 12 },
//   planBenefits: { marginTop: 12 },
//   benefitItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
//   benefitText: { marginLeft: 8, flex: 1, color: COLORS.PRIMARY_TXT },
//   planBadge: { marginBottom: 16, borderRadius: 8, padding: 12, marginHorizontal: 16 },
//   planBadgeContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   planBadgeText: { fontWeight: "600" },
//   changePlanButton: { minWidth: 100 },
//   healthCard: { marginHorizontal: 16, marginBottom: 16, borderRadius: 16, overflow: "hidden", height: 250 },
//   cardContent: { padding: 16 },
//   logoContainer: { position: "absolute", top: 10, right: 10, zIndex: 1 },
//   logoImage: { width: 120, height: 72 },
//   userSection: { flexDirection: "row", alignItems: "center", marginBottom: 12, marginTop: 20 },
//   userPhoto: { width: 80, height: 80, borderRadius: 25, marginRight: 12, borderWidth: 2, borderColor: COLORS.WHITE },
//   userInfo: { flex: 1 },
//   userName: { color: COLORS.WHITE, fontWeight: "bold", marginBottom: 2, textTransform: "uppercase", fontSize: 20 },
//   userDetails: { flexDirection: "row", gap: 8 },
//   userDetailText: { color: COLORS.WHITE, opacity: 0.9, fontSize: 15, marginTop: 5 },
//   qrHealthIdSection: { borderRadius: 8, padding: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
//   healthIdInfo: { flex: 1 },
//   healthIdLabel: { color: COLORS.WHITE, opacity: 0.8, marginBottom: 5, fontSize: 14 },
//   healthIdText: { color: COLORS.WHITE, fontWeight: "bold", marginBottom: 10, fontSize: 18 },
//   validityText: { color: COLORS.WHITE, opacity: 0.8, fontSize: 12 },
//   qrCodeContainer: { marginLeft: 8 },
//   floatingButtonContainer: { position: "absolute", bottom: 16, left: 16, right: 16, zIndex: 10 },
//   floatingButton: { borderRadius: 8, paddingVertical: 12 },
// });

// export default HealthCard;



import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
  handlePlanSelect,
  handleActivatePlan,
  handleChangePlan,
} from "./index";
import AvImage from "../../../../elements/AvImage";
import { IMAGES } from "../../../../assets";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import {
  fetchAllPatients,
  fetchPatientDashboardData,
  fetchPatientPhoto,
} from "../../../../store/thunks/patientThunks";
import { setUserProfile } from "../../../../store/slices/userSlice";
import { setCurrentPatient } from "../../../../store/slices/allPatientSlice";

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const HealthCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(
    subscriptionPlans[2]
  );
  const [isCardActivated, setIsCardActivated] = useState(false);
  const [showPlansView, setShowPlansView] = useState(true);

  // Redux selectors
  const { allPatients, loading } = useAppSelector((state) => state.patient);
  const { patientDashboardData } = useAppSelector(
    (state) => state.patientDashboardData
  );
  const { currentPatient } = useAppSelector((state) => state.currentPatient || {});
  const { photo } = useAppSelector((state) => state.patientSettingData || {});
  const userEmail = useAppSelector((state) => state.user.userProfile.email);

  // User data
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    name: "",
    dob: "",
    gender: "",
    phone: "",
    email: "",
    photo: "",
    aadhaar: "",
    state: "",
    city: "",
  });

  // Fetch all patients
  useEffect(() => {
    dispatch(fetchAllPatients());
  }, [dispatch]);

  // Match current patient by email
  useEffect(() => {
    if (allPatients?.length > 0) {
      const currentPatient = allPatients.find(
        (item: any) => userEmail === item.email
      );

      if (currentPatient) {
        dispatch(setCurrentPatient(currentPatient));
        dispatch(fetchPatientDashboardData(currentPatient.id));
        dispatch(setUserProfile({ patientId: currentPatient.id }));
      } else {
        console.log("No patient found with email:", userEmail);
      }
    }
  }, [allPatients, userEmail, dispatch]);

  // Fetch photo if available
  useEffect(() => {
    if (currentPatient?.photo) {
      dispatch(fetchPatientPhoto(currentPatient.photo));
    }
  }, [currentPatient, dispatch]);

  // ✅ Update userData when dashboard data loads
  useEffect(() => {
    if (patientDashboardData) {
      const newData = Array.isArray(patientDashboardData)
        ? patientDashboardData[0] || {}
        : patientDashboardData;

      console.log("Dashboard Data:", newData);

      setUserData((prev) => ({
        ...prev,
        ...newData,
        dob: newData.dob || newData.dateOfBirth || newData.birthDate || "",
        photo: photo || newData.photo || "",
      }));
    }
  }, [patientDashboardData, photo]);

  const healthId = generateHealthId(userData);

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

  const renderPlansView = () => (
    <View style={{ paddingBottom: 80 }}>
      <AvText type="heading_2" style={styles.plansHeader}>
        Choose Your Health Plan
      </AvText>
      <AvText type="caption" style={styles.plansSubheader}>
        Select the perfect plan for your healthcare needs
      </AvText>
      <View style={styles.plansColumn}>
        {subscriptionPlans.map((plan) => renderPlanCard(plan))}
      </View>
    </View>
  );

  const renderHealthCardView = () => {
    if (!selectedPlan) return null;
    const displayName =
      userData.name ||
      (userData.firstName && userData.lastName
        ? `${userData.firstName} ${userData.lastName}`
        : userData.email);

    return (
      <>
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

        <View style={[styles.healthCard, { backgroundColor: selectedPlan.color }]}>
          <View style={styles.cardContent}>
            <View style={styles.logoContainer}>
              <AvImage
                source={IMAGES.LOGO}
                style={[styles.logoImage, { width: 120, height: 72 }]}
                resizeMode="contain"
              />
            </View>
            <View style={styles.userSection}>
              <AvImage
                source={{ uri: photo || userData.photo || IMAGES.PROFILE }}
                style={styles.userPhoto}
              />
              <View style={styles.userInfo}>
                <AvText type="title_3" style={styles.userName}>
                  {displayName}
                </AvText>
                <View style={styles.userDetails}>
                  <AvText type="caption" style={styles.userDetailText}>
                    DOB: {userData.dob ? formatDate(userData.dob) : "N/A"}
                  </AvText>
                  <AvText type="caption" style={styles.userDetailText}>
                    Gender: {userData.gender || "N/A"}
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
      </>
    );
  };

  if (loading && !patientDashboardData) {
    return (
      <View style={styles.container}>
        <Header
          title={PAGES.PATIENT_HEALTHCARD}
          showBackButton={true}
          backgroundColor={COLORS.WHITE}
          titleColor={COLORS.BLACK}
        />
        <View style={styles.loadingContainer}>
          <AvText>Loading...</AvText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title={PAGES.PATIENT_HEALTHCARD}
        showBackButton={true}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {showPlansView ? renderPlansView() : renderHealthCardView()}
      </ScrollView>

      <View style={styles.floatingButtonContainer}>
        {showPlansView ? (
          <AvButton
            mode="contained"
            onPress={() =>
              handleActivatePlan(selectedPlan, setIsCardActivated, setShowPlansView)
            }
            style={[styles.floatingButton, { backgroundColor: selectedPlan?.color }]}
            disabled={!selectedPlan}
          >
            Activate {selectedPlan?.name} Plan
          </AvButton>
        ) : (
          <AvButton
            mode="contained"
            onPress={() => console.log("Download Card")}
            style={[styles.floatingButton, { backgroundColor: selectedPlan?.color }]}
          >
            Download Card
          </AvButton>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // styles unchanged from your original file
  container: { flex: 1, backgroundColor: COLORS.WHITE },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  plansHeader: {
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.PRIMARY_TXT,
    fontWeight: "bold",
    fontSize: 24,
  },
  plansSubheader: { textAlign: "center", marginBottom: 24, color: COLORS.SECONDARY },
  plansColumn: { marginBottom: 24, paddingHorizontal: 16 },
  planCard: { marginBottom: 12, padding: 16, borderRadius: 12 },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  planTitleContainer: { flexDirection: "row", alignItems: "center" },
  planIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  planName: { fontWeight: "600" },
  popularBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  popularBadgeText: { color: COLORS.PRIMARY_TXT, fontSize: 10, fontWeight: "bold" },
  planPriceContainer: { alignItems: "flex-end" },
  planPrice: { fontWeight: "bold" },
  planPeriod: { fontSize: 12 },
  planBenefits: { marginTop: 12 },
  benefitItem: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  benefitText: { marginLeft: 8, flex: 1, color: COLORS.PRIMARY_TXT },
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
  selectedDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  selectedText: { fontSize: 12, color: COLORS.PRIMARY_TXT },
  planBadge: { marginBottom: 16, borderRadius: 8, padding: 12, marginHorizontal: 16 },
  planBadgeContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planBadgeText: { fontWeight: "600" },
  changePlanButton: { minWidth: 100 },
  healthCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    height: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  cardContent: { padding: 16 },
  logoContainer: { position: "absolute", top: 10, right: 10, zIndex: 1 },
  logoImage: { width: 120, height: 72 },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 40,
  },
  userPhoto: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
  },
  userInfo: { flex: 1 },
  userName: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    marginBottom: 2,
    textTransform: "uppercase",
    fontSize: 20,
  },
  userDetails: { flexDirection: "row", gap: 8 },
  userDetailText: { color: COLORS.WHITE, opacity: 0.9, fontSize: 15, marginTop: 5 },
  qrHealthIdSection: {
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  healthIdInfo: { flex: 1 },
  healthIdLabel: { color: COLORS.WHITE, opacity: 0.8, marginBottom: 5, fontSize: 14 },
  healthIdText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontFamily: "monospace",
    marginBottom: 10,
    fontSize: 18,
  },
  validityText: { color: COLORS.WHITE, opacity: 0.8, fontSize: 12 },
  qrCodeContainer: { marginLeft: 8 },
  floatingButtonContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  floatingButton: { flex: 1 },
});

export default HealthCard;
