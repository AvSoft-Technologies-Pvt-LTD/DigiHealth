

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";
import { Invoice } from "./types"; // Adjust import path as needed
import { PAGES } from "../../../../constants/pages";
import { AvText } from "../../../../elements";

interface InvoiceFooterProps {
  invoice: Invoice;
  navigation: any;
}

const InvoiceFooter: React.FC<InvoiceFooterProps> = ({ invoice, navigation }) => {
  const handlePayPress = () => {
    // Transform invoice to match the record structure expected by PaymentPage
    const record = {
      amount: invoice.total,
      recordId: invoice.invoiceNo,
      patientName: invoice.patientName,
      // Add other fields if needed by PaymentPage
    };
    navigation.navigate(PAGES.PAYMENT_PAGE, { record });
  };

  const handlePrintPress = () => {
    navigation.navigate(PAGES.INVOICEPRINTPREVIEW, { invoice });
  };

  return (
    <View style={styles.termsContainer}>
      <AvText style={styles.termsTitle}>Terms & Conditions</AvText>
      <AvText style={styles.termsText}>
        Payment due within 30 days. Late fees apply. For queries, contact billing@pocketclinic.com.
      </AvText>
      <AvText style={styles.thanksText}>
        Thank you for choosing Pocket Clinic for your healthcare needs
      </AvText>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.printButton} onPress={handlePrintPress}>
          <AvText style={styles.buttonText}>Print</AvText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.payButton} onPress={handlePayPress}>
          <AvText style={styles.payButtonText}>Pay ₹{invoice.total}</AvText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  termsContainer: {
    marginTop: normalize(20),
    padding: normalize(10),
    backgroundColor: COLORS.BG_OFF_WHITE,
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    marginBottom: normalize(60),
  },
  termsTitle: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: COLORS.PRIMARY_TXT,
    marginBottom: normalize(8),
  },
  termsText: {
    fontSize: normalize(10),
    color: COLORS.GREY,
    marginBottom: normalize(8),
    lineHeight: normalize(16),
  },
  thanksText: {
    fontSize: normalize(10),
    color: COLORS.GREY,
    marginBottom: normalize(8),
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  printButton: {
    flex: 1,
    marginRight: normalize(8),
    padding: normalize(10),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    alignItems: "center",
  },
  payButton: {
    flex: 1,
    marginLeft: normalize(8),
    padding: normalize(12),
    backgroundColor: COLORS.GREEN,
    borderRadius: normalize(8),
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.PRIMARY_TXT,
    fontWeight: "bold",
    fontSize: normalize(13),
  },
  payButtonText: {
    color: COLORS.WHITE,
    fontWeight: "bold",
    fontSize: normalize(13),
  },
});

export default InvoiceFooter;
