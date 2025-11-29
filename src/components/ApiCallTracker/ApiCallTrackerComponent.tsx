import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { getApiTrackerData, resetApiTracker } from '../../utils/apiTracker';

interface ApiCallTracker {
  [apiName: string]: {
    count: number;
    totalTime: number;
    averageTime: number;
    lastCallTime: number;
    callDetails: Array<{
      timestamp: number;
      duration?: number;
      id?: string;
    }>;
  };
}

const ApiCallTrackerComponent: React.FC = () => {
  const [trackerData, setTrackerData] = useState<ApiCallTracker>({});
  const [isVisible, setIsVisible] = useState(false);
  const [totalCalls, setTotalCalls] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  // Update tracker data every 500ms
  useEffect(() => {
    const interval = setInterval(() => {
      const data = getApiTrackerData();
      setTrackerData(data);
      
      // Calculate totals
      let calls = 0;
      let time = 0;
      Object.values(data).forEach(tracker => {
        calls += tracker.count;
        time += tracker.totalTime;
      });
      setTotalCalls(calls);
      setTotalTime(time);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(1)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getPerformanceColor = (count: number) => {
    if (count === 1) return '#4CAF50'; // Green - Good
    if (count === 2) return '#FF9800'; // Orange - Warning
    return '#F44336'; // Red - Bad
  };

  const getSpeedColor = (avgTime: number) => {
    if (avgTime < 200) return '#4CAF50'; // Fast - Green
    if (avgTime < 500) return '#FF9800'; // Medium - Orange
    return '#F44336'; // Slow - Red
  };

  if (!isVisible) {
    return (
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => setIsVisible(true)}
      >
        <Text style={styles.floatingButtonText}>📊</Text>
        <Text style={styles.callCount}>{totalCalls}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 API Performance Tracker</Text>
        <TouchableOpacity onPress={() => setIsVisible(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Calls</Text>
          <Text style={[styles.summaryValue, { color: totalCalls > 4 ? '#F44336' : '#4CAF50' }]}>
            {totalCalls}
          </Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Total Time</Text>
          <Text style={styles.summaryValue}>{formatTime(totalTime)}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Avg Time</Text>
          <Text style={styles.summaryValue}>
            {totalCalls > 0 ? formatTime(totalTime / totalCalls) : '0ms'}
          </Text>
        </View>
      </View>

      {totalCalls > 4 && (
        <View style={styles.alertBox}>
          <Text style={styles.alertText}>🚨 PERFORMANCE ALERT: Expected 4 calls, got {totalCalls}</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {Object.entries(trackerData).map(([apiName, tracker]) => (
          <View key={apiName} style={styles.apiCard}>
            <View style={styles.apiHeader}>
              <Text style={styles.apiName}>{apiName}</Text>
              <View style={styles.callBadge}>
                <Text style={[styles.callCountText, { color: getPerformanceColor(tracker.count) }]}>
                  {tracker.count} calls
                </Text>
              </View>
            </View>
            
            <View style={styles.metricsRow}>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Avg Time</Text>
                <Text style={[styles.metricValue, { color: getSpeedColor(tracker.averageTime) }]}>
                  {formatTime(tracker.averageTime)}
                </Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Total Time</Text>
                <Text style={styles.metricValue}>{formatTime(tracker.totalTime)}</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={styles.metricLabel}>Status</Text>
                <Text style={[styles.metricValue, { color: getPerformanceColor(tracker.count) }]}>
                  {tracker.count === 1 ? '✅ Good' : tracker.count === 2 ? '⚠️ Duplicate' : '🚨 Bad'}
                </Text>
              </View>
            </View>

            {tracker.count > 1 && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  ⚠️ This API called {tracker.count} times - Performance impact!
                </Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => {
          resetApiTracker();
        }}
      >
        <Text style={styles.resetButtonText}>Reset Tracker</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 320,
    height: 400,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 1000,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  closeButton: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryCard: {
    backgroundColor: '#2D2D2D',
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 2,
  },
  summaryLabel: {
    fontSize: 10,
    color: '#999',
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 2,
  },
  alertBox: {
    backgroundColor: '#F44336',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  alertText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  apiCard: {
    backgroundColor: '#2D2D2D',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  apiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  apiName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  callBadge: {
    backgroundColor: '#3D3D3D',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  callCountText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    color: '#999',
  },
  metricValue: {
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: 2,
  },
  warningBox: {
    backgroundColor: '#FF9800',
    padding: 6,
    borderRadius: 4,
    marginTop: 8,
  },
  warningText: {
    color: '#FFF',
    fontSize: 10,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  floatingButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#2196F3',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  floatingButtonText: {
    fontSize: 20,
    marginBottom: -8,
  },
  callCount: {
    fontSize: 10,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default ApiCallTrackerComponent;
