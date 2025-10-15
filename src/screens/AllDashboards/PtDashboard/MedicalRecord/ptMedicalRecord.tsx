import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
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
import AvDatePicker from '../../../../elements/AvDatePicker';

interface ChipProps {
  label: string;
  onRemove: () => void;
}

const Chip: React.FC<ChipProps> = React.memo(({ label, onRemove }) => (
  <View style={styles.chip}>
    <AvText style={styles.chipText}>{label}</AvText>
    <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
      <Icon name="close" size={16} color={COLORS.WHITE} />
    </TouchableOpacity>
  </View>
));

interface ChipsProps {
  items: { id: string; label: string }[];
  selectedIds: string[];
  onRemove: (id: string) => void;
}

const Chips: React.FC<ChipsProps> = React.memo(({ items, selectedIds, onRemove }) => (
  <View style={styles.chipsContainer}>
    {items
      .filter((item) => selectedIds.includes(item.id))
      .map((item) => (
        <Chip
          key={item.id}
          label={item.label}
          onRemove={() => onRemove(item.id)}
        />
      ))}
  </View>
));

interface MedicalRecord extends DataRecord {
  recordId: string;
  hospitalName: string;
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

const hospitalList = [
  { label: 'Apollo Hospitals', value: 'Apollo Hospitals' },
  { label: 'Fortis Healthcare', value: 'Fortis Healthcare' },
  { label: 'Max Healthcare', value: 'Max Healthcare' },
  { label: 'Manipal Hospitals', value: 'Manipal Hospitals' },
  { label: 'AIIMS', value: 'AIIMS' },
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

const MedicalRecordsScreen = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'OPD' | 'IPD' | 'VIRTUAL'>('OPD');
  const [loading, setLoading] = useState(false);
  const [pressedHospitalId, setPressedHospitalId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [dateOfVisit, setDateOfVisit] = useState<Date>(new Date());
  const [dischargedDate, setDischargedDate] = useState<Date | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Discharged' | 'Pending' | 'All'>('All');
  const navigation = useNavigation();

  const formatDate = useCallback((dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const formattedData = Array.isArray(data)
        ? data.map((item) => ({
            recordId: item.id?.toString() || Date.now().toString(),
            hospitalName: item.hospitalName || 'Unknown Hospital',
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
      setRecords(formattedData);
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

  const filteredRecords = useMemo(() => {
    let filtered = [];
    if (activeTab === 'OPD') filtered = [...opdRecords];
    if (activeTab === 'IPD') filtered = [...ipdRecords];
    if (activeTab === 'VIRTUAL') filtered = [...virtualRecords];
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.hospitalName?.toLowerCase().includes(searchTerm) ||
          r.diagnosis?.toLowerCase().includes(searchTerm) ||
          r.status?.toLowerCase().includes(searchTerm)
      );
    }
    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status === status);
    }
    if (Object.values(selectedFilters).some(Boolean)) {
      filtered = filtered.filter((r) =>
        Object.entries(selectedFilters).some(
          ([key, value]) => value && r.status === key
        )
      );
    }
    return filtered;
  }, [activeTab, opdRecords, ipdRecords, virtualRecords, searchValue, status, selectedFilters]);

  const toggleCardBlur = useCallback((recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === recordId ? { ...r, isHidden: !r.isHidden } : r))
    );
  }, []);

  const handleHospitalPress = useCallback((record: MedicalRecord) => {
    navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, {
      record,
      recordType: record.type,
    });
  }, [navigation]);

  const handleFieldPress = useCallback((fieldKey: string, value: any, record: DataRecord) => {
    if (fieldKey === 'hospitalName') {
      handleHospitalPress(record as MedicalRecord);
    }
  }, [handleHospitalPress]);

  const handleAddRecord = useCallback(() => {
    setIsAddModalVisible(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setIsAddModalVisible(false);
    setHospitalName('');
    setDateOfVisit(new Date());
    setDischargedDate(null);
    setChiefComplaint('');
    setSelectedConditions([]);
    setStatus('Active');
  }, []);

  const toggleCondition = useCallback((conditionId: string) => {
    setSelectedConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId]
    );
  }, []);

  const handleSubmitRecord = useCallback(async () => {
    if (!hospitalName) {
      Alert.alert('Error', 'Please select a hospital');
      return;
    }
    const recordData = {
      hospitalName,
      type: activeTab,
      diagnosis: chiefComplaint,
      dateOfVisit: dateOfVisit.toISOString(),
      dischargedDate: activeTab === 'IPD' && dischargedDate ? dischargedDate.toISOString() : undefined,
      status: status === 'All' ? 'Active' : status,
      medicalConditions: selectedConditions.join(', '),
      recordId: Date.now().toString(),
      chiefComplaint,
      dischargeSummary: activeTab === 'IPD' ? 'Patient discharged with medications and advice for follow-up.' : undefined,
    };
    try {
      const response = await fetch('https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recordData),
      });
      if (!response.ok) throw new Error('Failed to add record');
      await fetchRecords();
      Alert.alert('Success', 'Record added successfully');
      closeAddModal();
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', `Failed to add record: ${error.message}`);
    }
  }, [hospitalName, activeTab, dateOfVisit, dischargedDate, chiefComplaint, selectedConditions, status, fetchRecords, closeAddModal]);

  const renderHospitalName = useCallback((record: MedicalRecord) => {
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
            {record.hospitalName}
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
            <FlatList
              data={filteredRecords}
              keyExtractor={(item) => item.recordId}
              renderItem={renderRecordItem}
              contentContainerStyle={styles.scrollContainer}
              getItemLayout={(data, index) => ({
                length: hp('20%'),
                offset: hp('20%') * index,
                index,
              })}
            />
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
            label="Hospital Name"
            items={hospitalList}
            selectedValue={hospitalName}
            onValueChange={setHospitalName}
            placeholder="Select Hospital"
            style={styles.input}
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
            required
          />
          <View style={styles.conditionsContainer}>
            <AvText style={styles.label}>Medical Conditions</AvText>
            <MultiSelectDropdown
              items={medicalConditionsOptions}
              selectedIds={selectedConditions}
              onSelect={toggleCondition}
              placeholder="Select Conditions"
              label=""
            />
            <Chips
              items={medicalConditionsOptions}
              selectedIds={selectedConditions}
              onRemove={(id) => toggleCondition(id)}
            />
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
              onPress={handleSubmitRecord}
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
