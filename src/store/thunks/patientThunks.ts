import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../slices/allPatientSlice';
import { fetchPatientDashboardDataStart, fetchPatientDashboardDataSuccess, fetchPatientDashboardDataFailure } from '../slices/patientDashboardSlice';
import { get, put, post } from '../../services/apiServices';
import { API } from '../../config/api';
import { AppDispatch } from '..';
import {
  fetchHealthSummaryDataStart,
  fetchHealthSummaryDataSuccess,
  fetchHealthSummaryDataFailure,
} from '../slices/healthSummary';
import {
  fetchHospitalListStart,
  fetchHospitalListSuccess,
  fetchHospitalListFailure,
} from '../slices/hospitalList';
import {
  fetchAmbulanceTypeStart,
  fetchAmbulanceTypeSuccess,
  fetchAmbulanceTypeFailure,
} from '../slices/ambulanceTypeSlice';
import {
  fetchPharmacyListStart,
  fetchPharmacyListSuccess,
  fetchPharmacyListFailure,
  createPharmacyStart,
  createPharmacySuccess,
  createPharmacyFailure,
} from '../slices/pharmacySlice';
import {
  fetchLabScanStart,
  fetchLabScanSuccess,
  fetchLabScanFailure,
} from '../slices/labScanSlice';
import {
  fetchMedicalInfoStart,
  fetchMedicalInfoSuccess,
  fetchMedicalInfoFailure,
} from '../slices/medicalInfoSlice.ts';

import {
  fetchPrescriptionStart,
  fetchPrescriptionSuccess,
  fetchPrescriptionFailure,
} from './../slices/prescriptionSlice.ts';
import {
  fetchPharmacyBillingStart,
  fetchPharmacyBillingSuccess,
  fetchPharmacyBillingFailure,
} from '../slices/pharmacyBillingSlice';
import {
  fetchLabBillingStart,
  fetchLabBillingSuccess,
  fetchLabBillingFailure,
} from '../slices/labBillingSlice.ts';
import {
  fetchHospitalBillingStart,
  fetchHospitalBillingSuccess,
  fetchHospitalBillingFailure,
} from '../slices/hospitalBillingSlice';
import { fetchPatientPersonalDataStart, fetchPatientPersonalDataSuccess, fetchPatientPersonalDataFailure } from '../slices/patientPersonalDataSlice';
import { fetchPatientBloodGroupDataStart, fetchPatientBloodGroupDataSuccess, fetchPatientBloodGroupDataFailure } from '../slices/patientBloodGroupSlice';
import { fetchHealthConditionDataFailure, fetchHealthConditionDataStart, fetchHealthConditionDataSuccess } from '../slices/healthConditionSlice';
import { fetchRelationDataFailure, fetchRelationDataStart, fetchRelationDataSuccess, saveFamilyHealthDataFailure, saveFamilyHealthDataStart, saveFamilyHealthDataSuccess } from '../slices/relationSlice';
import { fetchCoverageDataStart, fetchCoverageDataSuccess, fetchCoverageDataFailure, saveCoverageDataStart, saveCoverageDataSuccess, saveCoverageDataFailure } from "../slices/coverage";
import {
  fetchPatientAdditionalDetailsStart,
  fetchPatientAdditionalDetailsSuccess,
  fetchPatientAdditionalDetailsFailure,
  savePatientAdditionalDetailsStart,
  savePatientAdditionalDetailsSuccess,
  savePatientAdditionalDetailsFailure,
} from '../slices/patientAdditionalDataSlice';
import {
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFailure,
} from "../slices/plansSlice.ts";

// ====================== PATIENT THUNKS ======================

// --- Patient List ---
export const fetchAllPatients = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPatientsStart());
    const response = await get(API.ALL_PATIENT_API);
    dispatch(fetchPatientsSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients';
    dispatch(fetchPatientsFailure(errorMessage));
  }
};

// --- Patient Dashboard ---
export const fetchPatientDashboardData = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPatientDashboardDataStart());
    const response = await get(API.PATIENT_DASHBOARD_API + id);
    dispatch(fetchPatientDashboardDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient dashboard data';
    dispatch(fetchPatientDashboardDataFailure(errorMessage));
  }
};

// --- Patient Vitals ---
export const healthSummaryData = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHealthSummaryDataStart());
    const response = await get(API.PATIENT_VITALS_API + "/" + id);
    const responseData = response?.data || response;
    dispatch(fetchHealthSummaryDataSuccess(responseData));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch health summary';
    dispatch(fetchHealthSummaryDataFailure(errorMessage));
  }
};

