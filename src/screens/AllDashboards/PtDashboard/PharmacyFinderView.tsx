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
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // <-- Material Icons
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

// Dummy data ... (same as your version)

// PharmacyCard Component
const PharmacyCard: React.FC<PharmacyCardProps> = ({ name, address, distance, lat, lon }) => {
  const handleDirectionsPress = () => {
    const scheme = Platform.select({ ios: "maps:0,0?q=", android: "geo:0,0?q=" });
    const latLng = `${lat},${lon}`;
    const url = Platform.select({
      ios: `${scheme}${name}@${latLng}`,
      android: `${scheme}${latLng}(${name})`,
    });
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <AvCard
      title={
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <AvText type="title_6" style={styles.cardTitle}>{name}</AvText>
            <View style={styles.pill}>
              <AvText type="title_5" style={styles.pillText}>Pharmacy</AvText>
            </View>
          </View>
          <AvText type="title_3" style={styles.distanceText}>{distance}</AvText>
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
          <AvText type="body" style={styles.infoText}>Not available</AvText>
        </View>
        <View style={styles.infoRow}>
          <Icon name="clock-outline" size={20} color={COLORS.GREY} style={styles.icon} />
          <AvText type="body" style={styles.infoText}>Hours not available</AvText>
        </View>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.directionsButton} onPress={handleDirectionsPress}>
        <Icon name="send" size={18} color={COLORS.PRIMARY} />
        <AvText type="title_3" style={styles.directionsButtonText}>Directions</AvText>
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
    // Simulate API delay
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

  const renderPharmacyItem = ({ item }: { item: Pharmacy }) => (
    <PharmacyCard
      name={item.name}
      address={item.address}
      distance={item.distance}
      lat={item.lat}
      lon={item.lon}
    />
  );

  return (
    <View style={styles.container}>
      {/* App Header */}
      <View style={styles.header}>
        <Icon name="hospital-building" size={wp('12%')} color={COLORS.SECONDARY} />
        <AvText type="title_6" style={styles.title}>Pharmacy Finder</AvText>
        <AvText type="body" style={styles.subtitle}>
          Find nearby pharmacies, medical stores & chemists with comprehensive search
        </AvText>
      </View>

      {/* Search Box with label outside */}
      <View style={styles.searchContainer}>
        <AvText type="body" style={styles.searchLabel}>Search by city</AvText>
        <View style={styles.searchBox}>
          <Icon name="magnify" size={wp('5%')} color={COLORS.GREY} />
          <TextInput
            style={[Typography.description, styles.input]}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Icon name="magnify" size={wp('6%')} color={COLORS.WHITE} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Searching status */}
      {isLoading && (
        <View style={styles.searchingContainer}>
          <ActivityIndicator size="small" color={COLORS.GREY} />
          <AvText type="body" style={styles.searchingText}>Searching...</AvText>
        </View>
      )}

      {/* Error */}
      {errorMsg && <AvText type="body" style={styles.error}>{errorMsg}</AvText>}

      {/* Results */}
      <FlatList
        data={pharmacies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderPharmacyItem}
        contentContainerStyle={{ paddingBottom: hp('3%') }}
        style={{ marginTop: hp('3%') }}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp('4%'),
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  header: {
    alignItems: "center",
    marginBottom: hp('3%'),
    marginTop: hp('4%'),
  },
  title: {
    color: COLORS.PRIMARY,
    marginTop: hp('1.5%'),
  },
  subtitle: {
    color: COLORS.GREY,
    textAlign: "center",
    marginTop: hp('0.7%'),
    paddingHorizontal: wp('5%'),
  },
  searchContainer: {
    marginBottom: hp('1.5%'),
  },
  searchLabel: {
    color: COLORS.GREY,
    marginBottom: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: wp('2%'),
    paddingLeft: wp('3%'),
    backgroundColor: COLORS.WHITE,
  },
  input: {
    flex: 1,
    marginLeft: wp('2%'),
    paddingVertical: hp('1.8%'),
    color: COLORS.PRIMARY,
  },
  searchBtn: {
    backgroundColor:COLORS.SECONDARY,
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1.8%'),
    borderTopRightRadius: wp('2%'),
    borderBottomRightRadius: wp('2%'),
  },
  searchingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: hp('2%'),
  },
  searchingText: {
    marginLeft: wp('2%'),
    color: COLORS.GREY,
  },
  error: {
    color: COLORS.ERROR,
    marginTop: hp('2%'),
    textAlign: "center",
  },
  card: {
    borderRadius: wp('4%'),
    padding: wp('5%'),
    marginVertical: hp('1%'),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: hp('0.5%') },
    shadowOpacity: 0.1,
    shadowRadius: wp('2%'),
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: hp('1%'),
  },
  titleContainer: {
    flex: 1,
  },
  cardTitle: {
    color: COLORS.PRIMARY,
  },
  pill: {
    backgroundColor: COLORS.SUCCESS_BG,
    borderRadius: wp('3%'),
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.3%'),
    marginTop: hp('0.5%'),
    alignSelf: "flex-start",
  },
  pillText: {
    color: COLORS.SUCCESS,
  },
  distanceText: {
    color: COLORS.SECONDARY,
  },
  infoContainer: {
    marginBottom: hp('1%'),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: hp('0.8%'),
  },
  icon: {
    marginRight: wp('3%'),
  },
  infoText: {
    color: COLORS.GREY,
    flexShrink: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.NAVBAR_DIVIDER,
    marginVertical: hp('1%'),
  },
  directionsButton: {
    flexDirection: "row",
    alignSelf: "flex-end",
    alignItems: "center",
  },
  directionsButtonText: {
    color: COLORS.SECONDARY,
    marginLeft: wp('1.5%'),
  },
});

export default PharmacyFinderView;

