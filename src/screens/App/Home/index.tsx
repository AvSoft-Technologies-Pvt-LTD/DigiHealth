import React, { useState, useCallback } from 'react';
import HomeView from './HomeView';
import { Benefit, benefits as initialBenefits,Feature, features as initialFeatures, StatItem, stats as initialStats } from '../../../constants/data';

// Define the props type for the Home component (if needed in the future)
type HomeProps = {
  stats?: StatItem[];
  features?: Feature[];
  benefits?: Benefit[];
};

// Define the Home component with React.FC and props type
const Home: React.FC<HomeProps> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [features, setFeatures] = useState(initialFeatures);
  const [benefits, setBenefits] = useState(initialBenefits);

  // Simulate data refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch new data here
      // For now, we'll just reset to the initial data
      setStats(initialStats);
      setFeatures(initialFeatures);
      setBenefits(initialBenefits);
      setRefreshing(false);
    }, 1500);
  }, []);

  return (
    <HomeView 
      stats={stats} 
      features={features} 
      benefits={benefits}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};


export default Home;