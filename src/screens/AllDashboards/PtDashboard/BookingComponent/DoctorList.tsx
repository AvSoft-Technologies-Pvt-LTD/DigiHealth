import React from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, FlatList, Image } from "react-native";
import AvText from "../../../../elements/AvText";
import AvCard from "../../../../elements/AvCards";
import AvButton from "../../../../elements/AvButton";
import { Doctor } from "../../../../constants/data";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

interface DoctorListProps {
  doctors?: Doctor[];
  loading: boolean;
  error: string | null;
  city: string;
  onBookDoctor: (doctor: Doctor) => void;
}

const DoctorList: React.FC<DoctorListProps> = ({
  doctors = [],
  loading,
  error,
  city,
  onBookDoctor,
}) => {
  return (
    <View style={styles.doctorList}>
      {loading ? (
        <ActivityIndicator size="small" color={COLORS.SECONDARY} />
      ) : error ? (
        <AvText style={{ color: "red" }}>{error}</AvText>
      ) : doctors.length > 0 ? (
        <>
          <AvText type="title_2" style={styles.sectionTitle}>Available Doctors</AvText>
          <FlatList
            data={doctors}
            renderItem={({ item: doctor }) => (
              <AvCard
                title={doctor.name}
                cardStyle={styles.doctorCard}
              >
                <View style={styles.doctorHeader}>
                  <Image
                    source={{ uri: doctor.image }}
                    style={styles.doctorProfileImage}
                    resizeMode="cover"
                  />
                  <View style={styles.doctorNameContainer}>
                    <AvText style={styles.doctorName}>{doctor.name}</AvText>
                    <AvText style={styles.doctorSpecialty}>{doctor.specialty}</AvText>
                  </View>
                </View>
                <View style={styles.doctorInfo}>
                  {doctor.hospital && <AvText style={styles.doctorHospital}>{doctor.hospital}</AvText>}
                  <View style={styles.doctorDetailsRow}>
                    <AvText style={styles.doctorFees}>₹{doctor.fees}</AvText>
                    <AvButton
                      mode="outlined"
                      onPress={() => onBookDoctor(doctor)}
                      style={styles.smallBookButton}
                    >
                      Book
                    </AvButton>
                  </View>
                </View>
              </AvCard>
            )}
            keyExtractor={(doctor) => doctor.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.doctorSlider}
          />
        </>
      ) : (
        <AvText style={styles.noDoctors}>
          {city ? "No doctors found matching all your criteria. Try changing your filters." : "Please select your filters to find doctors"}
        </AvText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  doctorList: {
    marginTop: normalize(20),
    paddingHorizontal: normalize(16),
  },
  sectionTitle: {
    marginBottom: normalize(16),
    color: COLORS.PRIMARY,
    fontWeight: "bold",
  },
  doctorSlider: {
    paddingBottom: normalize(16),
  },
  doctorCard: {
    marginRight: normalize(16),
    width: Dimensions.get("window").width * 0.8,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: normalize(8),
    paddingTop: normalize(8),
  },
  doctorProfileImage: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    marginRight: normalize(12),
  },
  doctorNameContainer: {
    flex: 1,
  },
  doctorName: {
    fontSize: normalize(14),
    fontWeight: "bold",
    color: COLORS.BLACK,
  },
  doctorSpecialty: {
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  doctorInfo: {
    paddingHorizontal: normalize(8),
    paddingBottom: normalize(8),
  },
  doctorDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: normalize(8),
  },
  doctorHospital: {
    color: COLORS.SECONDARY,
    fontSize: normalize(12),
    marginTop: normalize(4),
  },
  doctorFees: {
    color: COLORS.SECONDARY,
    fontSize: normalize(14),
    fontWeight: "bold",
  },
  smallBookButton: {
    paddingHorizontal: normalize(8),
    paddingVertical: normalize(4),
    minWidth: normalize(60),
  },
  noDoctors: {
    textAlign: "center",
    marginTop: normalize(20),
    color: COLORS.GREY,
  },
});

export default DoctorList;
