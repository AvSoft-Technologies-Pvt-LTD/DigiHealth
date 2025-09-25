import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator,} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { Tabs } from '../../../../components/CommonComponents/Tabs';
import AvCard from '../../../../elements/AvCards';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { PAGES } from '../../../../constants/pages';
import { normalize } from '../../../../constants/platform';

// Types
type Test = {
  id: string;
  title: string;
  code: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: 'test';
};

type Scan = {
  id: string;
  title: string;
  code: string;
  description: string;
  price: number;
  originalPrice?: number;
  type: 'scan';
};

type Package = {id: string;
title: string;
  testsCount: number;
  price: number;
  originalPrice: number;
  tests: Array<{ title: string; code?: string; price?: number }>;
  type: 'package';
  includedTests?: Array<{ id: string; title: string; type: 'test'; price: number }>;
};

type RootStackParamList = {
  [PAGES.LAB_HOME]: undefined;
  [PAGES.LAB_DETAILS_PAGE]: { id: string; cart: any[]; setCart: (cart: any[]) => void };
  [PAGES.LAB_CART]: { cart: any[]; setCart: (cart: any[]) => void };
  [PAGES.AVAILABLE_LABS]: { cart: any[]; testDetails: any[] };
};

const API_URL = 'https://mocki.io/v1/64038255-16d2-4d67-a269-a35cbeca1c62';

// Components
const SearchBar = ({ onSearch,cartItemCount,onCartPress,}: {
  onSearch: (text: string) => void;
  cartItemCount: number;
  onCartPress: () => void;
}) => {
  const [searchText, setSearchText] = useState('');
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchInputContainer}>
        <Icon name="search" size={normalize(20)} color={COLORS.GREY} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for tests, scans..."
          placeholderTextColor={COLORS.GREY}
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            onSearch(text);
          }}
        />
      </View>
      <TouchableOpacity style={styles.cartIconContainer} onPress={onCartPress}>
        <Icon name="shopping-cart" size={normalize(24)} color={COLORS.PRIMARY} />
        {cartItemCount > 0 && (
          <View style={styles.cartBadge}>
            <AvText type="body" style={styles.cartBadgeText}>
              {cartItemCount}
            </AvText>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

const PrescriptionUploadCard = () => (
  <View style={styles.prescriptionCard}>
    <View style={styles.prescriptionRow}>
      <Icon name="upload-file" size={normalize(32)} color={COLORS.WHITE} />
      <View style={styles.prescriptionText}>
        <AvText type="title_6" style={styles.prescriptionTitle}>
          Have a prescription? Upload it!
        </AvText>
        <AvText type="body" style={styles.prescriptionSubtext}>
          Get personalized test recommendations
        </AvText>
      </View>
      <TouchableOpacity style={styles.uploadButton}>
        <AvText type="buttonText" style={styles.uploadButtonText}>
          Upload Prescription
        </AvText>
      </TouchableOpacity>
    </View>
  </View>
);

const TestCard = ({item,onPress,onAdd,onBookNow,}: {
  item: Test;
  onPress: () => void;
  onAdd: () => void;
  onBookNow: () => void;
}) => (
  <AvCard cardStyle={styles.testCard}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.testCardContent}>
        <View style={styles.testHeader}>
          <AvText type="title_6" style={styles.testTitle}>
            {item.title}
          </AvText>
          <AvText type="body" style={styles.testCode}>
            Code: {item.code}
          </AvText>
        </View>
        <AvText type="body" style={styles.testDescription}>
          {item.description}
        </AvText>
        <View style={styles.testFooter}>
          <AvText type="description" style={styles.testPrice}>
            ₹{item.price}
          </AvText>
          <View style={styles.testButtons}>
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Icon name="add-circle" size={normalize(30)} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookButton} onPress={onBookNow}>
              <AvText type="buttonText" style={styles.bookButtonText}>
                Book Now
              </AvText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </AvCard>
);

