import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../slices/allPatientSlice';
import { fetchPatientDashboardDataStart, fetchPatientDashboardDataSuccess, fetchPatientDashboardDataFailure } from '../slices/patientDashboardSlice';
import { get, put, post, plainDelete } from '../../services/apiServices';
import { API } from '../../config/api';
import { AppDispatch } from '..';
import {
  fetchMedicalConditionsStart,
  fetchMedicalConditionsSuccess,
  fetchMedicalConditionsFailure,
  
} from '../slices/medicalConditionStatusSlice';
import {
  fetchUrgencyLevelsStart,
  fetchUrgencyLevelsSuccess,
  fetchUrgencyLevelsFailure,
} from '../slices/urgencyLevelSlice';
import{  fetchMedicalStatusStart,
  fetchMedicalStatusSuccess,
  fetchMedicalStatusFailure,
  clearMedicalStatus}from "../slices/medicalStatusSlice";
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
import {
  fetchLabTestsStart,
  fetchLabTestsSuccess,
  fetchLabTestsFailure,
  fetchLabScansStart,
  fetchLabScansSuccess,
  fetchLabScansFailure,
} from "../slices/labSlice.ts";
import { getPatientPhotoFailure, getPatientPhotoStart, getPatientPhotoSuccess } from '../slices/patientSettingSlice.ts';
import { fetchFamilyMemberDataFailure, fetchFamilyMemberDataStart, fetchFamilyMemberDataSuccess } from '../slices/familyMemberSlice.ts';

// ====================== PATIENT THUNKS ======================

// --- Patient List ---
import { fetchMedicalConditionDataStart, fetchMedicalConditionDataSuccess } from '../slices/medicalConditionSlice.ts';
import { fetchAllergiesDataFailure, fetchAllergiesDataStart, fetchAllergiesDataSuccess } from '../slices/allergiesSlice.ts';
import { fetchSurgeriesDataFailure, fetchSurgeriesDataStart, fetchSurgeriesDataSuccess } from '../slices/surgeriesSlice.ts';
import { updatePatientFailure, updatePatientStart, updatePatientSuccess } from '../slices/updatePatientSlice';

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

// --- Allergies List ---
export const fetchAllergiesData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchAllergiesDataStart());
    const response = await get(API.ALLERGIES);
     const formattedAllergies = response?.map((item: any) => ({
                label: item.allergyName,
                value: item.id
            }));
    dispatch(fetchAllergiesDataSuccess(formattedAllergies));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hospitals';
    dispatch(fetchAllergiesDataFailure(errorMessage));
  }
};

// --- Surgeries List ---
export const fetchSurgeriesData = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchSurgeriesDataStart());
    const response = await get(API.SURGERIES);
     const formattedSurgeries = response?.map((item: any) => ({
                label: item.surgeryName,
                value: item.id
            }));
    dispatch(fetchSurgeriesDataSuccess(formattedSurgeries));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch hospitals';
    dispatch(fetchSurgeriesDataFailure(errorMessage));
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

