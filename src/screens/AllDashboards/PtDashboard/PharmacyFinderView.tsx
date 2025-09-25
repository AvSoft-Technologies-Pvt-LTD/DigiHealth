




import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../../constants/colors";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "../../../constants/platform";
import { Typography } from "../../../constants/fonts";
import AvCard from "../../../elements/AvCards";
import AvText from "../../../elements/AvText";

// Type definitions
type Pharmacy = {
  id: string | number;
  name: string;
  address: string;
  lat: string | number;
  lon: string | number;
  distance: string;
};

type PharmacyCardProps = {
  name: string;
  address: string;
  distance: string;
  lat: string | number;
  lon: string | number;
};

// Dummy Data
const dummyData: Record<string, Pharmacy[]> = {
  Mumbai: [
    {
      id: 1,
      name: "Apollo Pharmacy",
      address: "Andheri East, Mumbai, Maharashtra",
      lat: 19.1234,
      lon: 72.8345,
      distance: "2.5 km",
    },
    {
      id: 2,
      name: "MedPlus Mart",
      address: "Bandra West, Mumbai, Maharashtra",
      lat: 19.0567,
      lon: 72.8234,
      distance: "4.1 km",
    },
    {
      id: 3,
      name: "Health & Glow",
      address: "Powai, Mumbai, Maharashtra",
      lat: 19.1189,
      lon: 72.9012,
      distance: "5.3 km",
    },
  ],
  Delhi: [
    {
      id: 1,
      name: "Max Pharmacy",
      address: "Connaught Place, Delhi",
      lat: 28.6345,
      lon: 77.2145,
      distance: "1.8 km",
    },
    {
      id: 2,
      name: "Guardian Lifecare",
      address: "Rajouri Garden, Delhi",
      lat: 28.6398,
      lon: 77.1234,
      distance: "3.2 km",
    },
  ],
  Bangalore: [
    {
      id: 1,
      name: "HealthKart Pharmacy",
      address: "Indiranagar, Bangalore, Karnataka",
      lat: 12.9789,
      lon: 77.6345,
      distance: "1.5 km",
    },
    {
      id: 2,
      name: "Niramaya Pharmacy",
      address: "Koramangala, Bangalore, Karnataka",
      lat: 12.9345,
      lon: 77.6234,
      distance: "2.8 km",
    },
  ],
  Chennai: [
    {
      id: 1,
      name: "Apollo Pharmacy",
      address: "T Nagar, Chennai, Tamil Nadu",
      lat: 13.0567,
      lon: 80.2345,
      distance: "3.0 km",
    },
  ],
  Dharwad: [
    {
      id: 1,
      name: "Sanjivini Medicals",
      address: "PB Road, Dharwad, Karnataka",
      lat: 15.4589,
      lon: 75.0045,
      distance: "1.2 km",
    },
    {
      id: 2,
      name: "Apoorva Pharmacy",
      address: "Vidyanagar, Dharwad, Karnataka",
      lat: 15.4721,
      lon: 75.0167,
      distance: "2.7 km",
    },
    {
      id: 3,
      name: "Lifeline Pharmacy",
      address: "Sadankeri, Dharwad, Karnataka",
      lat: 15.4345,
      lon: 75.0234,
      distance: "3.5 km",
    },
  ],
};

