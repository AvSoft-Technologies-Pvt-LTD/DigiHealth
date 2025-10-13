import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { fetchPrescriptions } from '../../../../store/thunks/patientThunks';

interface Patient {
  id: string;
}

interface PrescriptionsProps {
  currentPatient?: Patient;
}

const Prescriptions: React.FC<PrescriptionsProps> = ({ currentPatient }) => {
  const reduxPatientId = useAppSelector(state => state.user.userProfile.patientId);
  const patientId = currentPatient?.id || reduxPatientId;

  const { prescriptionData, loading, error } = useAppSelector(state => state.prescription);
  const dispatch = useAppDispatch();

  // Fetch prescriptions whenever patientId changes
  useEffect(() => {
    if (patientId) {
      console.log('Dispatching fetchPrescriptions for patientId:', patientId);
      dispatch(fetchPrescriptions(patientId));
    }
  }, [patientId, dispatch]);

  // Debug logs for Redux state
  useEffect(() => {
    if (prescriptionData) console.log('Fetched prescriptions:', prescriptionData);
  }, [prescriptionData]);

  useEffect(() => {
    if (error) console.log('Redux prescription error:', error);
  }, [error]);

  // Format date string to YYYY-MM-DD if needed
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // If date comes as "2025-10-12", just return it; otherwise parse
    return dateStr;
  };

  return (
    <View style={styles.container}>
      {loading && <AvText>Loading prescriptions...</AvText>}
      {error && <AvText>Error: {error}</AvText>}
      {!loading && !error && (!prescriptionData || prescriptionData.length === 0) && (
        <AvText>No prescriptions found.</AvText>
      )}

      <ScrollView contentContainerStyle={styles.tabContent}>
        {(prescriptionData || []).map(prescription => (
          <AvCard key={prescription.id} cardStyle={styles.prescriptionCard}>
            <View style={styles.header}>
              <AvText type="subtitle" style={styles.doctorName}>
                {prescription.doctorName}
              </AvText>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.labelValuePair}>
                  <AvText type="body" style={styles.detailLabel}>DATE</AvText>
                  <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
                    {formatDate(prescription.date)}
                  </AvText>
                </View>
                <View style={styles.labelValuePair}>
                  <AvText type="body" style={styles.detailLabel}>MEDICINES</AvText>
                  <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
                    {prescription.medicines}
                  </AvText>
                </View>
              </View>
              <View style={[styles.detailRow, { marginTop: normalize(12), flexDirection: 'column' }]}>
                <AvText type="body" style={styles.detailLabel}>INSTRUCTIONS</AvText>
                <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
                  {prescription.instructions}
                </AvText>
              </View>
            </View>
          </AvCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(16),
    marginTop: normalize(16),
    marginBottom: normalize(20),
    backgroundColor: 'white',
    borderRadius: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tabContent: {
    paddingVertical: normalize(8),
  },
  prescriptionCard: {
    padding: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    backgroundColor: 'white',
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: normalize(12),
  },
  doctorName: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
    paddingTop: normalize(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelValuePair: {
    flex: 1,
  },
  detailLabel: {
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  detailValue: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: COLORS.BLACK,
  },
});

export default Prescriptions;
