import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, ActivityIndicator, FlatList, Linking, StyleSheet, Alert } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPharmacyList } from '../../../store/thunks/patientThunks';
import { AvCards, AvText, AvTextInput, AvIcons } from '../../../elements';
import { normalize } from '../../../constants/platform';

interface Pharmacy {
  id: string | number;
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  hours?: string;
}

const PharmacyFinderContent = () => {
  const dispatch = useAppDispatch();
  const { pharmacyListData: pharmacies, loading, error } = useAppSelector((state) => state.pharmacy);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const fetchPharmacies = async (query: string = '') => {
    setIsSearching(true);
    try {
      await dispatch(fetchPharmacyList(query));
    } catch (err) {
      console.error('Failed to fetch pharmacies:', err);
      Alert.alert('Error', 'Failed to fetch pharmacies. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    fetchPharmacies(); // Fetch all pharmacies on initial load
  }, []);

  const handleSearch = () => {
    fetchPharmacies(searchQuery); // Fetch pharmacies for the searched city
  };

  const getDirectionsUrl = (lat: number, lon: number, name: string): string => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}&travelmode=driving`;
  };

  return (
    <View style={styles.container}>
      <AvText type='heading_4' style={styles.title}>Pharmacy Finder</AvText>
      <AvText type='body' style={styles.subtitle}>Search pharmacies by city or name</AvText>
      <View style={styles.searchRow}>
        <AvTextInput
          style={styles.input}
          placeholder="Enter city or pharmacy name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn} disabled={isSearching}>
          {isSearching ? (
            <ActivityIndicator color={COLORS.WHITE} size="small" />
          ) : (
            <AvIcons type={"MaterialIcons"} name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      {error && <AvText type='body' style={styles.error}>{error}</AvText>}
      {loading || isSearching ? (
        <ActivityIndicator size="large" color={COLORS.GREEN} style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <AvText type='body' style={styles.emptyText}>
              {searchQuery ? 'No pharmacies found matching your search' : 'No pharmacies available'}
            </AvText>
          }
          renderItem={({ item }) => (
            <AvCards title={item.name} icon={<AvIcons type={"MaterialIcons"} name="local-pharmacy" size={22} color={COLORS.PRIMARY} />}>
              <View style={styles.cardContent}>
                <View style={styles.cardRow}>
                  <AvIcons type={"MaterialIcons"} name="location-on" size={16} color={COLORS.PRIMARY} />
                  <AvText type='body' style={styles.cardText} numberOfLines={2}>
                    {item.address}
                  </AvText>
                </View>
                {item.hours && (
                  <View style={styles.cardRow}>
                    <AvIcons type={"MaterialIcons"} name="access-time" size={16} color={COLORS.PRIMARY} />
                    <AvText type='body' style={styles.cardText}>{item.hours}</AvText>
                  </View>
                )}
                <View style={styles.cardRow}>
                  <AvIcons type={"MaterialIcons"} name="phone" size={16} color={COLORS.PRIMARY} />
                  <AvText type='body' style={styles.cardText}>{item.phone || 'Not available'}</AvText>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.directionsBtn}
                    onPress={() => Linking.openURL(getDirectionsUrl(item.latitude, item.longitude, item.name))}
                  >
                    <AvIcons type={"MaterialIcons"} name="navigation" size={18} color="#0E1630" />
                    <AvText type='body' style={styles.directionsText}>Directions</AvText>
                  </TouchableOpacity>
                  {item.phone && item.phone !== 'Not available' && (
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => Linking.openURL(`tel:${item.phone}`)}
                    >
                      <AvIcons type={"MaterialIcons"} name="call" size={18} color="#fff" />
                      <AvText type='body' style={styles.callText}>Call</AvText>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </AvCards>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: normalize(16),
    marginVertical: normalize(20),
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    color: '#0E1630',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    color: '#666',
  },
  searchRow: {
    flexDirection: 'row',
    marginBottom: normalize(16),
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    backgroundColor: '#fff',
  },
  searchBtn: {
    backgroundColor: '#0E1630',
    padding: normalize(12),
    borderRadius: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  error: {
    color: 'red',
    marginVertical: normalize(8),
    textAlign: 'center',
    fontSize: normalize(14),
  },
  emptyText: {
    textAlign: 'center',
    marginTop: normalize(20),
    color: '#666',
    paddingHorizontal: normalize(20),
  },
  loadingIndicator: {
    marginVertical: normalize(20),
  },
  listContent: {
    paddingBottom: normalize(20),
    flexGrow: 1,
  },
  cardContent: {
    gap: normalize(6),
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
    flexShrink: 1,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: normalize(10),
    gap: normalize(10),
  },
  directionsBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#0E1630',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(6),
    alignItems: 'center',
  },
  directionsText: {
    color: '#0E1630',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: normalize(12),
  },
  callBtn: {
    flexDirection: 'row',
    backgroundColor: '#01D48C',
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(6),
    alignItems: 'center',
  },
  callText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: normalize(12),
  },
});

export default PharmacyFinderContent;
