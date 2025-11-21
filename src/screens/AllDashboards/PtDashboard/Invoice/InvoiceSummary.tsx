import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { Invoice } from './types';
import { AvText } from '../../../../elements';

interface InvoiceSummaryProps {
  invoice: Invoice;
}

const InvoiceSummary: React.FC<InvoiceSummaryProps> = ({ invoice }) => {
  return (
    <>
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
      </View>
      <View style={styles.totalContainer}>
        <AvText style={styles.totalText}>Total Amount</AvText>
        <AvText style={styles.totalAmount}>₹{invoice.total}</AvText>
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
