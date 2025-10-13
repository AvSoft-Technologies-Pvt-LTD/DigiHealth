import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AvText from '../../../../elements/AvText';
import AvCard from '../../../../elements/AvCards';
import { COLORS } from '../../../../constants/colors';
import { normalize } from '../../../../constants/platform';
import { SearchFilterBar } from '../../../../components/CommonComponents/SearchFilter';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPharmacyBilling,
  fetchLabBilling,
  fetchHospitalBilling,
} from '../../../../store/thunks/patientThunks';
import { RootState, AppDispatch } from '../../../../store'; // Import AppDispatch

// --- Helper Components ---
interface PharmacyItem {
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  date: string;
}

interface PharmacyListProps {
  data: PharmacyItem[];
}

const PharmacyList: React.FC<PharmacyListProps> = ({ data }) => (
  <>
    {data.map((item, index) => (
      <AvCard key={index} cardStyle={styles.dataCard}>
        <AvText type="heading_5" style={styles.cardTitle}>
          {item.medicineName}
        </AvText>
        <View style={styles.dataRow}>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Quantity
            </AvText>
            <AvText type="Subtitle_1">{item.quantity}</AvText>
          </View>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Unit price ($)
            </AvText>
            <AvText type="Subtitle_1">{item.unitPrice.toFixed(1)}</AvText>
          </View>
        </View>
        <View style={[styles.dataRow, styles.bottomRow]}>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Total price ($)
            </AvText>
            <AvText type="Subtitle_1">{item.totalPrice.toFixed(1)}</AvText>
          </View>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Date
            </AvText>
            <AvText type="Subtitle_1">{item.date}</AvText>
          </View>
        </View>
      </AvCard>
    ))}
  </>
);

interface LabItem {
  testName: string;
  cost: number;
  date: string;
  paymentStatus: string;
}

interface LabsListProps {
  data: LabItem[];
}

const LabsList: React.FC<LabsListProps> = ({ data }) => (
  <>
    {data.map((item, index) => (
      <AvCard key={index} cardStyle={styles.dataCard}>
        <AvText type="heading_5" style={styles.cardTitle}>
          {item.testName}
        </AvText>
        <View style={styles.dataRow}>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Cost (₹)
            </AvText>
            <AvText type="Subtitle_1">{item.cost}</AvText>
          </View>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Date
            </AvText>
            <AvText type="Subtitle_1">{item.date}</AvText>
          </View>
        </View>
        <View style={[styles.dataRow, styles.bottomRow]}>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Payment status
            </AvText>
            <AvText
              type="Subtitle_1"
              style={{
                color:
                  item.paymentStatus === 'Paid'
                    ? COLORS.SUCCESS
                    : COLORS.WARNING,
                fontWeight: 'bold',
              }}
            >
              {item.paymentStatus.toUpperCase()}
            </AvText>
          </View>
        </View>
      </AvCard>
    ))}
  </>
);

interface HospitalBillItem {
  billType: string;
  amount: number;
  paymentMode: string;
  status: string;
  billDate: string;
}

interface HospitalBillsListProps {
  data: HospitalBillItem[];
}

const HospitalBillsList: React.FC<HospitalBillsListProps> = ({ data }) => (
  <>
    {data.map((item, index) => (
      <AvCard key={index} cardStyle={styles.dataCard}>
        <AvText type="heading_5" style={styles.cardTitle}>
          {item.billType}
        </AvText>
        <View style={styles.dataRow}>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Amount (₹)
            </AvText>
            <AvText type="Subtitle_1">{item.amount}</AvText>
          </View>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Bill date
            </AvText>
            <AvText type="Subtitle_1">{item.billDate}</AvText>
          </View>
        </View>
        <View style={[styles.dataRow, styles.bottomRow]}>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Payment mode
            </AvText>
            <AvText type="Subtitle_1">{item.paymentMode}</AvText>
          </View>
          <View style={styles.dataItem}>
            <AvText type="caption" style={styles.label}>
              Status
            </AvText>
            <AvText
              type="Subtitle_1"
              style={{
                color:
                  item.status === 'Paid' ? COLORS.SUCCESS : COLORS.ERROR,
                fontWeight: 'bold',
              }}
            >
              {item.status.toUpperCase()}
            </AvText>
          </View>
        </View>
      </AvCard>
    ))}
  </>
);

// --- Main Tabbed Component ---
interface BillingTabsViewProps {
  currentPatient?: {
    id: string;
  };
}

