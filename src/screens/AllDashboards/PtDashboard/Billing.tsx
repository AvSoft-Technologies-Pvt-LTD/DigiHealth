import React, { useState } from "react";
import { View, StyleSheet, Alert, Share } from "react-native";
import { TableCard, DataRecord, Action } from "../../../components/CommonComponents/TableCard"; // adjust path
import AvText from "../../../elements/AvText";
import { COLORS } from "../../../constants/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // <-- Material Icons

export default function Billing() {
  const [billingData, setBillingData] = useState<DataRecord[]>([
    {
      recordId: "INV-1001",
      isHidden: false,
      patientName: "John Doe",
      service: "Consultation",
      amount: 1200,
      status: "Paid",
      date: "2025-09-18",
    },
    {
      recordId: "INV-1002",
      isHidden: false,
      patientName: "Jane Smith",
      service: "Lab Test",
      amount: 800,
      status: "Pending",
      date: "2025-09-19",
    },
  ]);

  // Define actions (buttons on each card header)
  const actions: Action[] = [
    {
      key: "pay",
      onPress: (record) => {
        if (record.status === "Paid") {
          Alert.alert("Payment", `Invoice ${record.recordId} is already paid ✅`);
        } else {
          Alert.alert("Pay Now", `Proceed to pay invoice ${record.recordId}`);
        }
      },
      render: (record) => (
        <Icon
          name="credit-card-outline" // Material icon name
          size={22}
          color={record.status === "Paid" ? COLORS.GREY : COLORS.SECONDARY}
        />
      ),
    },
    {
      key: "share",
      onPress: async (record) => {
        try {
          await Share.share({
            message: `Invoice: ${record.recordId}\nPatient: ${record.patientName}\nService: ${record.service}\nAmount: $${record.amount}\nStatus: ${record.status}\nDate: ${record.date}`,
          });
        } catch (error: any) {
          Alert.alert("Error", "Unable to share invoice");
        }
      },
      render: () => (
        <Icon name="share-variant" size={22} color={COLORS.PRIMARY_BLUE} />
      ),
    },
  ];

  return (
    <View style={styles.container}>
      <AvText type="heading_1" style={styles.title}>
        Billing Records
      </AvText>

      <TableCard
        data={billingData}
        headerFields={[ "status" ]}
        actions={actions}
        onCardPress={(record) =>
          Alert.alert("Card Pressed", `You pressed invoice ${record.recordId}`)
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: COLORS.PRIMARY_BACKGROND,
  },
  title: {
    marginBottom: 16,
    color: COLORS.PRIMARY,
  },
});
