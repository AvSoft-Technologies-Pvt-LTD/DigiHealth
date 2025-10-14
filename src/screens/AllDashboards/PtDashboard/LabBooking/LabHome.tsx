import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../../store';
import {
  fetchLabTests,
  fetchLabScans,
  fetchAllLabData,
} from '../../../../store/thunks/patientThunks';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { Tabs } from '../../../../components/CommonComponents/Tabs';
import { normalize } from '../../../../constants/platform';
import { PAGES } from '../../../../constants/pages';

// ---------------- Types ----------------
type Test = {
  id: string;
  title: string;
  code?: string;
  description?: string;
  price?: number;
  type: 'test';
};

type Scan = {
  id: string;
  title: string;
  code?: string;
  description?: string;
  price?: number;
  type: 'scan';
};

type CartItem = Test | Scan;

type RootStackParamList = {
  [PAGES.LAB_HOME]: undefined;
  [PAGES.LAB_DETAILS_PAGE]: { id: string; cart: CartItem[]; setCart: (cart: CartItem[]) => void };
  [PAGES.LAB_CART]: { cart: CartItem[]; setCart: (cart: CartItem[]) => void };
  [PAGES.AVAILABLE_LABS]: { cart: CartItem[]; testDetails: CartItem[] };
};

// ---------------- Search Bar ----------------
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

// ---------------- Upload Prescription ----------------
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
          Upload
        </AvText>
      </TouchableOpacity>
    </View>
  </View>
);

// ---------------- Main Component ----------------
const LabHome: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState<'tests' | 'scans'>('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const {
    labTestsData,
    labScansData,
    loadingTests,
    loadingScans,
    errorTests,
    errorScans,
  } = useSelector((state: RootState) => state.labs);

  useEffect(() => {
    dispatch(fetchAllLabData());
  }, [dispatch]);

  const filteredTests = labTestsData.filter((test) =>
    test.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredScans = labScansData.filter((scan) =>
    scan.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (id: string) => {
    navigation.navigate(PAGES.LAB_DETAILS_PAGE, { id, cart, setCart });
  };

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      if (!prev.some((cartItem) => cartItem.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const handleBookNow = (item: CartItem) => {
    navigation.navigate(PAGES.AVAILABLE_LABS, { cart: [...cart, item], testDetails: [item] });
  };

  const handleNavigateToCart = () => {
    navigation.navigate(PAGES.LAB_CART, { cart, setCart });
  };

  if (loadingTests || loadingScans) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.PRIMARY} />
      </View>
    );
  }

  if (errorTests || errorScans) {
    return (
      <View style={styles.loadingContainer}>
        <AvText type="body" style={{ color: COLORS.ERROR }}>
          Failed to load lab data: {errorTests || errorScans}
        </AvText>
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
          <FlatList
            data={filteredTests}
            renderItem={({ item }) => (
              <AvCard cardStyle={styles.testCard}>
                <TouchableOpacity onPress={() => handleCardPress(item.id)}>
                  <View style={styles.testCardContent}>
                    <AvText type="title_6" style={styles.testTitle}>
                      {item.title || 'undefined'}
                    </AvText>
                    <AvText type="body" style={styles.testDescription}>
                      {item.description || 'No description'}
                    </AvText>
                    <View style={styles.testFooter}>
                      <AvText type="description" style={styles.testPrice}>
                        ₹{item.price ?? 'N/A'}
                      </AvText>
                      <View style={styles.testButtons}>
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
                          <Icon name="add-circle" size={normalize(30)} color={COLORS.PRIMARY} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bookButton} onPress={() => handleBookNow(item)}>
                          <AvText type="buttonText" style={styles.bookButtonText}>
                            Book Now
                          </AvText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </AvCard>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        ) : (
          <FlatList
            data={filteredScans}
            renderItem={({ item }) => (
              <AvCard cardStyle={styles.testCard}>
                <TouchableOpacity onPress={() => handleCardPress(item.id)}>
                  <View style={styles.testCardContent}>
                    <AvText type="title_6" style={styles.testTitle}>
                      {item.title || 'undefined'}
                    </AvText>
                    <AvText type="body" style={styles.testDescription}>
                      {item.description || 'No description'}
                    </AvText>
                    <View style={styles.testFooter}>
                      <AvText type="description" style={styles.testPrice}>
                        ₹{item.price ?? 'N/A'}
                      </AvText>
                      <View style={styles.testButtons}>
                        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
                          <Icon name="add-circle" size={normalize(30)} color={COLORS.PRIMARY} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bookButton} onPress={() => handleBookNow(item)}>
                          <AvText type="buttonText" style={styles.bookButtonText}>
                            Book Now
                          </AvText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </AvCard>
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

// ---------------- Styles ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.BG_OFF_WHITE },
  scrollView: { flex: 1, padding: normalize(16) },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  searchIcon: { marginRight: normalize(8) },
  searchInput: { flex: 1, fontSize: normalize(16), color: COLORS.PRIMARY },
  cartIconContainer: { marginLeft: normalize(12), position: 'relative' },
  cartBadge: {
    position: 'absolute',
    top: -normalize(8),
    right: -normalize(8),
    backgroundColor: COLORS.ERROR,
    borderRadius: normalize(10),
    width: normalize(20),
    height: normalize(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: { color: COLORS.WHITE, fontSize: normalize(12), fontWeight: 'bold' },
  prescriptionCard: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: normalize(12),
    padding: normalize(16),
    marginHorizontal: normalize(4),
    marginBottom: normalize(16),
  },
  prescriptionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  prescriptionText: { flex: 1, marginLeft: normalize(8) },
  prescriptionTitle: { color: COLORS.WHITE, fontWeight: 'bold', fontSize: normalize(16) },
  prescriptionSubtext: { color: COLORS.WHITE, fontSize: normalize(12), opacity: 0.9 },
  uploadButton: {
    backgroundColor: COLORS.WHITE,
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    borderRadius: normalize(20),
    marginLeft: normalize(12),
  },
  uploadButtonText: { color: COLORS.PRIMARY, fontWeight: '500', fontSize: normalize(12) },
  testCard: { marginBottom: normalize(12) },
  testCardContent: { padding: normalize(12) },
  testTitle: { fontWeight: 'bold' },
  testDescription: { color: COLORS.GREY, marginBottom: normalize(8) },
  testFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  testPrice: { fontWeight: 'bold' },
  testButtons: { flexDirection: 'row', alignItems: 'center' },
  addButton: { padding: normalize(4) },
  bookButton: {
    backgroundColor: COLORS.SECONDARY,
    padding: normalize(8),
    borderRadius: normalize(6),
    marginLeft: normalize(8),
  },
  bookButtonText: { color: COLORS.WHITE },
  listContent: { paddingBottom: normalize(16) },
});

export default LabHome;
