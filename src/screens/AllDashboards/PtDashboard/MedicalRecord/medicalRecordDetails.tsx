<<<<<<< HEAD
// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
// import { Tabs } from '../../../../components/CommonComponents/Tabs';
// import { COLORS } from '../../../../constants/colors';
// import { PAGES } from '../../../../constants/pages';
// import Header from '../../../../components/Header';
// import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
// import { setUserProfile } from "../../../../store/slices/userSlice";
// import { setCurrentPatient } from "../../../../store/slices/allPatientSlice";
// import {
//   fetchAllPatients,
//   fetchPatientDashboardData,
//   fetchPatientPersonalHealthData,
// } from "../../../../store/thunks/patientThunks";
// import { fetchMedicalInfo } from "../../../../store/thunks/patientThunks";
// import PatientHeader from './patientHeader';
// import VitalsSummary from './vitalsSummary';
// import MedicalInformation from './medicalInformation';
// import Prescriptions from './prescriptionTab';
// import LabScan from './labScan';
// import Billing from './billingTab';
// import { AvButton } from '../../../../elements';
// import VideoTab from './videoTab';

// const MedicalRecordsDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
//   const [activeTab, setActiveTab] = useState('medical-records');
//   const dispatch = useAppDispatch();
//   const id = useAppSelector((state) => state.user.userProfile.patientId);
//   const { currentPatient } = useAppSelector((state) => state.currentPatient || {});
//   const { allPatients } = useAppSelector((state) => state.patient);
//   const userEmail = useAppSelector((state) => state.user.userProfile.email);

//   // Define videoRecords (static for now)
//   const videoRecords = [
//     {
//       id: '1',
//       date: '10/13/2025, 12:59:26 PM',
//       type: 'OPD',
//       doctorName: 'Dr. Kavya Patil',
//     },
//     // Add more records as needed
//   ];

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchAllPatients());
//     }
//   }, [dispatch, id]);

//   useEffect(() => {
//     if (allPatients?.length > 0 && userEmail) {
//       const currentPatient = allPatients.find((item: any) => userEmail === item.email);
//       if (currentPatient) {
//         dispatch(setCurrentPatient(currentPatient));
//         dispatch(setUserProfile({ patientId: currentPatient.id }));
//       }
//     }
//   }, [allPatients, userEmail, dispatch]);

//   useEffect(() => {
//     if (currentPatient?.id) {
//       dispatch(fetchPatientDashboardData(currentPatient.id));
//       dispatch(fetchMedicalInfo(currentPatient.id));
//     }
//   }, [currentPatient?.id, dispatch]);

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchPatientPersonalHealthData(id));
//     }
//   }, [dispatch, id]);

//   return (
//     <View style={styles.container}>
//       <SafeAreaView style={styles.safeArea}>
//         <Header
//           title={PAGES.PATIENT_MEDICAL_RECORD}
//           showBackButton={true}
//           backgroundColor={COLORS.WHITE}
//           titleColor={COLORS.BLACK}
//         />
//         <ScrollView
//           style={styles.scrollView}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={styles.scrollContent}
//         >
//           <PatientHeader navigation={navigation} currentPatient={currentPatient} />
//           <VitalsSummary currentPatient={currentPatient} />
//           <Tabs
//             tabs={[
//               { key: 'medical-records', label: 'Medical Records' },
//               { key: 'prescriptions', label: 'Prescriptions' },
//               { key: 'lab-scan', label: 'Lab/Scan' },
//               { key: 'billing', label: 'Billing' },
//               { key: 'video', label: 'Video' },
//             ]}
//             activeTab={activeTab}
//             onTabChange={setActiveTab}
//           />
//           {activeTab === 'medical-records' && <MedicalInformation currentPatient={currentPatient} />}
//           {activeTab === 'prescriptions' && <Prescriptions currentPatient={currentPatient} />}
//           {activeTab === 'lab-scan' && <LabScan currentPatient={currentPatient} />}
//           {activeTab === 'billing' && <Billing currentPatient={currentPatient} />}
//           {activeTab === 'video' && <VideoTab videoRecords={videoRecords} />}
//           {/* Second Opinion Button */}
//           <View style={styles.buttonContainer}>
//             <AvButton>Second Opinion</AvButton>
//           </View>
//         </ScrollView>
//       </SafeAreaView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: COLORS.BG_OFF_WHITE,
//   },
//   safeArea: {
//     flex: 1,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   scrollContent: {
//     paddingBottom: 20,
//   },
//   buttonContainer: {
//     marginTop: 20,
//     marginBottom: 20,
//     marginHorizontal: 20,
//   },
// });

