import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { Invoice } from './types';

interface InvoicePrintPreviewProps {
  route: {
    params: {
      invoice: Invoice;
    };
  };
}

const InvoicePrintPreview: React.FC<InvoicePrintPreviewProps> = ({ route }) => {
  const { invoice } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.invoiceTitle}>INVOICE</Text>
        
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INVOICE DETAILS</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailText}>{invoice.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due:</Text>
            <Text style={styles.detailText}>{invoice.dueDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Doctor:</Text>
            <Text style={styles.detailText}>{invoice.doctorName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PATIENT INFORMATION</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name:</Text>
            <Text style={styles.detailText}>{invoice.patientName}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email:</Text>
            <Text style={styles.detailText}>{invoice.patientEmail}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Phone:</Text>
            <Text style={styles.detailText}>{invoice.patientPhone}</Text>
          </View>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText, { flex: 2 }]}>Description</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Unit Cost</Text>
          <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Qty</Text>
          <Text style={[styles.tableHeaderText, { flex: 1 }]}>Amount</Text>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.description}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.cost}</Text>
            <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.amount}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>₹{invoice.billedAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount</Text>
          <Text style={styles.summaryValue}>₹{invoice.discount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Tax</Text>
          <Text style={styles.summaryValue}>₹{invoice.tax}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{invoice.total}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Terms & Conditions</Text>
        <Text style={styles.footerText}>
          Payment due within 30 days of invoice date. Late payments may incur additional charges.
        </Text>
        <Text style={styles.footerText}>
          For any queries regarding this invoice, please contact us at billing@digihealth.com
        </Text>
        <Text style={styles.thanksText}>
          Thank you for choosing DigiHealth for your healthcare needs
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: normalize(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(20),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingBottom: normalize(10),
  },
  invoiceTitle: {
    fontSize: normalize(20),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  invoiceNumber: {
    fontSize: normalize(16),
    color: COLORS.GREY,
  },
  companyName: {
    fontSize: normalize(14),
    color: COLORS.PRIMARY,
    fontWeight: 'bold',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(20),
  },
  section: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
    marginBottom: normalize(8),
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: normalize(4),
  },
  detailLabel: {
    fontSize: normalize(11),
    color: COLORS.GREY,
    minWidth: normalize(60),
  },
  detailText: {
    fontSize: normalize(11),
    color: COLORS.PRIMARY_TXT,
  },
  tableContainer: {
    marginBottom: normalize(20),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.BG_OFF_WHITE,
    paddingVertical: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  tableHeaderText: {
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
    paddingHorizontal: normalize(5),
    fontSize: normalize(11),
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: normalize(8),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  tableCell: {
    color: COLORS.GREY,
    paddingHorizontal: normalize(5),
    fontSize: normalize(11),
  },
  summaryContainer: {
    alignSelf: 'flex-end',
    width: '50%',
    paddingTop: normalize(10),
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(4),
  },
  summaryLabel: {
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  summaryValue: {
    fontSize: normalize(12),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalize(8),
  },
  totalLabel: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  totalValue: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
  },
  footer: {
    marginTop: normalize(20),
  },
  footerTitle: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: COLORS.PRIMARY_TXT,
    marginBottom: normalize(8),
  },
  footerText: {
    fontSize: normalize(10),
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  thanksText: {
    fontSize: normalize(10),
    color: COLORS.GREY,
    marginTop: normalize(8),
    fontStyle: 'italic',
  },
});

export default InvoicePrintPreview;
