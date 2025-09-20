import React, { useState } from "react";
import { View, StyleSheet, TextInput as RNTextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AvButton from "./AvButton";
import AvText from "./AvText";
import AvTextInput from "./AvTextInput";
import { COLORS } from "../constants/colors";
import { normalize } from "../constants/platform";

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardHolderName: string;
}

interface PaymentComponentProps {
  onSuccess: (data: PaymentFormData) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  onSuccess,
  onError,
  loading = false,
}) => {
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardHolderName: "",
  });
  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [cardType, setCardType] = useState<string | null>(null); // "visa", "mastercard", etc.

  // Detect card type from number (simplified)
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s+/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5")) return "mastercard";
    if (cleaned.startsWith("34") || cleaned.startsWith("37")) return "amex";
    if (cleaned.startsWith("6")) return "discover";
    return null;
  };

  // Validation functions (same as before)
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s+/g, "");
    return cleaned.length >= 12 && cleaned.length <= 19;
  };

  const validateExpiryDate = (date: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(date)) return false;
    const [month, year] = date.split("/").map(Number);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;
    return (
      month >= 1 &&
      month <= 12 &&
      year >= currentYear &&
      (year > currentYear || month >= currentMonth)
    );
  };

  const validateCVV = (cvv: string): boolean => {
    return /^\d{3,4}$/.test(cvv);
  };

  const handleSubmit = () => {
    const newErrors: Partial<PaymentFormData> = {};

    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Invalid expiry date (MM/YY)";
    }
    if (!validateCVV(formData.cvv)) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }
    if (!formData.cardHolderName.trim()) {
      newErrors.cardHolderName = "Name is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSuccess(formData);
    } else {
      onError("Please fix the errors in the form");
    }
  };

  // Formatters (same as before)
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s+/g, "");
    const formatted = cleaned.replace(/(\d{4})/g, "$1 ").trim();
    setCardType(detectCardType(cleaned));
    return formatted;
  };

  const formatExpiryDate = (text: string) => {
    if (text.length === 2 && !text.includes("/")) {
      return text + "/";
    }
    return text;
  };

  // Render card icon based on detected type
  const renderCardIcon = () => {
    if (!cardType) return null;
    const iconProps = {
      size: normalize(24),
      color: COLORS.PRIMARY,
      style: styles.cardIcon,
    };
    switch (cardType) {
      case "visa":
        return <Icon name="credit-card" {...iconProps} />;
      case "mastercard":
        return <Icon name="credit-card-outline" {...iconProps} />;
      case "amex":
        return <Icon name="credit-card-plus" {...iconProps} />;
      case "discover":
        return <Icon name="credit-card-scan" {...iconProps} />;
      default:
        return <Icon name="credit-card" {...iconProps} />;
    }
  };

  return (
    <View style={styles.container}>
      <AvText type="title_2" style={styles.title}>
        Payment Details
      </AvText>

      {/* Card Number with Icon */}
      <View style={styles.inputRow}>
        <View style={styles.inputWithIcon}>
          <AvText type="body" style={styles.label}>
            Card Number
          </AvText>
          <View style={styles.inputContainer}>
            <AvTextInput
              type="default"
              placeholder="1234 5678 9012 3456"
              keyboardType="numeric"
              value={formData.cardNumber}
              onChangeText={(text) => {
                setFormData({ ...formData, cardNumber: formatCardNumber(text) });
              }}
              style={[
                styles.input,
                errors.cardNumber && styles.inputError,
                { flex: 1 },
              ]}
            />
            {renderCardIcon()}
          </View>
          {errors.cardNumber && (
            <View style={styles.errorContainer}>
              <Icon
                name="alert-circle-outline"
                size={normalize(16)}
                color={COLORS.ERROR}
                style={styles.errorIcon}
              />
              <AvText type="caption" style={styles.errorText}>
                {errors.cardNumber}
              </AvText>
            </View>
          )}
        </View>
      </View>

      {/* Expiry Date & CVV */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <AvText type="body" style={styles.label}>
            Expiry Date
          </AvText>
          <AvTextInput
            type="default"
            placeholder="MM/YY"
            keyboardType="numeric"
            value={formData.expiryDate}
            onChangeText={(text) => {
              setFormData({ ...formData, expiryDate: formatExpiryDate(text) });
            }}
            style={[
              styles.input,
              errors.expiryDate && styles.inputError,
            ]}
          />
          {errors.expiryDate && (
            <View style={styles.errorContainer}>
              <Icon
                name="alert-circle-outline"
                size={normalize(16)}
                color={COLORS.ERROR}
                style={styles.errorIcon}
              />
              <AvText type="caption" style={styles.errorText}>
                {errors.expiryDate}
              </AvText>
            </View>
          )}
        </View>

        <View style={styles.halfInput}>
          <AvText type="body" style={styles.label}>
            CVV
          </AvText>
          <View style={styles.inputContainer}>
            <AvTextInput
              type="default"
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
              value={formData.cvv}
              onChangeText={(text) => {
                setFormData({ ...formData, cvv: text });
              }}
              style={[
                styles.input,
                errors.cvv && styles.inputError,
                { flex: 1 },
              ]}
            />
            <Icon
              name="lock-outline"
              size={normalize(20)}
              color={COLORS.GREY}
              style={styles.cvvIcon}
            />
          </View>
          {errors.cvv && (
            <View style={styles.errorContainer}>
              <Icon
                name="alert-circle-outline"
                size={normalize(16)}
                color={COLORS.ERROR}
                style={styles.errorIcon}
              />
              <AvText type="caption" style={styles.errorText}>
                {errors.cvv}
              </AvText>
            </View>
          )}
        </View>
      </View>

      {/* Card Holder Name */}
      <AvText type="body" style={styles.label}>
        Card Holder Name
      </AvText>
      <AvTextInput
        type="default"
        placeholder="John Doe"
        value={formData.cardHolderName}
        onChangeText={(text) => {
          setFormData({ ...formData, cardHolderName: text });
        }}
        style={[
          styles.input,
          errors.cardHolderName && styles.inputError,
        ]}
      />
      {errors.cardHolderName && (
        <View style={styles.errorContainer}>
          <Icon
            name="alert-circle-outline"
            size={normalize(16)}
            color={COLORS.ERROR}
            style={styles.errorIcon}
          />
          <AvText type="caption" style={styles.errorText}>
            {errors.cardHolderName}
          </AvText>
        </View>
      )}

      {/* Secure Payment Indicator */}
      <View style={styles.secureContainer}>
        <Icon
          name="shield-check-outline"
          size={normalize(18)}
          color={COLORS.SUCCESS}
        />
        <AvText type="smallText" style={styles.secureText}>
          Secure payment powered by Stripe
        </AvText>
      </View>

      {/* Submit Button */}
      <AvButton
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        style={styles.submitButton}
        disabled={loading}
      >
        <View style={styles.buttonContent}>
          <Icon
            name="credit-card-check-outline"
            size={normalize(18)}
            color={COLORS.WHITE}
            style={styles.buttonIcon}
          />
          <AvText type="buttonText" style={styles.buttonText}>
            Pay Now
          </AvText>
        </View>
      </AvButton>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: normalize(16),
    backgroundColor: COLORS.WHITE,
    borderRadius: normalize(8),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    marginBottom: normalize(16),
    color: COLORS.PRIMARY,
  },
  label: {
    marginBottom: normalize(4),
    color: COLORS.PRIMARY_TXT,
  },
  input: {
    marginBottom: normalize(8),
    backgroundColor: COLORS.OFFWHITE,
    paddingHorizontal: normalize(12),
  },
  inputError: {
    borderColor: COLORS.ERROR,
    borderWidth: 1,
  },
  inputRow: {
    marginBottom: normalize(12),
  },
  inputWithIcon: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.OFFWHITE,
    borderRadius: normalize(4),
    paddingHorizontal: normalize(12),
  },
  cardIcon: {
    marginLeft: normalize(8),
  },
  cvvIcon: {
    marginLeft: normalize(8),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: normalize(12),
  },
  halfInput: {
    width: "48%",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(8),
  },
  errorIcon: {
    marginRight: normalize(4),
  },
  errorText: {
    color: COLORS.ERROR,
  },
  secureContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: normalize(12),
  },
  secureText: {
    marginLeft: normalize(6),
    color: COLORS.SUCCESS,
  },
  submitButton: {
    marginTop: normalize(16),
    paddingVertical: normalize(8),
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonIcon: {
    marginRight: normalize(8),
  },
  buttonText: {
    color: COLORS.WHITE,
  },
});

export default PaymentComponent;
