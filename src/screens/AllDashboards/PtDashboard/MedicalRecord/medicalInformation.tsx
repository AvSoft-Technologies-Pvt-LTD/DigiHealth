

import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { fetchMedicalInfo } from "../../../../store/thunks/patientThunks";
import { AvText, AvCards } from '../../../../elements';

interface MedicalInformationProps {
  currentPatient: any;
  record?: any;
}

const MedicalInformation: React.FC<MedicalInformationProps> = ({ currentPatient, record }) => {
  const dispatch = useAppDispatch();
  const { medicalInfoData, loading, error } = useAppSelector((state) => state.medicalInfo);

  useEffect(() => {
    if (currentPatient?.id) {
      dispatch(fetchMedicalInfo(currentPatient.id));
    }
  }, [currentPatient?.id, dispatch]);

  const sampleRecord = {
    chiefComplaint: medicalInfoData?.chiefComplaint || record?.chiefComplaint || '',
    pastHistory: medicalInfoData?.pastHistory || record?.pastHistory || 'Hypertension (5 years), No known allergies',
    advice: medicalInfoData?.advice || record?.advice || '1. Rest in dark room\n2. Hydration (3L/day)\n3. Avoid caffeine\n4. Cold compress',
    plan: medicalInfoData?.plan || record?.plan || '1. Follow-up in 1 week\n2. Neurology consult if symptoms persist\n3. MRI if needed',
    diagnosis: medicalInfoData?.diagnosis || record?.diagnosis || 'Migraine',
    treatmentGiven: medicalInfoData?.treatmentGiven || record?.treatmentGiven || 'Paracetamol 500mg, Ibuprofen 400mg',
    doctorNotes: medicalInfoData?.doctorNotes || record?.doctorNotes || 'Patient responded well to treatment. No side effects observed.',
    initialAssessment: medicalInfoData?.initialAssessment || record?.initialAssessment || 'Patient presented with severe headache and nausea.',
    systematicExamination: medicalInfoData?.systematicExamination || record?.systematicExamination || 'Neurological examination was normal. No focal deficits.',
    investigations: medicalInfoData?.investigations || record?.investigations || 'CBC, Lipid Profile',
    treatmentAdvice: medicalInfoData?.treatmentAdvice || record?.treatmentAdvice || 'Continue with prescribed medications. Follow-up in one week.',
    dischargeSummary: record?.type === 'IPD' ? (medicalInfoData?.dischargeSummary || record?.dischargeSummary || 'Patient discharged with medications and advice for follow-up.') : undefined,
  };

  return (
    <View style={styles.medicalInfoContainer}>
      <View style={styles.medicalInfoHeader}>
        <AvText type="heading_6" style={styles.sectionTitle}>📋 Medical Information</AvText>
        <TouchableOpacity style={styles.viewOriginalButton}>
          <AvText type="caption" style={styles.viewOriginalText}>View Original</AvText>
        </TouchableOpacity>
      </View>
      {loading ? (
        <AvText type="body" style={styles.loadingText}>Loading medical info...</AvText>
      ) : error ? (
        <AvText type="body" style={styles.errorText}>{error}</AvText>
      ) : (
        <View style={styles.medicalInfoGrid}>
          <AvCards title="Chief Complaint" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Chief Complaint</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.chiefComplaint}</AvText>
          </AvCards>
          <AvCards title="Past History" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Past History</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.pastHistory}</AvText>
          </AvCards>
          <AvCards title="Advice" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Advice</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.advice}</AvText>
          </AvCards>
          <AvCards title="Plan" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Plan</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.plan}</AvText>
          </AvCards>
          <AvCards title="Diagnosis" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Diagnosis</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.diagnosis}</AvText>
          </AvCards>
          <AvCards title="Treatment Given" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Treatment Given</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.treatmentGiven}</AvText>
          </AvCards>
          <AvCards title="Doctor Notes" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Doctor Notes</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.doctorNotes}</AvText>
          </AvCards>
          <AvCards title="Initial Assessment" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Initial Assessment</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.initialAssessment}</AvText>
          </AvCards>
          <AvCards title="Systematic Examination" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Systematic Examination</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.systematicExamination}</AvText>
          </AvCards>
          <AvCards title="Investigations" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Investigations</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.investigations}</AvText>
          </AvCards>
          <AvCards title="Treatment Advice" cardStyle={styles.infoCard}>
            <AvText type="Subtitle_1" style={styles.infoCardTitle}>Treatment Advice</AvText>
            <AvText type="body" style={styles.infoCardValue}>{sampleRecord.treatmentAdvice}</AvText>
          </AvCards>
          {sampleRecord.dischargeSummary && (
            <AvCards title="Discharge Summary" cardStyle={styles.infoCard}>
              <AvText type="Subtitle_1" style={styles.infoCardTitle}>Discharge Summary</AvText>
              <AvText type="body" style={styles.infoCardValue}>{sampleRecord.dischargeSummary}</AvText>
            </AvCards>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  loadingText: {
    color: COLORS.GREY,
    textAlign: 'center',
    padding: normalize(16),
  },
  errorText: {
    color: COLORS.ERROR,
    textAlign: 'center',
    padding: normalize(16),
  },
  sectionTitle: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: 'bold',
  },
});

export default MedicalInformation;