const BillingTabsView: React.FC<BillingTabsViewProps> = ({ currentPatient }) => {
  const [activeTab, setActiveTab] = useState<'Pharmacy' | 'Labs' | 'Hospital Bills'>('Pharmacy');
  const [searchValue, setSearchValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});
  const dispatch = useDispatch<AppDispatch>(); // Typed dispatch
  const { bills: pharmacyBills, loading: pharmacyLoading, error: pharmacyError } = useSelector(
    (state: RootState) => state.pharmacyBilling,
  );
  const { bills: labBills, loading: labLoading, error: labError } = useSelector(
    (state: RootState) => state.labBilling,
  );
  const { bills: hospitalBills, loading: hospitalLoading, error: hospitalError } = useSelector(
    (state: RootState) => state.hospitalBilling,
  );

  useEffect(() => {
    if (currentPatient?.id) {
      dispatch(fetchPharmacyBilling(currentPatient.id));
      dispatch(fetchLabBilling(currentPatient.id));
      dispatch(fetchHospitalBilling(currentPatient.id));
    }
  }, [currentPatient?.id, dispatch]);

  const pharmacyFilterOptions = [
    { id: 'paid', displayName: 'Paid' },
    { id: 'pending', displayName: 'Pending' },
  ];

  const labsFilterOptions = [
    { id: 'paid', displayName: 'Paid' },
    { id: 'pending', displayName: 'Pending' },
  ];

  const hospitalBillsFilterOptions = [
    { id: 'paid', displayName: 'Paid' },
    { id: 'pending', displayName: 'Pending' },
    { id: 'insurance', displayName: 'Insurance' },
  ];

  const getFilterOptions = () => {
    switch (activeTab) {
      case 'Labs':
        return labsFilterOptions;
      case 'Hospital Bills':
        return hospitalBillsFilterOptions;
      case 'Pharmacy':
      default:
        return pharmacyFilterOptions;
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchValue(text);
  };

  const handleFiltersApplied = (filters: Record<string, boolean>) => {
    setSelectedFilters(filters);
  };

  const renderContent = () => {
    if (activeTab === 'Pharmacy' && pharmacyLoading) {
      return <AvText>Loading pharmacy bills...</AvText>;
    }
    if (activeTab === 'Pharmacy' && pharmacyError) {
      return <AvText style={{ color: 'red' }}>{pharmacyError}</AvText>;
    }
    if (activeTab === 'Labs' && labLoading) {
      return <AvText>Loading lab bills...</AvText>;
    }
    if (activeTab === 'Labs' && labError) {
      return <AvText style={{ color: 'red' }}>{labError}</AvText>;
    }
    if (activeTab === 'Hospital Bills' && hospitalLoading) {
      return <AvText>Loading hospital bills...</AvText>;
    }
    if (activeTab === 'Hospital Bills' && hospitalError) {
      return <AvText style={{ color: 'red' }}>{hospitalError}</AvText>;
    }

    let filteredData;
    switch (activeTab) {
      case 'Labs':
        filteredData = labBills.filter((item) => {
          const matchesSearch = item.testName.toLowerCase().includes(searchValue.toLowerCase());
          const matchesFilter =
            Object.keys(selectedFilters).length === 0 ||
            (selectedFilters.paid && item.paymentStatus === 'Paid') ||
            (selectedFilters.pending && item.paymentStatus === 'Pending');
          return matchesSearch && matchesFilter;
        });
        return <LabsList data={filteredData} />;
      case 'Hospital Bills':
        filteredData = hospitalBills.filter((item) => {
          const matchesSearch = item.billType.toLowerCase().includes(searchValue.toLowerCase());
          const matchesFilter =
            Object.keys(selectedFilters).length === 0 ||
            (selectedFilters.paid && item.status === 'Paid') ||
            (selectedFilters.pending && item.status === 'Pending') ||
            (selectedFilters.insurance && item.paymentMode === 'Insurance');
          return matchesSearch && matchesFilter;
        });
        return <HospitalBillsList data={filteredData} />;
      case 'Pharmacy':
      default:
        filteredData = pharmacyBills.filter((item) => {
          const matchesSearch = item.medicineName.toLowerCase().includes(searchValue.toLowerCase());
          const matchesFilter = Object.keys(selectedFilters).length === 0;
          return matchesSearch && matchesFilter;
        });
        return <PharmacyList data={filteredData} />;
    }
  };

  const tabs = ['Pharmacy', 'Labs', 'Hospital Bills'];

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab as 'Pharmacy' | 'Labs' | 'Hospital Bills')}>
              <AvText
                type="body"
                style={tab === activeTab ? styles.activeTab : styles.inactiveTab}
              >
                {tab}
              </AvText>
            </TouchableOpacity>
          ))}
        </View>
        <SearchFilterBar
          searchValue={searchValue}
          onSearchChange={handleSearchChange}
          filterOptions={getFilterOptions()}
          onFiltersApplied={handleFiltersApplied}
          placeholder="Search..."
        />
      </View>
      <ScrollView contentContainerStyle={styles.detailsContainer}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  topBar: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(10),
    backgroundColor: COLORS.WHITE,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: normalize(10),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT_GREY,
  },
  activeTab: {
    fontWeight: 'bold',
    paddingBottom: normalize(8),
    marginRight: normalize(20),
    borderBottomWidth: 2,
    borderBottomColor: COLORS.DARK_BLUE,
  },
  inactiveTab: {
    paddingBottom: normalize(8),
    marginRight: normalize(20),
    color: COLORS.GREY,
  },
  detailsContainer: {
    paddingHorizontal: normalize(16),
    paddingBottom: normalize(20),
  },
  dataCard: {
    padding: normalize(16),
    marginTop: normalize(10),
    borderRadius: normalize(8),
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: normalize(16),
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: normalize(16),
  },
  bottomRow: {
    marginBottom: 0,
  },
  dataItem: {
    flex: 0.5,
  },
  label: {
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
});

export default BillingTabsView;
