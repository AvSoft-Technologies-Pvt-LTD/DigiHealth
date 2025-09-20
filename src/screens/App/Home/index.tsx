import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Button, StyleSheet } from 'react-native';
import HomeView from './HomeView';

import { COLORS } from '../../../constants/colors';
import { setHomeData,selectHomeError } from '../../../store/slices/homeSlice';
import { benefits, features, stats } from '../../../constants/data';

type HomeProps = {
  // Props can be added here if needed
};

const Home: React.FC<HomeProps> = () => {
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [isConsultationModalVisible, setConsultationModalVisible] = useState(false);
  
  // Prepare home data
  const homeData = {
    stats: [...stats],
    features: [...features],
    benefits: [...benefits],
  };

  // Load initial data
  // useEffect(() => {
  //   dispatch(setHomeData(homeData));
  // }, [dispatch]);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // In a real app, you would fetch fresh data here
      await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
      dispatch(setHomeData(homeData));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      console.error('Error refreshing data:', errorMessage);
    } finally {
      setRefreshing(false);
    }
  }, [dispatch, homeData]);

  // Show error state if there was an error loading data
  const error = useSelector(selectHomeError);
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: COLORS.ERROR, marginBottom: 16, textAlign: 'center' }}>
          {error}
        </Text>
        <Button onPress={onRefresh} title="Retry" />
      </View>
    );
  }

  console.log("Stats Passing", stats);

  return (
    <View style={styles.container}>
      <HomeView
        refreshing={refreshing}
        onRefresh={onRefresh}
        isConsultationModalVisible={isConsultationModalVisible}
        setConsultationModalVisible={setConsultationModalVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;