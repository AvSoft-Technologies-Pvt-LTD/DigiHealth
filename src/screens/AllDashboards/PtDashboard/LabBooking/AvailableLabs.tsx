import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { SearchFilterBar } from '../../../../components/CommonComponents/SearchFilter';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';

type RootStackParamList = {
  [PAGES.LAB_CART]: { cart: any[]; testDetails?: any[] };
  [PAGES.LAB_BOOKING_PAGE]: { lab: any; cart: any[]; testDetails: any[] };
  [PAGES.AVAILABLE_LABS]: { cart: any[]; testDetails: any[] };
};

type NavigationPropType = NativeStackNavigationProp<RootStackParamList>;
type RoutePropType = RouteProp<RootStackParamList, typeof PAGES.AVAILABLE_LABS>;

const AvailableLabs: React.FC = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavigationPropType>();
  const { cart, testDetails = [] } = route.params;

  const [labs, setLabs] = useState<any[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedPackages, setExpandedPackages] = useState<{ [key: string]: boolean }>({});

  const filterOptions = [
    { id: 'homeCollection', displayName: 'Home Collection Only' },
    { id: 'cityDelhi', displayName: 'Delhi' },
    { id: 'cityMumbai', displayName: 'Mumbai' },
    { id: 'cityBangalore', displayName: 'Bangalore' },
    { id: 'cityHyderabad', displayName: 'Hyderabad' },
    { id: 'cityPune', displayName: 'Pune' },
    { id: 'cityChennai', displayName: 'Chennai' },
    { id: 'cityKolkata', displayName: 'Kolkata' },
  ];

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://mocki.io/v1/2f914b6d-3a1d-4fe4-b075-219bef09ca4a');
        setLabs(response.data);
        setFilteredLabs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching lab data:', err);
        setError('Failed to load lab data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const handleFiltersApplied = (selectedFilters: Record<string, boolean>) => {
    let filtered = [...labs];
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          lab.location.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    Object.keys(selectedFilters).forEach((key) => {
      if (key.startsWith('city') && selectedFilters[key]) {
        const city = key.replace('city', '').toLowerCase();
        filtered = filtered.filter((lab) => lab.location.toLowerCase().includes(city));
      }
    });
    if (selectedFilters.homeCollection) {
      filtered = filtered.filter((lab) => lab.homeCollection === true);
    }
    setFilteredLabs(filtered);
  };

  const togglePackageExpand = (id: string) => {
  setExpandedPackages((prev) => ({
    ...prev,
    [id]: !prev[id], // flip only this package
  }));
};

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <ScrollView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AvText style={styles.backIcon}>←</AvText>
        <AvText style={styles.backText}>Back to Cart</AvText>
      </TouchableOpacity>

      {/* ✅ Selected Tests / Packages (SAME as Cart UI) */}
      <View style={styles.selectedTestsContainer}>
        <AvText type="title_6" style={styles.selectedTestsTitle}>Selected Tests</AvText>

        {cart.map((item) => {
          const isPackage = item.type === 'package';
          const isExpanded = expandedPackages[item.id];

          return (
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
              {item.description && <AvText type="body" style={styles.itemDescription}>{item.description}</AvText>}

              {/* Expand Packages */}
              {isPackage && (
  <TouchableOpacity
    onPress={() => togglePackageExpand(item.id)}
    style={styles.viewMoreButton}
  >
    <AvText type="body" style={styles.viewMoreText}>
      {isExpanded ? 'View Less' : 'View More'}
    </AvText>
  </TouchableOpacity>
)}

{isPackage && isExpanded && item.tests && (
  <View style={styles.includedTestsContainer}>
    <AvText varient="subtitle" style={styles.includedTestsTitle}>Included Tests:</AvText>
    {item.tests.map((test: any, index: number) => (
      <View key={index} style={styles.testItem}>
        <Icon name="check-circle" size={16} color={COLORS.SUCCESS} />
        <AvText type="body" style={styles.testText}>{test.title}</AvText>
      </View>
    ))}
  </View>
)}

            </View>
          );
        })}

        <AvText type="body" style={styles.totalPriceText}>Total Price: ₹{totalPrice}</AvText>
      </View>

      {/* Search & Filter Section */}
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={(text) => {
          setSearchValue(text);
          handleFiltersApplied({});
        }}
        filterOptions={filterOptions}
        onFiltersApplied={handleFiltersApplied}
        placeholder="Search by Lab Name or Location"
        filterModalTitle="Filter Labs"
        applyButtonText="Apply Filters"
        resetButtonText="Reset"
      />

      {/* Labs List */}
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.PRIMARY} style={styles.loader} />
      ) : error ? (
        <AvText style={styles.errorText}>{error}</AvText>
      ) : filteredLabs.length === 0 ? (
        <AvText style={styles.noLabsText}>No labs found for selected filters.</AvText>
      ) : (
        filteredLabs.map((lab) => (
          <TouchableOpacity
            key={lab.id}
            style={styles.labCard}
            onPress={() =>
              navigation.navigate(PAGES.LAB_BOOKING_PAGE, {
                lab,
                cart,
                testDetails,
              })
            }
          >
            <View style={styles.labInfo}>
              <View style={styles.labDetails}>
                <AvText type="title_6" style={styles.labName}>{lab.name}</AvText>
                <AvText type="body" style={styles.labLocation}>Location: {lab.location}</AvText>
                <View style={styles.labMeta}>
                  <AvText type="body" style={styles.labRating}>Rating: {lab.rating || 'N/A'}</AvText>
                  {lab.reportTime && <AvText type="body" style={styles.labReportTime}>Report Time: {lab.reportTime}</AvText>}
                </View>
                {lab.homeCollection && (
                  <View style={styles.homeCollectionBadge}>
                    <AvText type="body" style={styles.homeCollectionText}>Home Collection Available</AvText>
                  </View>
                )}
              </View>
              <AvText type="description" style={styles.labPrice}>₹{totalPrice}</AvText>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE, padding: normalize(16) },
  backButton: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(16) },
  backIcon: { fontSize: normalize(20), color: COLORS.PRIMARY, marginRight: normalize(8) },
  backText: { color: COLORS.PRIMARY },
  selectedTestsContainer: { backgroundColor: COLORS.WHITE, borderRadius: normalize(8), padding: normalize(16), marginBottom: normalize(16) },
  selectedTestsTitle: { fontWeight: 'bold', marginBottom: normalize(12) },
  cartItem: { borderBottomWidth: 1, borderBottomColor: COLORS.LIGHT_GREY, paddingBottom: normalize(16), marginBottom: normalize(16) },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: normalize(8) },
  itemTitle: { fontWeight: 'bold', flex: 1 },
  priceContainer: { alignItems: 'flex-end' },
  itemPrice: { fontWeight: 'bold' },
  originalPrice: { textDecorationLine: 'line-through', color: COLORS.GREY },
  itemCode: { color: COLORS.GREY, marginBottom: normalize(4) },
  itemDescription: { color: COLORS.GREY, marginBottom: normalize(8) },
  viewMoreButton: { marginBottom: normalize(8) },
  viewMoreText: { color: COLORS.PRIMARY, textDecorationLine: 'underline' },
  includedTestsContainer: { marginTop: normalize(8), backgroundColor: COLORS.WHITE, padding: normalize(8), borderRadius: normalize(8), borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  includedTestsTitle: { fontWeight: 'bold', marginBottom: normalize(4), color: COLORS.BLACK },
  testItem: { flexDirection: 'row', alignItems: 'center', marginBottom: normalize(4) },
  testText: { marginLeft: normalize(4), color: COLORS.BLACK },
  totalPriceText: { fontWeight: 'bold', marginTop: normalize(12), textAlign: 'right' },
  loader: { marginTop: normalize(20) },
  errorText: { textAlign: 'center', marginTop: normalize(20), color: COLORS.ERROR },
  noLabsText: { textAlign: 'center', marginTop: normalize(20) },
  labCard: { backgroundColor: COLORS.WHITE, borderRadius: normalize(8), padding: normalize(12), marginBottom: normalize(12), elevation: 2 },
  labInfo: { flexDirection: 'row', justifyContent: 'space-between' },
  labDetails: { flex: 1 },
  labName: { fontWeight: 'bold', marginBottom: normalize(4) },
  labLocation: { color: COLORS.GREY, marginBottom: normalize(4) },
  labMeta: { flexDirection: 'row', marginBottom: normalize(4) },
  labRating: { color: COLORS.GREY, marginRight: normalize(12) },
  labReportTime: { color: COLORS.GREY },
  homeCollectionBadge: { backgroundColor: COLORS.LIGHT_GREEN, padding: normalize(4), borderRadius: normalize(4), alignSelf: 'flex-start', marginTop: normalize(4) },
  homeCollectionText: { color: COLORS.GREEN, fontSize: normalize(12) },
  labPrice: { fontWeight: 'bold' },
});

export default AvailableLabs;
