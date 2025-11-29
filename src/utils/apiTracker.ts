// Global API Call Tracking System
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

const apiTracker: ApiCallTracker = {};

export const logApiCall = (apiName: string, details?: string) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  
  // Initialize tracker for this API if not exists
  if (!apiTracker[apiName]) {
    apiTracker[apiName] = {
      count: 0,
      totalTime: 0,
      averageTime: 0,
      lastCallTime: 0,
      callDetails: []
    };
  }
  
  // Update tracker
  apiTracker[apiName].count++;
  apiTracker[apiName].lastCallTime = startTime;
  apiTracker[apiName].callDetails.push({
    timestamp: startTime,
    id: details?.match(/ID:\s*(\w+)/)?.[1]
  });
  
  const currentCount = apiTracker[apiName].count;
  
  // Log with performance warnings
  console.log(`📞 API CALL #${currentCount}: ${apiName}${details ? ` - ${details}` : ''}`);
  
  // Warning for duplicate calls
  if (currentCount > 1) {
    console.warn(`⚠️  DUPLICATE CALL: ${apiName} called ${currentCount} times`);
    console.warn(`📊 PERFORMANCE IMPACT: Same API hit ${currentCount} times`);
  }
  
  // Performance tracking
  const endTime = Date.now();
  const duration = endTime - startTime;
  apiTracker[apiName].totalTime += duration;
  apiTracker[apiName].averageTime = apiTracker[apiName].totalTime / apiTracker[apiName].count;
  apiTracker[apiName].callDetails[apiTracker[apiName].callDetails.length - 1].duration = duration;
  
  // Performance warnings
  if (duration > 1000) {
    console.error(`🐌 SLOW API: ${apiName} took ${duration.toFixed(2)}ms`);
  }
  
  // Log summary every 5 calls
  if (currentCount % 5 === 0) {
    console.log(`📈 API SUMMARY: ${apiName}`);
    console.log(`   Total calls: ${currentCount}`);
    console.log(`   Average time: ${apiTracker[apiName].averageTime.toFixed(2)}ms`);
    console.log(`   Total time: ${apiTracker[apiName].totalTime.toFixed(2)}ms`);
  }
  
  // Log complete tracker summary periodically
  if (currentCount === 1) {
    setTimeout(() => logCompleteTrackerSummary(), 100);
  }
};

const logCompleteTrackerSummary = () => {
  console.log('\n📊 === COMPLETE API PERFORMANCE SUMMARY ===');
  
  const apis = Object.keys(apiTracker);
  let totalApiCalls = 0;
  let totalApiTime = 0;
  
  apis.forEach(apiName => {
    const tracker = apiTracker[apiName];
    totalApiCalls += tracker.count;
    totalApiTime += tracker.totalTime;
    
    if (tracker.count > 1) {
      console.warn(`⚠️  ${apiName}: ${tracker.count} calls (DUPLICATE!)`);
    } else {
      console.log(`✅ ${apiName}: ${tracker.count} call`);
    }
    
    console.log(`   ⏱️  Avg: ${tracker.averageTime.toFixed(2)}ms | Total: ${tracker.totalTime.toFixed(2)}ms`);
  });
  
  console.log(`\n📈 TOTAL PERFORMANCE:`);
  console.log(`   Total API calls: ${totalApiCalls}`);
  console.log(`   Total time: ${totalApiTime.toFixed(2)}ms`);
  console.log(`   Average per API: ${(totalApiTime / totalApiCalls).toFixed(2)}ms`);
  
  if (totalApiCalls > 4) {
    console.error(`🚨 PERFORMANCE ALERT: ${totalApiCalls} API calls detected! Expected: 4`);
  }
  
  console.log('=============================================\n');
};

// Get tracker data for debugging
export const getApiTrackerData = () => ({ ...apiTracker });

// Reset tracker data
export const resetApiTracker = () => {
  Object.keys(apiTracker).forEach(key => {
    delete apiTracker[key];
  });
  console.log('🔄 API Tracker reset');
};
