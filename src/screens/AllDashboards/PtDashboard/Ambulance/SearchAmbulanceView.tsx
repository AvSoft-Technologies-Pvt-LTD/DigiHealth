import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AmbulanceResults from "./AmbulanceResults";
import LocationModal from "./LocationModal";
import { SearchFilterBar } from "../../../../components/CommonComponents/SearchFilter";
import { COLORS } from "../../../../constants/colors"; // Import COLORS
import { Typography } from "../../../../constants/fonts"; // Import Typography
import { normalize } from "../../../../constants/platform"; // Import normalize for scaling

type LocationType = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const mockLocation: LocationType = {
  latitude: 15.4589,
  longitude: 75.0078,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

const SearchAmbulanceView: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const [location, setLocation] = useState<LocationType | null>(mockLocation);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  // Mock filter options for demo
  const filterOptions = [
    { id: "ngo", displayName: "NGO" },
    { id: "private", displayName: "Private" },
    { id: "bls", displayName: "BLS" },
    { id: "als", displayName: "ALS" },
    { id: "available", displayName: "Available" },
  ];

  const handleFiltersApplied = (filters: Record<string, boolean>) => {
    setSelectedFilters(filters);
    console.log("Filters applied:", filters);
  };

  return (
    <View style={styles.card}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <Icon name="search" size={normalize(20)} color={COLORS.GREEN} />
        </View>
        <View style={styles.headerText}>
          <Text style={[Typography.title_6, styles.title]}>Search Ambulances</Text>
          <Text style={[Typography.body, styles.subtitle]}>
            Find ambulances by location
          </Text>
        </View>
      </View>

      {/* Close Button */}
      <TouchableOpacity style={styles.closeBtn} onPress={() => {}}>
        <Icon name="close" size={normalize(16)} color={COLORS.GREY} />
      </TouchableOpacity>

      {/* Search & Filter Bar */}
      <SearchFilterBar
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by location, ambulance name"
        filterOptions={filterOptions}
        onFiltersApplied={handleFiltersApplied}
        filterModalTitle="Filter Ambulances"
        applyButtonText="Apply"
        resetButtonText="Reset"
      />

      {/* Action Buttons (Location & Search) */}
      <View style={styles.actions}>
  <TouchableOpacity
    style={[styles.actionBtn, { marginLeft: normalize(15) }]} // Add left margin here
    onPress={() => setMapVisible(true)}
  >
    <Icon name="location-on" size={normalize(16)} color={COLORS.WHITE} />
    <Text style={[Typography.buttonText, styles.btnText]}>Location</Text>
  </TouchableOpacity>
  <TouchableOpacity
    style={styles.actionBtn}
    onPress={() => setShowResults(true)}
  >
    <Icon name="search" size={normalize(16)} color={COLORS.WHITE} />
    <Text style={[Typography.buttonText, styles.btnText]}>Search</Text>
  </TouchableOpacity>
</View>

      {/* Results & Modals */}
      {showResults && <AmbulanceResults />}
      <LocationModal
        visible={mapVisible}
        onClose={() => setMapVisible(false)}
      
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: normalize(20),
    shadowColor: COLORS.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowRadius: normalize(8),
    elevation: 3,
    margin: normalize(10),
    width: "95%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(10),
  },
  headerIcon: {
    backgroundColor: COLORS.LIGHT_GREEN,
    borderRadius: normalize(8),
    padding: normalize(6),
    marginRight: normalize(10),
  },
  headerText: {},
  title: {
    color: COLORS.PRIMARY_TXT,
  },
  subtitle: {
    color: COLORS.GREY,
    marginTop: normalize(2),
  },
  closeBtn: {
    position: "absolute",
    top: normalize(10),
    right: normalize(10),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(12),
    width: normalize(24),
    height: normalize(24),
    justifyContent: "center",
    alignItems: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: normalize(8),
    marginTop: normalize(10),
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.GREEN,
    borderRadius: normalize(8),
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(15),
  },
  btnText: {
    color: COLORS.WHITE,
    marginLeft: normalize(5),
  },
});

export default SearchAmbulanceView;
