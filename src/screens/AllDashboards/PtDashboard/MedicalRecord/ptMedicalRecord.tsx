
import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  ScrollView,
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
import DateTimePicker from '@react-native-community/datetimepicker';
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

// Chip Components
interface ChipProps {
  label: string;
  onRemove: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => (
  <View style={styles.chip}>
    <AvText style={styles.chipText}>{label}</AvText>
    <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
      <Icon name="close" size={16} color={COLORS.WHITE} />
    </TouchableOpacity>
  </View>
);

interface ChipsProps {
  items: { id: string; label: string }[];
  selectedIds: string[];
  onRemove: (id: string) => void;
}

const Chips: React.FC<ChipsProps> = ({ items, selectedIds, onRemove }) => (
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
);

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
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'OPD' | 'IPD' | 'VIRTUAL'>('OPD');
  const [loading, setLoading] = useState(false);
  const [pressedHospitalId, setPressedHospitalId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [recordType, setRecordType] = useState<'OPD' | 'IPD' | 'VIRTUAL' | null>(null);
  const [dateOfVisit, setDateOfVisit] = useState(new Date());
  const [dischargedDate, setDischargedDate] = useState<Date | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDischargedDatePicker, setShowDischargedDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'visit' | 'discharged'>('visit');
  const [status, setStatus] = useState<'Active' | 'Discharged' | 'Pending' | 'All'>('All');
  const navigation = useNavigation();

  // Format date for display
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, searchValue, selectedFilters, activeTab, status]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log('API Response:', data); // Debug log

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
          }))
        : [];

      setRecords(formattedData);
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', `Failed to fetch records: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // Search filter
    if (searchValue.trim()) {
      const searchTerm = searchValue.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.hospitalName?.toLowerCase().includes(searchTerm) ||
          r.diagnosis?.toLowerCase().includes(searchTerm) ||
          r.status?.toLowerCase().includes(searchTerm) ||
          r.type?.toLowerCase().includes(searchTerm)
      );
    }

    // Status filter
    if (status && status !== 'All') {
      filtered = filtered.filter((r) => r.status === status);
    }

    // Selected filters (from chips)
    if (Object.values(selectedFilters).some(Boolean)) {
      filtered = filtered.filter((r) =>
        Object.entries(selectedFilters).some(
          ([key, value]) => value && r.status === key
        )
      );
    }

    // Tab filter
    filtered = filtered.filter((r) =>
      r.type?.toLowerCase() === activeTab.toLowerCase()
    );

    setFilteredRecords(filtered);
  };

  const toggleCardBlur = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === recordId ? { ...r, isHidden: !r.isHidden } : r))
    );
  };

  const handleHospitalPress = (record: MedicalRecord) => {
    navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, { hospital: record.hospitalName });
  };

  const handleFieldPress = (fieldKey: string, value: any, record: DataRecord) => {
    if (fieldKey === 'hospitalName') {
      handleHospitalPress(record as MedicalRecord);
    }
  };

  const handleAddRecord = () => {
    setIsAddModalVisible(true);
  };

  const closeAddModal = () => {
    setIsAddModalVisible(false);
    setHospitalName('');
    setRecordType(null);
    setDateOfVisit(new Date());
    setDischargedDate(null);
    setChiefComplaint('');
    setSelectedConditions([]);
    setStatus('Active');
  };

  const toggleCondition = (conditionId: string) => {
    setSelectedConditions((prev) =>
      prev.includes(conditionId)
        ? prev.filter((id) => id !== conditionId)
        : [...prev, conditionId]
    );
  };

  const handleSubmitRecord = async () => {
    if (!hospitalName) {
      Alert.alert('Error', 'Please select a hospital');
      return;
    }

    const recordData = {
      hospitalName,
      type: activeTab === 'IPD' ? recordType || 'IPD' : activeTab,
      diagnosis: chiefComplaint,
      dateOfVisit: dateOfVisit.toISOString(),
      dischargedDate: activeTab === 'IPD' && dischargedDate ? dischargedDate.toISOString() : undefined,
      status: status === 'All' ? 'Active' : status,
      medicalConditions: selectedConditions.join(', '),
      recordId: Date.now().toString(),
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

      // Refresh records after adding new one
      fetchRecords();
      Alert.alert('Success', 'Record added successfully');
      closeAddModal();
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', `Failed to add record: ${error.message}`);
    }
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

  const renderHospitalName = (record: MedicalRecord) => {
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
  };

  const renderHiddenHeader = () => (
    <View style={styles.hiddenHeaderContainer}>
      <AvText style={styles.hiddenHeaderText}>Data Hidden</AvText>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon name="medical-services" size={60} color={COLORS.GREY} />
      <AvText style={styles.emptyText}>No medical records found</AvText>
      <AvText style={styles.emptySubtext}>
        {loading ? 'Loading records...' : 'Try adjusting your filters or add a new record'}
      </AvText>
    </View>
  );

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
                    onPress: () => {},
                  },
                ];

                // Prepare data for TableCard with formatted dates
                const cardData = {
                  ...record,
                  dateOfVisit: formatDate(record.dateOfVisit),
                  dischargedDate: formatDate(record.dischargedDate),
                };

                return (
                  <View key={record.recordId} style={styles.recordWrapper}>
                    <View style={styles.cardContainer}>
                      {isHidden && renderHiddenHeader()}
                      <TableCard
                        data={[cardData]}
                        headerFields={['status', 'type']}
                        bodyFields={['hospitalName', 'dischargedDate', 'diagnosis']}
                        topRightFields={['dateOfVisit']}
                        actions={actions}
                        onCardPress={(record) => navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, { record })}
                        onFieldPress={handleFieldPress}
                        customRenderers={{
                          hospitalName: (value, record) => renderHospitalName(record as MedicalRecord)
                        }}
                      />
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </>
      )}

      {/* Add Record Modal */}
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

          {activeTab === 'IPD' && (
            <>
              <AvSelect
                label="Record Type"
                items={tabs}
                selectedValue={recordType || ''}
                onValueChange={(value) => setRecordType(value as 'OPD' | 'IPD' | 'VIRTUAL')}
                placeholder="Select Record Type"
                style={styles.input}
                required
              />
              <View >
                <AvTextInput
                  label="Discharged Date"
                  value={dischargedDate ? dischargedDate.toLocaleDateString() : ''}
                  style={styles.input}
                  editable={false}
                  right={
                    <AvTextInput.Icon
                      icon="calendar"
                      color={COLORS.BLACK}
                      onPress={() => showDatepicker('discharged')}
                    />
                  }
                />
              </View>
            </>
          )}

          <View >
            <AvTextInput
              label="Date of Visit"
               mode='outlined'
              value={dateOfVisit.toLocaleDateString()}
              style={styles.input}
              editable={false}
              right={
                <AvTextInput.Icon
                  icon="calendar"
                  color={COLORS.BLACK}
                  onPress={() => showDatepicker('visit')}
                />
              }
            />
          </View>

          <View >
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

      {/* Date Pickers */}
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfVisit}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {showDischargedDatePicker && (
        <DateTimePicker
          testID="dischargedDateTimePicker"
          value={dischargedDate || new Date()}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Add Record Button */}
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
  hiddenHeaderContainer: {
    position: 'absolute',
    top: hp('1%'),
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
    paddingVertical: normalize(6),
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
});

export default MedicalRecordsScreen;