export const updatePatientVitals = (id: string, vitalsData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHealthSummaryDataStart());
    const response = await put(API.PATIENT_VITALS_API + id, vitalsData);
    const responseData = response?.data || response;
    dispatch(fetchHealthSummaryDataSuccess(responseData));
    return responseData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update vitals';
    dispatch(fetchHealthSummaryDataFailure(errorMessage));
    throw error;
  }
};

export const createPatientVitals = (id: string, vitalsData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHealthSummaryDataStart());
    const response = await post(API.PATIENT_VITALS_API, vitalsData);
    const responseData = response?.data || response;
    dispatch(fetchHealthSummaryDataSuccess(responseData));
    return responseData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create vitals';
    dispatch(fetchHealthSummaryDataFailure(errorMessage));
    throw error;
  }
};

// --- Hospital List ---
export const fetchHospitalList = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHospitalListStart());
    const response = await get(API.HOSPITAL_LIST_API);
    dispatch(fetchHospitalListSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hospitals';
    dispatch(fetchHospitalListFailure(errorMessage));
  }
};

// --- Patient Personal Health Data ---
export const fetchPatientPersonalHealthData = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPatientPersonalDataStart());
    const response = await get(API.PATIENT_PERSONAL_HEALTH_API + id);
    dispatch(fetchPatientPersonalDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient personal health data';
    dispatch(fetchPatientPersonalDataFailure(errorMessage));
  }
};

export const updatePatientPersonalHealthData = (id: string, data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPatientPersonalDataStart());
    const response = await put(API.PATIENT_PERSONAL_HEALTH_API + id, data);
    dispatch(fetchPatientPersonalDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update patient personal health data';
    dispatch(fetchPatientPersonalDataFailure(errorMessage));
  }
};

// --- Patient Blood Group Data ---
export const fetchPatientBloodGroupData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPatientBloodGroupDataStart());
    const response = await get(API.PATIENT_BLOOD_GROUP_API);
    dispatch(fetchPatientBloodGroupDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient blood group data';
    dispatch(fetchPatientBloodGroupDataFailure(errorMessage));
  }
};

// --- Patient Health Condition Data ---
export const fetchHealthConditionData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHealthConditionDataStart());
    const response = await get(API.PATIENT_HEALTH_CONDITION_API);
    dispatch(fetchHealthConditionDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient health condition data';
    dispatch(fetchHealthConditionDataFailure(errorMessage));
  }
};

// --- Patient Relation Data ---
export const fetchRelationData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchRelationDataStart());
    const response = await get(API.PATIENT_RELATION_API);
    dispatch(fetchRelationDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient relation data';
    dispatch(fetchRelationDataFailure(errorMessage));
  }
};

// --- Patient Family Health Data ---
export const saveFamilyHealthData = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saveFamilyHealthDataStart());
    const response = await post(API.PATIENT_FAMILY_HEALTH_API, data);
    dispatch(saveFamilyHealthDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save family health data';
    dispatch(saveFamilyHealthDataFailure(errorMessage));
  }
};

// --- Patient Coverage Data ---
export const fetchCoverageTypes = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchCoverageDataStart());
    const response = await get(API.PATIENT_COVERAGE_API);
    dispatch(fetchCoverageDataSuccess(response.data || response));
  } catch (error: any) {
    dispatch(fetchCoverageDataFailure(error.message || 'Failed to fetch coverage types'));
  }
};

export const saveCoverageData = (data: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(saveCoverageDataStart());
    const response = await post(API.PATIENT_COVERAGE_API, data);
    dispatch(saveCoverageDataSuccess(response.data || response));
  } catch (error: any) {
    dispatch(saveCoverageDataFailure(error.message || 'Failed to save coverage data'));
  }
};

export const fetchPatientAdditionalData =
  (patientId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(fetchPatientAdditionalDetailsStart());
      const response = await get(`${API.PATIENT_ADDITIONAL_DETAILS_API}${patientId}`);
      dispatch(fetchPatientAdditionalDetailsSuccess(response.data || response));
    } catch (error: any) {
      dispatch(
        fetchPatientAdditionalDetailsFailure(
          error.message || 'Failed to fetch patient additional data'
        )
      );
    }
  };

