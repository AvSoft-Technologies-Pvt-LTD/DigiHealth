import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { Invoice } from './types';

interface InvoiceSummaryProps {
  invoice: Invoice;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoice }) => {
  return (
    <>
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
      </View>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹{invoice.total}</Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: normalize(2),
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.GREEN,
    borderRadius: normalize(10),
    padding: normalize(12),
    marginTop: normalize(20),
  },
  totalText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: normalize(13),
  },
  totalAmount: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
});

export default InvoiceSummary;
