import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { Invoice } from './types';
import { AvIcons, AvText } from '../../../../elements';

interface InvoiceInfoSectionProps {
  invoice: Invoice;
}

const InvoiceInfoSection: React.FC<InvoiceInfoSectionProps> = ({ invoice }) => {
  return (
    <View style={styles.detailsSection}>
      <View style={styles.detailsColumn}>
        <View style={styles.sectionHeader}>
          <AvText style={styles.sectionTitleWithIcon}>INVOICE DETAILS</AvText>
        </View>
        <View style={styles.detailRowWithIcon}>
          <AvIcons type="MaterialCommunityIcons" name="calendar" size={16} color={COLORS.GREY} />
          <AvText style={styles.detailLabel}>Date:</AvText>
          <AvText style={styles.detailText}>{invoice.date}</AvText>
        </View>
        <View style={styles.detailRowWithIcon}>
          <AvIcons type="MaterialCommunityIcons" name="calendar-clock" size={16} color={COLORS.GREY} />
          <AvText style={styles.detailLabel}>Due:</AvText>
          <AvText style={styles.detailText}>{invoice.dueDate}</AvText>
        </View>
        <View style={styles.detailRowWithIcon}>
          <AvIcons type="MaterialCommunityIcons" name="account-tie" size={16} color={COLORS.GREY} />
          <AvText style={styles.detailLabel}>Doctor:</AvText>
          <AvText style={styles.detailText}>{invoice.doctorName}</AvText>
        </View>
      </View>
      <View style={{ width: 20 }} />
      <View style={styles.detailsColumn}>
        <View style={styles.sectionHeader}>
          <AvText style={styles.sectionTitleWithIcon}>PATIENT INFORMATION</AvText>
        </View>
        <View style={styles.detailRowWithIcon}>
          <AvIcons type="MaterialCommunityIcons" name="account" size={16} color={COLORS.GREY} />
          <AvText style={styles.detailText}>{invoice.patientName}</AvText>
        </View>
        <View style={styles.detailRowWithIcon}>
          <AvIcons type="MaterialCommunityIcons" name="email" size={16} color={COLORS.GREY} />
          <AvText style={styles.detailText}>{invoice.patientEmail}</AvText>
        </View>
        <View style={styles.detailRowWithIcon}>
          <AvIcons type="MaterialCommunityIcons" name="phone" size={16} color={COLORS.GREY} />
          <AvText style={styles.detailText}>{invoice.patientPhone}</AvText>
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
