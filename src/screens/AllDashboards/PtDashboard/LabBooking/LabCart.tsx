import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import AvButton from '../../../../elements/AvButton';
import { COLORS } from '../../../../constants/colors';

const LabCart = () => {
  const route = useRoute();
  const { cart: initialCart } = route.params as { cart: any[] };
  const [cart, setCart] = useState<any[]>(initialCart || []);
  const navigation = useNavigation();
  const subtotal = cart.reduce((sum: number, test: any) => sum + test.price, 0);

  const handleRemove = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="arrow-back" size={20} color={COLORS.PRIMARY} />
        <AvText style={styles.backText}>Continue Shopping</AvText>
      </TouchableOpacity>
      <AvText type="title_4" style={styles.title}>Your Cart</AvText>
      {cart.length === 0 ? (
        <AvText style={styles.emptyCartText}>Your cart is empty. Start adding tests!</AvText>
      ) : (
        <>
          <AvCard style={styles.cartCard}>
            {cart.map((test: any) => (
              <View key={test.id} style={styles.cartItem}>
                <View style={styles.cartItemContent}>
                  <View style={styles.cartItemDetails}>
                    <AvText type="title_6" style={styles.cartItemTitle}>{test.title}</AvText>
                    <AvText type="body" style={styles.cartItemCode}>Code: {test.code}</AvText>
                    <AvText type="body" style={styles.cartItemDescription}>{test.description}</AvText>
                  </View>
                  <View style={styles.cartItemActions}>
                    <AvText type="title_6" style={styles.cartItemPrice}>₹{test.price}</AvText>
                    <TouchableOpacity onPress={() => handleRemove(test.id)} style={styles.removeButton}>
                      <Icon name="delete" size={16} color={COLORS.ERROR} />
                      <AvText style={styles.removeButtonText}>Remove</AvText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </AvCard>
          <AvCard style={styles.summaryCard}>
            <AvText type="title_6" style={styles.summaryTitle}>Order Summary</AvText>
            <View style={styles.summaryRow}>
              <AvText type="body">Subtotal</AvText>
              <AvText type="body">₹{subtotal}</AvText>
            </View>
            <AvButton
              mode="contained"
              onPress={() => navigation.navigate('AvailableLabs', { cart })}
              style={styles.proceedButton}
            >
              Proceed to Book
            </AvButton>
          </AvCard>
        </>
      )}
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
    padding: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backText: {
    color: COLORS.PRIMARY,
    marginLeft: 8,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: 20,
  },
  cartCard: {
    marginBottom: 16,
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingBottom: 12,
    marginBottom: 12,
  },
  cartItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cartItemDetails: {
    flex: 1,
  },
  cartItemTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cartItemCode: {
    color: COLORS.GREY,
    marginBottom: 4,
  },
  cartItemDescription: {
    marginBottom: 4,
  },
  cartItemActions: {
    alignItems: 'flex-end',
  },
  cartItemPrice: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  removeButtonText: {
    color: COLORS.ERROR,
    marginLeft: 4,
  },
  summaryCard: {
    marginBottom: 16,
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  proceedButton: {
    marginTop: 12,
    backgroundColor: COLORS.PRIMARY,
  },
});

export default LabCart;
