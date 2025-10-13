// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import homeReducer from './slices/homeSlice';
import doctorReducer from './slices/doctorSlice';
import { currentPatientReducer } from './slices/allPatientSlice';
import allPatientReducer from './slices/allPatientSlice';
import patientDashboardReducer from './slices/patientDashboardSlice';
import updatePatientReducer from "./slices/updatePatientSlice";
import patientBloodGroupReducer from './slices/patientBloodGroupSlice';
import patientPersonalDataReducer from './slices/patientPersonalDataSlice';
import healthConditionReducer from './slices/healthConditionSlice';
import relationReducer from './slices/relationSlice';
import healthSummaryData from "./slices/healthSummary"
import hospitalListReducer from './slices/hospitalList';
import coverageReducer from './slices/coverage'
import patientAdditionalDataReducer from './slices/patientAdditionalDataSlice';
import pharmacyReducer from './slices/pharmacySlice';import ambulanceTypeReducer from './slices/ambulanceTypeSlice';
import medicalInfoReducer from './slices/medicalInfoSlice';
import prescriptionReducer from './slices/prescriptionSlice';
import labScanReducer from './slices/labScanSlice';
import pharmacyBillingReducer from './slices/pharmacyBillingSlice';
import labBillingReducer from './slices/labBillingSlice';
import hospitalBillingReducer from './slices/hospitalBillingSlice';



export const store = configureStore({
  reducer: {
    updatePatient: updatePatientReducer,
    user: userReducer,
    home: homeReducer,
    doctor: doctorReducer,
    patient: allPatientReducer,
    patientDashboardData: patientDashboardReducer,
    healthSummaryData:healthSummaryData,
    hospitalList: hospitalListReducer,
    patientBloodGroupData: patientBloodGroupReducer,
    patientPersonalData: patientPersonalDataReducer,
    healthConditionData: healthConditionReducer,
    coverageData:coverageReducer,
    relationData: relationReducer,
    ambulanceType: ambulanceTypeReducer,
    pharmacy: pharmacyReducer,
    patientAdditionalData: patientAdditionalDataReducer,
     prescription: prescriptionReducer,       labScan: labScanReducer,
 medicalInfo: medicalInfoReducer,
 currentPatient: currentPatientReducer,
 pharmacyBilling: pharmacyBillingReducer,
    labBilling: labBillingReducer,
    hospitalBilling: hospitalBillingReducer,
     
        
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
