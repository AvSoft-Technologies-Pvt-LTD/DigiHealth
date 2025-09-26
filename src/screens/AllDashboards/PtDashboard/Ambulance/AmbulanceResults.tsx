import React, { useState } from "react";
import { View, StyleSheet, ViewStyle, TextStyle, TextInput, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import AvCard from "../../../../elements/AvCards";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

// Define types for our data
interface Ambulance {
  name: string;
  location: string;
  tags: string[];
  distance: string;
  rating: string;
  phone: string;
}

// Mock data for ambulances
const ambulanceData: Ambulance[] = [
  {
    name: "City Life Ambulance",
    location: "Dharwad",
    tags: ["Private", "ICU", "Available"],
    distance: "2.5 km",
    rating: "4.5",
    phone: "9901341763"
  },
  {
    name: "Life Line Ambulance",
    location: "Hubballi",
    tags: ["Government", "Available"],
    distance: "3.2 km",
    rating: "4.2",
    phone: "9876543210"
  },
  {
    name: "Quick Response Ambulance",
    location: "Dharwad",
    tags: ["Private", "ICU"],
    distance: "4.1 km",
    rating: "4.7",
    phone: "9876512345"
  },
  {
    name: "Emergency Care Ambulance",
    location: "Hubballi",
    tags: ["Government", "Available"],
    distance: "5.3 km",
    rating: "4.0",
    phone: "9812345678"
  }
];

const AmbulanceCard: React.FC<Ambulance> = ({ name, location, tags, distance, rating, phone }) => (
  <AvCard
    title={name}
    titleStyle={styles.cardTitle}  // Add custom title style
    cardStyle={styles.ambulanceCard}
  >
    <View style={styles.cardHeader}>
      <Icon name="favorite" size={normalize(24)} color={COLORS.PRIMARY} />
      <View style={styles.locationRow}>
        <Icon name="location-on" size={normalize(16)} color={COLORS.GREY} />
        <AvText type="caption" style={styles.locationText}>
          {location}
        </AvText>
      </View>
    </View>
    {/* Tags */}
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => (
        <View
          key={`${name}-${tag}-${index}`}  // More unique key
          style={[
            styles.tag,
            tag === "Available"
              ? styles.availableTag
              : tag === "ICU"
              ? styles.icuTag
              : styles.privateTag,
          ]}
        >
          <AvText
            style={[
              styles.tagText,
              tag === "ICU" ? styles.icuTagText : {},
            ]}
          >
            {tag}
          </AvText>
        </View>
      ))}
    </View>
    {/* Distance & Rating */}
    <View style={styles.detailsRow}>
      <View style={styles.distanceRow}>
        <Icon name="directions" size={normalize(16)} color={COLORS.PRIMARY} />
        <AvText type="caption" style={styles.distanceText}>
          {distance}
        </AvText>
      </View>
      <View style={styles.ratingRow}>
        <Icon name="star" size={normalize(16)} color={COLORS.BRIGHT_ORANGE} />
        <AvText type="caption" style={styles.ratingText}>
          {rating}
        </AvText>
      </View>
    </View>
    {/* Phone Number */}
    <View style={styles.phoneNumberContainer}>
      <AvText type="body" style={styles.phoneNumber}>
        {phone}
      </AvText>
    </View>
    {/* Action Buttons */}
    <View style={styles.buttonRow}>
      <AvButton
        mode="contained"
        buttonColor={COLORS.GREEN}
        style={styles.callButton}
        icon={() => <Icon name="call" size={normalize(18)} color={COLORS.WHITE} />}
        onPress={() => {}}
      >
        Call Now
      </AvButton>
      <AvButton
        mode="contained"
        buttonColor={COLORS.PRIMARY}
        style={styles.bookButton}
        icon={() => <Icon name="book" size={normalize(18)} color={COLORS.WHITE} />}
        onPress={() => {}}
      >
        Book
      </AvButton>
    </View>
  </AvCard>
);

