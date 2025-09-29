// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import homeReducer from './slices/homeSlice';
import doctorReducer from './slices/doctorSlice'; // Add this import
import patientReducer from './slices/allPatientSlice';
import patientDashboardReducer from './slices/patientDashboardSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    home: homeReducer,
    doctor: doctorReducer, // Register the doctor reducer
    patient: patientReducer,
    patientDashboardData: patientDashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