// PharmacyCard Component
const PharmacyCard: React.FC<PharmacyCardProps> = ({ name, address, distance, lat, lon }) => {
  const handleDirectionsPress = () => {
    const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
    const latLng = `${lat},${lon}`;
    const url = Platform.select({
      ios: `${scheme}${name}@${latLng}`,
      android: `${scheme}${latLng}(${name})`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <AvCard
      title={
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <AvText type="title_6" style={styles.cardTitle}>
              {name}
            </AvText>
            <View style={styles.pill}>
              <AvText type="title_5" style={styles.pillText}>
                Pharmacy
              </AvText>
            </View>
          </View>
          <AvText type="title_3" style={styles.distanceText}>
            {distance}
          </AvText>
        </View>
      }
      cardStyle={styles.card}
    >
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Icon name="map-marker-outline" size={20} color={COLORS.GREY} style={styles.icon} />
          <AvText type="body" style={styles.infoText}>
            {address || "Address not available"}
          </AvText>
        </View>
        <View style={styles.infoRow}>
          <Icon name="phone" size={20} color={COLORS.GREY} style={styles.icon} />
          <AvText type="body" style={styles.infoText}>
            Not available
          </AvText>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color={COLORS.GREY} style={styles.icon} />
          <AvText type="body" style={styles.infoText}>
            Hours not available
          </AvText>
        </View>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.directionsButton} onPress={handleDirectionsPress}>
        <Icon name="send" size={18} color={COLORS.PRIMARY} />
        <AvText type="title_3" style={styles.directionsButtonText}>
          Directions
        </AvText>
      </TouchableOpacity>
    </AvCard>
  );
};

// Main PharmacyFinder Component
const PharmacyFinderView: React.FC = () => {
  const [search, setSearch] = useState<string>("");
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = () => {
    if (!search.trim()) {
      setErrorMsg("Please enter a city to search.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    setPharmacies([]);
    setTimeout(() => {
      const city = search.trim();
      const data = dummyData[city];
      if (!data) {
        setErrorMsg("No pharmacies found for this city.");
      } else {
        setPharmacies(data);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Icon name="hospital-building" size={wp("12%")} color={COLORS.SECONDARY} />
        <AvText type="title_6" style={styles.title}>
          Pharmacy Finder
        </AvText>
        <AvText type="body" style={styles.subtitle}>
          Find nearby pharmacies, medical stores & chemists with comprehensive search
        </AvText>
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <AvText type="body" style={styles.searchLabel}>
          Search by city
        </AvText>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={wp("5%")} color={COLORS.GREY} />
          <TextInput
            style={[Typography.description, styles.input]}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Icon name="magnify" size={wp("6%")} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading */}
      {isLoading && (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color={COLORS.GREY} />
          <AvText type="body" style={styles.searchingText}>
            Searching...
          </AvText>
        </View>
      )}

      {/* Error */}
      {errorMsg && (
        <AvText type="body" style={styles.error}>
          {errorMsg}
        </AvText>
      )}

      {/* Results */}
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PharmacyCard
            name={item.name}
            address={item.address}
            distance={item.distance}
            lat={item.lat}
            lon={item.lon}
          />
        )}
        contentContainerStyle={{ paddingBottom: hp("3%") }}
        style={{ marginTop: hp("3%") }}
      />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp("4%"),
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  header: {
    alignItems: "center",
    marginBottom: hp("3%"),
    marginTop: hp("4%"),
  },
  title: {
    color: COLORS.PRIMARY,
    marginTop: hp("1.5%"),
  },
  subtitle: {
    color: COLORS.GREY,
    textAlign: "center",
    marginTop: hp("0.7%"),
    paddingHorizontal: wp("5%"),
  },
  searchContainer: {
    marginBottom: hp("1.5%"),
  },
  searchLabel: {
    color: COLORS.GREY,
    marginBottom: hp("1%"),
    paddingHorizontal: wp("2%"),
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: wp("2%"),
    paddingLeft: wp("3%"),
    backgroundColor: COLORS.WHITE,
  },
  input: {
    flex: 1,
    marginLeft: wp("2%"),
    paddingVertical: hp("1.8%"),
    color: COLORS.PRIMARY,
  },
  searchBtn: {
    backgroundColor: COLORS.SECONDARY,
    paddingHorizontal: wp("4%"),
    paddingVertical: hp("1.8%"),
    borderTopRightRadius: wp("2%"),
    borderBottomRightRadius: wp("2%"),
  },
  searchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp("2%"),
  },
  searchingText: {
    marginLeft: wp("2%"),
    color: COLORS.GREY,
  },
  error: {
    color: COLORS.ERROR,
    marginTop: hp("2%"),
    textAlign: "center",
  },
  card: {
    borderRadius: wp("4%"),
    padding: wp("5%"),
    marginVertical: hp("1%"),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: hp("0.5%") },
    shadowOpacity: 0.1,
    shadowRadius: wp("2%"),
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp("1%"),
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.PRIMARY,
  },
  pill: {
    backgroundColor: COLORS.SUCCESS_BG,
    borderRadius: wp("3%"),
    paddingHorizontal: wp("2%"),
    paddingVertical: hp("0.3%"),
    marginTop: hp("0.5%"),
    alignSelf: "flex-start",
  },
  pillText: {
    color: COLORS.SUCCESS,
  },
  distanceText: {
    color: COLORS.SECONDARY,
  },
  infoContainer: {
    marginBottom: hp("1%"),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp("0.8%"),
  },
  icon: {
    marginRight: wp("3%"),
  },
  infoText: {
    color: COLORS.GREY,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.NAVBAR_DIVIDER,
    marginVertical: hp("1%"),
  },
  directionsButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  directionsButtonText: {
    color: COLORS.SECONDARY,
    marginLeft: wp("1.5%"),
  },
});

export default PharmacyFinderView;
