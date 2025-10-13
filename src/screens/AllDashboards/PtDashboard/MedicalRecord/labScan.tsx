import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvIcons from '../../../../elements/AvIcons';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { fetchLabScans } from '../../../../store/thunks/patientThunks';

const LabScan: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentPatient = useAppSelector((state) => state.currentPatient.currentPatient);
  const { labScanData, loading, error } = useAppSelector((state) => state.labScan);

  useEffect(() => {
    if (currentPatient?.id) {
      dispatch(fetchLabScans(currentPatient.id));
    }
  }, [currentPatient?.id, dispatch]);

  const formatDate = (date: string | number[]) => {
    if (Array.isArray(date)) return date.join('/');
    return date;
  };

  if (loading) {
    return (
      <View style={{ padding: normalize(16) }}>
        <AvText>Loading lab scans...</AvText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ padding: normalize(16) }}>
        <AvText>Error: {error}</AvText>
      </View>
    );
  }

  if (!labScanData || labScanData.length === 0) {
    return (
      <View style={{ padding: normalize(16) }}>
        <AvText>No lab scans found.</AvText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {labScanData.map((report, index) => (
        <AvCard key={index} cardStyle={styles.labReportCard}>
          {/* Header: Test Name and Status */}
          <View style={styles.header}>
            <AvText type="subtitle" style={styles.testName}>{report.testName}</AvText>
            <View
              style={[
                styles.statusContainer,
                { backgroundColor: report.status === 'Pending' ? COLORS.LIGHT_YELLOW : COLORS.LIGHT_GREEN },
              ]}
            >
              <AvText
                type="caption"
                style={[
                  styles.statusText,
                  { color: report.status === 'Pending' ? COLORS.WARNING : COLORS.GREEN },
                ]}
              >
                {report.status}
              </AvText>
            </View>
          </View>
          {/* Details Section */}
          <View style={styles.detailsContainer}>
            {/* Date and Result */}
            <View style={styles.detailRow}>
              <View style={styles.leftColumn}>
                <AvText type="body" style={styles.detailLabel}>Date</AvText>
                <AvText type="body" style={styles.detailValue}>{formatDate(report.date)}</AvText>
              </View>
              <View style={styles.rightColumn}>
                <AvText type="body" style={styles.detailLabel}>Result</AvText>
                <AvText type="body" style={styles.detailValue}>{report.result}</AvText>
              </View>
            </View>
            {/* Normal Range and Print */}
            <View style={styles.detailRow}>
              <View style={styles.leftColumn}>
                <AvText type="body" style={styles.detailLabel}>Normal range</AvText>
                <AvText type="body" style={styles.detailValue}>{report.normalRange}</AvText>
              </View>
              <View style={styles.rightColumn}>
                <AvText type="body" style={styles.detailLabel}>Print</AvText>
                <TouchableOpacity style={styles.printButton}>
                  <AvIcons type="MaterialIcons" name="print" size={20} color={COLORS.BLACK} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </AvCard>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: normalize(16),
    marginBottom: normalize(20),
  },
  labReportCard: {
    padding: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    marginBottom: normalize(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  testName: {
    fontWeight: 'bold',
    fontSize: normalize(16),
    color: COLORS.BLACK,
  },
  statusContainer: {
    borderRadius: normalize(12),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(4),
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: normalize(12),
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
    paddingTop: normalize(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    flex: 1,
  },
  rightColumn: {
    flex: 1,
  },
  detailLabel: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  detailValue: {
    fontWeight: 'bold',
    fontSize: normalize(12),
    color: COLORS.BLACK,
    marginTop: normalize(2),
  },
  printButton: {
    padding: normalize(4),
    marginTop: normalize(2),
  },
});

export default LabScan;
