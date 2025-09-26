


import React from "react";
import { View, StyleSheet } from "react-native";
import PaymentComponent from "../../../elements/AvPayment";
import { useRoute } from "@react-navigation/native";
import { COLORS } from "../../../constants/colors";

type PaymentRecord = {
  amount: number;
  recordId?: string;
  patientName?: string;
  // Add other fields if needed
};

const PaymentPage = () => {
  const route = useRoute();
  const { record } = route.params as { record: PaymentRecord };

  // Safeguard: Default to 0 if amount is missing
  const amount = record?.amount || 0;
  const currency = "₹";
  const merchantName = "Your Clinic Name";

  return (
    <View style={styles.container}>
      <PaymentComponent
        amount={amount}
        currency={currency}
        merchantName={merchantName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
});

export default PaymentPage;
