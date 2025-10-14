// import React, { useEffect } from 'react';
// import { View, StyleSheet, ScrollView } from 'react-native';
// import AvText from '../../../../elements/AvText';
// import AvCard from '../../../../elements/AvCards';
// import { COLORS } from '../../../../constants/colors';
// import { normalize } from '../../../../constants/platform';
// import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
// import { fetchPrescriptions } from '../../../../store/thunks/patientThunks';

// interface Patient {
//   id: string;
// }

// interface PrescriptionsProps {
//   currentPatient: any;
// }

// interface Prescription {
//   id: number;
//   date: string | number[];
//   doctorName: string;
//   medicines: string;
//   instructions: string;
//   patientId: number;
// }

// const capitalizeFirstLetter = (str: string) => {
//   if (!str) return '';
//   return str.charAt(0).toUpperCase() + str.slice(1);
// };

// const formatDate = (date: string | number[]) => {
//   if (!date) return '';
//   if (Array.isArray(date)) {
//     // Assuming the array is [year, month, day]
//     return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString();
//   } else {
//     return date;
//   }
// };

// const Prescriptions: React.FC<PrescriptionsProps> = ({ currentPatient }) => {
//   const reduxPatientId = useAppSelector((state) => state.user.userProfile.patientId);
//   const patientId = currentPatient?.id || reduxPatientId;
//   const { prescriptionData, loading, error } = useAppSelector((state) => state.prescription);
//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (patientId) {
//       console.log('Dispatching fetchPrescriptions for patientId:', patientId);
//       dispatch(fetchPrescriptions(patientId));
//     }
//   }, [patientId, dispatch]);

//   useEffect(() => {
//     if (prescriptionData) console.log('Fetched prescriptions:', prescriptionData);
//   }, [prescriptionData]);

//   useEffect(() => {
//     if (error) console.log('Redux prescription error:', error);
//   }, [error]);