const AmbulanceResults: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLocation, setSearchLocation] = useState<string>("dharwad");

  // Filter ambulances based on search query and location
  const filteredAmbulances = ambulanceData.filter(ambulance => {
    const matchesSearch = ambulance.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ambulance.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = ambulance.location.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesSearch && matchesLocation;
  });

  return (
    <View style={styles.resultsContainer}>
      {/* Added container for the header section with top margin */}
      <View style={styles.headerContainer}>
        <AvText type="title_5" style={styles.resultsHeader}>
          Found {filteredAmbulances.length} Ambulance{filteredAmbulances.length !== 1 ? 's' : ''}
        </AvText>
        <AvText type="body" style={styles.resultsSubHeader}>
          Showing results for "{searchLocation}"
        </AvText>
      </View>

      {/* Search Input - Now properly implemented */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={normalize(20)} color={COLORS.PRIMARY}  />
          <TextInput
            style={styles.searchInput}
            placeholder="Search ambulances or locations..."
            placeholderTextColor={COLORS.GREY}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Location Filter */}
      <View style={styles.filterContainer}>
        <AvText type="body" style={styles.filterLabel}>Location:</AvText>
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={[styles.filterOption, searchLocation === 'dharwad' && styles.activeFilter]}
            onPress={() => setSearchLocation('dharwad')}
          >
            <AvText type="body" style={searchLocation === 'dharwad' ? styles.activeFilterText : styles.filterText}>
              Dharwad
            </AvText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterOption, searchLocation === 'hubballi' && styles.activeFilter]}
            onPress={() => setSearchLocation('hubballi')}
          >
            <AvText type="body" style={searchLocation === 'hubballi' ? styles.activeFilterText : styles.filterText}>
              Hubballi
            </AvText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Ambulance Cards */}
      {filteredAmbulances.length > 0 ? (
        filteredAmbulances.map((ambulance, index) => (
          <AmbulanceCard
            key={`${ambulance.name}-${index}`}
            name={ambulance.name}
            location={ambulance.location}
            tags={ambulance.tags}
            distance={ambulance.distance}
            rating={ambulance.rating}
            phone={ambulance.phone}
          />
        ))
      ) : (
        <View style={styles.noResultsContainer}>
          <Icon name="search-off" size={normalize(40)} color={COLORS.PRIMARY} />
          <AvText type="body" style={styles.noResultsText}>
            No ambulances found matching your search
          </AvText>
        </View>
      )}
    </View>
  );
};

interface Styles {
  resultsContainer: ViewStyle;
  headerContainer: ViewStyle;  // Added for header section
  resultsHeader: TextStyle;
  resultsSubHeader: TextStyle;
  ambulanceCard: ViewStyle;
  cardTitle: TextStyle;  // Added for card title styling
  cardHeader: ViewStyle;
  locationRow: ViewStyle;
  locationText: TextStyle;
  tagsContainer: ViewStyle;
  tag: ViewStyle;
  privateTag: ViewStyle;
  icuTag: ViewStyle;
  availableTag: ViewStyle;
  icuTagText: TextStyle;
  tagText: TextStyle;
  detailsRow: ViewStyle;
  distanceRow: ViewStyle;
  distanceText: TextStyle;
  ratingRow: ViewStyle;
  ratingText: TextStyle;
  phoneNumberContainer: ViewStyle;
  phoneNumber: TextStyle;
  buttonRow: ViewStyle;
  callButton: ViewStyle;
  bookButton: ViewStyle;
  searchContainer: ViewStyle;
  searchInputContainer: ViewStyle;
  searchIcon: ViewStyle;
  searchInput: TextStyle;
  filterContainer: ViewStyle;
  filterLabel: TextStyle;
  filterOptions: ViewStyle;
  filterOption: ViewStyle;
  activeFilter: ViewStyle;
  filterText: TextStyle;
  activeFilterText: TextStyle;
  noResultsContainer: ViewStyle;
  noResultsText: TextStyle;
}

