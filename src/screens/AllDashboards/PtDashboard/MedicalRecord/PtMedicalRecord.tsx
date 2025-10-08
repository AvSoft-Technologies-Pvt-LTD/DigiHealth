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

interface MedicalRecord extends DataRecord {
  recordId: string;
  hospitalName: string;
  type: 'OPD' | 'IPD' | 'Virtual';
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
  { key: 'Virtual', label: 'Virtual' },
];

const MedicalRecordsScreen = () => {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<MedicalRecord[]>([]);
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<'OPD' | 'IPD' | 'Virtual'>('OPD');
  const [loading, setLoading] = useState(false);
  const [pressedHospitalId, setPressedHospitalId] = useState<string | null>(null);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [hospitalName, setHospitalName] = useState('');
  const [recordType, setRecordType] = useState<'OPD' | 'IPD' | 'Virtual' | null>(null);
  const [dateOfVisit, setDateOfVisit] = useState(new Date());
  const [dischargedDate, setDischargedDate] = useState<Date | null>(null);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDischargedDatePicker, setShowDischargedDatePicker] = useState(false);
  const [datePickerType, setDatePickerType] = useState<'visit' | 'discharged'>('visit');
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [records, searchValue, selectedFilters, activeTab]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://6895d385039a1a2b28907a16.mockapi.io/pt-mr/patient-mrec');
      if (!response.ok) throw new Error('Network response not ok');
      const data: MedicalRecord[] = await response.json();
      const formattedData = data.map((item) => ({
        ...item,
        recordId: item.id || item.recordId,
        isHidden: false,
      }));
      setRecords(formattedData);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];
    if (searchValue.trim()) {
      filtered = filtered.filter(
        (r) =>
          r.hospitalName?.toLowerCase().includes(searchValue.toLowerCase()) ||
          r.diagnosis?.toLowerCase().includes(searchValue.toLowerCase()) ||
          r.status?.toLowerCase().includes(searchValue.toLowerCase()) ||
          r.type?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    if (Object.values(selectedFilters).some(Boolean)) {
      filtered = filtered.filter(
        (r) =>
          (selectedFilters['Active'] && r.status === 'Active') ||
          (selectedFilters['Discharged'] && r.status === 'Discharged') ||
          (selectedFilters['Pending'] && r.status === 'Pending')
      );
    }
    filtered = filtered.filter((r) => r.type === activeTab);
    setFilteredRecords(filtered);
  };

  const toggleCardBlur = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.recordId === recordId ? { ...r, isHidden: !r.isHidden } : r))
    );
  };

  const handleHospitalPress = (record: MedicalRecord) => {
    navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, { hospital: record.hospital });
  };

  const handleFieldPress = (fieldKey: string, value: any, record: DataRecord) => {
    if (fieldKey === 'hospital') {
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
    setMedicalConditions('');
  };

  const handleSubmitRecord = async () => {
    if (!hospitalName || !recordType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    const recordData = {
      hospital: hospitalName,
      type: recordType,
      diagnosis: chiefComplaint,
      dateOfVisit: dateOfVisit.toISOString(),
      dischargedDate: dischargedDate ? dischargedDate.toISOString() : undefined,
      status: dischargedDate ? 'Discharged' : 'Active',
      medicalConditions,
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
      Alert.alert('Success', 'Record added successfully');
      fetchRecords();
      closeAddModal();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add record');
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
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
        onTabChange={(tabKey) => setActiveTab(tabKey as any)}
      />
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filterOptions={filterOptions}
        onFiltersApplied={(filters) => setSelectedFilters(filters)}
      />
      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {filteredRecords.map((record) => {
            const isHidden = !!record.isHidden;
            const isPressed = pressedHospitalId === record.recordId;
            const actions: Action[] = [
              {
                key: 'blurSwitch',
                render: () => (
                  <Switch
                    value={isHidden}
                    onValueChange={() => toggleCardBlur(record.recordId)}
                    trackColor={{ false: COLORS.GREY, true: COLORS.GREEN }}
                    thumbColor={COLORS.WHITE}
                    style={styles.cardToggle}
                  />
                ),
                onPress: () => {},
              },
            ];

            const hospitalDisplay = (
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
                    {record.hospital}
                  </AvText>
                  <Icon name="check-circle" size={18} color={COLORS.GREEN} style={{ marginLeft: 6 }} />
                </View>
              </TouchableOpacity>
            );

            return (
              <View key={record.recordId} style={styles.recordWrapper}>
                {!isHidden ? (
                  <TableCard
                    data={[{ ...record, hospital: hospitalDisplay }]}
                    headerFields={['status', 'type']}
                    bodyFields={['hospitalName', 'dateOfDischarge', 'diagnosis']}
                    topRightFields={['dateOfVisit']}
                    actions={actions}
                    onCardPress={(record) => navigation.navigate(PAGES.PATIENT_MEDICAL_DETAILS, { record })}
                    onFieldPress={handleFieldPress}
                  />
                ) : (
                  <View style={styles.hiddenCard}>
                    <AvText style={styles.hiddenText}>Data Hidden</AvText>
                    <Switch
                      value={isHidden}
                      onValueChange={() => toggleCardBlur(record.recordId)}
                      trackColor={{ false: COLORS.GREY, true: COLORS.GREEN }}
                      thumbColor={COLORS.WHITE}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
      <AvModal
        isModalVisible={isAddModalVisible}
        setModalVisible={setIsAddModalVisible}
        title="Add Medical Record"
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <AvTextInput
            label="Hospital Name"
            value={hospitalName}
            onChangeText={setHospitalName}
            style={styles.input}
          />
          <AvTextInput
            label="Record Type"
            value={recordType || ''}
            style={styles.input}
            right={
              <AvTextInput.Icon
                icon="chevron-down"
                color={COLORS.BLACK}
                onPress={() => {}}
              />
            }
            onFocus={() => {}}
          />
          <AvTextInput
            label="Date of Visit"
            value={dateOfVisit.toLocaleDateString()}
            style={styles.input}
            right={
              <AvTextInput.Icon
                icon="calendar"
                color={COLORS.BLACK}
                onPress={() => showDatepicker('visit')}
              />
            }
          />
          <AvTextInput
            label="Discharged Date"
            value={dischargedDate ? dischargedDate.toLocaleDateString() : ''}
            style={styles.input}
            right={
              <AvTextInput.Icon
                icon="calendar"
                color={COLORS.BLACK}
                onPress={() => showDatepicker('discharged')}
              />
            }
          />
          <AvTextInput
            label="Chief Complaint"
            value={chiefComplaint}
            onChangeText={setChiefComplaint}
            style={styles.input}
          />
          <AvTextInput
            label="Medical Conditions"
            value={medicalConditions}
            onChangeText={setMedicalConditions}
            style={styles.input}
          />
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
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfVisit}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
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
        />
      )}
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
  hiddenCard: {
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(12),
    padding: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.GREY_LIGHT,
  },
  hiddenText: {
    color: COLORS.BLACK,
    fontSize: normalize(16),
    fontWeight: '600',
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
    marginBottom: hp('2%'),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    padding: wp('3%'),
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
});

export default MedicalRecordsScreen;