//   return (
//     <View style={styles.container}>
//       {loading && <AvText>Loading prescriptions...</AvText>}
//       {error && <AvText>Error: {error}</AvText>}
//       {!loading && !error && (!prescriptionData || prescriptionData.length === 0) && (
//         <AvText>No prescriptions found.</AvText>
//       )}
//       <ScrollView contentContainerStyle={styles.tabContent}>
//         {(prescriptionData || []).map((prescription) => (
//           <AvCard key={prescription.id} cardStyle={styles.prescriptionCard}>
//             <View style={styles.header}>
//               <AvText style={styles.doctorName}>
//                 {capitalizeFirstLetter(prescription.doctorName)}
//               </AvText>
//             </View>
//             <View style={styles.detailsContainer}>
//               <View style={styles.detailRow}>
//                 <View style={styles.labelValuePair}>
//                   <AvText type="body" style={styles.detailLabel}>
//                     Date
//                   </AvText>
//                   <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
//                     {formatDate(prescription.date)}
//                   </AvText>
//                 </View>
//                 <View style={styles.labelValuePair}>
//                   <AvText type="body" style={styles.detailLabel}>
//                     Medicines
//                   </AvText>
//                   <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
//                     {capitalizeFirstLetter(prescription.medicines)}
//                   </AvText>
//                 </View>
//               </View>
//               <View style={[styles.detailRow, { marginTop: normalize(12), flexDirection: 'column' }]}>
//                 <AvText type="body" style={styles.detailLabel}>
//                   Instructions
//                 </AvText>
//                 <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
//                   {capitalizeFirstLetter(prescription.instructions)}
//                 </AvText>
//               </View>
//             </View>
//           </AvCard>
//         ))}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingHorizontal: normalize(16),
//     marginTop: normalize(16),
//     marginBottom: normalize(20),
//     backgroundColor: 'white',
//     borderRadius: normalize(8),
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   tabContent: {
//     paddingVertical: normalize(8),
//   },
//   prescriptionCard: {
//     padding: normalize(16),
//     borderWidth: 1,
//     borderColor: COLORS.LIGHT_GREY,
//     borderRadius: normalize(8),
//     backgroundColor: 'white',
//     marginBottom: normalize(16),
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   header: {
//     marginBottom: normalize(12),
//   },
//   doctorName: {
//     fontSize: normalize(16),
//     fontWeight: '600',
//     color: COLORS.BLACK,
//   },
//   detailsContainer: {
//     borderTopWidth: 1,
//     borderTopColor: COLORS.LIGHT_GREY,
//     paddingTop: normalize(12),
//   },
//   detailRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   labelValuePair: {
//     flex: 1,
//   },
//   detailLabel: {
//     fontSize: normalize(12),
//     color: COLORS.GREY,
//   },
//   detailValue: {
//     fontSize: normalize(12),
//     fontWeight: '500',
//     color: COLORS.BLACK,
//   },
// });

// export default Prescriptions;








import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { fetchPrescriptions } from '../../../../store/thunks/patientThunks';
import { SearchFilterBar, FilterOption } from '../../../../components/CommonComponents/SearchFilter'; // Adjust the import path as needed

interface Patient {
  id: string;
}

interface PrescriptionsProps {
  currentPatient: Patient;
}

interface Prescription {
  id: number;
  date: string | number[];
  doctorName: string;
  medicines: string;
  instructions: string;
  patientId: number;
}

const capitalizeFirstLetter = (str: string) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatDate = (date: string | number[]) => {
  if (!date) return '';
  if (Array.isArray(date)) {
    return new Date(date[0], date[1] - 1, date[2]).toLocaleDateString();
  } else {
    return date;
  }
};

const Prescriptions: React.FC<PrescriptionsProps> = ({ currentPatient }) => {
  const reduxPatientId = useAppSelector((state) => state.user.userProfile.patientId);
  const patientId = currentPatient?.id || reduxPatientId;
  const { prescriptionData, loading, error } = useAppSelector((state) => state.prescription);
  const dispatch = useAppDispatch();

  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  const filterOptions: FilterOption[] = [
    { id: 'recent', displayName: 'Recent (Last 30 days)' },
    { id: 'older', displayName: 'Older than 30 days' },
    { id: 'medicineA', displayName: 'Medicine A' },
    { id: 'medicineB', displayName: 'Medicine B' },
  ];

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPrescriptions(patientId));
    }
  }, [patientId, dispatch]);

  const filteredPrescriptions = (prescriptionData || []).filter((prescription) => {
    const matchesSearch =
      prescription.doctorName.toLowerCase().includes(searchValue.toLowerCase()) ||
      prescription.medicines.toLowerCase().includes(searchValue.toLowerCase());

    const matchesFilter = Object.entries(selectedFilters).every(([key, isSelected]) => {
      if (!isSelected) return true;
      switch (key) {
        case 'recent':
          const date = new Date();
          date.setDate(date.getDate() - 30);
          return new Date(prescription.date) >= date;
        case 'older':
          const oldDate = new Date();
          oldDate.setDate(oldDate.getDate() - 30);
          return new Date(prescription.date) < oldDate;
        case 'medicineA':
          return prescription.medicines.includes('Medicine A');
        case 'medicineB':
          return prescription.medicines.includes('Medicine B');
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        placeholder="Search prescriptions..."
        filterOptions={filterOptions}
        onFiltersApplied={setSelectedFilters}
      />
      {loading && <AvText>Loading prescriptions...</AvText>}
      {error && <AvText>Error: {error}</AvText>}
      {!loading && !error && filteredPrescriptions.length === 0 && (
        <AvText>No prescriptions found.</AvText>
      )}
      <ScrollView contentContainerStyle={styles.tabContent}>
        {filteredPrescriptions.map((prescription) => (
          <AvCard key={prescription.id} cardStyle={styles.prescriptionCard}>
            <View style={styles.header}>
              <AvText style={styles.doctorName}>
                {capitalizeFirstLetter(prescription.doctorName)}
              </AvText>
            </View>
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <View style={styles.labelValuePair}>
                  <AvText type="body" style={styles.detailLabel}>
                    Date
                  </AvText>
                  <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
                    {formatDate(prescription.date)}
                  </AvText>
                </View>
                <View style={styles.labelValuePair}>
                  <AvText type="body" style={styles.detailLabel}>
                    Medicines
                  </AvText>
                  <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
                    {capitalizeFirstLetter(prescription.medicines)}
                  </AvText>
                </View>
              </View>
              <View style={[styles.detailRow, { marginTop: normalize(12), flexDirection: 'column' }]}>
                <AvText type="body" style={styles.detailLabel}>
                  Instructions
                </AvText>
                <AvText type="body" style={[styles.detailValue, { marginTop: normalize(4) }]}>
                  {capitalizeFirstLetter(prescription.instructions)}
                </AvText>
              </View>
            </View>
          </AvCard>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: normalize(16),
    marginTop: normalize(16),
    marginBottom: normalize(20),
    backgroundColor: 'white',
    borderRadius: normalize(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginLeft: normalize(9),
    marginRight: normalize(9),
  },
  tabContent: {
    paddingVertical: normalize(8),
  },
  prescriptionCard: {
    padding: normalize(16),
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    backgroundColor: 'white',
    marginBottom: normalize(16),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: normalize(12),
  },
  doctorName: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: COLORS.BLACK,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.LIGHT_GREY,
    paddingTop: normalize(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelValuePair: {
    flex: 1,
  },
  detailLabel: {
    fontSize: normalize(12),
    color: COLORS.GREY,
  },
  detailValue: {
    fontSize: normalize(12),
    fontWeight: '500',
    color: COLORS.BLACK,
  },
});

export default Prescriptions;
