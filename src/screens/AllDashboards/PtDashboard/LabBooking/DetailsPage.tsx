import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';

const API_URL = 'https://mocki.io/v1/eef2e0ad-4941-4900-94c5-bc63e7c661f8';

const DetailsPage = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { id, cart: existingCart = [], setCart } = route.params;
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCartLocal] = useState<any[]>(existingCart);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(API_URL);
        const allItems = [...res.data.tests, ...res.data.scans, ...res.data.packages];
        const foundItem = allItems.find((i) => i.id.toString() === id.toString());
        setItem(foundItem || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleAddToCart = () => {
    if (!item) return;
    const updatedCart = [...cart];
    const isItemInCart = updatedCart.some((cartItem) => cartItem.id === item.id);
    if (!isItemInCart) {
      updatedCart.push(item);
      setCartLocal(updatedCart);
      setCart(updatedCart); // Update the cart in LabHome
    }
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
      <AvCard style={styles.itemCard}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('LabCart', { cart })}
            style={styles.cartIconContainer}>
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
            <AvText type="caption" style={styles.codeText}>{item.code}</AvText>
          </View>
        </View>
        <AvText type="body" style={styles.itemDescription}>{item.description}</AvText>
        <View style={styles.priceContainer}>
          <AvText type="title_6" style={styles.itemPrice}>₹{item.price}</AvText>
          {item.discountedPrice && (
            <AvText type="caption" style={styles.discountedPrice}>₹{item.discountedPrice}</AvText>
          )}
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}>
          <Icon name="add-circle" size={20} color={COLORS.WHITE} />
          <AvText type="buttonText" style={styles.addToCartButtonText}>
            Add to Cart
          </AvText>
        </TouchableOpacity>
        <View style={styles.itemFeatures}>
          <View style={styles.feature}>
            <Icon name="schedule" size={16} color={COLORS.GREY} />
            <AvText type="caption" style={styles.featureText}>Report: {item.reportTime}</AvText>
          </View>
          <View style={styles.feature}>
            <Icon name="fastfood" size={16} color={COLORS.GREY} />
            <AvText type="caption" style={styles.featureText}>{item.fasting}</AvText>
          </View>
        </View>
      </AvCard>
      <AvCard style={styles.labsCard}>
        <View style={styles.labsHeader}>
          <AvText type="title_6" style={styles.labsTitle}>Find the best labs for {item.title}</AvText>
          <AvText type="caption" style={styles.labsSubtitle}>Compare prices, check availability, and book appointments.</AvText>
        </View>
        <TouchableOpacity
          style={styles.viewLabsButton}
          onPress={() =>
            navigation.navigate('AvailableLabs', {
              cart,
              testDetails: [item], // pass current test as testDetails
            })
          }
        >
          <AvText type="buttonText" style={styles.viewLabsButtonText}>
            View Available Labs
          </AvText>
        </TouchableOpacity>

      </AvCard>
      <AvCard style={styles.aboutCard}>
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
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemCard: {
    marginBottom: 16,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartIconContainer: {
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: COLORS.ERROR,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: COLORS.WHITE,
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  codeBadge: {
    backgroundColor: COLORS.LIGHT_BLUE,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  codeText: {
    color: COLORS.PRIMARY,
  },
  itemDescription: {
    color: COLORS.GREY,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemPrice: {
    fontWeight: 'bold',
    marginRight: 8,
  },
  discountedPrice: {
    textDecorationLine: 'line-through',
    color: COLORS.GREY,
  },
  addToCartButton: {
    backgroundColor: COLORS.PRIMARY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    flexDirection: 'row',
  },
  addToCartButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  itemFeatures: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureText: {
    color: COLORS.GREY,
    marginLeft: 4,
  },
  labsCard: {
    marginBottom: 16,
    padding: 16,
  },
  labsHeader: {
    marginBottom: 16,
  },
  labsTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  labsSubtitle: {
    color: COLORS.GREY,
  },
  viewLabsButton: {
    backgroundColor: COLORS.LIGHT_GREY,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLabsButtonText: {
    color: COLORS.PRIMARY,
  },
  aboutCard: {
    marginBottom: 16,
    padding: 16,
  },
  aboutTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  aboutSection: {
    marginBottom: 12,
  },
  aboutSubtitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  aboutText: {
    color: COLORS.GREY,
  },
});

export default DetailsPage;
