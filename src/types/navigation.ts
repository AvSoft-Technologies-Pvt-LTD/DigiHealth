// src/types/navigation.ts
import { PAGES } from '../constants/pages';

export type RootStackParamList = {
  [PAGES.HOME]: undefined;
  [PAGES.SPLASH]: undefined;
  [PAGES.LOGIN]: undefined;
  [PAGES.REGISTER]: undefined;
  [PAGES.PATIENT_REGISTER]: undefined;
  [PAGES.DOCTOR_REGISTER]: undefined;
  [PAGES.HOSPITAL_REGISTER]: undefined;
  [PAGES.LABS_SCAN_REGISTER]: undefined;
  [PAGES.PATIENT_DASHBOARD]: undefined;
  [PAGES.PATIENT_SETTINGS]: undefined;
  [PAGES.LAB_BOOKING]: undefined;
  [PAGES.PATIENT_APPOINTMENTS]: undefined;
  [PAGES.AMBULANCE_BOOKING_VIEW]:undefined;
  [PAGES.NOTIFICATION_SCREEN]:undefined;
  [PAGES.BILLING]:undefined;
  [PAGES.PHARMACY_FINDER_VIEW]:undefined;

};

// This ensures type checking for navigation props
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}