import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';

interface PatientHeaderProps {
  navigation: any;
  currentPatient: any;
}

const PatientHeader: React.FC<PatientHeaderProps> = ({ navigation, currentPatient }) => {
  const sampleRecord = {
    patientName: currentPatient?.name || 'Sahana Kadrolli',
    patientInitials: currentPatient?.name ? currentPatient.name.charAt(0) + (currentPatient.name.split(' ')[1] ? currentPatient.name.split(' ')[1].charAt(0) : '') : 'SK',
    age: currentPatient?.age || '32',
    gender: currentPatient?.gender || 'Female',
    hospital: 'AV Hospital',
    visitDate: '10/10/2025',
    diagnosis: 'Migraine',
  };

  return (
    <View style={styles.patientHeader}>
      <View style={styles.headerContent}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} />
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
};

const styles = StyleSheet.create({
  patientHeader: {
    backgroundColor: COLORS.SECONDARY,
    paddingBottom: normalize(20),
    marginBottom: normalize(16),
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
});

export default PatientHeader;
