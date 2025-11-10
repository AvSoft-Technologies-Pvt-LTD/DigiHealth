import React, { useState, useEffect, useCallback, memo,useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Header from '../../../../components/Header';
import AvButton from '../../../../elements/AvButton';
import AvText from '../../../../elements/AvText';
import AvTextInput from '../../../../elements/AvTextInput';
import { COLORS } from '../../../../constants/colors';
import AvModal from '../../../../elements/AvModal';
import { PAGES } from '../../../../constants/pages';
import { TableCard, DataRecord, Action } from '../../../../components/CommonComponents/TableCard';
import { SearchFilterBar, FilterOption } from '../../../../components/CommonComponents/SearchFilter';
import { Tabs } from '../../../../components/CommonComponents/Tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  normalize,
  isIos,
  isIphoneX,
  StatusBarHeight,
} from '../../../../constants/platform';
import { AvSelect } from '../../../../elements/AvSelect';
import { MultiSelectDropdown } from '../../../../elements/MultiSelectDropdown';
import { FlatList } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { fetchHospitalList, fetchMedicalConditions, saveMedicalRecord } from '../../../../store/thunks/patientThunks';
import AvDatePicker from '../../../../elements/AvDatePicker';

// interface ChipProps {
//   label: string;
//   onRemove: () => void;
// }

// const Chip = React.memo(memo(({ label, onRemove }: ChipProps) => (
//   <View style={styles.chip}>
//     <AvText style={styles.chipText}>{label}</AvText>
//     <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
//       <Icon name="close" size={16} color={COLORS.WHITE} />
//     </TouchableOpacity>
//   </View>
// )));

// interface ChipsProps {
//   items: { id: string; label: string }[];
//   selectedIds: string[];
//   onRemove: (id: string) => void;
// }

// const Chips: React.FC<ChipsProps> = React.memo(({ items, selectedIds, onRemove }) => (
//   <View style={styles.chipsContainer}>
//     {items
//       .filter((item) => selectedIds.includes(item.id))
//       .map((item) => (
//         <Chip
//           key={item.id}
//           label={item.label}
//           onRemove={() => onRemove(item.id)}
//         />
//       ))}
//   </View>
// ));

interface MedicalRecord extends DataRecord {
  recordId: string;
  selectedHospital: string;
  type: 'OPD' | 'IPD' | 'VIRTUAL';
  diagnosis: string;
  dateOfVisit: string;
  dischargedDate?: string;
  status: 'Active' | 'Discharged' | 'Pending';
  medicalConditions?: string;
  isHidden?: boolean;
  chiefComplaint?: string;
  dischargeSummary?: string;
}

const filterOptions: FilterOption[] = [
  { id: 'Active', displayName: 'Active' },
  { id: 'Discharged', displayName: 'Discharged' },
  { id: 'Pending', displayName: 'Pending' },
];

const tabs = [
  { key: 'OPD', label: 'OPD' },
  { key: 'IPD', label: 'IPD' },
  { key: 'VIRTUAL', label: 'Virtual' },
];

const medicalConditionsOptions = [
  { id: 'asthma', label: 'Asthma Disease' },
  { id: 'bp', label: 'BP (Blood Pressure)' },
  { id: 'diabetes', label: 'Diabetic Disease' },
  { id: 'heart', label: 'Heart Disease' },
];

const statusOptions = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Discharged', value: 'Discharged' },
  { label: 'Pending', value: 'Pending' },
];

// Memoized Chip component to prevent unnecessary re-renders
// const Chip = memo(({ label, onRemove }: ChipProps) => (
//   <View style={styles.chip}>
//     <AvText style={styles.chipText}>{label}</AvText>
//     <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
//       <Icon name="close" size={16} color={COLORS.WHITE} />
//     </TouchableOpacity>
//   </View>
// ));

