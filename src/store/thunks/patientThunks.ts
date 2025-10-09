import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../slices/allPatientSlice';
import { fetchPatientDashboardDataStart, fetchPatientDashboardDataSuccess, fetchPatientDashboardDataFailure } from '../slices/patientDashboardSlice';
import { get, put, post, } from '../../services/apiServices';
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
// Fetch all patientsimport { fetchPatientPersonalDataStart, fetchPatientPersonalDataSuccess, fetchPatientPersonalDataFailure } from '../slices/patientPersonalDataSlice';
import { fetchPatientBloodGroupDataStart, fetchPatientBloodGroupDataSuccess, fetchPatientBloodGroupDataFailure } from '../slices/patientBloodGroupSlice';
import { fetchHealthConditionDataFailure, fetchHealthConditionDataStart, fetchHealthConditionDataSuccess } from '../slices/healthConditionSlice';
import { fetchRelationDataFailure, fetchRelationDataStart, fetchRelationDataSuccess, saveFamilyHealthDataFailure, saveFamilyHealthDataStart, saveFamilyHealthDataSuccess } from '../slices/relationSlice';
import {fetchCoverageDataStart,fetchCoverageDataSuccess,fetchCoverageDataFailure,saveCoverageDataStart,saveCoverageDataSuccess, saveCoverageDataFailure,
} from "../slices/coverage"; 
import {
  fetchPatientAdditionalDetailsStart,
  fetchPatientAdditionalDetailsSuccess,
  fetchPatientAdditionalDetailsFailure,
  savePatientAdditionalDetailsStart,
  savePatientAdditionalDetailsSuccess,
  savePatientAdditionalDetailsFailure,
} from "../slices/patientAdditionalDataSlice";import { getPatientPhotoFailure, getPatientPhotoStart, getPatientPhotoSuccess } from '../slices/patientSettingSlice';

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

// Fetch patient dashboard data
export const fetchPatientDashboardData = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchPatientDashboardDataStart());
    const response = await get(API.PATIENT_DASHBOARD_API + id);
    dispatch(fetchPatientDashboardDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient dashboard data dashboard data';
    dispatch(fetchPatientDashboardDataFailure(errorMessage));
  }
};


export const healthSummaryData = (id: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHealthSummaryDataStart());
    const response = await get(API.PATIENT_VITALS_API +"/"+id);
    console.log("this is my vitals.......:", response);
    const responseData = response?.data || response;
    console.log("Vitals data to be dispatched:", responseData);
    dispatch(fetchHealthSummaryDataSuccess(responseData));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch health summary';
    console.error("Error fetching vitals:", error);
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

// Create vitals (POST)
export const createPatientVitals = (id: string, vitalsData: any) => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchHealthSummaryDataStart());
    const response = await post(API.PATIENT_VITALS_API, vitalsData);
    console.log("Create response:", response); // Log the response
    const responseData = response?.data || response;
    dispatch(fetchHealthSummaryDataSuccess(responseData));
    return responseData;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create vitals';
    console.error("Error creating vitals:", error); // Log the error
    dispatch(fetchHealthSummaryDataFailure(errorMessage));
    throw error;
  }
};

// hospitallist 
export const fetchHospitalList = () => async (dispatch: AppDispatch) => {
  console.log("this is hospitallist ",API.HOSPITAL_LIST_API);
  try {
    dispatch(fetchHospitalListStart());
    const response = await get(API.HOSPITAL_LIST_API);
     console.log("Fetched Hospital List Data:", response);
    dispatch(fetchHospitalListSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hospitals';
    dispatch(fetchHospitalListFailure(errorMessage));
  }
};


  export const fetchPatientPersonalHealthData = (id:string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchPatientPersonalDataStart());
      const response = await get(API.PATIENT_PERSONAL_HEALTH_API+id);
      dispatch(fetchPatientPersonalDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients personal health data';
      dispatch(fetchPatientPersonalDataFailure(errorMessage));
    }
  };
  export const updatePatientPersonalHealthData = (id:string,data:any) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchPatientPersonalDataStart());
      const response = await put(API.PATIENT_PERSONAL_HEALTH_API+id,data);
      console.log("Updated response",response);
      dispatch(fetchPatientPersonalDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update patients personal health data';
      dispatch(fetchPatientPersonalDataFailure(errorMessage));
    }
  };

  export const fetchPatientBloodGroupData = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchPatientBloodGroupDataStart());
      const response = await get(API.PATIENT_BLOOD_GROUP_API);
      dispatch(fetchPatientBloodGroupDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients blood group data';
      dispatch(fetchPatientBloodGroupDataFailure(errorMessage));
    }
  };

  export const fetchHealthConditionData = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchHealthConditionDataStart());
      const response = await get(API.PATIENT_HEALTH_CONDITION_API);
      dispatch(fetchHealthConditionDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients health condition data';
      dispatch(fetchHealthConditionDataFailure(errorMessage));
    }
  };

     export const fetchRelationData = () => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchRelationDataStart());
      const response = await get(API.PATIENT_RELATION_API);
      dispatch(fetchRelationDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients health condition data';
      dispatch(fetchRelationDataFailure(errorMessage));
    }
  };

  export const saveFamilyHealthData = (data:any) => async (dispatch: AppDispatch) => {
    console.log("Data",data,"url",API.PATIENT_FAMILY_HEALTH_API)
    try {
      dispatch(saveFamilyHealthDataStart());
      const response = await post(API.PATIENT_FAMILY_HEALTH_API,data);
      dispatch(saveFamilyHealthDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients health condition data';
      dispatch(saveFamilyHealthDataFailure(errorMessage));
    }
  };





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



  // Fetch Ambulance Types
export const fetchAmbulanceTypes = () => async (dispatch: AppDispatch) => {
  console.log("Fetching ambulance types from:", API.AMBULANCE_TYPE);
  try {
    dispatch(fetchAmbulanceTypeStart());
    const response = await get(API.AMBULANCE_TYPE);
    console.log("Fetched Ambulance Types:", response);
    dispatch(fetchAmbulanceTypeSuccess(response));
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch ambulance types';
    dispatch(fetchAmbulanceTypeFailure(errorMessage));
  }
};








// patientThunks.ts
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

// POST - Create new pharmacy
export const createPharmacy = (pharmacyData: any) => async (dispatch: AppDispatch) => {
  console.log("post pharmacies");
  try {
    dispatch(createPharmacyStart());
    const response = await post(API.PHARMACY_LIST_API, pharmacyData);
    dispatch(createPharmacySuccess(response));
    return response; // Return response for potential redirect or notification
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create pharmacy';
    dispatch(createPharmacyFailure(errorMessage));
    throw error; // Re-throw error for handling in component
  }
};