export const updatePatientPersonalHealthData = (id: number, data: any) => async (dispatch: AppDispatch) => {
  console.log("UPDATING",id,"DATA",data,"DISPATCH",dispatch)
  try {
    dispatch(fetchPatientPersonalDataStart());
    const response = await put(API.PATIENT_PERSONAL_HEALTH_API + id, data);
    console.log("RESPONSE OF UDATED",response)
    if(response){
      dispatch(fetchPatientPersonalHealthData(id));
    }
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
export const saveFamilyHealthData = (data: any, isEditing?: boolean) => async (dispatch: AppDispatch) => {
  const method = isEditing ? put : post;
  const apiUrl = isEditing ? `${API.PATIENT_FAMILY_HEALTH_API}/${data.id}` : API.PATIENT_FAMILY_HEALTH_API;
  console.log("API URL",apiUrl)
  console.log("DATA",data)
  console.log("isEditing",isEditing)
  try {
    dispatch(saveFamilyHealthDataStart());
    const response = await method(apiUrl, data);
    if(response){
      dispatch(fetchFamilyHealthData(response.patientId));
    }
    dispatch(saveFamilyHealthDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save family health data';
    dispatch(saveFamilyHealthDataFailure(errorMessage));
  }
};
export const deleteFamilyMember = (item: any) => async (dispatch: AppDispatch) => {
  try {
    await plainDelete(API.PATIENT_FAMILY_HEALTH_API +"/"+ item.id);
    dispatch(fetchFamilyHealthData(item.patientId));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete family member';
    console.log("DELETE ERROR",errorMessage)
  }
};
// --- Patient Family Health Data ---
export const fetchFamilyHealthData = (patientId: string) => async (dispatch: AppDispatch) => {

  try {
    dispatch(fetchFamilyMemberDataStart());
    const response = await get(API.PATIENT_FAMILY_MEMBERS_API + patientId);
    dispatch(fetchFamilyMemberDataSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to save family health data';
    dispatch(fetchFamilyMemberDataFailure(errorMessage));
  }
};

// --- Patient Coverage Data ---

  // export const fetchPatientPhoto = (photo:string) => async (dispatch: AppDispatch) => {
  //   try {
  //     dispatch(getPatientPhotoStart());
  //     const response = await get(API.PATIENT_PHOTO + photo);
  //     console.log("this is my photo",response)
  //     dispatch(getPatientPhotoSuccess(response));
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients photo';
  //     dispatch(getPatientPhotoFailure(errorMessage));
  //   }
  // };

  // export const fetchPatientPhoto = (path: string) => async (dispatch: AppDispatch) => {
  //   try {
  //     dispatch(getPatientPhotoStart());
  
  //     // Get binary data
  //     const response = await get(API.PATIENT_PHOTO + path, {}, 'arraybuffer');
  
  //     // Convert binary -> base64 (React Native safe)
  //     const base64 = arrayBufferToBase64(response);
  //     const imageUri = `data:image/jpeg;base64,${base64}`;
  
  //     dispatch(getPatientPhotoSuccess(imageUri));
  //   } catch (error) {
  //     console.error('Error in fetchPatientPhoto:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient photo';
  //     dispatch(getPatientPhotoFailure(errorMessage));
  //     return Promise.reject(error);
  //   }
  // };


  // export const fetchPatientPhoto = (photo:string) => async (dispatch: AppDispatch) => {
  //   try {
  //     dispatch(getPatientPhotoStart());
  //     const response = await get(API.PATIENT_PHOTO + photo);
  //     console.log("this is my photo",response)
  //     dispatch(getPatientPhotoSuccess(response));
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patients photo';
  //     dispatch(getPatientPhotoFailure(errorMessage));
  //   }
  // };

  export const fetchPatientPhoto = (path: string) => async (dispatch: AppDispatch) => {
    // try {
    //   dispatch(getPatientPhotoStart());
  
      // Get binary data
      // const response = await get(API.PATIENT_PHOTO + path, {}, 'arraybuffer');
      console.log("PHOTO URL",API.PATIENT_PHOTO + path)
      // Convert binary -> base64 (React Native safe)
    //   const base64 = arrayBufferToBase64(response);
    //   const imageUri = `data:image/jpeg;base64,${base64}`;
  
    //   dispatch(getPatientPhotoSuccess(imageUri));
    // } catch (error) {
    //   console.error('Error in fetchPatientPhoto:', error);
    //   const errorMessage = error instanceof Error ? error.message : 'Failed to fetch patient photo';
    //   dispatch(getPatientPhotoFailure(errorMessage));
    //   return Promise.reject(error);
    // }
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

export const saveMedicalRecord = (data: any, isIpd?: boolean) => async (dispatch: AppDispatch) => {
  console.log("DATA",data)
  console.log("isIpd",isIpd)
  try {
    dispatch(saveCoverageDataStart());
    const response = await post(isIpd ? API.IPD_RECORD_API : API.OPD_RECORD_API, data);
    console.log("RESPONSE OF OPD",response)
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

export const updatePatientById = (id:string,data:any) => async (dispatch: AppDispatch) => {
  console.log("Update patient by id",id,data)
  try {
    dispatch(updatePatientStart());
    const response = await put(API.UPDATE_PATIENT_BY_ID + id, data);
    console.log("Updated response",response)
    dispatch(updatePatientSuccess(response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update patient';
    dispatch(updatePatientFailure(errorMessage));
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
// export const fetchLabScans = (patientId: string) => async (dispatch: AppDispatch) => {
//   console.log("Fetching lab scans for patient:", API.PATIENT_LAB_SCAN_API(patientId));
//   try {
//     dispatch(fetchLabScanStart());
//     const response = await get(API.PATIENT_LAB_SCAN_API(patientId));
//     console.log("API Response for Lab Scans==============:", response);
//     dispatch(fetchLabScanSuccess(response.data || response));
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Failed to fetch lab scans';
//     dispatch(fetchLabScanFailure(errorMessage));
//   }
// };

export const getLabScans = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchLabScansStart());
    const response = await get(API.LABS_SCANS_API);
    const data = response?.data || response;
    dispatch(fetchLabScansSuccess(data));
    return data;
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to fetch lab scans";
    dispatch(fetchLabScansFailure(errorMessage));
    throw error;
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

export const fetchLabTests = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchLabTestsStart());
    const response = await get(API.LABS_TESTS_API);
    const data = response?.data || response;
    dispatch(fetchLabTestsSuccess(data));
    return data;
  } catch (error: any) {
    const errorMessage = error?.message || "Failed to fetch lab tests";
    dispatch(fetchLabTestsFailure(errorMessage));
    throw error;
  }
};



export const fetchAllLabData = () => async (dispatch: AppDispatch) => {
  try {
    await Promise.all([
      dispatch(fetchLabTests()),
      dispatch(getLabScans()),
    ]);
  } catch (error) {
    console.error("Failed to fetch all lab data:", error);
  }
};
// Example thunk
// src/store/thunks/patientThunks.ts
export const fetchMedicalConditions = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchMedicalConditionsStart());
    const response = await fetch(API.PATIENT_MEDICAL_CONDITIONS_API);
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    dispatch(fetchMedicalConditionsSuccess(data));
  } catch (error: any) {
    dispatch(fetchMedicalConditionsFailure(error.message));
    dispatch(fetchMedicalConditionsSuccess([])); // Fallback to empty array
  }
};


// --- Medical Record Status ---
export const fetchMedicalStatuses = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchMedicalStatusStart());
    const response = await get(API.MEDICAL_STATUS_API);
    dispatch(fetchMedicalStatusSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch medical statuses';
    dispatch(fetchMedicalStatusFailure(errorMessage));
  }
};


// urgancy levels api
export const fetchUrgencyLevels = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(fetchUrgencyLevelsStart());
    const response = await get(API.URGENCY_LEVELS_API);
    console.log("Urgency Levels Response:", response);
    dispatch(fetchUrgencyLevelsSuccess(response.data || response));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch urgency levels';
    dispatch(fetchUrgencyLevelsFailure(errorMessage));
  }
};