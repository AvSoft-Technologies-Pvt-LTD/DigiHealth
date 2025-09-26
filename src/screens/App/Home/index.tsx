import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import HomeView from './HomeView';
import { setHomeData, selectHomeError } from '../../../store/slices/homeSlice';
import { benefits, features, stats } from '../../../constants/data';

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isConsultationModalVisible, setConsultationModalVisible] = useState(false);
  const [isContentLoaded, setIsContentLoaded] = useState(false);

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

  const error = useSelector(selectHomeError);
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button onPress={onRefresh} title="Retry" />
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
    color: 'red',
    marginBottom: 16,
  },
});

export default Home;