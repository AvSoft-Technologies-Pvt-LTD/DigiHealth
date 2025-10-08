import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../slices/allPatientSlice';
import { fetchPatientDashboardDataStart, fetchPatientDashboardDataSuccess, fetchPatientDashboardDataFailure } from '../slices/patientDashboardSlice';
import { get, post, put } from '../../services/apiServices';
import { API } from '../../config/api';
import { AppDispatch } from '..';
import { fetchPatientPersonalDataStart, fetchPatientPersonalDataSuccess, fetchPatientPersonalDataFailure } from '../slices/patientPersonalDataSlice';
import { fetchPatientBloodGroupDataStart, fetchPatientBloodGroupDataSuccess, fetchPatientBloodGroupDataFailure } from '../slices/patientBloodGroupSlice';
import { fetchHealthConditionDataFailure, fetchHealthConditionDataStart, fetchHealthConditionDataSuccess } from '../slices/healthConditionSlice';
import { fetchRelationDataFailure, fetchRelationDataStart, fetchRelationDataSuccess, saveFamilyHealthDataFailure, saveFamilyHealthDataStart, saveFamilyHealthDataSuccess } from '../slices/relationSlice';
import { getPatientPhotoFailure, getPatientPhotoStart, getPatientPhotoSuccess } from '../slices/patientSettingSlice';

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

export const fetchPatientDashboardData = (id:string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(fetchPatientDashboardDataStart());
      const response = await get(API.PATIENT_DASHBOARD_API+id);
      dispatch(fetchPatientDashboardDataSuccess(response));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients dashboard data';
      dispatch(fetchPatientDashboardDataFailure(errorMessage));
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

export const fetchPatientPhoto = (path: string) => async (dispatch: AppDispatch) => {
  try {
    dispatch(getPatientPhotoStart());

    // Get binary data
    const response = await get(API.PATIENT_PHOTO + path, {}, 'arraybuffer');

    // Convert binary -> base64 (React Native safe)
    const base64 = arrayBufferToBase64(response);
    const imageUri = `data:image/jpeg;base64,${base64}`;

    dispatch(getPatientPhotoSuccess(imageUri));
  } catch (error) {
    console.error('Error in fetchPatientPhoto:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient photo';
    dispatch(getPatientPhotoFailure(errorMessage));
    return Promise.reject(error);
  }
};

// Utility function to convert ArrayBuffer -> base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 8192; // for large images

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, Array.from(chunk));
  }

  return global.btoa(binary); // btoa is safe in React Native
};
