import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { Tabs } from '../../../../components/CommonComponents/Tabs';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import Header from '../../../../components/Header';
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

const MedicalRecordsDetails: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('medical-records');
  const dispatch = useAppDispatch();
  const id = useAppSelector((state) => state.user.userProfile.patientId);
  const { currentPatient } = useAppSelector((state) => state.currentPatient || {});
  const { allPatients } = useAppSelector((state) => state.patient);
  const userEmail = useAppSelector((state) => state.user.userProfile.email);

  useEffect(() => {
    if (id) {
      dispatch(fetchAllPatients());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (allPatients?.length > 0 && userEmail) {
      const currentPatient = allPatients.find((item: any) => userEmail === item.email);
      if (currentPatient) {
        dispatch(setCurrentPatient(currentPatient));
        dispatch(setUserProfile({ patientId: currentPatient.id }));
      }
    }
  }, [allPatients, userEmail, dispatch]);

  useEffect(() => {
    if (currentPatient?.id) {
      dispatch(fetchPatientDashboardData(currentPatient.id));
      dispatch(fetchMedicalInfo(currentPatient.id));
    }
  }, [currentPatient?.id, dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(fetchPatientPersonalHealthData(id));
    }
  }, [dispatch, id]);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Header
          title={PAGES.PATIENT_MEDICAL_RECORD}
          showBackButton={true}
          backgroundColor={COLORS.WHITE}
          titleColor={COLORS.BLACK}
        />
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <PatientHeader navigation={navigation} currentPatient={currentPatient} />
          <VitalsSummary currentPatient={currentPatient} />
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
          {activeTab === 'medical-records' && <MedicalInformation currentPatient={currentPatient} />}
          {activeTab === 'prescriptions' && <Prescriptions currentPatient={currentPatient} />}
          {activeTab === 'lab-scan' && <LabScan currentPatient={currentPatient} />}
          {activeTab === 'billing' && <Billing currentPatient={currentPatient} />}

          {/* Second Opinion Button */}
          <View style={styles.buttonContainer}>
            <AvButton>Second Opinion</AvButton>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20, // Add padding to prevent content from touching the bottom of the screen
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});

export default MedicalRecordsDetails;
