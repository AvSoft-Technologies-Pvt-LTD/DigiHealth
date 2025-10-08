// import React, { useState } from 'react';
// import { useNavigation } from '@react-navigation/native';
// import MedicalRecordDetails from './MedicalRecordDetails';
// import { COLORS } from '../../../../constants/colors';
// import {
//   vitalsData,
//   prescriptionsData,
//   testResultsData,
//   billingItemsData,
//   educationalVideos
// } from '../../../../constants/data';
// import { PAGES } from '../../../../constants/pages';

// export default function MedicalRecordDetails() {
//   const [activeTab, setActiveTab] = useState('medical-records');
//   const [chiefComplaint, setChiefComplaint] = useState('Headache');
//   const [pastHistory, setPastHistory] = useState('No prior medical issues');
//   const navigation = useNavigation();

//   const tabs = [
//     { key: 'medical-records', label: 'Medical Records' },
//     { key: 'prescriptions', label: 'Prescriptions' },
//     { key: 'lab-results', label: 'Lab Results' },
//     { key: 'billing', label: 'Billing' },
//     { key: 'videos', label: 'Videos' },
//   ];

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Pending': return COLORS.BRIGHT_ORANGE;
//       case 'Completed': return COLORS.SUCCESS;
//       case 'Failed': return COLORS.ERROR;
//       case 'Paid': return COLORS.SUCCESS;
//       case 'Overdue': return COLORS.ERROR;
//       default: return COLORS.GREY;
//     }
//   };

//   const calculateTotalOutstanding = () => {
//     return billingItemsData
//       .filter(item => item.status === 'Pending')
//       .reduce((sum, item) => sum + item.amount, 0);
//   };

//   const handleSecondOpinionPress = () => {
//     navigation.navigate(PAGES.PATIENT_DASHBOARD);
//   };

//   const handlePrintPrescription = (recordId: string) => {
//     console.log('Print prescription:', recordId);
//   };

//   const handlePrintTestResult = (recordId: string) => {
//     console.log('Print test result:', recordId);
//   };

//   const handleBillingItemPress = (recordId: string) => {
//     console.log('Billing item pressed:', recordId);
//   };

//   const handleVideoPress = (videoId: string) => {
//     console.log('Video pressed:', videoId);
//   };

//   return (
//     <MedicalRecordDetails
//       activeTab={activeTab}
//       setActiveTab={setActiveTab}
//       tabs={tabs}
//       chiefComplaint={chiefComplaint}
//       setChiefComplaint={setChiefComplaint}
//       pastHistory={pastHistory}
//       setPastHistory={setPastHistory}
//       vitalsData={vitalsData}
//       prescriptionsData={prescriptionsData}
//       testResultsData={testResultsData}s
//       billingItemsData={billingItemsData}
//       educationalVideos={educationalVideos}
//       getStatusColor={getStatusColor}
//       calculateTotalOutstanding={calculateTotalOutstanding}
//       onSecondOpinionPress={handleSecondOpinionPress}
//       onPrintPrescription={handlePrintPrescription}
//       onPrintTestResult={handlePrintTestResult}
//       onBillingItemPress={handleBillingItemPress}
//       onVideoPress={handleVideoPress}
//     />
//   );
// }
