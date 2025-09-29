import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../slices/allPatientSlice';
import { fetchPatientDashboardDataStart, fetchPatientDashboardDataSuccess, fetchPatientDashboardDataFailure } from '../slices/patientDashboardSlice';
import { get } from '../../services/apiServices';
import { API } from '../../config/api';
import { AppDispatch } from '..';

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
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients';
      dispatch(fetchPatientDashboardDataFailure(errorMessage));
    }
  };