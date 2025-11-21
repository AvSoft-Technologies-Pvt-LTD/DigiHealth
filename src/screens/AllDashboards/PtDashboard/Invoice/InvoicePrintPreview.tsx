import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { Invoice } from './types';
import { AvText } from '../../../../elements';

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
        <AvText style={styles.invoiceTitle}>INVOICE</AvText>
        
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.section}>
          <AvText style={styles.sectionTitle}>INVOICE DETAILS</AvText>
          <View style={styles.detailRow}>
            <AvText style={styles.detailLabel}>Date:</AvText>
            <AvText style={styles.detailText}>{invoice.date}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText style={styles.detailLabel}>Due:</AvText>
            <AvText style={styles.detailText}>{invoice.dueDate}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText style={styles.detailLabel}>Doctor:</AvText>
            <AvText style={styles.detailText}>{invoice.doctorName}</AvText>
          </View>
        </View>

        <View style={styles.section}>
          <AvText style={styles.sectionTitle}>PATIENT INFORMATION</AvText>
          <View style={styles.detailRow}>
            <AvText style={styles.detailLabel}>Name:</AvText>
            <AvText style={styles.detailText}>{invoice.patientName}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText style={styles.detailLabel}>Email:</AvText>
            <AvText style={styles.detailText}>{invoice.patientEmail}</AvText>
          </View>
          <View style={styles.detailRow}>
            <AvText style={styles.detailLabel}>Phone:</AvText>
            <AvText style={styles.detailText}>{invoice.patientPhone}</AvText>
          </View>
        </View>
      </View>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <AvText style={[styles.tableHeaderText, { flex: 2 }]}>Description</AvText>
          <AvText style={[styles.tableHeaderText, { flex: 1 }]}>Unit Cost</AvText>
          <AvText style={[styles.tableHeaderText, { flex: 0.5 }]}>Qty</AvText>
          <AvText style={[styles.tableHeaderText, { flex: 1 }]}>Amount</AvText>
        </View>
        {invoice.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <AvText style={[styles.tableCell, { flex: 2 }]}>{item.description}</AvText>
            <AvText style={[styles.tableCell, { flex: 1 }]}>₹{item.cost}</AvText>
            <AvText style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</AvText>
            <AvText style={[styles.tableCell, { flex: 1 }]}>₹{item.amount}</AvText>
          </View>
        ))}
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <AvText style={styles.summaryLabel}>Subtotal</AvText>
          <AvText style={styles.summaryValue}>₹{invoice.billedAmount}</AvText>
        </View>
        <View style={styles.summaryRow}>
          <AvText style={styles.summaryLabel}>Discount</AvText>
          <AvText style={styles.summaryValue}>₹{invoice.discount}</AvText>
        </View>
        <View style={styles.summaryRow}>
          <AvText style={styles.summaryLabel}>Tax</AvText>
          <AvText style={styles.summaryValue}>₹{invoice.tax}</AvText>
        </View>
        <View style={styles.totalRow}>
          <AvText style={styles.totalLabel}>Total Amount</AvText>
          <AvText style={styles.totalValue}>₹{invoice.total}</AvText>
        </View>
      </View>

      <View style={styles.footer}>
        <AvText type='heading_5' style={styles.footerTitle}>Terms & Conditions</AvText>
        <AvText type='title_4' style={styles.footerText}>
          Payment due within 30 days of invoice date. Late payments may incur additional charges.
        </AvText>
        <AvText type='title_4' style={styles.footerText}>
          For any queries regarding this invoice, please contact us at billing@digihealth.com
        </AvText>
        <AvText type='Subtitle_2' style={styles.thanksText}>
          Thank you for choosing Pocket Clinic for your healthcare needs
        </AvText>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    padding: normalize(20),
    marginVertical :normalize(20)
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
    marginBottom: normalize(8),
  },
  footerText: {
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  thanksText: {
    // fontSize: normalize(10),
    color: COLORS.GREY,
    marginTop: normalize(8),
    fontStyle: 'italic',
  },
});

export default InvoicePrintPreview;