// export default MedicalRecordsDetails;














import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
=======
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvIcons from '../../../../elements/AvIcons';
>>>>>>> 6c4a9a52c5df149463269873e25212680d39bbcf
import { Tabs } from '../../../../components/CommonComponents/Tabs';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { PAGES } from '../../../../constants/pages';
import Header from '../../../../components/Header';
<<<<<<< HEAD
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { setUserProfile } from "../../../../store/slices/userSlice";
import { setCurrentPatient } from "../../../../store/slices/allPatientSlice";
import {
  fetchAllPatients,
  fetchPatientDashboardData,
  fetchPatientPersonalHealthData,
} from "../../../../store/thunks/patientThunks";
import { fetchMedicalInfo } from "../../../../store/thunks/patientThunks";
import PatientHeader from './patientHeader';
import VitalsSummary from './vitalsSummary';
import MedicalInformation from './medicalInformation';
import Prescriptions from './prescriptionTab';
import LabScan from './labScan';
import Billing from './billingTab';
import { AvButton } from '../../../../elements';
import VideoTab from './videoTab';

const MedicalRecordsDetails: React.FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('medical-records');
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.user.userProfile.patientId);
  const { currentPatient } = useAppSelector((state) => state.currentPatient || {});
  const { allPatients } = useAppSelector((state) => state.patient);
  const userEmail = useAppSelector((state) => state.user.userProfile.email);
  const { record, recordType } = route.params || {};

  const videoRecords = [
    {
      id: '1',
      date: '10/13/2025, 12:59:26 PM',
      type: 'OPD',
      doctorName: 'Dr. Kavya Patil',
    },
  ];

  const tabs = [
    { key: 'medical-records', label: 'Medical Records' },
    { key: 'prescriptions', label: 'Prescriptions' },
    { key: 'lab-scan', label: 'Lab/Scan' },
    { key: 'billing', label: 'Billing' },
    ...(recordType === 'VIRTUAL' ? [{ key: 'video', label: 'Video' }] : []),
  ];
=======

interface MedicalRecord {
  id: string;
  patientName: string;
  patientInitials: string;
  age: string;
  gender: string;
  hospital: string;
  visitDate: string;
  diagnosis: string;
  chiefComplaint: string;
  pastHistory: string;
  advice: string;
  plan: string;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    spO2: string;
    respiratoryRate: string;
    height: string;
    weight: string;
  };
}

const MedicalRecordsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('medical-records');
>>>>>>> 6c4a9a52c5df149463269873e25212680d39bbcf

  const sampleRecord: MedicalRecord = {
    id: '1',
    patientName: 'Sahana Kadrolli',
    patientInitials: 'SK',
    age: '32',
    gender: 'Female',
    hospital: 'AV Hospital',
    visitDate: '10/10/2025',
    diagnosis: 'Migraine',
    chiefComplaint: 'Severe headache for 3 days',
    pastHistory: 'Hypertension (5 years), No known allergies',
    advice: '1. Rest in dark room\n2. Hydration (3L/day)\n3. Avoid caffeine\n4. Cold compress',
    plan: '1. Follow-up in 1 week\n2. Neurology consult if symptoms persist\n3. MRI if needed',
    vitals: {
      bloodPressure: '120/80',
      heartRate: '78',
      temperature: '98.6°F',
      spO2: '98%',
      respiratoryRate: '18',
      height: '165 cm',
      weight: '65 kg',
    },
  };

  const vitalsData = [
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="heart-pulse" size={20} color={COLORS.ERROR} />,
      label: 'BP',
      value: sampleRecord.vitals.bloodPressure,
      unit: 'mmHg',
      color: COLORS.ERROR,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.ERROR,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="heart" size={20} color={COLORS.PRIMARY_BLUE} />,
      label: 'Heart Rate',
      value: sampleRecord.vitals.heartRate,
      unit: 'bpm',
      color: COLORS.PRIMARY_BLUE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.PRIMARY_BLUE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="thermometer" size={20} color={COLORS.BRIGHT_ORANGE} />,
      label: 'Temp',
      value: sampleRecord.vitals.temperature,
      color: COLORS.BRIGHT_ORANGE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.ORANGE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="lungs" size={20} color={COLORS.SECONDARY} />,
      label: 'SpO₂',
      value: sampleRecord.vitals.spO2,
      unit: '%',
      color: COLORS.SECONDARY,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.SECONDARY,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="lungs" size={20} color={COLORS.BRIGHT_PURPLE} />,
      label: 'Resp. Rate',
      value: sampleRecord.vitals.respiratoryRate,
      unit: 'bpm',
      color: COLORS.BRIGHT_PURPLE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.PURPLE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="human-male-height" size={20} color={COLORS.OCEAN_BLUE} />,
      label: 'Height',
      value: sampleRecord.vitals.height,
      color: COLORS.OCEAN_BLUE,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.BLUE,
    },
    {
      icon: <AvIcons type="MaterialCommunityIcons" name="weight" size={20} color={COLORS.GREEN} />,
      label: 'Weight',
      value: sampleRecord.vitals.weight,
      color: COLORS.GREEN,
      bgColor: COLORS.WHITE,
      borderColor: COLORS.GREEN,
    },
  ];

  const renderPatientHeader = () => (
    <View style={styles.patientHeader}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        </TouchableOpacity>
        <View style={styles.patientInfoRow}>
          <View style={styles.patientAvatar}>
            <AvText type="heading_4" style={styles.avatarText}>{sampleRecord.patientInitials}</AvText>
          </View>
          <View style={styles.patientDetails}>
            <AvText type="heading_5" style={styles.patientName}>{sampleRecord.patientName}</AvText>
            <View style={styles.patientMetaRow}>
              <View style={styles.metaItem}>
                <AvText type="caption" style={styles.metaLabel}>Age</AvText>
                <AvText type="body" style={styles.metaValue}>{sampleRecord.age}</AvText>
              </View>
              <View style={styles.metaItem}>
                <AvText type="caption" style={styles.metaLabel}>Gender</AvText>
                <AvText type="body" style={styles.metaValue}>{sampleRecord.gender}</AvText>
              </View>
            </View>
            <View style={styles.visitInfoRow}>
              <View style={styles.visitInfoItem}>
                <AvText type="caption" style={styles.visitInfoLabel}>Hospital</AvText>
                <AvText type="body" style={styles.visitInfoValue}>{sampleRecord.hospital}</AvText>
              </View>
              <View style={styles.visitInfoItem}>
                <AvText type="caption" style={styles.visitInfoLabel}>Visit Date</AvText>
                <AvText type="body" style={styles.visitInfoValue}>{sampleRecord.visitDate}</AvText>
              </View>
              <View style={styles.visitInfoItem}>
                <AvText type="caption" style={styles.visitInfoLabel}>Diagnosis</AvText>
                <AvText type="body" style={styles.visitInfoValue}>{sampleRecord.diagnosis}</AvText>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const renderVitalsSummary = () => (
    <View style={styles.vitalsContainer}>
      <View style={styles.vitalsHeader}>
        <AvIcons type="MaterialIcons" name="favorite" size={normalize(20)} color={COLORS.SECONDARY} />
        <AvText type="heading_6" style={styles.sectionTitle}>Vitals Summary</AvText>
      </View>
      <View style={styles.vitalsGrid}>
        {vitalsData.map((vital, index) => (
          <AvCard key={index} cardStyle={[styles.vitalCard, { borderColor: vital.borderColor, backgroundColor: `${vital.color}10` }]}>
            <View style={styles.vitalContent}>
              <View style={[styles.vitalIconContainer, { backgroundColor: `${vital.color}1A` }]}>
                {vital.icon}
              </View>
              <View style={styles.vitalTextContainer}>
                <AvText type="caption" style={[styles.vitalLabel, { color: vital.color }]}>{vital.label}</AvText>
                <AvText type="heading_5" style={[styles.vitalValue, { color: vital.color }]}>{vital.value}</AvText>
                {vital.unit && <AvText type="caption" style={[styles.vitalUnit, { color: vital.color }]}>{vital.unit}</AvText>}
              </View>
            </View>
          </AvCard>
        ))}
      </View>
    </View>
  );

  const renderMedicalInformation = () => (
    <View style={styles.medicalInfoContainer}>
      <View style={styles.medicalInfoHeader}>
        <AvText type="heading_6" style={styles.sectionTitle}>📋 Medical Information</AvText>
        <TouchableOpacity style={styles.viewOriginalButton}>
          <AvText type="caption" style={styles.viewOriginalText}>View Original</AvText>
        </TouchableOpacity>
      </View>
      <View style={styles.medicalInfoGrid}>
        <AvCard cardStyle={styles.infoCard}>
          <AvText type="Subtitle_1" style={styles.infoCardTitle}>Chief Complaint</AvText>
          <AvText type="body" style={styles.infoCardValue}>{sampleRecord.chiefComplaint}</AvText>
        </AvCard>
        <AvCard cardStyle={styles.infoCard}>
          <AvText type="Subtitle_1" style={styles.infoCardTitle}>Past History</AvText>
          <AvText type="body" style={styles.infoCardValue}>{sampleRecord.pastHistory}</AvText>
        </AvCard>
        <AvCard cardStyle={styles.infoCard}>
          <AvText type="Subtitle_1" style={styles.infoCardTitle}>Advice</AvText>
          <AvText type="body" style={styles.infoCardValue}>{sampleRecord.advice}</AvText>
        </AvCard>
        <AvCard cardStyle={styles.infoCard}>
          <AvText type="Subtitle_1" style={styles.infoCardTitle}>Plan</AvText>
          <AvText type="body" style={styles.infoCardValue}>{sampleRecord.plan}</AvText>
        </AvCard>
      </View>
    </View>
  );

  const renderPrescriptions = () => (
    <View style={styles.tabContent}>
      <AvCard cardStyle={styles.prescriptionCard}>
        <View style={styles.prescriptionHeader}>
          <AvText type="heading_6">Prescriptions</AvText>
          <TouchableOpacity style={styles.addPrescriptionButton}>
            <AvIcons type="MaterialIcons" name="add" size={20} color={COLORS.SECONDARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.prescriptionItem}>
          <AvText type="body" style={styles.prescriptionName}>Paracetamol 500mg</AvText>
          <AvText type="caption" style={styles.prescriptionDetails}>1-0-1 for 3 days</AvText>
        </View>
        <View style={styles.prescriptionItem}>
          <AvText type="body" style={styles.prescriptionName}>Ibuprofen 400mg</AvText>
          <AvText type="caption" style={styles.prescriptionDetails}>1-0-1 after food for 3 days</AvText>
        </View>
      </AvCard>
    </View>
  );

  const renderLabScan = () => (
    <View style={styles.tabContent}>
      <AvCard cardStyle={styles.labCard}>
        <View style={styles.labHeader}>
          <AvText type="heading_6">Lab Reports</AvText>
          <TouchableOpacity style={styles.addLabButton}>
            <AvIcons type="MaterialIcons" name="add" size={20} color={COLORS.SECONDARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.labItem}>
          <View style={styles.labIcon}>
            <AvIcons type="MaterialCommunityIcons" name="file-document" size={24} color={COLORS.PRIMARY_BLUE} />
          </View>
          <View style={styles.labDetails}>
            <AvText type="body" style={styles.labName}>CBC Report</AvText>
            <AvText type="caption" style={styles.labDate}>10/10/2025</AvText>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <AvIcons type="MaterialIcons" name="download" size={20} color={COLORS.SECONDARY} />
          </TouchableOpacity>
        </View>
        <View style={styles.labItem}>
          <View style={styles.labIcon}>
            <AvIcons type="MaterialCommunityIcons" name="file-document" size={24} color={COLORS.PRIMARY_BLUE} />
          </View>
          <View style={styles.labDetails}>
            <AvText type="body" style={styles.labName}>Lipid Profile</AvText>
            <AvText type="caption" style={styles.labDate}>10/10/2025</AvText>
          </View>
          <TouchableOpacity style={styles.downloadButton}>
            <AvIcons type="MaterialIcons" name="download" size={20} color={COLORS.SECONDARY} />
          </TouchableOpacity>
        </View>
      </AvCard>
    </View>
  );

  const renderBilling = () => (
    <View style={styles.tabContent}>
      <AvCard cardStyle={styles.billingCard}>
        <AvText type="heading_6" style={styles.billingTitle}>Billing Summary</AvText>
        <View style={styles.billingItem}>
          <AvText type="body">Consultation Fee</AvText>
          <AvText type="body">₹500</AvText>
        </View>
        <View style={styles.billingItem}>
          <AvText type="body">Medicine Charges</AvText>
          <AvText type="body">₹350</AvText>
        </View>
        <View style={styles.billingItem}>
          <AvText type="body">Lab Tests</AvText>
          <AvText type="body">₹800</AvText>
        </View>
        <View style={styles.billingTotal}>
          <AvText type="Subtitle_1">Total Amount</AvText>
          <AvText type="Subtitle_1">₹1,650</AvText>
        </View>
      </AvCard>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={PAGES.PATIENT_MEDICAL_RECORD}
        showBackButton={true}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderPatientHeader()}
        {renderVitalsSummary()}
        <Tabs
          tabs={[
            { key: 'medical-records', label: 'Medical Records' },
            { key: 'prescriptions', label: 'Prescriptions' },
            { key: 'lab-scan', label: 'Lab/Scan' },
            { key: 'billing', label: 'Billing' },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
<<<<<<< HEAD
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <PatientHeader navigation={navigation} currentPatient={currentPatient} />
          <VitalsSummary currentPatient={currentPatient} />
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {activeTab === 'medical-records' && <MedicalInformation currentPatient={currentPatient} record={record} />}
          {activeTab === 'prescriptions' && <Prescriptions currentPatient={currentPatient} />}
          {activeTab === 'lab-scan' && <LabScan currentPatient={currentPatient} />}
          {activeTab === 'billing' && <Billing currentPatient={currentPatient} />}
          {activeTab === 'video' && <VideoTab videoRecords={videoRecords} />}
          <View style={styles.buttonContainer}>
            <AvButton
              onPress={() => navigation.navigate(PAGES.PATIENT_SECOND_OPINION)}
            >
              Second Opinion
            </AvButton>
=======
        {activeTab === 'medical-records' && (
          <View style={styles.tabContent}>
            {renderMedicalInformation()}
>>>>>>> 6c4a9a52c5df149463269873e25212680d39bbcf
          </View>
        )}
        {activeTab === 'prescriptions' && renderPrescriptions()}
        {activeTab === 'lab-scan' && renderLabScan()}
        {activeTab === 'billing' && renderBilling()}
        <TouchableOpacity
          style={styles.secondOpinionButton}
          onPress={() => navigation.navigate(PAGES.PATIENT_SECOND_OPINION)}
        >
          <AvIcons type="MaterialIcons" name="medical-services" size={normalize(20)} color={COLORS.WHITE} />
          <AvText type="buttonText" style={styles.secondOpinionText}>Get Second Opinion</AvText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  scrollView: {
    flex: 1,
  },
<<<<<<< HEAD
  scrollContent: {
    paddingBottom: 20,
=======
  patientHeader: {
    backgroundColor: COLORS.SECONDARY,
    paddingBottom: normalize(20),
    marginBottom: normalize(16),
>>>>>>> 6c4a9a52c5df149463269873e25212680d39bbcf
  },
  headerContent: {
    paddingHorizontal: normalize(16),
  },
  backButton: {
    paddingVertical: normalize(12),
  },
  patientInfoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: normalize(16),
  },
  patientAvatar: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(8),
  },
  avatarText: {
    color: COLORS.SECONDARY,
    fontWeight: 'bold',
    fontSize: normalize(24),
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    marginBottom: normalize(8),
    fontSize: normalize(18),
  },
  patientMetaRow: {
    flexDirection: 'row',
    gap: normalize(16),
    marginBottom: normalize(12),
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    color: COLORS.WHITE,
    opacity: 0.8,
    fontSize: normalize(12),
  },
  metaValue: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
  visitInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: normalize(12),
  },
  visitInfoItem: {
    alignItems: 'center',
  },
  visitInfoLabel: {
    color: COLORS.WHITE,
    opacity: 0.8,
    fontSize: normalize(10),
  },
  visitInfoValue: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: normalize(12),
  },
  vitalsContainer: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(16),
  },
  vitalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(8),
    marginBottom: normalize(16),
  },
  sectionTitle: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: 'bold',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: normalize(12),
  },
  vitalCard: {
    padding: normalize(12),
    borderRadius: normalize(10),
    borderWidth: 1,
    elevation: 2,
    marginBottom: normalize(12),
    width: '48%',
  },
  vitalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: normalize(12),
  },
  vitalIconContainer: {
    width: normalize(36),
    height: normalize(36),
    borderRadius: normalize(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  vitalTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  vitalLabel: {
    fontSize: normalize(11),
    fontWeight: '500',
    marginBottom: normalize(2),
  },
  vitalValue: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    marginBottom: normalize(2),
  },
  vitalUnit: {
    fontSize: normalize(10),
  },
  medicalInfoContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(16),
    marginHorizontal: normalize(16),
    marginBottom: normalize(20),
    elevation: 1,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  medicalInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  viewOriginalButton: {
    backgroundColor: COLORS.PRIMARY_TXT,
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
    borderRadius: normalize(6),
  },
  viewOriginalText: {
    color: COLORS.WHITE,
    fontSize: normalize(10),
  },
  medicalInfoGrid: {
    gap: normalize(12),
  },
  infoCard: {
    borderLeftWidth: 0,
    padding: normalize(12),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
  },
  infoCardTitle: {
    color: COLORS.GREY,
    marginBottom: normalize(6),
    fontWeight: '500',
  },
  infoCardValue: {
    color: COLORS.PRIMARY_TXT,
    lineHeight: normalize(20),
  },
  secondOpinionButton: {
    backgroundColor: COLORS.PRIMARY_TXT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: normalize(14),
    borderRadius: normalize(8),
    gap: normalize(8),
    marginHorizontal: normalize(16),
    marginBottom: normalize(20),
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.PRIMARY_TXT,
  },
  secondOpinionText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  tabContent: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(20),
  },
  prescriptionCard: {
    padding: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
  },
  prescriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  prescriptionItem: {
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  prescriptionName: {
    fontWeight: 'bold',
    marginBottom: normalize(4),
  },
  prescriptionDetails: {
    color: COLORS.GREY,
  },
  labCard: {
    padding: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
  },
  labHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  labIcon: {
    marginRight: normalize(12),
  },
  labDetails: {
    flex: 1,
  },
  labName: {
    fontWeight: 'bold',
    marginBottom: normalize(2),
  },
  labDate: {
    color: COLORS.GREY,
  },
  downloadButton: {
    padding: normalize(8),
  },
  billingCard: {
    padding: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
  },
  billingTitle: {
    marginBottom: normalize(16),
  },
  billingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  billingTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: normalize(12),
    marginTop: normalize(8),
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
  },
});

export default MedicalRecordsScreen;
