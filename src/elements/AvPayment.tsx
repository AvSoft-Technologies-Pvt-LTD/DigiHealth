import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Animated, Linking } from "react-native";
import AvButton from "./AvButton";
import AvText from "./AvText";
import AvTextInput from "./AvTextInput";
import AvCards from "./AvCards";
import AvModal from "./AvModal";
import { COLORS } from "../constants/colors";
import AvIcons from "./AvIcons";

type PaymentMethod = "card" | "upi" | "wallet" | "cash" | "bankTransfer";
type CardType = "visa" | "mastercard" | "amex" | "rupay" | null;
type WalletProvider = "gpay" | "phonepe" | "paytm" | "amazonpay";

interface PaymentFormData {
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
  upiId?: string;
  walletProvider?: WalletProvider;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  transactionId?: string;
  paymentTime?: string;
}

interface PaymentComponentProps {
  onSuccess?: (data: PaymentFormData) => void;
  onError?: (error: string) => void;
  loading?: boolean;
  amount: number;
  currency?: string;
  merchantName?: string;
  buttonText?: string;
  style?: any;
  navigation?: any;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  onSuccess = () => {},
  onError = () => {},
  loading = false,
  amount,
  currency = "₹",
  merchantName = "Merchant",
  buttonText = `Pay ${currency}${amount}`,
  style = {},
  navigation,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [formData, setFormData] = useState<PaymentFormData>({});
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkmarkScale] = useState(new Animated.Value(0));
  const [savedCards] = useState<{ last4: string; brand: CardType }[]>([
    { last4: "4242", brand: "visa" },
    { last4: "7890", brand: "mastercard" },
  ]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};
    if (paymentMethod === "card") {
      if (!formData.cardNumber?.replace(/\s+/g, "").match(/^\d{12,19}$/)) newErrors.cardNumber = "Invalid card number";
      if (!formData.expiryDate?.match(/^\d{2}\/\d{2}$/)) newErrors.expiryDate = "Invalid expiry (MM/YY)";
      if (!formData.cvv?.match(/^\d{3,4}$/)) newErrors.cvv = "Invalid CVV";
    } else if (paymentMethod === "upi") {
      if (!formData.upiId?.match(/^[a-zA-Z0-9.-]{3,}@[a-zA-Z]{2,}$/)) newErrors.upiId = "Invalid UPI ID";
    } else if (paymentMethod === "bankTransfer") {
      if (!formData.bankName) newErrors.bankName = "Bank name is required";
      if (!formData.accountNumber?.match(/^\d{9,18}$/)) newErrors.accountNumber = "Invalid account number";
      if (!formData.ifscCode?.match(/^[A-Z]{4}0[A-Z0-9]{6}$/)) newErrors.ifscCode = "Invalid IFSC code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (paymentMethod === "cash") {
      const transactionData = { ...formData, transactionId: `TXN${Math.floor(Math.random() * 1000000)}`, paymentTime: new Date().toLocaleString() };
      setFormData(transactionData);
      setIsModalVisible(true);
      Animated.spring(checkmarkScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
      onSuccess(transactionData);
      return;
    }
    if (!validateForm()) {
      onError("Please fix the errors to proceed");
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1500));
      const transactionData = { ...formData, transactionId: `TXN${Math.floor(Math.random() * 1000000)}`, paymentTime: new Date().toLocaleString() };
      setFormData(transactionData);
      setIsModalVisible(true);
      Animated.spring(checkmarkScale, { toValue: 1, friction: 3, useNativeDriver: true }).start();
      if (paymentMethod === "upi" && formData.upiId) {
        const upiUrl = `upi://pay?pa=${formData.upiId}&pn=${merchantName}&am=${amount}&cu=INR`;
        if (await Linking.canOpenURL(upiUrl)) Linking.openURL(upiUrl);
      }
      onSuccess(transactionData);
    } catch (error) {
      onError("Payment failed. Please try again.");
      Alert.alert("Error", "Payment failed. Please retry.");
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (isModalVisible) {
      const timer = setTimeout(() => {
        setIsModalVisible(false);
        navigation?.navigate("NextScreen");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isModalVisible, navigation]);

  const popularBanks = ["State Bank of India", "HDFC Bank", "ICICI Bank", "Punjab National Bank", "Bank of Baroda", "Canara Bank", "Union Bank of India", "Axis Bank", "Kotak Mahindra Bank", "IndusInd Bank"];

  const renderPaymentMethods = () => (
    <View style={styles.methodsContainer}>
      {(["upi", "card", "wallet", "cash", "bankTransfer"] as PaymentMethod[]).map((method) => (
        <AvCards
          key={method}
          title={method === "upi" ? "UPI" : method === "card" ? "Credit/Debit Card" : method === "wallet" ? "Wallet" : method === "cash" ? "Cash" : "Bank Transfer"}
          icon={<AvIcons type={"MaterialCommunityIcons"} name={method === "upi" ? "cellphone-wireless" : method === "card" ? "credit-card" : method === "wallet" ? "wallet" : method === "cash" ? "cash" : "bank-transfer"} size={22} color={paymentMethod === method ? COLORS.WHITE : COLORS.PRIMARY} />}
          cardStyle={[styles.methodCard, paymentMethod === method && styles.activeMethodCard]}
          titleStyle={[paymentMethod === method ? styles.activeMethodText : styles.methodText]}
          onPress={() => setPaymentMethod(method)}
        >
          {paymentMethod === method && <AvIcons type={"MaterialCommunityIcons"} name="check-circle" size={18} color={COLORS.WHITE} style={styles.checkIcon} />}
        </AvCards>
      ))}
    </View>
  );

  const renderCardForm = () => (
    <>
      <View style={styles.savedCardsContainer}>
        {savedCards.map((card, index) => (
          <AvCards
            key={index}
            title={`**** ${card.last4}`}
            icon={<AvIcons type={"MaterialCommunityIcons"} name={card.brand === "visa" ? "credit-card" : "credit-card-outline"} size={18} color={COLORS.PRIMARY} />}
            cardStyle={styles.savedCard}
            onPress={() => setFormData({ ...formData, cardNumber: `**** **** **** ${card.last4}`, expiryDate: "12/25", cvv: "123" })}
          />
        ))}
      </View>
      <AvText style={styles.label}>Card Number</AvText>
      <AvTextInput
        placeholder="1234 5678 9012 3456"
        keyboardType="numeric"
        value={formData.cardNumber}
        onChangeText={(text) => setFormData({ ...formData, cardNumber: text.replace(/\s+/g, "").replace(/(\d{4})/g, "$1 ").trim() })}
 style={[
          styles.input,
          ...(errors.cardNumber ? [styles.errorInput] : []),
        ]}      />
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <AvText style={styles.label}>Expiry Date</AvText>
          <AvTextInput
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChangeText={(text) => setFormData({ ...formData, expiryDate: text.length === 2 && !text.includes("/") ? text + "/" : text })}
 style={[
          styles.input,
          ...(errors.expiryDate ? [styles.errorInput] : []),
        ]}          />
        </View>
        <View style={styles.halfInput}>
          <AvText style={styles.label}>CVV</AvText>
          <AvTextInput
            placeholder="123"
            keyboardType="numeric"
            secureTextEntry
            value={formData.cvv}
            onChangeText={(text) => setFormData({ ...formData, cvv: text })}
           style={[
          styles.input,
          ...(errors.cvv ? [styles.errorInput] : []),
        ]}
          />
        </View>
      </View>
    </>
  );

  const renderUPIForm = () => (
    <>
      <AvText style={styles.label}>UPI ID</AvText>
      
      <AvTextInput
        placeholder="yourname@bank"
        value={formData.upiId}
        onChangeText={(text) => setFormData({ ...formData, upiId: text })}
        style={[
          styles.input,
          ...(errors.upiId ? [styles.errorInput] : []),
        ]}
      />
      <TouchableOpacity onPress={() => setFormData({ ...formData, upiId: "test@upi" })}>
        <AvText style={styles.suggestionText}>Use test@upi for testing</AvText>
      </TouchableOpacity>
      {formData.upiId && <AvCards title="This UPI ID will be used for payment" icon={<AvIcons type={"MaterialCommunityIcons"} name="upi" size={40} color={COLORS.PRIMARY} />} cardStyle={styles.upiIconContainer} />}
    </>
  );

  const renderWalletForm = () => (
    <>
      {(["gpay", "phonepe", "paytm", "amazonpay"] as WalletProvider[]).map((wallet) => (
        <AvCards
          key={wallet}
          title={wallet === "gpay" ? "Google Pay" : wallet === "phonepe" ? "PhonePe" : wallet === "paytm" ? "Paytm" : "Amazon Pay"}
          icon={<AvIcons type={"MaterialCommunityIcons"} name={wallet === "gpay" ? "google" : wallet === "phonepe" ? "cellphone" : wallet === "paytm" ? "wallet" : "credit-card-outline"} size={24} color={formData.walletProvider === wallet ? COLORS.WHITE : wallet === "gpay" ? "#4285F4" : wallet === "phonepe" ? "#5B2886" : wallet === "paytm" ? "#00BAFF" : "#FF9900"} />}
          cardStyle={[styles.walletOption, formData.walletProvider === wallet && { backgroundColor: COLORS.SECONDARY, borderColor: COLORS.BG_OFF_WHITE }]}
          titleStyle={[formData.walletProvider === wallet ? styles.selectedWalletText : styles.walletText, { color: formData.walletProvider === wallet ? COLORS.WHITE : wallet === "gpay" ? "#4285F4" : wallet === "phonepe" ? "#5B2886" : wallet === "paytm" ? "#00BAFF" : "#FF9900" }]}
          onPress={() => setFormData({ ...formData, walletProvider: wallet })}
        >
          {formData.walletProvider === wallet && <AvIcons type={"MaterialCommunityIcons"} name="check-circle" size={18} color={COLORS.WHITE} style={styles.checkIcon} />}
        </AvCards>
      ))}
    </>
  );

  const renderBankTransferForm = () => (
    <>
      <AvText style={styles.label}>Bank Name</AvText>
      <TouchableOpacity style={[styles.input, styles.dropdownInput]} onPress={() => Alert.alert("Select Bank", "", [...popularBanks.map(bank => ({ text: bank, onPress: () => setFormData({ ...formData, bankName: bank }) })), { text: "Cancel", style: "cancel" }])}>
        <AvText style={formData.bankName ? styles.dropdownText : styles.placeholderText}>{formData.bankName || "Select your bank"}</AvText>
        <AvIcons type={"MaterialCommunityIcons"} name="chevron-down" size={22} color={COLORS.PRIMARY} />
      </TouchableOpacity>
      <AvText style={styles.label}>Account Number</AvText>
      <AvTextInput
        placeholder="Your account number"
        keyboardType="numeric"
        value={formData.accountNumber}
        onChangeText={(text) => setFormData({ ...formData, accountNumber: text })}
         style={[
          styles.input,
          ...(errors.accountNumber ? [styles.errorInput] : []),
        ]}
      />
      <AvText style={styles.label}>IFSC Code</AvText>
      <AvTextInput
        placeholder="e.g., SBIN0001234"
        value={formData.ifscCode}
        onChangeText={(text) => setFormData({ ...formData, ifscCode: text.toUpperCase() })}
       style={[
          styles.input,
          ...(errors.ifscCode ? [styles.errorInput] : []),
        ]}
      />
    </>
  );

  const renderCashForm = () => (
    <AvCards title={`Please pay ${currency}${amount} in cash`} icon={<AvIcons type={"MaterialCommunityIcons"} name="cash" size={40} color={COLORS.PRIMARY} />} cardStyle={styles.cashContainer}>
      <AvText style={styles.cashNote}>Your order will be confirmed after payment</AvText>
    </AvCards>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.amountContainer}>
        <AvText style={styles.amountText}>{currency}{amount}</AvText>
        <AvText style={styles.merchantText}>Paying to {merchantName}</AvText>
      </View>
      <AvText style={styles.sectionTitle}>Payment Method</AvText>
      {renderPaymentMethods()}
      <View style={styles.formContainer}>
        {paymentMethod === "card" && renderCardForm()}
        {paymentMethod === "upi" && renderUPIForm()}
        {paymentMethod === "wallet" && renderWalletForm()}
        {paymentMethod === "cash" && renderCashForm()}
        {paymentMethod === "bankTransfer" && renderBankTransferForm()}
      </View>
      <AvButton mode="contained" onPress={handleSubmit} loading={isProcessing} disabled={isProcessing} style={styles.submitButton}>{buttonText}</AvButton>
      <AvModal isModalVisible={isModalVisible} setModalVisible={setIsModalVisible} title="Payment Receipt">
        <View style={styles.successContainer}>
          <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}><AvIcons type={"MaterialCommunityIcons"} name="check-circle" size={60} color={COLORS.SUCCESS} /></Animated.View>
          <AvText style={styles.successText}>Payment Successful!</AvText>
          <AvCards title="Receipt" cardStyle={styles.receiptContainer}>
            <View style={styles.receiptRow}><AvText style={styles.receiptLabel}>Amount:</AvText><AvText style={styles.receiptValue}>{currency}{amount}</AvText></View>
            <View style={styles.receiptRow}><AvText style={styles.receiptLabel}>Transaction ID:</AvText><AvText style={styles.receiptValue}>{formData.transactionId}</AvText></View>
            <View style={styles.receiptRow}><AvText style={styles.receiptLabel}>Time:</AvText><AvText style={styles.receiptValue}>{formData.paymentTime}</AvText></View>
            <View style={styles.receiptRow}><AvText style={styles.receiptLabel}>Method:</AvText><AvText style={styles.receiptValue}>{paymentMethod === "upi" ? "UPI" : paymentMethod === "card" ? "Card" : paymentMethod === "wallet" ? formData.walletProvider : paymentMethod === "bankTransfer" ? "Bank Transfer" : "Cash"}</AvText></View>
          </AvCards>
        </View>
      </AvModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: COLORS.WHITE, borderRadius: 12 },
  amountContainer: { alignItems: "center", marginBottom: 20 },
  amountText: { fontSize: 24, fontWeight: "bold", color: COLORS.PRIMARY },
  merchantText: { color: COLORS.GREY, marginTop: 4 },
  sectionTitle: { fontWeight: "600", marginBottom: 12, color: COLORS.PRIMARY_TXT },
  methodsContainer: { marginBottom: 20 },
  methodCard: { flexDirection: "row", alignItems: "center", padding: 14, marginBottom: 10, borderRadius: 8, backgroundColor: COLORS.OFFWHITE, borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  activeMethodCard: { backgroundColor: COLORS.PRIMARY, borderColor: COLORS.PRIMARY },
  methodText: { marginLeft: 8, color: COLORS.PRIMARY_TXT, flex: 1 },
  activeMethodText: { marginLeft: 8, color: COLORS.WHITE, fontWeight: "500", flex: 1 },
  checkIcon: { marginLeft: "auto" },
  formContainer: { marginBottom: 20 },
  label: { marginBottom: 6, color: COLORS.PRIMARY_TXT, fontWeight: "500" },
  input: { backgroundColor: COLORS.OFFWHITE, borderRadius: 8, padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  dropdownInput: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  placeholderText: { color: COLORS.GREY },
  dropdownText: { color: COLORS.PRIMARY_TXT },
  errorInput: { borderColor: COLORS.ERROR },
  row: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  savedCardsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 15 },
  savedCard: { flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.OFFWHITE, borderRadius: 6, borderWidth: 1, borderColor: COLORS.LIGHT_GREY, marginRight: 8, minWidth: "48%" },
  suggestionText: { color: COLORS.PRIMARY, fontSize: 12, alignSelf: "flex-end", marginBottom: 15 },
  upiIconContainer: { alignItems: "center", marginTop: 15, padding: 15, backgroundColor: COLORS.OFFWHITE, borderRadius: 8, borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  walletOption: { flexDirection: "row", alignItems: "center", padding: 12, marginBottom: 8, borderRadius: 8, backgroundColor: COLORS.OFFWHITE, borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  walletText: { marginLeft: 10, color: COLORS.PRIMARY_TXT, flex: 1 },
  selectedWalletText: { marginLeft: 10, color: COLORS.WHITE, fontWeight: "500", flex: 1 },
  successContainer: { alignItems: "center" },
  successText: { fontSize: 20, fontWeight: "bold", color: COLORS.SUCCESS, marginVertical: 20 },
  receiptContainer: { width: "100%", backgroundColor: COLORS.OFFWHITE, borderRadius: 8, padding: 15, marginBottom: 20 },
  receiptRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  receiptLabel: { color: COLORS.PRIMARY_TXT },
  receiptValue: { fontWeight: "600", color: COLORS.PRIMARY },
  submitButton: { marginTop: 10 },
  cashContainer: { alignItems: "center", padding: 20, backgroundColor: COLORS.OFFWHITE, borderRadius: 8, borderWidth: 1, borderColor: COLORS.LIGHT_GREY },
  cashNote: { textAlign: "center", color: COLORS.GREY, fontSize: 12, marginTop: 8 },
});

export default PaymentComponent;
