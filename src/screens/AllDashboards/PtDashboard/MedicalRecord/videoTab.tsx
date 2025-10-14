import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AvCard from '../../../../elements/AvCards';
import AvText from '../../../../elements/AvText';
import AvIcons from '../../../../elements/AvIcons';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';

interface VideoRecord {
  id: string;
  date: string;
  type: string;
  doctorName: string;
}

interface VideoTabProps {
  videoRecords: VideoRecord[];
}

const VideoTab: React.FC<VideoTabProps> = ({ videoRecords }) => {
  return (
    <View style={styles.container}>
      {videoRecords.map((record, index) => (
        <AvCard key={record.id} cardStyle={styles.card}>
          <View style={styles.header}>
            <AvText type="heading_6" style={styles.doctorName}>
              Dr. {record.doctorName}
            </AvText>
            <TouchableOpacity
              style={styles.viewRecordingButton}
              onPress={() => {
                console.log(`View recording for ${record.id}`);
              }}
            >
              <AvIcons
                type="MaterialIcons"
                name="videocam"
                size={normalize(16)}
                color={COLORS.WHITE}
              />
              <AvText type="caption" style={styles.viewRecordingText}>
                View Recording
              </AvText>
            </TouchableOpacity>
          </View>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <AvText type="caption" style={styles.detailLabel}>
                TYPE
              </AvText>
              <AvText type="body" style={styles.detailValue}>
                {record.type}
              </AvText>
            </View>
            <View style={styles.detailRow}>
              <AvText type="caption" style={styles.detailLabel}>
                DATE
              </AvText>
              <AvText type="body" style={styles.detailValue}>
                {record.date}
              </AvText>
            </View>
          </View>
        </AvCard>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: normalize(10),
  },
  card: {
    marginBottom: normalize(10),
    padding: normalize(12),
    borderRadius: normalize(10),
    borderLeftWidth: normalize(4),
    borderLeftColor: COLORS.PRIMARY,
    backgroundColor: COLORS.WHITE,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(12),
  },
  doctorName: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: 'bold',
  },
  viewRecordingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: normalize(10),
    paddingVertical: normalize(6),
    borderRadius: normalize(15),
  },
  viewRecordingText: {
    color: COLORS.WHITE,
    marginLeft: normalize(5),
  },
  details: {
    marginTop: normalize(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(6),
  },
  detailLabel: {
    color: COLORS.SECONDARY_TXT,
    fontSize: normalize(12),
  },
  detailValue: {
    color: COLORS.PRIMARY_TXT,
    fontSize: normalize(12),
  },
});

export default VideoTab;
