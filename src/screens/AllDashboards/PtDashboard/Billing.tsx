import React, { useState } from "react";
import { View, StyleSheet, Alert, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TableCard, DataRecord, Action } from "../../../components/CommonComponents/TableCard";
import AvText from "../../../elements/AvText";
import { COLORS, ALERT_COLORS } from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import billingData from '../../../constants/data';
import { normalize } from "../../../constants/platform";
import { PAGES } from '../../../constants/pages';
import { RootStackParamList } from '../../../types/navigation';
import { SearchFilterBar, FilterOption } from "../../../components/CommonComponents/SearchFilter";

interface Invoice {
  invoiceNo: string;
  date: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  patientAddress: string;
  patientDOB: string;
  doctorName: string;
  items: {
    description: string;
    cost: number;
    quantity: number;
    amount: number;
  }[];
  billedAmount: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
}

type Status = 'Paid' | 'Pending' | 'Overdue';

const statusColors: Record<Status, string> = {
  Paid: COLORS.LIGHT_GREEN,
  Pending: COLORS.WARNING_BG,
  Overdue: ALERT_COLORS.ERROR,
};

const statusTextColors: Record<Status, string> = {
  Paid: COLORS.SUCCESS,
  Pending: ALERT_COLORS.WARNING_TEXT,
  Overdue: ALERT_COLORS.ERROR_TEXT,
};

const getStatusBgColor = (status: string): string => {
  return statusColors[status as Status] || COLORS.LIGHT_GREY;
};

const getStatusTextColor = (status: string): string => {
  return statusTextColors[status as Status] || COLORS.BLACK;
};

const transformToInvoiceFormat = (record: DataRecord): Invoice => ({
  invoiceNo: record.recordId,
  date: record.date,
  patientName: record.patientName,
  patientEmail: record.patientEmail || 'patient@example.com',
  patientPhone: record.patientPhone || '123-456-7890',
  patientAddress: record.patientAddress || 'Address not provided',
  patientDOB: record.patientDOB || '01/01/1990',
  doctorName: record.doctorName || 'Dr. Smith',
  items: [{
    description: record.service,
    cost: record.amount,
    quantity: 1,
    amount: record.amount
  }],
  billedAmount: record.amount,
  discount: record.discount || 0,
  tax: record.tax || 0,
  total: record.amount,
  status: record.status
});

export default function Billing() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [billingDataState, setBillingDataState] = useState<DataRecord[]>(billingData);
  const [searchValue, setSearchValue] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<Record<string, boolean>>({});

  const filterOptions: FilterOption[] = [
    { id: "Paid", displayName: "Paid" },
    { id: "Pending", displayName: "Pending" },
    { id: "Overdue", displayName: "Overdue" },
  ];

  const handleSearch = (text: string) => {
    setSearchValue(text);
    const filteredData = billingData.filter((item) =>
      item.patientName.toLowerCase().includes(text.toLowerCase()) ||
      item.recordId.toLowerCase().includes(text.toLowerCase())
    );
    setBillingDataState(filteredData);
  };

  const handleFiltersApplied = (filters: Record<string, boolean>) => {
    setSelectedFilters(filters);
    let filteredData = [...billingData];
    if (searchValue) {
      filteredData = filteredData.filter((item) =>
        item.patientName.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.recordId.toLowerCase().includes(searchValue.toLowerCase())
      );
    }
    const activeFilters = Object.entries(filters)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key);
    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) => activeFilters.includes(item.status));
    }
    setBillingDataState(filteredData);
  };

  const getProcessedData = (data: DataRecord[]) => data.map((record) => ({
    ...record,
    statusElement: (
      <View style={[styles.statusContainer, { backgroundColor: getStatusBgColor(record.status) }]}>
        <AvText style={[styles.statusText, { color: getStatusTextColor(record.status) }]}>
          {record.status}
        </AvText>
      </View>
    ),
    // Add a custom property to indicate if Pay button should be shown
    showPayButton: record.status === "Pending"
  }));

  const handleShare = async (record: DataRecord) => {
    try {
      await Share.share({
        message: `Invoice: ${record.recordId}\nPatient: ${record.patientName}\nService: ${record.service}\nAmount: $${record.amount}\nStatus: ${record.status}\nDate: ${record.date}`,
      });
    } catch (error: any) {
      Alert.alert("Error", "Unable to share invoice");
    }
  };

  const handlePayment = (record: DataRecord) => {
    navigation.navigate(PAGES.PAYMENT_PAGE, { record } as any);
  };

  // Define all possible actions
  const allActions: Action[] = [
    {
      key: "share",
      onPress: (record: DataRecord) => handleShare(record),
      render: () => <Icon name="share-variant" size={22} color={COLORS.GREY} />,
    },
    {
      key: "payment",
      onPress: (record: DataRecord) => handlePayment(record),
      render: (record: DataRecord) => (
        (record as any).showPayButton ? (
          <View style={styles.payButton}>
            <AvText style={styles.payButtonText}>Pay</AvText>
          </View>
        ) : null
      ),
    },
  ];

  const handleInvoicePress = (record: DataRecord) => {
    const invoiceData = transformToInvoiceFormat(record);
    navigation.navigate(PAGES.INVOICE_COMPONENT, { invoice: invoiceData } as any);
  };

  return (
    <View style={styles.container}>
      <AvText type="heading_3" style={styles.title}>
        Billing Records
      </AvText>
      <SearchFilterBar
        searchValue={searchValue}
        onSearchChange={handleSearch}
        placeholder="Search by invoice ID..."
        filterOptions={filterOptions}
        onFiltersApplied={handleFiltersApplied}
        filterModalTitle="Filter by Status"
      />
      <TableCard
        data={getProcessedData(billingDataState)}
        headerFields={["statusElement"]}
        actions={allActions}
        onCardPress={(record: DataRecord) => {
          const { statusElement, showPayButton, ...cleanRecord } = record as DataRecord & {
            statusElement: React.ReactNode;
            showPayButton: boolean;
          };
          handleInvoicePress(cleanRecord);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.WHITE,
  },
  title: {
    marginBottom: normalize(15),
    color: COLORS.PRIMARY,
    marginLeft: normalize(17),
    marginTop: normalize(10),
    fontWeight: 'bold',
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  payButton: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600'
  }
});
