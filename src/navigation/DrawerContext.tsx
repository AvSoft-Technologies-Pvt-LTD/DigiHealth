// src/navigation/DrawerContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

type DrawerContextType = {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: (screen?: keyof RootStackParamList) => void;
};

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};

export const DrawerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const openDrawer = useCallback(() => setIsOpen(true), []);
  
  const closeDrawer = useCallback((screen?: keyof RootStackParamList) => {
    setIsOpen(false);
    if (screen) {
      navigation.navigate(screen);
    }
  }, [navigation]);

  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer, closeDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};