// ✅ Save (Create or Update) Patient Additional Data Automatically
export const savePatientAdditionalData =
  (patientId: string, data: Record<string, any>) =>
  async (dispatch: AppDispatch): Promise<any> => {
    try {
      dispatch(savePatientAdditionalDetailsStart());

      // 🔍 Step 1: Check if data exists for this patient
      let existingData;
      try {
        const checkResponse = await get(`${API.PATIENT_ADDITIONAL_DETAILS_API}${patientId}`);
        existingData = checkResponse?.data || checkResponse;
      } catch {
        existingData = null; // ignore fetch error, assume no data
      }

      // 🧭 Step 2: Choose HTTP method dynamically
      const hasExisting = existingData && Object.keys(existingData).length > 0;
      const apiUrl = `${API.PATIENT_ADDITIONAL_DETAILS_API}${patientId}`;
      const response = hasExisting
        ? await put(apiUrl, data) // update existing
        : await post(apiUrl, data); // create new

      dispatch(savePatientAdditionalDetailsSuccess(response.data || response));
      return response.data || response;
    } catch (error: any) {
      dispatch(
        savePatientAdditionalDetailsFailure(
          error.message || 'Failed to save patient additional data'
        )
      );
      throw error;
    }
  };

// --- Ambulance Types ---
export const fetchAmbulanceTypes = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchAmbulanceTypeStart());
    const response = await get(API.AMBULANCE_TYPE);
    dispatch(fetchAmbulanceTypeSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch ambulance types';
    dispatch(fetchAmbulanceTypeFailure(errorMessage));
  }
};

// --- Pharmacy List ---
export const fetchPharmacyList = (city?: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPharmacyListStart());
    let url = API.PHARMACY_LIST_API;
    if (city) {
      url += `?city=${encodeURIComponent(city)}`;
    }
    const response = await get(url);
    dispatch(fetchPharmacyListSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pharmacies';
    dispatch(fetchPharmacyListFailure(errorMessage));
  }
};

// --- Create Pharmacy ---
export const createPharmacy = (pharmacyData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(createPharmacyStart());
    const response = await post(API.PHARMACY_LIST_API, pharmacyData);
    dispatch(createPharmacySuccess(response));
    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create pharmacy';
    dispatch(createPharmacyFailure(errorMessage));
    throw error;
  }
};
export const fetchPlans = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPlansStart());
    const response = await get(API.PLANS);
    dispatch(fetchPlansSuccess(response.data || response));
  } catch (error: any) {
    dispatch(fetchPlansFailure(error.message || "Failed to fetch plans"));
  }
};



// medicalrecord informtion 



export const fetchMedicalInfo = (patientId: string) => async (dispatch: AppDispatch) => {
  console.log("this is medical record..............",API.PATIENT_MEDICAL_INFO_API)
  try {
    dispatch(fetchMedicalInfoStart());
    const response = await get(API.PATIENT_MEDICAL_INFO_API(patientId));
    console.log("Fetched Medical Info:", response);
    dispatch(fetchMedicalInfoSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch medical info';
    dispatch(fetchMedicalInfoFailure(errorMessage));
  }
};



export const fetchPrescriptions = (patientId: string) => async (dispatch: AppDispatch) => {
  console.log("Fetching prescriptions for patient:", patientId);
  try {
    dispatch(fetchPrescriptionStart());
    const response = await get(API.PATIENT_PRESCRIPTION_API(patientId));
    console.log("API Response:", response);

   

    dispatch(fetchPrescriptionSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch prescriptions';
    console.error("Error fetching prescriptions:", error);
    dispatch(fetchPrescriptionFailure(errorMessage));
  }
};


// Fetch Lab Scans
export const fetchLabScans = (patientId: string) => async (dispatch: AppDispatch) => {
  console.log("Fetching lab scans for patient:", API.PATIENT_LAB_SCAN_API(patientId));
  try {
    dispatch(fetchLabScanStart());
    const response = await get(API.PATIENT_LAB_SCAN_API(patientId));
    console.log("API Response for Lab Scans==============:", response);
    dispatch(fetchLabScanSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lab scans';
    dispatch(fetchLabScanFailure(errorMessage));
  }
};


// Billing api medical record details in patient



// Pharmacy Billing
export const fetchPharmacyBilling = (patientId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPharmacyBillingStart());
    const response = await get(API.PHARMACY_BILLING_API(patientId));
    console.log("Pharmacy Billing Response:", response);
    dispatch(fetchPharmacyBillingSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch pharmacy bills';
    dispatch(fetchPharmacyBillingFailure(errorMessage));
  }
};

// Lab Billing
export const fetchLabBilling = (patientId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchLabBillingStart());
    const response = await get(API.LAB_BILLING_API(patientId));
    dispatch(fetchLabBillingSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lab bills';
    dispatch(fetchLabBillingFailure(errorMessage));
  }
};

// Hospital Billing
export const fetchHospitalBilling = (patientId: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHospitalBillingStart());
    const response = await get(API.HOSPITAL_BILLING_API(patientId));
    dispatch(fetchHospitalBillingSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hospital bills';
    dispatch(fetchHospitalBillingFailure(errorMessage));
  }
};