const MedicalRecordsScreen = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'OPD' | 'IPD' | 'VIRTUAL'>('OPD');
  const [loading, setLoading] = useState(false);
  const [pressedHospitalId, setPressedHospitalId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState('');
  const [dateOfVisit, setDateOfVisit] = useState<Date>(new Date());
  const [dischargedDate, setDischargedDate] = useState<Date | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Discharged' | 'Pending' | 'All'>('All');
  const navigation = useNavigation();
  const hospitalListData = useAppSelector((state) => state.hospitalList.hospitalListData);
  const medicalConditionData = useAppSelector((state) => state.medicalConditionData.medicalConditionData);


  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }, []);

  useEffect(() => {
    fetchRecords();
  }, []);


  // Memoize filtered records to avoid recalculating on every render
  const filteredRecords = useMemo(() => {
    if (!records.length) return [];

    const searchTerm = searchValue.trim().toLowerCase();
    const activeFilters = Object.entries(selectedFilters)
      .filter(([_, value]) => value)
      .map(([key]) => key);

    return records.filter((record) => {
      // Early return if record doesn't match the active tab
      if (record.type?.toLowerCase() !== activeTab.toLowerCase()) {
        return false;
      }

      // Apply status filter
      if (status !== 'All' && record.status !== status) {
        return false;
      }

      // Apply search filter if search term exists
      if (searchTerm && !(
        record.selectedHospital?.toLowerCase().includes(searchTerm) ||
        record.diagnosis?.toLowerCase().includes(searchTerm) ||
        record.status?.toLowerCase().includes(searchTerm) ||
        record.type?.toLowerCase().includes(searchTerm)
      )) {
        return false;
      }

      // Apply selected filters from chips
      if (activeFilters.length > 0 && !activeFilters.includes(record.status)) {
        return false;
      }

      return true;
    });
  }, [records, searchValue, selectedFilters, activeTab, status]);

  // Memoize event handlers with useCallback
  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      const formattedData = Array.isArray(data)
        ? data.map((item) => ({
            recordId: item.id?.toString() || Date.now().toString(),
          selectedHospital: item.selectedHospital || 'Unknown Hospital',
            type: item.type || 'OPD',
            diagnosis: item.diagnosis || 'No diagnosis',
            dateOfVisit: item.dateOfVisit || new Date().toISOString(),
            dischargedDate: item.dischargedDate,
            status: item.status || 'Active',
            medicalConditions: item.medicalConditions,
            isHidden: false,
            chiefComplaint: item.chiefComplaint,
            dischargeSummary: item.dischargeSummary,
          }))
        : [];
      // setRecords(formattedData);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', `Failed to fetch records: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const opdRecords = useMemo(
    () => records.filter((r) => r.type === 'OPD'),
    [records]
  );

  const ipdRecords = useMemo(
    () => records.filter((r) => r.type === 'IPD'),
    [records]
  );

  const virtualRecords = useMemo(
    () => records.filter((r) => r.type === 'VIRTUAL'),
    [records]
  );

  // const filteredRecords = useMemo(() => {
  //   let filtered = [];
  //   if (activeTab === 'OPD') filtered = [...opdRecords];
  //   if (activeTab === 'IPD') filtered = [...ipdRecords];
  //   if (activeTab === 'VIRTUAL') filtered = [...virtualRecords];
  //   if (searchValue.trim()) {
  //     const searchTerm = searchValue.toLowerCase();
  //     filtered = filtered.filter(
  //       (r) =>
  //         r.hospitalName?.toLowerCase().includes(searchTerm) ||
  //         r.diagnosis?.toLowerCase().includes(searchTerm) ||
  //         r.status?.toLowerCase().includes(searchTerm)
  //     );
  //   }
  //   if (status && status !== 'All') {
  //     filtered = filtered.filter((r) => r.status === status);
  //   }
  //   if (Object.values(selectedFilters).some(Boolean)) {
  //     filtered = filtered.filter((r) =>
  //       Object.entries(selectedFilters).some(
  //         ([key, value]) => value && r.status === key
  //       )
  //     );
  //   }
  //   return filtered;
  // }, [activeTab, opdRecords, ipdRecords, virtualRecords, searchValue, status, selectedFilters]);

  const toggleCardBlur = useCallback((recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === recordId ? { ...r, isHidden: !r.isHidden } : r))
    );
  }, []);

  const handleHospitalPress = useCallback((record: MedicalRecord) => {
    navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, {
      hospital: record.selectedHospital
    });
  }, [navigation]);

  const handleFieldPress = useCallback((fieldKey: string, _: any, record: DataRecord) => {
    if (fieldKey === 'selectedHospital') {
      handleHospitalPress(record as MedicalRecord);
    }
  }, [handleHospitalPress]);

  const handleAddRecord = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setSelectedHospital('');
    setRecordType(null);
    setDateOfVisit(new Date());
    setDischargedDate(null);
    setChiefComplaint('');
    setSelectedConditions([]);
    setStatus('Active');
  }, []);

  const dispatch = useAppDispatch();
  const currentPatient = useAppSelector((state) => state.currentPatient.currentPatient);

  useEffect(() => {
    dispatch(fetchHospitalList());
    dispatch(fetchMedicalConditions())
  }, []);
  const toggleCondition = useCallback((conditionId: string) => {
    setSelectedConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId]
    );
  }, []);

  const handleSubmitRecord = async () => {

    // if (!selectedHospital) {
    //   Alert.alert('Error', 'Please select a hospital');
    //   return;
    // }
    const OPDpayload = {
      patientId: currentPatient?.id,
      hospitalId:selectedHospital,
      // type: activeTab === 'IPD' ? recordType || 'IPD' : activeTab,
      chiefComplaint: chiefComplaint,
      status: status,
      dateOfVisit: dateOfVisit.toISOString(),
    }
    const IPDpayload = {
      patientId: currentPatient?.id,
      hospitalId:selectedHospital,

      // type: activeTab === 'IPD' ? recordType || 'IPD' : activeTab,
      chiefComplaint: chiefComplaint,
      status: status === 'All' ? 'Active' : status,
      dateOfAdmission: dateOfVisit.toISOString(),
      dateOfDischarge: dischargedDate?.toISOString(),
    }
    console.log("PAYLOAD UPD", IPDpayload)
    dispatch(saveMedicalRecord(activeTab == 'IPD' ? IPDpayload : OPDpayload, activeTab == 'IPD'))
    closeAddModal()
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      if (datePickerType === 'visit') {
        setShowDatePicker(false);
      } else {
        setShowDischargedDatePicker(false);
      }
      return;
    }

    if (datePickerType === 'visit') {
      setShowDatePicker(false);
      if (selectedDate) {
        setDateOfVisit(selectedDate);
      }
    } else {
      setShowDischargedDatePicker(false);
      if (selectedDate) {
        setDischargedDate(selectedDate);
      }
    }
  };

  const showDatepicker = (type: 'visit' | 'discharged') => {
    setDatePickerType(type);
    if (type === 'visit') {
      setShowDatePicker(true);
    } else {
      setShowDischargedDatePicker(true);
    }
  };

  const renderselectedHospital = useCallback((record: MedicalRecord) => {
    const isPressed = pressedHospitalId === record.recordId;
    return (
      <TouchableOpacity
        onPress={() => handleHospitalPress(record)}
        onPressIn={() => setPressedHospitalId(record.recordId)}
        onPressOut={() => setPressedHospitalId(null)}
        activeOpacity={0.8}
      >
        <View style={styles.hospitalWrapper}>
          <AvText
            style={[
              styles.hospitalText,
              ...(isPressed ? [styles.pressedHospitalText] : [])
            ]}
          >
            {record.selectedHospital}
          </AvText>
          <Icon name="check-circle" size={18} color={COLORS.GREEN} style={{ marginLeft: 6 }} />
        </View>
      </TouchableOpacity>
    );
  }, [pressedHospitalId, handleHospitalPress]);

  const renderHiddenHeader = useCallback(() => (
    <View style={styles.hiddenHeaderContainer}>
      <AvText style={styles.hiddenHeaderText}>Data Hidden</AvText>
    </View>
  ), []);

  const renderEmptyState = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Icon name="medical-services" size={60} color={COLORS.GREY} />
      <AvText style={styles.emptyText}>No medical records found</AvText>
      <AvText style={styles.emptySubtext}>
        {loading ? 'Loading records...' : 'Try adjusting your filters or add a new record'}
      </AvText>
    </View>
  ), [loading]);

  const renderRecordItem = useCallback(({ item }: { item: MedicalRecord }) => {
    const isHidden = !!item.isHidden;
    const actions: Action[] = [
      {
        key: 'blurSwitch',
        render: () => (
          <Switch
            value={isHidden}
            onValueChange={() => toggleCardBlur(item.recordId)}
            trackColor={{ false: COLORS.GREY_LIGHT, true: COLORS.GREEN }}
            thumbColor={COLORS.WHITE}
            style={styles.cardToggle}
          />
        ),
        onPress: () => {},
      },
    ];
    const cardData = {
      ...item,
      dateOfVisit: formatDate(item.dateOfVisit),
      dischargedDate: formatDate(item.dischargedDate),
    };
    return (
      <View style={styles.recordWrapper}>
        <View style={[
          styles.cardContainer,
          isHidden && styles.cardContainerWithHeader
        ]}>
          {isHidden && renderHiddenHeader()}
          <TableCard
            data={[cardData]}
            headerFields={['status', 'type']}
            bodyFields={['hospitalName', 'dischargedDate', 'diagnosis']}
            topRightFields={['dateOfVisit']}
            actions={actions}
            onCardPress={() => navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, { record: item, recordType: item.type })}
            onFieldPress={handleFieldPress}
            customRenderers={{
              hospitalName: (value, record) => renderHospitalName(record as MedicalRecord)
            }}
          />
        </View>
      </View>
    );
  }, [toggleCardBlur, formatDate, renderHiddenHeader, navigation, handleFieldPress, renderHospitalName]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return (
    <View style={styles.container}>
      <Header
        title={PAGES.PATIENT_MEDICAL_RECORD}
        showBackButton={false}
        backgroundColor={COLORS.WHITE}
        titleColor={COLORS.BLACK}
      />
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabKey) => setActiveTab(tabKey as 'OPD' | 'IPD' | 'VIRTUAL')}
      />
      <View style={styles.filterContainer}>
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterOptions={filterOptions}
          onFiltersApplied={(filters) => setSelectedFilters(filters)}
        />
        <AvSelect
          items={statusOptions}
          selectedValue={status}
          onValueChange={(value) => setStatus(value as 'Active' | 'Discharged' | 'Pending' | 'All')}
          placeholder="Filter by Status"
          style={styles.statusFilter}
        />
      </View>
      {loading && records.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <>
          {filteredRecords.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {filteredRecords.map((record) => {
                  const isHidden = !!record.isHidden;
                  const actions: Action[] = [
                    {
                      key: 'blurSwitch',
                      render: () => (
                        <Switch
                          value={isHidden}
                          onValueChange={() => toggleCardBlur(record.recordId)}
                          trackColor={{ false: COLORS.GREY_LIGHT, true: COLORS.GREEN }}
                          thumbColor={COLORS.WHITE}
                          style={styles.cardToggle}
                        />
                      ),
                      onPress: () => { },
                    },
                  ];

                  // Prepare data for TableCard with formatted dates
                  const cardData = {
                    ...record,
                    dateOfVisit: formatDate(record.dateOfVisit),
                    dischargedDate: formatDate(record.dischargedDate),
                  };

                  return (
                    <View key={Number(record.recordId)} style={styles.recordWrapper}>
                      <View style={styles.cardContainer}>
                        {isHidden && renderHiddenHeader()}
                        <TableCard
                          data={[cardData]}
                          headerFields={['status', 'type']}
                          bodyFields={['selectedHospital', 'dischargedDate', 'diagnosis']}
                          topRightFields={['dateOfVisit']}
                          actions={actions}
                          onCardPress={(record) => navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, { record })}
                          onFieldPress={handleFieldPress}
                          customRenderers={{
                            selectedHospital: (value, record) => renderselectedHospital(record as MedicalRecord)
                          }}
                        />
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </>
          )}
        </>
      )}
      <AvModal
        isModalVisible={isAddModalVisible}
        setModalVisible={setIsAddModalVisible}
        title="Add Medical Record"
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <AvSelect
            items={hospitalListData}
            selectedValue={selectedHospital}
            onValueChange={setSelectedHospital}
            placeholder="Search Hospital..."
            label="Select Hospital"
            required
          />
          <View style={styles.datePickerContainer}>
            <AvText style={styles.datePickerLabel}>Date of Visit</AvText>
            <View style={styles.datePickerWrapper}>
              <AvDatePicker
                value={dateOfVisit}
                onDateChange={(date) => setDateOfVisit(date)}
                mode="date"
                maximumDate={new Date()}
                style={styles.datePickerInput}
                textStyle={styles.dateText}
                placeholder="Select Date of Visit"
              />
              <Icon name="date-range" size={24} color={COLORS.GREY} style={styles.dateIcon} />
            </View>
          </View>
          {activeTab === 'IPD' && (
            <View style={styles.datePickerContainer}>
              <AvText style={styles.datePickerLabel}>Discharged Date</AvText>
              <View style={styles.datePickerWrapper}>
                <AvDatePicker
                  value={dischargedDate}
                  onDateChange={(date) => setDischargedDate(date)}
                  mode="date"
                  maximumDate={new Date()}
                  style={styles.datePickerInput}
                  textStyle={styles.dateText}
                  placeholder="Select Discharged Date"
                />
                <Icon name="date-range" size={24} color={COLORS.GREY} style={styles.dateIcon} />
              </View>
            </View>
          )}
          <View>
            <AvTextInput
              mode='outlined'
              label="Chief Complaint"
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
              style={styles.input}
              placeholder="Describe the main complaint"
            />
          </View>
          <AvSelect
            label="Status"
            items={statusOptions.filter(option => option.value !== 'All')}
            selectedValue={status === 'All' ? 'Active' : status}
            onValueChange={(value) => setStatus(value as 'Active' | 'Discharged' | 'Pending')}
            placeholder="Select Status"
            style={styles.input}
          />
          <View style={styles.conditionsContainer}>
            <AvText style={styles.label}>Medical Conditions</AvText>
            {/* <AvSelect
              multiselect={true}
              items={medicalConditionData}
              selectedValue={selectedConditions}
              onValueChange={(selectedItems) => {
                const selectedValues = Array.isArray(selectedItems)
                  ? selectedItems
                  : selectedItems ? [selectedItems] : [];
                toggleCondition(selectedValues);
              }}
              // onSelect={toggleCondition}
              placeholder="Select health conditions"
              required
            /> */}
            <AvSelect
              items={medicalConditionData}
              selectedValue={selectedConditions}
              onValueChange={setSelectedConditions}
              placeholder="Select health conditions"
              label="Select Conditions"
              required
            />
            {/* <MultiSelectDropdown
              items={medicalConditionData}
              selectedIds={selectedConditions}
              onSelect={toggleCondition}
              placeholder="Select Conditions"
              label=""
            /> */}
            {/* <Chips
              items={medicalConditionData}
              selectedIds={selectedConditions}
              onRemove={toggleCondition}
            /> */}
          </View>
          <View style={styles.modalActions}>
            <AvButton
              mode="outlined"
              onPress={closeAddModal}
              style={styles.cancelButton}
              textColor={COLORS.SECONDARY}
            >
              Cancel
            </AvButton>
            <AvButton
              mode="contained"
              onPress={() => handleSubmitRecord()}
              style={styles.submitButton}
              buttonColor={COLORS.SECONDARY}
            >
              Save
            </AvButton>
          </View>
        </View>
      </AvModal>
      <AvButton
        mode="contained"
        onPress={handleAddRecord}
        style={styles.addButton}
        buttonColor={COLORS.SECONDARY}
      >
        Add Record
      </AvButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BG_OFF_WHITE,
    paddingTop: isIos() ? (isIphoneX() ? StatusBarHeight() + 10 : StatusBarHeight()) : 0,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('4%'),
    marginBottom: hp('1%'),
  },
  statusFilter: {
    marginLeft: wp('2%'),
    width: wp('40%'),
    backgroundColor: COLORS.WHITE,
    padding: wp('2%'),
  },
  scrollContainer: {
    padding: wp('4%'),
    paddingBottom: hp('12%'),
  },
  addButton: {
    position: 'absolute',
    bottom: hp('2%'),
    right: wp('4%'),
    left: wp('4%'),
  },
  recordWrapper: {
    marginBottom: hp('2%'),
  },
  cardToggle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    position: 'relative',
  },
  cardContainerWithHeader: {
    paddingTop: hp('4%'),
  },
  hiddenHeaderContainer: {
    position: 'absolute',
    top: 0,
    right: wp('4%'),
    zIndex: 1,
    backgroundColor: COLORS.WHITE,
    paddingHorizontal: wp('2%'),
    paddingVertical: hp('0.5%'),
    borderRadius: normalize(4),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  hiddenHeaderText: {
    color: COLORS.GREY,
    fontSize: normalize(12),
    fontWeight: '500',
  },
  hospitalWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: hp('0.8%'),
    paddingHorizontal: wp('2%'),
    borderRadius: normalize(4),
  },
  hospitalText: {
    fontWeight: '600',
    color: COLORS.BLACK,
    fontSize: normalize(14),
  },
  pressedHospitalText: {
    color: COLORS.PRIMARY,
    textDecorationLine: 'underline',
  },
  modalContent: {
    width: '100%',
    paddingHorizontal: wp('4%'),
  },
  input: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    marginBottom: hp('2%'),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: hp('2%'),
    marginBottom: hp('2%'),
  },
  cancelButton: {
    marginRight: wp('2%'),
  },
  submitButton: {
    marginLeft: wp('2%'),
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp('2%'),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.PRIMARY,
    borderRadius: normalize(12),
    paddingHorizontal: normalize(10),
    
    marginRight: normalize(6),
    marginBottom: normalize(6),
  },
  chipText: {
    color: COLORS.WHITE,
    fontSize: normalize(12),
    marginRight: normalize(6),
  },
  closeButton: {
    padding: normalize(2),
  },
  label: {
    fontSize: normalize(14),
    color: COLORS.BLACK,
    marginBottom: normalize(6),
  },
  conditionsContainer: {
    marginBottom: hp('2%'),
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: wp('10%'),
  },
  emptyText: {
    fontSize: normalize(18),
    color: COLORS.GREY_DARK,
    marginTop: hp('2%'),
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginTop: hp('1%'),
    textAlign: 'center',
  },
  datePickerContainer: {
    width: '100%',
    marginBottom: hp('2%'),
  },
  datePickerLabel: {
    fontSize: normalize(14),
    color: COLORS.BLACK,
    marginBottom: normalize(6),
  },
  datePickerWrapper: {
    position: 'relative',
  },
  datePickerInput: {
    borderWidth: 1,
    borderColor: COLORS.GREY,
    borderRadius: 4,
    
    paddingRight: 40, // Space for the icon
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
  },
  dateIcon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -12, // Half of icon size
  },
  dateText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
  },
  placeholderText: {
    color: COLORS.GREY,
  },
});

export default MedicalRecordsScreen;
