import React from 'react';
import HomeView from './HomeView';

// Define the props type for the Home component (if needed in the future)
type HomeProps = {};

// Define the Home component with React.FC and props type
const Home: React.FC<HomeProps> = () => {

  return (
    <HomeView />
  );
};


export default Home;