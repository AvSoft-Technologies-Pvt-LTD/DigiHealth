import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import InvoiceHeader from './InvoiceHeader';
import InvoiceInfoSection from './InvoiceInfoSection';
import InvoiceTable from './InvoiceTable';
import InvoiceSummary from './InvoiceSummary';
import InvoiceFooter from './InvoiceFooter';
import { InvoiceDetailsProps } from './types';
import { AvIcons, AvText } from '../../../../elements';

const InvoiceDetails: React.FC<InvoiceDetailsProps> = ({ route, navigation }) => {
  const { invoice } = route.params || {
    invoice: {
      invoiceNo: 'INV-2025-001',
      date: '2025-01-05',
      dueDate: '10/22/2025',
      doctorName: 'Dr. Rajesh Sharma',
      patientName: 'Sahana Kadrolli',
      patientEmail: 'sahana@gmail.com',
      patientPhone: '9901347673',
      items: [],
      billedAmount: '0',
      discount: '0',
      tax: '0',
      total: '300',
    },
  };

  return (
    <ScrollView style={styles.container}>
      <InvoiceHeader onClose={() => navigation.goBack()} />
      <View style={styles.invoiceIdContainer}>
        <View style={styles.invoiceIdHeader}>
          <AvIcons type="MaterialCommunityIcons" name="receipt" size={20} color={COLORS.PRIMARY_TXT} />
          <AvText style={styles.headerTitle}> INVOICE #{invoice.invoiceNo}</AvText>
        </View>
      </View>
      <InvoiceInfoSection invoice={invoice} />
      <InvoiceTable items={invoice.items} />
      <InvoiceSummary invoice={invoice} />
      <InvoiceFooter invoice={invoice} navigation={navigation} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: normalize(30),
    borderRadius: normalize(16),
    margin: normalize(10),
    elevation: 8,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: normalize(4) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(8),
    marginBottom: normalize(8),
  },
  invoiceIdContainer: {
    marginBottom: normalize(20),
  },
  invoiceIdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
});

export default InvoiceDetails;
