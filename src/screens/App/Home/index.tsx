import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import HomeView from './HomeView';
import { setHomeData, selectHomeError } from '../../../store/slices/homeSlice';
import { benefits, features, stats } from '../../../constants/data';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchAllPatients, fetchPatientDashboardData } from '../../../store/thunks/patientThunks';
import { setCurrentPatient } from '../../../store/slices/allPatientSlice';
import { setUserProfile } from '../../../store/slices/userSlice';
import { AvButton, AvText } from '../../../elements';
import { COLORS } from '../../../constants/colors';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isConsultationModalVisible, setConsultationModalVisible] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);
  const allPatients = useAppSelector((state) => state.patient.allPatients); 

  // ✅ memoize static data
  const homeData = useMemo(
    () => ({
      stats,
      features,
      benefits,
    }),
    []
  );

  // Load home data once
  useEffect(() => {
    dispatch(setHomeData(homeData));
  }, [dispatch, homeData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1000));
      dispatch(setHomeData(homeData));
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, homeData]);

  const userEmail = useAppSelector((state) => state.user.userProfile.email);
    // Fetch patient data on component mount
    useEffect(() => {
      dispatch(fetchAllPatients());
    }, [dispatch]);
  
    // Handle patient data once it's loaded
    useEffect(() => {
      if (allPatients?.length > 0) {
        const currentPatient = allPatients.find((item: any) => userEmail === item.email);
  
        if (currentPatient) {
          dispatch(setCurrentPatient(currentPatient));
          dispatch(fetchPatientDashboardData(currentPatient?.id));
          dispatch(setUserProfile({ patientId: currentPatient?.id }));
        }
      }
    }, [allPatients, userEmail, dispatch]);

  const error = useSelector(selectHomeError);
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AvText style={styles.errorText}>{error}</AvText>
        <AvButton onPress={onRefresh} buttonColor={COLORS.SECONDARY}>Retry</AvButton>
      </View>
    );
  }

  return (
    <HomeView
      refreshing={refreshing}
      onRefresh={onRefresh}
      isConsultationModalVisible={isConsultationModalVisible}
      setConsultationModalVisible={setConsultationModalVisible}
      onContentLoadComplete={() => !isContentLoaded && setIsContentLoaded(true)}
    />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: COLORS.ERROR,
    marginBottom: 16,
  },
});

export default Home;