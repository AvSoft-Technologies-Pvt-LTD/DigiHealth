import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';
import { AvButton, AvCards, AvIcons, AvText } from '../../../../elements';

type LabStackParamList = {
  [PAGES.LAB_CART]: { cart: any[]; setCart: (cart: any[]) => void };
  [PAGES.AVAILABLE_LABS]: { cart: any[]; testDetails: any[] };
};

type LabCartRouteProp = RouteProp<LabStackParamList, typeof PAGES.LAB_CART>;
type LabCartNavigationProp = NativeStackNavigationProp<LabStackParamList, typeof PAGES.LAB_CART>;

const LabCart: React.FC = () => {
  const route = useRoute<LabCartRouteProp>();
  const navigation = useNavigation<LabCartNavigationProp>();
  const { cart: initialCart, setCart: setCartInLabHome } = route.params;
  const [cart, setCart] = useState<any[]>(initialCart || []);
  const [expandedPackages, setExpandedPackages] = useState<Record<string, boolean>>({});

  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleRemove = (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    setCart(updatedCart);
    setCartInLabHome(updatedCart);
  };

  const handleClearAll = () => {
    setCart([]);
    setCartInLabHome([]);
  };

  const togglePackageExpand = (id: string) => {
    setExpandedPackages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const isPackage = (item: any) => item.type === 'package';

  const getTestDetails = () => {
    const testDetails: any[] = [];
    cart.forEach((item) => {
      if (isPackage(item) && expandedPackages[item.id]) {
        item.includedTests?.forEach((test: any) => {
          testDetails.push({
            id: test.id,
            title: test.title,
            code: test.code || 'N/A',
            price: test.price || 0,
            type: 'test',
          });
        });
      } else {
        testDetails.push({
          id: item.id,
          title: item.title,
          code: item.code || 'N/A',
          price: item.price || 0,
          type: item.type,
        });
      }
    });
    return testDetails;
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AvIcons type="MaterialIcons" name="arrow-back" size={normalize(20)} color={COLORS.PRIMARY} />
        <AvText style={styles.backText}>Back to Home</AvText>
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AvIcons type="MaterialIcons" name="shopping-cart" size={24} color={COLORS.PRIMARY} />
          <AvText type="title_4" style={styles.title}>Your Cart</AvText>
        </View>
        <TouchableOpacity onPress={handleClearAll} style={styles.clearAllButton}>
          <AvIcons type="MaterialIcons" name="delete" size={16} color={COLORS.ERROR} />
          <AvText style={styles.clearAllText}>Clear All</AvText>
        </TouchableOpacity>
      </View>
      {cart.length === 0 ? (
        <AvText style={styles.emptyCartText}>Your cart is empty. Start adding tests!</AvText>
      ) : (
        <>
          <AvCards title="Your Cart" cardStyle={styles.cartCard}>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemHeader}>
                  <AvText type="title_6" style={styles.itemTitle}>{item.title}</AvText>
                  <View style={styles.priceContainer}>
                    <AvText type="title_6" style={styles.itemPrice}>₹{item.price}</AvText>
                    {item.originalPrice && (
                      <AvText type="caption" style={styles.originalPrice}>₹{item.originalPrice}</AvText>
                    )}
                  </View>
                </View>
                <AvText type="body" style={styles.itemCode}>Code: {item.code || 'N/A'}</AvText>
                <AvText type="body" style={styles.itemDescription}>{item.description}</AvText>
                {isPackage(item) && (
                  <TouchableOpacity onPress={() => togglePackageExpand(item.id)} style={styles.viewMoreButton}>
                    <AvText type="body" style={styles.viewMoreText}>
                      {expandedPackages[item.id] ? 'View Less' : 'View More'}
                    </AvText>
                  </TouchableOpacity>
                )}
                {isPackage(item) && expandedPackages[item.id] && item.includedTests && (
                  <View style={styles.includedTestsContainer}>
                    <AvText type="Subtitle_1" style={styles.includedTestsTitle}>Included Tests:</AvText>
                    {item.includedTests.map((test: any, index: number) => (
                      <View key={index} style={styles.testItem}>
                        <AvIcons type="MaterialIcons" name="check-circle" size={16} color={COLORS.SUCCESS} />
                        <AvText type="body" style={styles.testText}>{test.title}</AvText>
                      </View>
                    ))}
                  </View>
                )}
                <TouchableOpacity onPress={() => handleRemove(item.id)} style={styles.removeButton}>
                  <AvIcons type="MaterialIcons" name="delete" size={16} color={COLORS.ERROR} />
                  <AvText style={styles.removeButtonText}>Remove</AvText>
                </TouchableOpacity>
              </View>
            ))}
          </AvCards>
          <AvCards title="Order Summary" cardStyle={styles.summaryCard}>
            <AvText type="title_6" style={styles.summaryTitle}>Order Summary</AvText>
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <AvText type="title_6" style={styles.itemTitle}>{item.title}</AvText>
                <AvText type="body" style={styles.itemCode}>Code: {item.code || 'N/A'}</AvText>
                <AvText type="body" style={styles.itemDescription}>{item.description}</AvText>
              </View>
            ))}

            <View style={styles.totalRow}>
              <AvText type="Subtitle_1" style={styles.totalLabel}>Total</AvText>
              <AvText type="Subtitle_1" style={styles.totalPrice}>₹{subtotal}</AvText>
            </View>
            <AvButton
              mode="contained"
              onPress={() => navigation.navigate(PAGES.AVAILABLE_LABS, {
                cart,
                testDetails: getTestDetails(),
              })}
              style={styles.proceedButton}
            >
              Proceed to Book
            </AvButton>
          </AvCards>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
    padding: normalize(16),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginLeft: normalize(8),
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.ERROR,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(6),
  },
  clearAllText: {
    color: COLORS.ERROR,
    marginLeft: normalize(4),
  },
  emptyCartText: {
    textAlign: 'center',
    marginTop: normalize(20),
    color: COLORS.GREY,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(16),
  },
  backText: {
    color: COLORS.PRIMARY,
    marginLeft: normalize(8),
  },
  cartCard: {
    marginBottom: normalize(16),
    padding: normalize(16),
  },
  cartItem: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingBottom: normalize(16),
    marginBottom: normalize(16),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: normalize(8),
  },
  itemTitle: {
    fontWeight: 'bold',
    flex: 1,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: COLORS.GREY,
  },
  itemCode: {
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  itemDescription: {
    color: COLORS.GREY,
    marginBottom: normalize(8),
  },
  viewMoreButton: {
    marginBottom: normalize(8),
  },
  viewMoreText: {
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  includedTestsContainer: {
    marginTop: normalize(8),
    backgroundColor: COLORS.WHITE,
    padding: normalize(8),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  includedTestsTitle: {
    fontWeight: 'bold',
    marginBottom: normalize(4),
    color: COLORS.BLACK,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  testText: {
    marginLeft: normalize(4),
    color: COLORS.BLACK,
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  removeButtonText: {
    color: COLORS.ERROR,
    marginLeft: normalize(4),
  },
  summaryCard: {
    marginBottom: normalize(16),
    padding: normalize(16),
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: normalize(12),
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  summaryItemText: {
    color: COLORS.BLACK,
  },
  summaryItemPrice: {
    color: COLORS.BLACK,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
    paddingTop: normalize(12),
    marginTop: normalize(8),
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalPrice: {
    fontWeight: 'bold',
  },
  proceedButton: {
    marginTop: normalize(16),
    backgroundColor: COLORS.PRIMARY,
  },
});


export default LabCart;
