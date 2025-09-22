import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { SearchFilterBar } from '../../../../components/CommonComponents/SearchFilter';

const AvailableLabs = () => {
  const route = useRoute();
const { cart, testDetails } = route.params as { cart: any[]; testDetails: any[] };
  const navigation = useNavigation();
  const [labs, setLabs] = useState<any[]>([]);
  const [filteredLabs, setFilteredLabs] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter options for the SearchFilterBar
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
    // Make API call to fetch lab data
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

    // Apply search filter
    if (searchValue.trim()) {
      filtered = filtered.filter((lab) =>
        lab.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        lab.location.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Apply city filters
    if (selectedFilters.cityDelhi) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('delhi'));
    }
    if (selectedFilters.cityMumbai) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('mumbai'));
    }
    if (selectedFilters.cityBangalore) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('bangalore'));
    }
    if (selectedFilters.cityHyderabad) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('hyderabad'));
    }
    if (selectedFilters.cityPune) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('pune'));
    }
    if (selectedFilters.cityChennai) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('chennai'));
    }
    if (selectedFilters.cityKolkata) {
      filtered = filtered.filter((lab) => lab.location.toLowerCase().includes('kolkata'));
    }

    // Apply home collection filter
    if (selectedFilters.homeCollection) {
      filtered = filtered.filter((lab) => lab.homeCollection === true);
    }

    setFilteredLabs(filtered);
  };

  const totalPrice = cart.reduce((sum, test) => sum + test.price, 0);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <AvText style={styles.backIcon}>←</AvText>
        <AvText style={styles.backText}>Back to Cart</AvText>
      </TouchableOpacity>

      <AvCard style={styles.selectedTestsCard}>
        <AvText type="title_6" style={styles.selectedTestsTitle}>Selected Tests</AvText>
        {cart.map((test) => (
          <View key={test.id} style={styles.testItem}>
            <AvText type="body" style={styles.testTitle}>{test.title}</AvText>
            <AvText type="body" style={styles.testCode}>Code: {test.code}</AvText>
            <AvText type="body" style={styles.testPrice}>Price: ₹{test.price}</AvText>
          </View>
        ))}
      </AvCard>

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
  onPress={() =>navigation.navigate('LabBooking', { lab, cart, testDetails })}
>
  <AvCard>
    <View style={styles.labInfo}>
      <View style={styles.labDetails}>
        <AvText type="title_6" style={styles.labName}>{lab.name}</AvText>
        <AvText type="body" style={styles.labLocation}>Location: {lab.location}</AvText>
        <View style={styles.labMeta}>
          <AvText type="body" style={styles.labRating}>Rating: {lab.rating || 'N/A'}</AvText>
          {lab.reportTime && (
            <AvText type="body" style={styles.labReportTime}>Report Time: {lab.reportTime}</AvText>
          )}
        </View>
        {lab.homeCollection && (
          <View style={styles.homeCollectionBadge}>
            <AvText type="body" style={styles.homeCollectionText}>Home Collection Available</AvText>
          </View>
        )}
      </View>
      <AvText type="description" style={styles.labPrice}>₹{totalPrice}</AvText>
    </View>
  </AvCard>
</TouchableOpacity>

        ))
      )}
    </ScrollView>
  );
};

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
  backIcon: {
    fontSize: 20,
    color: COLORS.PRIMARY,
    marginRight: 8,
  },
  backText: {
    color: COLORS.PRIMARY,
  },
  selectedTestsCard: {
    marginBottom: 16,
    padding: 12,
  },
  selectedTestsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  testItem: {
    marginBottom: 8,
  },
  testTitle: {
    fontWeight: 'bold',
  },
  testCode: {
    color: COLORS.GREY,
  },
  testPrice: {
    color: COLORS.GREY,
  },
  loader: {
    marginTop: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.RED,
  },
  noLabsText: {
    textAlign: 'center',
    marginTop: 20,
  },
  labCard: {
    marginBottom: 12,
  },
  labInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
  },
  labDetails: {
    flex: 1,
  },
  labName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  labLocation: {
    color: COLORS.GREY,
    marginBottom: 4,
  },
  labMeta: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  labRating: {
    color: COLORS.GREY,
    marginRight: 12,
  },
  labReportTime: {
    color: COLORS.GREY,
  },
  homeCollectionBadge: {
    backgroundColor: COLORS.LIGHT_GREEN,
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  homeCollectionText: {
    color: COLORS.GREEN,
    fontSize: 12,
  },
  labPrice: {
    fontWeight: 'bold',
  },
});

export default AvailableLabs;
