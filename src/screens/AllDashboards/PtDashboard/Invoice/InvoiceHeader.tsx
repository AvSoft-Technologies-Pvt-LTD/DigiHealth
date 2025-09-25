import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';

interface InvoiceHeaderProps {
  onClose: () => void;
}

const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({ onClose }) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../../assets/images/logo.png')}
            style={styles.logo}
          />
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={24} color={COLORS.GREY} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
    paddingBottom: normalize(10),
    marginBottom: normalize(10),
  },
  headerLeft: {
    width: normalize(100),
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  logoContainer: {
    backgroundColor: COLORS.GREEN,
    padding: normalize(8),
    borderRadius: normalize(8),
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logo: {
    width: normalize(90),
    height: normalize(15),
    tintColor: COLORS.WHITE,
  },
  closeButton: {
    zIndex: 1,
  },
});

export default InvoiceHeader;
