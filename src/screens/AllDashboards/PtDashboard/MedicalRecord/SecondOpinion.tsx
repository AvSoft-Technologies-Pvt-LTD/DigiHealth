import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AvModal from '../../../../elements/AvModal';
import AvText from '../../../../elements/AvText';
import AvButton from '../../../../elements/AvButton';
import { AvSelect } from '../../../../elements/AvSelect';
import AvTextInput from '../../../../elements/AvTextInput';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import {PAGES} from '../../../../constants/pages'
import Header from '../../../../components/Header';

interface MedicalRecord {
  patientName: string;
  age: string;
  gender: string;
  hospital: string;
  visitDate: string;
  diagnosis: string;
  chiefComplaint: string;
  pastHistory: string;
  socialHistory: string;
  familyHistory: string;
  systemicExamination: string;
  investigations: string;
  treatmentAdvice: string;
  dischargeSummary: string;
}

interface Prescription {
  date: string;
  doctorName: string;
  medicines: string;
  instructions: string;
}

interface LabTest {
  date: string;
  testName: string;
  result: string;
  normalRange: string;
  status: string;
}

interface SecondOpinionForm {
  consultingDoctor: string;
  urgencyLevel: string;
  consultationMode: string;
  attachedReports: string;
}

const MedicalRecordsPreview: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showSecondOpinionForm, setShowSecondOpinionForm] = useState(true);
  const [secondOpinionForm, setSecondOpinionForm] = useState<SecondOpinionForm>({
    consultingDoctor: '',
    urgencyLevel: '',
    consultationMode: '',
    attachedReports: '',
  });

  const doctors = [
    { label: 'Dr. Smith', value: 'dr_smith' },
    { label: 'Dr. Johnson', value: 'dr_johnson' },
    { label: 'Dr. Williams', value: 'dr_williams' },
  ];

  const urgencyLevels = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Critical', value: 'critical' },
  ];

  const consultationModes = [
    { label: 'Video Call', value: 'video' },
    { label: 'Audio Call', value: 'audio' },
    { label: 'Chat', value: 'chat' },
    { label: 'In-Person', value: 'in_person' },
  ];

  const medicalRecord: MedicalRecord = {
    patientName: 'N/A',
    age: '---',
    gender: '---',
    hospital: 'AV Hospital',
    visitDate: 'dateOfVisit 1',
    diagnosis: 'diagnosis 12',
    chiefComplaint: 'High fever with chills, body ache, and headache for 3 days',
    pastHistory: 'No significant past medical or surgical history, No known allergies',
    socialHistory: 'Denies Fever Confirmatory IgG antigen and IgM positivity',
    familyHistory: 'No family history of fever, complains have over affected',
    systemicExamination: 'Mild hepatomegaly, no signs of liver or bleeding',
    investigations: 'CBC, Dengue IgG Antigen, Platelet count, Platelet Count',
    treatmentAdvice: 'Maintain hydration, avoid NSAIDs, and monitor platelet count daily',
    dischargeSummary: 'Patient admitted with dengue fever, treated with supportive care, Patient is stable and ready for discharge',
  };

  const prescriptions: Prescription[] = [
    {
      date: '2024-01-15',
      doctorName: 'Dr. Smith',
      medicines: 'Paracetamol 500mg',
      instructions: 'Take twice daily after meals',
    },
  ];

  const labTests: LabTest[] = [
    {
      date: '2024-01-15',
      testName: 'Complete Blood Count',
      result: '12.5',
      normalRange: '12-16 g/dL',
      status: 'Normal',
    },
  ];

  const handlePreviewMedicalRecords = () => {
    setIsModalVisible(true);
  };

  const handleSecondOpinion = () => {
    setIsModalVisible(false);
    setShowSecondOpinionForm(true);
  };

  const handleFormSubmit = () => {
    console.log('Second Opinion Form Submitted:', secondOpinionForm);
    setShowSecondOpinionForm(false);
  };

  const renderMedicalInfo = () => (
    <View style={styles.section}>
      <AvText type="heading_6" style={styles.sectionTitle}>Medical Information</AvText>
      <View style={styles.infoGrid}>
        {[
          { label: 'Chief Complaint', value: medicalRecord.chiefComplaint },
          { label: 'Past History', value: medicalRecord.pastHistory },
          { label: 'Diagnosis', value: medicalRecord.diagnosis },
          { label: 'Social History', value: medicalRecord.socialHistory },
          { label: 'Family History', value: medicalRecord.familyHistory },
          { label: 'Systemic Examination', value: medicalRecord.systemicExamination },
          { label: 'Investigations', value: medicalRecord.investigations },
          { label: 'Treatment Advice', value: medicalRecord.treatmentAdvice },
          { label: 'Discharge Summary', value: medicalRecord.dischargeSummary },
        ].map((item, index) => (
          <View key={index} style={styles.infoItem}>
            <AvText type="body" style={styles.label}>{item.label}</AvText>
            <View style={styles.valueContainer}>
              <AvText type="body" style={styles.value}>{item.value}</AvText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderPrescriptions = () => (
    <View style={styles.section}>
      <AvText type="heading_6" style={styles.sectionTitle}>Prescriptions</AvText>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <AvText type="body" style={[styles.tableHeaderText, styles.dateCol]}>DATE</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.doctorCol]}>DOCTOR NAME</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.medicineCol]}>MEDICINES</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.instructionsCol]}>INSTRUCTIONS</AvText>
        </View>
        {prescriptions.length > 0 ? (
          prescriptions.map((prescription, index) => (
            <View key={index} style={styles.tableRow}>
              <AvText type="body" style={[styles.tableCell, styles.dateCol]}>{prescription.date}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.doctorCol]}>{prescription.doctorName}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.medicineCol]}>{prescription.medicines}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.instructionsCol]}>{prescription.instructions}</AvText>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <AvText type="body" style={styles.noDataText}>No records found</AvText>
          </View>
        )}
      </View>
    </View>
  );

  const renderLabTests = () => (
    <View style={styles.section}>
      <AvText type="heading_6" style={styles.sectionTitle}>Lab Tests</AvText>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <AvText type="body" style={[styles.tableHeaderText, styles.dateCol]}>DATE</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.testCol]}>TEST NAME</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.resultCol]}>RESULT</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.rangeCol]}>NORMAL RANGE</AvText>
          <AvText type="body" style={[styles.tableHeaderText, styles.statusCol]}>STATUS</AvText>
        </View>
        {labTests.length > 0 ? (
          labTests.map((test, index) => (
            <View key={index} style={styles.tableRow}>
              <AvText type="body" style={[styles.tableCell, styles.dateCol]}>{test.date}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.testCol]}>{test.testName}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.resultCol]}>{test.result}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.rangeCol]}>{test.normalRange}</AvText>
              <AvText type="body" style={[styles.tableCell, styles.statusCol]}>{test.status}</AvText>
            </View>
          ))
        ) : (
          <View style={styles.noDataContainer}>
            <AvText type="body" style={styles.noDataText}>No records found</AvText>
          </View>
        )}
      </View>
    </View>
  );

  const renderPatientInfo = () => (
    <View style={styles.patientInfoContainer}>
      <View style={styles.patientInfoHeader}>
        <AvText type="heading_6" style={styles.patientInfoTitle}>
          Patient Information (Auto-attached)
        </AvText>
      </View>
      <View style={styles.patientInfoContent}>
        <View style={styles.patientInfoLeft}>
          <AvText type="body" style={styles.patientInfoLabel}>Patient Name: <AvText type="body" style={styles.patientInfoValue}>{medicalRecord.patientName}</AvText></AvText>
          <AvText type="body" style={styles.patientInfoLabel}>Age: <AvText type="body" style={styles.patientInfoValue}>{medicalRecord.age}</AvText></AvText>
          <AvText type="body" style={styles.patientInfoLabel}>Gender: <AvText type="body" style={styles.patientInfoValue}>{medicalRecord.gender}</AvText></AvText>
        </View>
        <View style={styles.patientInfoRight}>
          <AvText type="body" style={styles.patientInfoLabel}>Hospital: <AvText type="body" style={styles.patientInfoValue}>{medicalRecord.hospital}</AvText></AvText>
          <AvText type="body" style={styles.patientInfoLabel}>Visit Date: <AvText type="body" style={styles.patientInfoValue}>{medicalRecord.visitDate}</AvText></AvText>
          <AvText type="body" style={styles.patientInfoLabel}>Diagnosis: <AvText type="body" style={styles.patientInfoValue}>{medicalRecord.diagnosis}</AvText></AvText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={PAGES.PATIENT_SECOND_OPINION}
        showBackButton={true}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />
      {showSecondOpinionForm && (
        <ScrollView style={styles.formContainer}>
          <AvText type="heading_5" style={styles.formTitle}>Second Opinion Request</AvText>
          <View style={styles.autoAttachedBanner}>
            <AvText type="body" style={styles.bannerText}>Medical Records Automatically Attached</AvText>
            <AvText type="caption" style={styles.bannerSubtext}>Patient information, vitals, and medical history will be included</AvText>
            <AvButton
              mode="contained"
              onPress={handlePreviewMedicalRecords}
              style={styles.previewButtonInBanner}
              buttonColor="#22c55e"
            >
              Preview Medical Records
            </AvButton>
          </View>
          {renderPatientInfo()}
          <View style={styles.formFieldsContainer}>
            <AvSelect
              label="Select Consulting Doctor"
              required
              items={doctors}
              selectedValue={secondOpinionForm.consultingDoctor}
              onValueChange={(value) => setSecondOpinionForm({...secondOpinionForm, consultingDoctor: value})}
              placeholder="Select a doctor..."
              style={styles.formField}
            />
            <AvSelect
              label="Urgency Level"
              required
              items={urgencyLevels}
              selectedValue={secondOpinionForm.urgencyLevel}
              onValueChange={(value) => setSecondOpinionForm({...secondOpinionForm, urgencyLevel: value})}
              placeholder="Select urgency level"
              style={styles.formField}
            />
            <AvSelect
              label="Preferred Consultation Mode"
              required
              items={consultationModes}
              selectedValue={secondOpinionForm.consultationMode}
              onValueChange={(value) => setSecondOpinionForm({...secondOpinionForm, consultationMode: value})}
              placeholder="Select consultation mode"
              style={styles.formField}
            />
            <View style={styles.formField}>
              <AvText type="body" style={styles.fieldLabel}>Attach Additional Reports (Optional)</AvText>
              <TouchableOpacity style={styles.attachButton}>
                <AvText type="body" style={styles.attachButtonText}>Attach Document</AvText>
              </TouchableOpacity>
            </View>
            <View style={styles.formField}>
            
            </View>
          </View>
          <View style={styles.formActions}>
            <AvButton
              mode="contained"
              onPress={handleFormSubmit}
              style={styles.submitButton}
              buttonColor={COLORS.PRIMARY}
            >
              Print Preview & Send
            </AvButton>
          </View>
        </ScrollView>
      )}
      <AvModal
        isModalVisible={isModalVisible}
        setModalVisible={setIsModalVisible}
        title="Medical Records Preview"
        modalStyles={styles.modalContainer}
      >
        <ScrollView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.vitalsHeader}>
              <AvText type="heading_6" style={styles.vitalsTitle}>{medicalRecord.patientName}</AvText>
              <View style={styles.vitalsInfo}>
                <View style={styles.vitalsInfoLeft}>
                  <AvText type="body" style={styles.vitalsText}>Age: {medicalRecord.age}</AvText>
                  <AvText type="body" style={styles.vitalsText}>Gender: {medicalRecord.gender}</AvText>
                </View>
                <View style={styles.vitalsInfoRight}>
                  <AvText type="body" style={styles.vitalsText}>Hospital: {medicalRecord.hospital}</AvText>
                  <AvText type="body" style={styles.vitalsText}>Visit Date: {medicalRecord.visitDate}</AvText>
                </View>
              </View>
            </View>
          </View>
          {renderMedicalInfo()}
          {renderPrescriptions()}
          {renderLabTests()}
          <View style={styles.modalActions}>
            <AvButton
              mode="contained"
              onPress={handleSecondOpinion}
              style={styles.secondOpinionButton}
              buttonColor={COLORS.PRIMARY}
            >
              Request Second Opinion
            </AvButton>
          </View>
        </ScrollView>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  formContainer: {
    flex: 1,
    padding: normalize(20),
    backgroundColor: COLORS.WHITE,
  },
  formTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    marginBottom: normalize(20),
    color: COLORS.BLACK,
  },
  autoAttachedBanner: {
    backgroundColor: '#dcfce7',
    padding: normalize(16),
    borderRadius: normalize(8),
    marginBottom: normalize(20),
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  bannerText: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: '#166534',
    marginBottom: normalize(4),
  },
  bannerSubtext: {
    fontSize: normalize(12),
    color: '#166534',
    marginBottom: normalize(12),
  },
  previewButtonInBanner: {
    alignSelf: 'flex-end',
  },
  patientInfoContainer: {
    backgroundColor: '#059669',
    borderRadius: normalize(12),
    padding: normalize(16),
    marginBottom: normalize(20),
  },
  patientInfoHeader: {
    marginBottom: normalize(12),
  },
  patientInfoTitle: {
    color: COLORS.WHITE,
    fontSize: normalize(16),
    fontWeight: 'bold',
  },
  patientInfoContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  patientInfoLeft: {
    flex: 1,
  },
  patientInfoRight: {
    flex: 1,
  },
  patientInfoLabel: {
    color: COLORS.WHITE,
    fontSize: normalize(12),
    marginBottom: normalize(6),
  },
  patientInfoValue: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  formFieldsContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    padding: normalize(16),
    marginBottom: normalize(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  formField: {
    marginBottom: normalize(16),
  },
  fieldLabel: {
    fontSize: normalize(14),
    fontWeight: '600',
    color: COLORS.BLACK,
    marginBottom: normalize(8),
  },
  attachButton: {
    borderWidth: 1,
    borderColor: COLORS.PRIMARY,
    borderRadius: normalize(8),
    padding: normalize(12),
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
  },
  attachButtonText: {
    color: COLORS.PRIMARY,
    fontSize: normalize(14),
    fontWeight: '600',
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(12),
    height: normalize(100), // Fixed height
    textAlignVertical: 'top',
    backgroundColor: COLORS.WHITE,
  },
  formActions: {
    paddingHorizontal: normalize(20),
    marginBottom: normalize(20),
  },
  submitButton: {
    marginVertical: normalize(8),
  },
  modalContainer: {
    maxHeight: '90%',
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalContent: {
    padding: normalize(20),
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: normalize(20),
    borderTopRightRadius: normalize(20),
  },
  modalHeader: {
    marginBottom: normalize(20),
  },
  vitalsHeader: {
    backgroundColor: '#059669',
    borderRadius: normalize(12),
    padding: normalize(16),
  },
  vitalsTitle: {
    color: COLORS.WHITE,
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginBottom: normalize(12),
  },
  vitalsInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  vitalsInfoLeft: {
    flex: 1,
  },
  vitalsInfoRight: {
    flex: 1,
  },
  vitalsText: {
    color: COLORS.WHITE,
    fontSize: normalize(12),
    marginBottom: normalize(6),
  },
  section: {
    marginBottom: normalize(24),
  },
  sectionTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(12),
    color: COLORS.BLACK,
  },
  infoGrid: {
    gap: normalize(12),
  },
  infoItem: {
    marginBottom: normalize(16),
  },
  label: {
    fontSize: normalize(12),
    fontWeight: '600',
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  valueContainer: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(12),
  },
  value: {
    fontSize: normalize(14),
    color: COLORS.BLACK,
    lineHeight: normalize(20),
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.LIGHT_GREY,
    padding: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.GREY,
  },
  tableHeaderText: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: COLORS.DARK_GREY,
  },
  tableRow: {
    flexDirection: 'row',
    padding: normalize(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    backgroundColor: COLORS.WHITE,
  },
  tableCell: {
    fontSize: normalize(12),
    color: COLORS.BLACK,
  },
  dateCol: {
    flex: 1.5,
  },
  doctorCol: {
    flex: 2,
  },
  medicineCol: {
    flex: 2,
  },
  instructionsCol: {
    flex: 2.5,
  },
  testCol: {
    flex: 2.5,
  },
  resultCol: {
    flex: 1.5,
  },
  rangeCol: {
    flex: 2,
  },
  statusCol: {
    flex: 1.5,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: normalize(20),
    backgroundColor: COLORS.WHITE,
  },
  noDataText: {
    fontSize: normalize(14),
    color: COLORS.GREY,
  },
  modalActions: {
    marginTop: normalize(10),
    marginBottom: normalize(20),
  },
  secondOpinionButton: {
    marginVertical: normalize(8),
  },
});

export default MedicalRecordsPreview;
