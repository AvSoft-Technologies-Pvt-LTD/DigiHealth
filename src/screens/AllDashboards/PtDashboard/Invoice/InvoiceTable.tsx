import React from 'react';
import { View, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { InvoiceItem } from './types';
import { AvText } from '../../../../elements';

interface InvoiceTableProps {
  items: InvoiceItem[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ items }) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <AvText style={[styles.tableHeaderText, { flex: 1 }]}>Description</AvText>
        <AvText style={[styles.tableHeaderText, { flex: 1 }]}>Unit Cost</AvText>
        <AvText style={[styles.tableHeaderText, { flex: 0.5 }]}>Qty</AvText>
        <AvText style={[styles.tableHeaderText, { flex: 1 }]}>Amount</AvText>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <AvText style={[styles.tableCell, { flex: 1 }]}>{item.description}</AvText>
          <AvText style={[styles.tableCell, { flex: 1 }]}>₹{item.cost}</AvText>
          <AvText style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</AvText>
          <AvText style={[styles.tableCell, { flex: 1 }]}>₹{item.amount}</AvText>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tableContainer: {
    marginBottom: normalize(20),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: COLORS.BG_OFF_WHITE,
    paddingVertical: normalize(10),
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
});

export default InvoiceTable;