const ScanCard = ({
  item,
  onPress,
  onAdd,
  onBookNow,
}: {
  item: Scan;
  onPress: () => void;
  onAdd: () => void;
  onBookNow: () => void;
}) => (
  <AvCard cardStyle={styles.scanCard}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.scanCardContent}>
        <View style={styles.scanHeader}>
          <AvText type="title_6" style={styles.scanTitle}>
            {item.title}
          </AvText>
          <AvText type="body" style={styles.scanCode}>
            Code: {item.code}
          </AvText>
        </View>
        <AvText type="body" style={styles.scanDescription}>
          {item.description}
        </AvText>
        <View style={styles.scanFooter}>
          <AvText type="description" style={styles.scanPrice}>
            ₹{item.price}
          </AvText>
          <View style={styles.scanButtons}>
            <TouchableOpacity style={styles.addButton} onPress={onAdd}>
              <Icon name="add-circle" size={normalize(30)} color={COLORS.PRIMARY} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.bookButton} onPress={onBookNow}>
              <AvText type="buttonText" style={styles.bookButtonText}>
                Book Now
              </AvText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  </AvCard>
);

const PackageCard = ({
  item,
  onPress,
  onAdd,
  onBookNow,
}: {
  item: Package;
  onPress: () => void;
  onAdd: () => void;
  onBookNow: () => void;
}) => (
  <AvCard cardStyle={styles.packageCard}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.packageCardContent}>
        <View style={styles.packageHeader}>
          <AvText type="title_6" style={styles.packageName}>
            {item.title}
          </AvText>
          <TouchableOpacity onPress={onPress} style={styles.testsCountBadge}>
            <AvText type="body" style={styles.testsCountText}>
              {item.testsCount} Tests
            </AvText>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: normalize(8) }}>
          <AvText type="description" style={styles.packagePrice}>
            ₹{item.price}
          </AvText>
          <AvText type="body" style={styles.packageOldPrice}>
            ₹{item.originalPrice}
          </AvText>
        </View>
        <View style={styles.packageIncludes}>
          {item.tests.slice(0, 3).map((test, index) => (
            <AvText key={index} type="body" style={styles.packageInclude}>
              • {test.title}
            </AvText>
          ))}
          <TouchableOpacity onPress={onPress}>
            <AvText type="Link" style={styles.viewMoreText}>
              View More
            </AvText>
          </TouchableOpacity>
        </View>
        <View style={styles.packageButtons}>
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Icon name="add-circle" size={normalize(30)} color={COLORS.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookButton} onPress={onBookNow}>
            <AvText type="buttonText" style={styles.bookButtonText}>
              Book Now
            </AvText>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  </AvCard>
);

