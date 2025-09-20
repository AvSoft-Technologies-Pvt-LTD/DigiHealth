import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AvText from '../../elements/AvText';
import { COLORS } from '../../constants/colors';

export interface Tab {
  key: string;
  label: string;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.key === activeTab;
          const tabTextStyle = isActive ? styles.activeTabText : styles.tabText;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tab,
                index === 0 && styles.firstTab,
                index === tabs.length - 1 && styles.lastTab,
              ]}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={0.7}
            >
              <AvText type="body" style={tabTextStyle}>
                {tab.label}
              </AvText>
              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    position: 'relative',
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstTab: {
    paddingLeft: 10,
  },
  lastTab: {
    paddingRight: 0,
  },
  tabText: {
    color: COLORS.PRIMARY,
    fontWeight: '600',
    fontSize: 16,
  },
  activeTabText: {
    color: COLORS.PRIMARY,
    fontWeight: '700',
    fontSize: 16,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -20 }],
    width: 80,
    height: 3,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 1.5,
  },
});