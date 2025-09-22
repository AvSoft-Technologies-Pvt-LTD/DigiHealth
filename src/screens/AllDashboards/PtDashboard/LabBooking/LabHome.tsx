import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, FlatList, TouchableOpacity, TextInput, ActivityIndicator, ListRenderItem,} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { Tabs } from '../../../../components/CommonComponents/Tabs';
import AvCard from '../../../../elements/AvCards';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// ---------------- TYPES ----------------
type Test = {
  id: string;
  title: string;
  code: string;
  description: string;
  price: number;
};

type Scan = {
  id: string;
  title: string;
  code: string;
  description: string;
  price: number;
};

type Package = {
  id: string;
  title: string;
  testsCount: number;
  price: number;
  originalPrice: number;
  tests: string[];
};

type RootStackParamList = {
  LabHome: undefined;
  DetailsPage: { id: string };
  LabCart: { cart: (Test | Scan | Package)[] };
  AvailableLabs: { cart: (Test | Scan | Package)[] };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// ---------------- CONSTANTS ----------------
const API_URL =
  'https://mocki.io/v1/eef2e0ad-4941-4900-94c5-bc63e7c661f8';

// ---------------- COMPONENTS ----------------

// SearchBar
const SearchBar = ({
  onSearch,
  cartItemCount,
  onCartPress,
}: {
  onSearch: (text: string) => void;
  cartItemCount: number;
  onCartPress: () => void;
}) => {
  const [searchText, setSearchText] = useState('');

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.searchInputContainer}>
        <Icon
          name="search"
          size={20}
          color={COLORS.GREY}
          style={styles.searchIcon}
        />
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
      <TouchableOpacity
        style={styles.cartIconContainer}
        onPress={onCartPress}
      >
        <Icon name="shopping-cart" size={24} color={COLORS.PRIMARY} />
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

// PrescriptionUploadCard
const PrescriptionUploadCard = () => (
  <View style={styles.prescriptionCard}>
    <View style={styles.prescriptionRow}>
      <Icon name="upload-file" size={32} color={COLORS.WHITE} />
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

// Card Props
interface CardProps<T> {
  item: T;
  onPress: () => void;
  onAdd: () => void;
  onBookNow: () => void;
}

// TestCard
const TestCard = ({ item, onPress, onAdd, onBookNow }: CardProps<Test>) => (
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
              <Icon name="add-circle" size={30} color={COLORS.PRIMARY} />
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

// ScanCard
const ScanCard = ({ item, onPress, onAdd, onBookNow }: CardProps<Scan>) => (
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
              <Icon name="add-circle" size={30} color={COLORS.PRIMARY} />
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

// PackageCard
const PackageCard = ({
  item,
  onPress,
  onAdd,
  onBookNow,
}: CardProps<Package>) => (
  <AvCard cardStyle={styles.packageCard}>
    <TouchableOpacity onPress={onPress}>
      <View style={styles.packageCardContent}>
        <View style={styles.packageHeader}>
          <AvText type="title_6" style={styles.packageName}>
            {item.title}
          </AvText>
          <View style={styles.testsCountBadge}>
            <AvText type="body" style={styles.testsCountText}>
              {item.testsCount} Tests
            </AvText>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <AvText type="description" style={styles.packagePrice}>
            ₹{item.price}
          </AvText>
          <AvText type="body" style={styles.packageOldPrice}>
            ₹{item.originalPrice}
          </AvText>
        </View>
        <View style={styles.packageIncludes}>
          {item.tests.map((test, index) => (
            <AvText key={index} type="body" style={styles.packageInclude}>
              • {test}
            </AvText>
          ))}
        </View>
        <View style={styles.packageButtons}>
          <TouchableOpacity style={styles.addButton} onPress={onAdd}>
            <Icon name="add-circle" size={30} color={COLORS.PRIMARY} />
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

// ---------------- MAIN COMPONENT ----------------
const LabHome: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tests' | 'scans'>('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [tests, setTests] = useState<Test[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<(Test | Scan | Package)[]>([]);
  const navigation = useNavigation<NavigationProp>();

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
    test.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredScans = scans.filter((scan) =>
    scan.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (id: string) => {
    navigation.navigate('DetailsPage', { id });
  };

  const handleAddToCart = (item: Test | Scan | Package) => {
    setCart((prevCart) => {
      const isItemInCart = prevCart.some((cartItem) => cartItem.id === item.id);
      if (!isItemInCart) {
        return [...prevCart, item];
      }
      return prevCart;
    });
  };

  const handleBookNow = (item: Test | Scan | Package) => {
    navigation.navigate('AvailableLabs', { cart: [item] });
  };

  const handleNavigateToCart = () => {
    navigation.navigate('LabCart', { cart });
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

export default LabHome;

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  scrollView: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: COLORS.PRIMARY },
  cartIconContainer: { marginLeft: 12, position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.ERROR,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: COLORS.WHITE, fontSize: 12, fontWeight: 'bold' },
  prescriptionCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    marginBottom: 16,
  },
  prescriptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prescriptionText: { flex: 1, marginLeft: 8 },
  prescriptionTitle: { color: COLORS.WHITE, fontWeight: 'bold', fontSize: 16 },
  prescriptionSubtext: { color: COLORS.WHITE, fontSize: 12, opacity: 0.9 },
  uploadButton: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginLeft: 12,
  },
  uploadButtonText: { color: COLORS.PRIMARY, fontWeight: '500', fontSize: 12 },
  testCard: { marginBottom: 12 },
  testCardContent: { padding: 12 },
  testHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  testTitle: { fontWeight: 'bold' },
  testCode: { color: COLORS.GREY },
  testDescription: { color: COLORS.GREY, marginBottom: 8 },
  testFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  testPrice: { fontWeight: 'bold' },
  testButtons: { flexDirection: 'row' },
  addButton: { padding: 4 },
  bookButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: 8,
    borderRadius: 6,
    marginLeft: 8,
  },
  bookButtonText: { color: COLORS.WHITE },
  scanCard: { marginBottom: 12 },
  scanCardContent: { padding: 12 },
  scanHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  scanTitle: { fontWeight: 'bold' },
  scanCode: { color: COLORS.GREY },
  scanDescription: { color: COLORS.GREY, marginBottom: 8 },
  scanFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  scanPrice: { fontWeight: 'bold' },
  scanButtons: { flexDirection: 'row' },
  packageCard: { marginBottom: 12 },
  packageCardContent: { padding: 12 },
  packageHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  packageName: { fontWeight: 'bold' },
  testsCountBadge: { backgroundColor: COLORS.LIGHT_GREY, padding: 4, borderRadius: 4 },
  testsCountText: { fontSize: 12 },
  packagePrice: { fontWeight: 'bold' },
  packageOldPrice: { textDecorationLine: 'line-through', color: COLORS.GREY, marginLeft: 8 },
  packageIncludes: { marginBottom: 12 },
  packageInclude: { color: COLORS.GREY, marginBottom: 2 },
  packageButtons: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  sectionTitle: { fontWeight: 'bold', marginVertical: 12 },
  listContent: { paddingBottom: 16 },
});