const styles: Styles = StyleSheet.create({
  resultsContainer: {
    marginTop: normalize(10),  // Reduced top margin since we have header container
    padding: normalize(10),
  },
  headerContainer: {
    marginBottom: normalize(15),  // Added margin bottom for spacing
    marginTop: normalize(10),     // Added top margin for the "Found" text
  },
  resultsHeader: {
    fontSize: normalize(18),
    fontWeight: "bold",
    color: COLORS.PRIMARY_TXT,
    marginBottom: normalize(4),
  },
  resultsSubHeader: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginBottom: normalize(15),
  },
  cardTitle: {
    color: COLORS.PRIMARY_TXT,
    fontSize: normalize(16),
    fontWeight: "bold",
    marginBottom: normalize(8),
  },
  ambulanceCard: {
    marginBottom: normalize(10),
    padding: normalize(15),
    borderRadius: normalize(12),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: normalize(2) },
    shadowOpacity: 0.1,
    shadowRadius: normalize(4),
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(10),
    justifyContent: "space-between",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: normalize(4),
  },
  locationText: {
    marginLeft: normalize(5),
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  tagsContainer: {
    flexDirection: "row",
    marginBottom: normalize(12),
  },
  tag: {
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(10),
    borderRadius: normalize(12),
    marginRight: normalize(8),
  },
  privateTag: {
    backgroundColor: COLORS.LIGHT_GREY,
  },
  icuTag: {
    backgroundColor: COLORS.BRIGHT_ORANGE,  // Using LIGHT_BLUE (make sure this exists in your COLORS)
  },
  availableTag: {
    backgroundColor: COLORS.LIGHT_GREEN,
  },
  icuTagText: {
    color: COLORS.PRIMARY,
  },
  tagText: {
    fontSize: normalize(12),
    fontWeight: "600",
    color: COLORS.PRIMARY_TXT,
  },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(12),
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: normalize(20),
  },
  distanceText: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    color: COLORS.GREY,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: normalize(5),
    fontSize: normalize(14),
    color: COLORS.GREY,
  },
  phoneNumberContainer: {
    borderWidth: normalize(1),
    borderColor: COLORS.GREEN,
    borderRadius: normalize(8),
    padding: normalize(12),
    marginBottom: normalize(15),
    backgroundColor: COLORS.LIGHT_GREEN,
  },
  phoneNumber: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: COLORS.GREEN,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  callButton: {
    flex: 1,
    marginRight: normalize(5),
    borderRadius: normalize(8),
  },
  bookButton: {
    flex: 1,
    marginLeft: normalize(5),
    borderRadius: normalize(8),
  },
  searchContainer: {
    marginBottom: normalize(15),
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  searchIcon: {
    marginRight: normalize(8),
  },
  searchInput: {
    flex: 1,
    fontSize: normalize(14),
    color: COLORS.PRIMARY_TXT,
    paddingVertical: normalize(8),
  },
  filterContainer: {
    marginBottom: normalize(15),
  },
  filterLabel: {
    fontSize: normalize(14),
    color: COLORS.PRIMARY_TXT,
    marginBottom: normalize(8),
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterOption: {
    paddingVertical: normalize(6),
    paddingHorizontal: normalize(12),
    borderRadius: normalize(20),
    backgroundColor: COLORS.LIGHT_GREY,
    marginRight: normalize(8),
    marginBottom: normalize(8),
  },
  activeFilter: {
    backgroundColor: COLORS.PRIMARY,
  },
  filterText: {
    fontSize: normalize(12),
    color: COLORS.PRIMARY_TXT,
  },
  activeFilterText: {
    fontSize: normalize(12),
    color: COLORS.WHITE,
    fontWeight: "bold",
  },
  noResultsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: normalize(20),
    marginTop: normalize(20),
  },
  noResultsText: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginTop: normalize(10),
  },
});

export default AmbulanceResults;