// Main Component
const LabHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'scans'>('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState<Test[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(API_URL);
        setTests(response.data.tests);
        setScans(response.data.scans);
        setPackages(response.data.packages);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTests = tests.filter((test) =>
    test.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const filteredScans = scans.filter((scan) =>
    scan.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCardPress = (id: string) => {
    navigation.navigate(PAGES.LAB_DETAILS_PAGE, { id, cart, setCart });
  };

  const handleAddToCart = (item: Test | Scan | Package) => {
    setCart((prevCart) => {
      const isItemInCart = prevCart.some((cartItem) => cartItem.id === item.id);
      if (!isItemInCart) {
        if (item.type === 'package') {
          return [...prevCart, { ...item, includedTests: item.tests }];
        }
        return [...prevCart, item];
      }
      return prevCart;
    });
  };

  const handleBookNow = (item: Test | Scan | Package) => {
    let testDetails: any[] = [];
    if (item.type === 'package') {
      testDetails = [
        item,
        ...item.tests.map((test, index) => ({
          id: `${item.id}_${index}`,
          title: test.title,
          code: test.code || 'N/A',
          price: test.price || 0,
          type: 'test',
        })),
      ];
    } else {
      testDetails = [item];
    }
    navigation.navigate(PAGES.AVAILABLE_LABS, {
      cart: [...cart, item],
      testDetails,
    });
  };

  const handleNavigateToCart = () => {
    navigation.navigate(PAGES.LAB_CART, { cart, setCart });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar
        onSearch={setSearchQuery}
        cartItemCount={cart.length}
        onCartPress={handleNavigateToCart}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <PrescriptionUploadCard />
        <Tabs
          tabs={[
            { key: 'tests', label: 'Tests' },
            { key: 'scans', label: 'Scans' },
          ]}
          activeTab={activeTab}
          onTabChange={(key) => setActiveTab(key as 'tests' | 'scans')}
        />
        {activeTab === 'tests' ? (
          <>
            <FlatList
              data={filteredTests}
              renderItem={({ item }) => (
                <TestCard
                  item={item}
                  onPress={() => handleCardPress(item.id)}
                  onAdd={() => handleAddToCart(item)}
                  onBookNow={() => handleBookNow(item)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
            />
            <AvText type="title_6" style={styles.sectionTitle}>
              Popular Health Packages
            </AvText>
            <FlatList
              data={packages}
              renderItem={({ item }) => (
                <PackageCard
                  item={item}
                  onPress={() => handleCardPress(item.id)}
                  onAdd={() => handleAddToCart(item)}
                  onBookNow={() => handleBookNow(item)}
                />
              )}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.listContent}
              scrollEnabled={false}
            />
          </>
        ) : (
          <FlatList
            data={filteredScans}
            renderItem={({ item }) => (
              <ScanCard
                item={item}
                onPress={() => handleCardPress(item.id)}
                onAdd={() => handleAddToCart(item)}
                onBookNow={() => handleBookNow(item)}
              />
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  scrollView: { flex: 1, padding: normalize(16) },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', padding: normalize(16), backgroundColor: COLORS.WHITE, borderBottomWidth: 1, borderBottomColor: COLORS.LIGHT_GREY },
  searchInputContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.WHITE, borderRadius: normalize(12), paddingHorizontal: normalize(12), paddingVertical: normalize(8), borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  searchIcon: { marginRight: normalize(8) },
  searchInput: { flex: 1, fontSize: normalize(16), color: COLORS.PRIMARY },
  cartIconContainer: { marginLeft: normalize(12), position: 'relative' },
  cartBadge: { position: 'absolute', top: -normalize(8), right: -normalize(8), backgroundColor: COLORS.ERROR, borderRadius: normalize(10), width: normalize(20), height: normalize(20), justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { color: COLORS.WHITE, fontSize: normalize(12), fontWeight: 'bold' },
  prescriptionCard: { backgroundColor: COLORS.PRIMARY, borderRadius: normalize(12), padding: normalize(16), marginHorizontal: normalize(4), marginBottom: normalize(16) },
  prescriptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prescriptionText: { flex: 1, marginLeft: normalize(8) },
  prescriptionTitle: { color: COLORS.WHITE, fontWeight: 'bold', fontSize: normalize(16) },
  prescriptionSubtext: { color: COLORS.WHITE, fontSize: normalize(12), opacity: 0.9 },
  uploadButton: { backgroundColor: COLORS.WHITE, paddingVertical: normalize(8), paddingHorizontal: normalize(16), borderRadius: normalize(20), marginLeft: normalize(12) },
  uploadButtonText: { color: COLORS.PRIMARY, fontWeight: '500', fontSize: normalize(12) },
  testCard: { marginBottom: normalize(12) },
  testCardContent: { padding: normalize(12) },
  testHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(4) },
  testTitle: { fontWeight: 'bold' },
  testCode: { color: COLORS.GREY },
  testDescription: { color: COLORS.GREY, marginBottom: normalize(8) },
  testFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  testPrice: { fontWeight: 'bold' },
  testButtons: { flexDirection: 'row', alignItems: 'center' },
  addButton: { padding: normalize(4) },
  bookButton: { backgroundColor: COLORS.SECONDARY, padding: normalize(8), borderRadius: normalize(6), marginLeft: normalize(8) },
  bookButtonText: { color: COLORS.WHITE },
  scanCard: { marginBottom: normalize(12) },
  scanCardContent: { padding: normalize(12) },
  scanHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(4) },
  scanTitle: { fontWeight: 'bold' },
  scanCode: { color: COLORS.GREY },
  scanDescription: { color: COLORS.GREY, marginBottom: normalize(8) },
  scanFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scanPrice: { fontWeight: 'bold' },
  scanButtons: { flexDirection: 'row', alignItems: 'center' },
  packageCard: { marginBottom: normalize(12) },
  packageCardContent: { padding: normalize(12) },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(4) },
  packageName: { fontWeight: 'bold' },
  testsCountBadge: { backgroundColor: COLORS.LIGHT_GREY, padding: normalize(4), borderRadius: normalize(4) },
  testsCountText: { fontSize: normalize(12), color: COLORS.PRIMARY },
  viewMoreText: { color: COLORS.PRIMARY, textDecorationLine: 'underline', marginTop: normalize(4) },
  packagePrice: { fontWeight: 'bold' },
  packageOldPrice: { textDecorationLine: 'line-through', color: COLORS.GREY, marginLeft: normalize(8) },
  packageIncludes: { marginBottom: normalize(12) },
  packageInclude: { color: COLORS.GREY, marginBottom: normalize(2) },
  packageButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: normalize(8) },
  sectionTitle: { fontWeight: 'bold', marginVertical: normalize(12) },
  listContent: { paddingBottom: normalize(16) },
});

export default LabHome;
