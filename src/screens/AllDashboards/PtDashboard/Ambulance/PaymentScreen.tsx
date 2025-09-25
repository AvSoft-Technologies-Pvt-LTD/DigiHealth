import React from 'react';
import { View, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import PaymentComponent from '../../../../elements/AvPayment'; // Adjust the import path as needed

type PaymentScreenRouteProp = RouteProp<{ PaymentScreen: { amount: number; currency: string; merchantName: string } }, 'PaymentScreen'>;

interface PaymentScreenProps {
  route: PaymentScreenRouteProp;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ route }) => {
  const { amount, currency, merchantName } = route.params;

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
  },
});

export default PaymentScreen;
