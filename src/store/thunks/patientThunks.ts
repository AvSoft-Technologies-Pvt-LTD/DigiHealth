import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../slices/allPatientSlice';
import { fetchPatientDashboardDataStart, fetchPatientDashboardDataSuccess, fetchPatientDashboardDataFailure } from '../slices/patientDashboardSlice';
import { get, post, put } from '../../services/apiServices';
import { API } from '../../config/api';
import { AppDispatch } from '..';
import { fetchPatientPersonalDataStart, fetchPatientPersonalDataSuccess, fetchPatientPersonalDataFailure } from '../slices/patientPersonalDataSlice';
import { fetchPatientBloodGroupDataStart, fetchPatientBloodGroupDataSuccess, fetchPatientBloodGroupDataFailure } from '../slices/patientBloodGroupSlice';
import { fetchHealthConditionDataFailure, fetchHealthConditionDataStart, fetchHealthConditionDataSuccess } from '../slices/healthConditionSlice';
import { fetchRelationDataFailure, fetchRelationDataStart, fetchRelationDataSuccess } from '../slices/relationSlice';

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