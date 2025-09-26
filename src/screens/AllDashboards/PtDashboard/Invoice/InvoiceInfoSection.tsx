import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { Invoice } from './types';

interface InvoiceInfoSectionProps {
  invoice: Invoice;
}

const InvoiceInfoSection: React.FC<InvoiceInfoSectionProps> = ({ invoice }) => {
  return (
    <View style={styles.detailsSection}>
      <View style={styles.detailsColumn}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleWithIcon}>INVOICE DETAILS</Text>
        </View>
        <View style={styles.detailRowWithIcon}>
          <Icon name="calendar" size={16} color={COLORS.GREY} />
          <Text style={styles.detailLabel}>Date:</Text>
          <Text style={styles.detailText}>{invoice.date}</Text>
        </View>
        <View style={styles.detailRowWithIcon}>
          <Icon name="calendar-clock" size={16} color={COLORS.GREY} />
          <Text style={styles.detailLabel}>Due:</Text>
          <Text style={styles.detailText}>{invoice.dueDate}</Text>
        </View>
        <View style={styles.detailRowWithIcon}>
          <Icon name="account-tie" size={16} color={COLORS.GREY} />
          <Text style={styles.detailLabel}>Doctor:</Text>
          <Text style={styles.detailText}>{invoice.doctorName}</Text>
        </View>
      </View>
      <View style={{ width: 20 }} />
      <View style={styles.detailsColumn}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitleWithIcon}>PATIENT INFORMATION</Text>
        </View>
        <View style={styles.detailRowWithIcon}>
          <Icon name="account" size={16} color={COLORS.GREY} />
          <Text style={styles.detailText}>{invoice.patientName}</Text>
        </View>
        <View style={styles.detailRowWithIcon}>
          <Icon name="email" size={16} color={COLORS.GREY} />
          <Text style={styles.detailText}>{invoice.patientEmail}</Text>
        </View>
        <View style={styles.detailRowWithIcon}>
          <Icon name="phone" size={16} color={COLORS.GREY} />
          <Text style={styles.detailText}>{invoice.patientPhone}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(20),
  },
  detailsColumn: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  sectionTitleWithIcon: {
    fontSize: normalize(10),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  detailRowWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: normalize(8),
    marginBottom: normalize(2),
  },
  detailLabel: {
    fontSize: normalize(10),
    color: COLORS.GREY,
    marginLeft: normalize(5),
    minWidth: normalize(30),
  },
  detailText: {
    fontSize: normalize(9),
    color: COLORS.GREY,
    flex: 1,
  },
});

export default InvoiceInfoSection;
