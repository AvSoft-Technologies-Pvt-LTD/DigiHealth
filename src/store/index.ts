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
import healthSummaryData from "./slices/healthSummary";
import hospitalListReducer from './slices/hospitalList';
import coverageReducer from './slices/coverage';
import medicalInfoSlice from './slices/medicalInfoSlice';
import patientAdditionalDataReducer from './slices/patientAdditionalDataSlice';
import pharmacyReducer from './slices/pharmacySlice';
import medicalConditionStatusReducer from './slices/medicalConditionStatusSlice';
import medicalRecordStatusReducer from './slices/medicalStatusSlice';
import ambulanceTypeReducer from './slices/ambulanceTypeSlice';
import prescriptionReducer from './slices/prescriptionSlice';
import labScanReducer from './slices/labScanSlice';
import pharmacyBillingReducer from './slices/pharmacyBillingSlice';
import labBillingReducer from './slices/labBillingSlice';
import hospitalBillingReducer from './slices/hospitalBillingSlice';
import urgencyLevelReducer from './slices/urgencyLevelSlice';
import medicalConditionReducer from './slices/medicalConditionSlice';
import familyMemberDataReducer from './slices/familyMemberSlice';
import patientSettingReducer from './slices/patientSettingSlice';
import masterReducer from './slices/masterSlice'; // Import the reducer
import allergiesReducer from './slices/allergiesSlice';
import surgeriesReducer from './slices/surgeriesSlice';

export const store = configureStore({
  reducer: {
    updatePatient: updatePatientReducer,
    user: userReducer,
    home: homeReducer,
    doctor: doctorReducer,
    patient: allPatientReducer,
    patientDashboardData: patientDashboardReducer,
    healthSummaryData: healthSummaryData,
    hospitalList: hospitalListReducer,
    patientBloodGroupData: patientBloodGroupReducer,
    patientPersonalData: patientPersonalDataReducer,
    healthConditionData: healthConditionReducer,
    coverageData: coverageReducer,
    relationData: relationReducer,
    ambulanceType: ambulanceTypeReducer,
    master: masterReducer, 
    pharmacy: pharmacyReducer,
    patientAdditionalData: patientAdditionalDataReducer,
    medicalInfo: medicalInfoSlice,
    medicalConditionStatus: medicalConditionStatusReducer,
    medicalRecordStatus: medicalRecordStatusReducer,
    prescription: prescriptionReducer,
    labScan: labScanReducer,
    pharmacyBilling: pharmacyBillingReducer,
    familyMemberData: familyMemberDataReducer,
    medicalConditionData: medicalConditionReducer,
    allergiesData: allergiesReducer,
    surgeriesData: surgeriesReducer,
     
        
    patientSettingData: patientSettingReducer,
    currentPatient: currentPatientReducer,
    labBilling: labBillingReducer,
     hospitalBilling: hospitalBillingReducer,
   urgencyLevel: urgencyLevelReducer,  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
