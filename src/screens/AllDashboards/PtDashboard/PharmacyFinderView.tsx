import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList, Linking, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';
import AvCard from '../../../elements/AvCards';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchPharmacyList } from '../../../store/thunks/patientThunks';

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
      <Text style={styles.title}>Pharmacy Finder</Text>
      <Text style={styles.subtitle}>Search pharmacies by city or name</Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          placeholder="Enter city or pharmacy name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchBtn} disabled={isSearching}>
          {isSearching ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Icon name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {loading || isSearching ? (
        <ActivityIndicator size="large" color="#01D48C" style={styles.loadingIndicator} />
      ) : (
        <FlatList
          data={pharmacies}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {searchQuery ? 'No pharmacies found matching your search' : 'No pharmacies available'}
            </Text>
          }
          renderItem={({ item }) => (
            <AvCard title={item.name} icon={<Icon name="local-pharmacy" size={22} color={COLORS.PRIMARY} />}>
              <View style={styles.cardContent}>
                <View style={styles.cardRow}>
                  <Icon name="location-on" size={16} color={COLORS.PRIMARY} />
                  <Text style={styles.cardText} numberOfLines={2}>
                    {item.address}
                  </Text>
                </View>
                {item.hours && (
                  <View style={styles.cardRow}>
                    <Icon name="access-time" size={16} color={COLORS.PRIMARY} />
                    <Text style={styles.cardText}>{item.hours}</Text>
                  </View>
                )}
                <View style={styles.cardRow}>
                  <Icon name="phone" size={16} color={COLORS.PRIMARY} />
                  <Text style={styles.cardText}>{item.phone || 'Not available'}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.directionsBtn}
                    onPress={() => Linking.openURL(getDirectionsUrl(item.latitude, item.longitude, item.name))}
                  >
                    <Icon name="navigation" size={18} color="#0E1630" />
                    <Text style={styles.directionsText}>Directions</Text>
                  </TouchableOpacity>
                  {item.phone && item.phone !== 'Not available' && (
                    <TouchableOpacity
                      style={styles.callBtn}
                      onPress={() => Linking.openURL(`tel:${item.phone}`)}
                    >
                      <Icon name="call" size={18} color="#fff" />
                      <Text style={styles.callText}>Call</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </AvCard>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
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
    marginBottom: 16,
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
    padding: 12,
    borderRadius: 10,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  error: {
    color: 'red',
    marginVertical: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  cardContent: {
    gap: 6,
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
    marginTop: 10,
    gap: 10,
  },
  directionsBtn: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#0E1630',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  directionsText: {
    color: '#0E1630',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
  callBtn: {
    flexDirection: 'row',
    backgroundColor: '#01D48C',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  callText: {
    color: '#fff',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
});

export default PharmacyFinderContent;
