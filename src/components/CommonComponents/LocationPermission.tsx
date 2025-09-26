// src/components/CommonComponents/LocationPermission.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { COLORS } from '../../constants/colors';
import AvButton from '../../elements/AvButton';
import AvText from '../../elements/AvText';
import AvModal from '../../elements/AvModal';
import { isIos, normalize } from '../../constants/platform';

interface LocationPermissionProps {
  children: React.ReactNode;
  onPermissionGranted?: () => void;
  onPermissionDenied?: () => void;
  showSettingsOnDeny?: boolean;
  permissionMessage?: string;
  settingsMessage?: string;
}

const LocationPermission: React.FC<LocationPermissionProps> = ({
  children,
  onPermissionGranted,
  onPermissionDenied,
  showSettingsOnDeny = true,
  permissionMessage = 'This app needs location access to provide location-based services.',
  settingsMessage = 'Location permission is required. Please enable it in settings.',
}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        setHasPermission(granted);
        if (granted) {
          onPermissionGranted?.();
        } else {
          requestLocationPermission();
        }
      } catch (err) {
        console.warn('Error checking location permission:', err);
        setHasPermission(false);
      }
    } else {
      // For iOS, you might want to use react-native-permissions
      // This is a simplified version
      setHasPermission(true);
    }
  };

  const requestLocationPermission = async () => {
    if (!isIos()) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: permissionMessage,
            // buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
          onPermissionGranted?.();
        } else {
          setHasPermission(false);
          onPermissionDenied?.();
          if (showSettingsOnDeny) {
            showSettingsAlert();
          }
        }
      } catch (err) {
        console.warn('Error requesting location permission:', err);
        setHasPermission(false);
      }
    }
  };

  const showSettingsAlert = () => {
    setIsModalVisible(true);
  };

  const handleOpenSettings = () => {
    setIsModalVisible(false);
    Linking.openSettings();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderPermissionRequest = () => (
    <View style={styles.container}>
      <View style={styles.content}>
        <AvText mode="title_1" style={styles.title}>
          Location Access Needed
        </AvText>
        <AvText style={styles.message}>
          {permissionMessage}
        </AvText>
        <View style={styles.buttonContainer}>
          <AvButton
            onPress={requestLocationPermission}
            mode="contained"
            style={styles.button}
          >
            Allow Location Access
          </AvButton>
          
        </View>
      </View>
    </View>
  );


  const renderModal = () => (
    <AvModal
      isModalVisible={isModalVisible}
      setModalVisible={setIsModalVisible}
      title="Permission Required"
    >
      <View style={styles.modalContent}>
        <AvText style={styles.modalMessage}>{settingsMessage}</AvText>
        <View style={styles.modalButtons}>
          <AvButton
            onPress={handleCancel}
            mode="outlined"
            style={styles.modalButton}
            buttonColor={COLORS.PRIMARY}
          >
            Cancel
          </AvButton>
          <AvButton
            onPress={handleOpenSettings}
            mode="contained"
            style={[styles.modalButton, styles.openSettingsButton]}
          >
            Open Settings
          </AvButton>
        </View>
      </View>
    </AvModal>
  );

  if (hasPermission === null) {
    // Show loading state or null while checking permission
    return null;
  }

  return (
    <>
      {renderModal()}
      {!hasPermission ? renderPermissionRequest() : children}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
  },
  content: {
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: COLORS.PRIMARY,
  },
  message: {
    marginBottom: 24,
    textAlign: 'center',
    color: COLORS.PRIMARY,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    marginBottom: 16,
  },
  settingsText: {
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  modalContent: {
    padding: 16,
    width: '100%',
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.PRIMARY,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  openSettingsButton: {
    backgroundColor: COLORS.PRIMARY,
  },
  cancelButtonText: {
    color: COLORS.PRIMARY,
  },
});

export default LocationPermission;
