import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { Card } from 'react-native-paper';
import AvText from '../../../../elements/AvText';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { AvIcons } from '../../../../elements';
import LinearGradient from 'react-native-linear-gradient';

const services = [
  { id: 1, title: 'Consult', icon: 'stethoscope' },
  { id: 2, title: 'Medicines', icon: 'pill' },
  { id: 3, title: 'Lab Tests', icon: 'flask' },
  { id: 4, title: 'Records', icon: 'file-document' },
];

const HealthCardSection = memo(() => {
  return (
    <View style={styles.container}>
      {/* Health Card */}
      <View style={styles.healthCard}>
        <LinearGradient
          colors={[COLORS.SECONDARY, COLORS.BLACK]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        >
          <View style={styles.cardContent}>

            {/* Left side - Patient Image */}

            {/* Middle - Patient Info */}
            <View style={styles.patientInfo}>
              <AvText type="heading_6" style={styles.cardTitle}>Health Card</AvText>

              <View style={styles.infoRow}>
                <AvText type="body" style={styles.infoLabel}>Name:</AvText>
                <AvText type="body" style={styles.infoValue}>XXXXXXXXX</AvText>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoGroup}>
                  <AvText type="body" style={styles.infoLabel}>DOB:</AvText>
                  <AvText type="body" style={styles.infoValue}>XX/XX/XXXX</AvText>
                </View>
              </View>
              <View style={styles.infoRow}>

                <View style={[styles.infoGroup]}>
                  <AvText type="body" style={styles.infoLabel}>Gender:</AvText>
                  <AvText type="body" style={styles.infoValue}>XXXXX</AvText>
                </View>
              </View>
              <View style={styles.infoRow}>
                <AvText type="body" style={styles.infoLabel}>Health ID:</AvText>
                <AvText type="body" style={styles.infoValue}>XXXXXX-XXXXX-XXXXX</AvText>
              </View>

              <View style={[styles.infoRow, styles.lastInfoRow]}>
                <AvText type="body" style={styles.infoLabel}>Valid Upto:</AvText>
                <AvText type="body" style={styles.infoValue}>XX/XX/XXXX</AvText>
              </View>
            </View>

            {/* Right side - QR Code */}
            <View style={styles.qrContainer}>
              {/* <View style={styles.patientImageContainer}>
              <View style={styles.patientImageWrapper}>
                <Image 
                  source={{ uri: 'https://via.placeholder.com/80' }} 
                  style={styles.patientImage}
                  resizeMode="cover"
                />
              </View>
            </View> */}
              <View style={styles.qrCode}>
                <AvIcons
                  type="MaterialCommunityIcons"
                  name="qrcode"
                  size={normalize(60)}
                  color={COLORS.WHITE}
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Generate Button - Separated */}
      <TouchableOpacity style={styles.generateButton}>
        <AvText type="buttonText" style={styles.generateButtonText}>Generate Health Card</AvText>
      </TouchableOpacity>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <AvText type="heading_5" style={styles.descriptionText}>
          Get expert advice from top doctors anytime, anywhere!
        </AvText>
        <AvText type="title_3" style={[styles.descriptionText, styles.secondaryText]}>
          Connect with qualified healthcare professionals and receive personalized medical consultation from the comfort of your home.
        </AvText>
      </View>

      {/* Services List - Horizontal with Arrows */}
      <View style={styles.servicesContainer}>
        {services.map((service, index) => (
          <React.Fragment key={service.id}>
            <TouchableOpacity style={styles.serviceItem}>
              <View style={styles.serviceIcon}>
                <AvIcons
                  type="MaterialCommunityIcons"
                  name={service.icon}
                  size={normalize(13)}
                  color={COLORS.PRIMARY}
                />
              </View>
              <AvText type="body" style={styles.serviceText}>{service.title}</AvText>
            </TouchableOpacity>

            {index < services.length - 1 && (
              <View style={styles.arrowContainer}>
                <AvIcons
                  type="MaterialIcons"
                  name="keyboard-arrow-right"
                  size={normalize(24)}
                  color={COLORS.GREY}
                />
              </View>
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    padding: normalize(10),
    margin: normalize(10),
    borderWidth: 2,
    borderColor: COLORS.SECONDARY,
    borderRadius: normalize(10)
  },
  healthCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: normalize(16),
    elevation: 4,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  gradient: {
    flex: 1,
    // padding: normalize(16),
  },
  cardContent: {
    flexDirection: 'row',
    padding: normalize(16),
    position: 'relative',
  },
  patientImageContainer: {
    // marginLeft: normalize(12),
    // marginTop: normalize(12),
    justifyContent: 'center',
  },
  patientImageWrapper: {
    width: normalize(80),
    height: normalize(80),
    borderRadius: normalize(40),
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    backgroundColor: COLORS.WHITE,
  },
  patientImage: {
    width: '100%',
    height: '100%',
  },
  patientInfo: {
    flex: 1,
    marginRight: normalize(12),
  },
  cardTitle: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
    marginBottom: normalize(8),
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: normalize(8),
    alignItems: 'center',
  },
  infoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  genderGroup: {
    marginLeft: normalize(12),
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: normalize(4),
  },
  infoValue: {
    color: COLORS.WHITE,
    fontWeight: '500',
  },
  lastInfoRow: {
    marginBottom: normalize(8),
  },
  qrContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: normalize(8),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    alignSelf: 'center',
  },
  qrCode: {
    alignItems: 'center',
  },
  qrText: {
    color: COLORS.WHITE,
    marginTop: 4,
  },
  generateButton: {
    backgroundColor: COLORS.PRIMARY,
    borderRadius: 8,
    paddingVertical: normalize(12),
    alignItems: 'center',
    marginBottom: normalize(16),
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  generateButtonText: {
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    marginBottom: normalize(16),
    paddingHorizontal: normalize(4),
  },
  descriptionText: {
    color: COLORS.BLACK,
    marginBottom: normalize(8),
    lineHeight: normalize(20),
  },
  secondaryText: {
    color: COLORS.GREY,
  },
  servicesContainer: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    padding: normalize(8),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  serviceItem: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  serviceIcon: {
    width: normalize(18),
    height: normalize(18),
    borderRadius: normalize(20),
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: normalize(4),
  },
  serviceText: {
    color: COLORS.BLACK,
    textAlign: 'center',
  },
  arrowContainer: {
    paddingHorizontal: normalize(4),
  },
});

export default HealthCardSection;
