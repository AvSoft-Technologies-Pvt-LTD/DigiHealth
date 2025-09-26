import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';

type RootStackParamList = {
  [PAGES.LAB_DETAILS_PAGE]: { id: string; cart: any[]; setCart: (cart: any[]) => void };
  [PAGES.LAB_CART]: { cart: any[]; setCart: (cart: any[]) => void };
  [PAGES.AVAILABLE_LABS]: { cart: any[]; testDetails: any[] };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = RouteProp<RootStackParamList, typeof PAGES.LAB_DETAILS_PAGE>;

const API_URL = 'https://mocki.io/v1/64038255-16d2-4d67-a269-a35cbeca1c62';

const DetailsPage: React.FC = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationProp>();
  const { id, cart: existingCart = [], setCart: setCartInLabHome } = route.params;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCartLocal] = useState<any[]>(existingCart);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(API_URL);
        const allItems = [...res.data.tests, ...res.data.scans, ...res.data.packages];
        let foundItem = allItems.find((i) => i.id.toString() === id.toString());
        if (foundItem && foundItem.type === 'package') {
          foundItem = {
            ...foundItem,
            includedTests: foundItem.tests.map((test, index) => ({
              id: `${foundItem.id}_${index}`,
              title: test.title,
              code: test.code || 'N/A',
              price: test.price || 0,
              type: 'test',
            })),
          };
        }
        setItem(foundItem || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  useEffect(() => {
    setCartInLabHome(cart);
  }, [cart]);

  const handleAddToCart = () => {
    if (!item) return;
    const updatedCart = [...cart];
    if (item.type === 'package') {
      if (!updatedCart.some((cartItem) => cartItem.id === item.id)) {
        updatedCart.push(item);
      }
    } else {
      if (!updatedCart.some((cartItem) => cartItem.id === item.id)) {
        updatedCart.push(item);
      }
    }
    setCartLocal(updatedCart);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <AvText>No item found.</AvText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollView}>
      <AvCard cardStyle={styles.itemCard}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate(PAGES.LAB_CART, { cart, setCart: setCartLocal })}
            style={styles.cartIconContainer}
          >
            <Icon name="shopping-cart" size={24} color={COLORS.PRIMARY} />
            {cart.length > 0 && (
              <View style={styles.cartBadge}>
                <AvText type="caption" style={styles.cartBadgeText}>
                  {cart.length}
                </AvText>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.itemHeader}>
          <AvText type="title_4" style={styles.itemTitle}>{item.title}</AvText>
          <View style={styles.codeBadge}>
            <AvText type="caption" style={styles.codeText}>{item.code || 'PKG' + item.id}</AvText>
          </View>
        </View>
        <AvText type="body" style={styles.itemDescription}>{item.description}</AvText>
        <View style={styles.priceContainer}>
          <AvText type="title_6" style={styles.itemPrice}>₹{item.price}</AvText>
          {item.originalPrice && (
            <AvText type="caption" style={styles.discountedPrice}>₹{item.originalPrice}</AvText>
          )}
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Icon name="add-circle" size={20} color={COLORS.WHITE} />
          <AvText type="buttonText" style={styles.addToCartButtonText}>Add to Cart</AvText>
        </TouchableOpacity>
        {item.includedTests && item.includedTests.length > 0 && (
          <View style={styles.includedTestsContainer}>
            <AvText type="subtitle" style={styles.includedTestsTitle}>📋 Included Tests</AvText>
            <View style={styles.testsGrid}>
              {item.includedTests.map((test, index) => (
                <View key={index} style={styles.testItem}>
                  <Icon name="check-circle" size={16} color={COLORS.SUCCESS} />
                  <AvText type="body" style={styles.testText}>{test.title}</AvText>
                </View>
              ))}
            </View>
          </View>
        )}
  </AvCard>
 <AvCard cardStyle={styles.labsCard}>
        <View style={styles.labsHeader}>
          <AvText type="title_6" style={styles.labsTitle}>Find the best labs for {item.title}</AvText>
          <AvText type="caption" style={styles.labsSubtitle}>Compare prices, check availability, and book appointments.</AvText>
        </View>
        <TouchableOpacity
          style={styles.viewLabsButton}
          onPress={() => navigation.navigate(PAGES.AVAILABLE_LABS, {
            cart: [...cart, item],
            testDetails: item.type === 'package' ? [...cart, item, ...item.includedTests] : [...cart, item],
          })}
        >
          <AvText type="buttonText" style={styles.viewLabsButtonText}>
            View Available Labs
          </AvText>
        </TouchableOpacity>
      </AvCard>
       <AvCard cardStyle={styles.aboutCard}>
        <AvText type="title_6" style={styles.aboutTitle}>💡 About {item.title}</AvText>
        {item.about && (
          <View style={styles.aboutSection}>
            <AvText type="subtitle" style={styles.aboutSubtitle}>What is it?</AvText>
            <AvText type="body" style={styles.aboutText}>{item.about}</AvText>
          </View>
        )}
        {item.why && (
          <View style={styles.aboutSection}>
            <AvText type="subtitle" style={styles.aboutSubtitle}>Why is it done?</AvText>
            <AvText type="body" style={styles.aboutText}>{item.why}</AvText>
          </View>
        )}
        {item.preparation && (
          <View style={styles.aboutSection}>
            <AvText type="subtitle" style={styles.aboutSubtitle}>Preparation Required</AvText>
            <AvText type="body" style={styles.aboutText}>{item.preparation}</AvText>
          </View>
        )}
      </AvCard>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE, padding: normalize(16) },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  itemCard: { marginBottom: normalize(16), padding: normalize(16) },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(12) },
  cartIconContainer: { position: 'relative' },
  cartBadge: { position: 'absolute', right: normalize(-6), top: normalize(-3), backgroundColor: COLORS.ERROR, borderRadius: normalize(10), width: normalize(20), height: normalize(20), justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: COLORS.WHITE, fontSize: normalize(12), fontWeight: 'bold' },
  itemHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) },
  itemTitle: { fontWeight: 'bold', marginRight: normalize(8) },
  codeBadge: { backgroundColor: COLORS.LIGTH_BLUE, paddingHorizontal: normalize(8), paddingVertical: normalize(4), borderRadius: normalize(12) },
  codeText: { color: COLORS.PRIMARY },
  itemDescription: { color: COLORS.GREY, marginBottom: normalize(12) },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(16) },
  itemPrice: { fontWeight: 'bold', marginRight: normalize(8) },
  discountedPrice: { textDecorationLine: 'line-through', color: COLORS.GREY },
  addToCartButton: { backgroundColor: COLORS.PRIMARY, padding: normalize(12), borderRadius: normalize(8), alignItems: 'center', justifyContent: 'center', marginBottom: normalize(16), flexDirection: 'row' },
  addToCartButtonText: { color: COLORS.WHITE, fontWeight: 'bold', marginLeft: normalize(8) },
  includedTestsContainer: { marginVertical: normalize(12), backgroundColor: COLORS.WHITE, padding: normalize(12), borderRadius: normalize(8), borderWidth: 1, borderColor: COLORS.LIGHT_GREY, width: '100%' },
  includedTestsTitle: { fontWeight: 'bold', marginBottom: normalize(12), color: COLORS.BLACK },
  testsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' },
  testItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.LIGHT_GREY, paddingHorizontal: normalize(12), paddingVertical: normalize(8), borderRadius: normalize(8), marginRight: normalize(8), marginBottom: normalize(8), maxWidth: '48%' },
  testText: { marginLeft: normalize(6), color: COLORS.BLACK, flexShrink: 1 },
  viewLabsButton: { backgroundColor: COLORS.LIGHT_GREY, padding: normalize(12), borderRadius: normalize(8), alignItems: 'center', justifyContent: 'center', marginTop: normalize(16) },
  viewLabsButtonText: { color: COLORS.PRIMARY },
  labsCard: { marginBottom: normalize(16), padding: normalize(16) },
  labsHeader: { marginBottom: normalize(16) },
  labsTitle: { fontWeight: 'bold', marginBottom: normalize(4) },
  labsSubtitle: { color: COLORS.GREY },
  aboutCard: { marginBottom: normalize(16), padding: normalize(16) },
  aboutTitle: { fontWeight: 'bold', marginBottom: normalize(12) },
  aboutSection: { marginBottom: normalize(12) },
  aboutSubtitle: { fontWeight: 'bold', marginBottom: normalize(4) },
  aboutText: { color: COLORS.GREY },
});
export default DetailsPage;
