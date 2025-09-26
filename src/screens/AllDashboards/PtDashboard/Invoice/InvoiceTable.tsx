import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { InvoiceItem } from './types';

interface InvoiceTableProps {
  items: InvoiceItem[];
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({ items }) => {
  return (
    <View style={styles.tableContainer}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Description</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Unit Cost</Text>
        <Text style={[styles.tableHeaderText, { flex: 0.5 }]}>Qty</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Amount</Text>
      </View>
      {items.map((item, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={[styles.tableCell, { flex: 1 }]}>{item.description}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.cost}</Text>
          <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</Text>
          <Text style={[styles.tableCell, { flex: 1 }]}>₹{item.amount}</Text>
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
