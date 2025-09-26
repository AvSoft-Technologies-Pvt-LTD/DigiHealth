import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert, TextInput } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';
import FormField, { FieldType } from '../form/FormField';
import { isIos, normalize } from '../../../constants/platform';

interface FormField {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  helperText?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    errorMessage?: string;
  };
  multiple?: boolean;
}

interface DynamicFormProps {
  fields: FormField[];
  onSubmit: (formData: Record<string, any>) => void;
  onCancel?: () => void;
  headerTitle?: string;
  formData: Record<string, any>;
  onChange: (name: string, value: any) => void;
  buttonTitle?: string;
  singleButton?: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  fields,
  onSubmit,
  onCancel,
  headerTitle,
  formData,
  onChange,
  buttonTitle = 'Save',
  singleButton = false,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [expandedSelect, setExpandedSelect] = useState<{ [key: string]: boolean }>({});
  const [showDatePicker, setShowDatePicker] = useState<{ [key: string]: boolean }>({});
  const [currentField, setCurrentField] = useState<string | null>(null);

  const validateField = (name: string, value: any, field: FormField): string => {
    if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
      return 'This field is required';
    }
    if (field.validation && value) {
      if (field.validation.minLength && value.toString().length < field.validation.minLength) {
        return field.validation.errorMessage || `Minimum length is ${field.validation.minLength}`;
      }
      if (field.validation.maxLength && value.toString().length > field.validation.maxLength) {
        return field.validation.errorMessage || `Maximum length is ${field.validation.maxLength}`;
      }
      if (field.validation.pattern && !field.validation.pattern.test(value.toString())) {
        return field.validation.errorMessage || 'Invalid format';
      }
    }
    return '';
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    fields.forEach((field) => {
      const error = validateField(field.name, formData[field.name], field);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });
    setErrors(newErrors);
    if (isValid) {
      onSubmit(formData);
    } else {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
    }
  };

  const toggleShowPassword = (name: string) => {
    setShowPassword({ ...showPassword, [name]: !showPassword[name] });
  };

  const handleFileUpload = (name: string, multiple?: boolean) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: multiple ? 0 : 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else if (response.assets) {
          const uris = response.assets.map((asset) => asset.uri);
          onChange(name, multiple ? uris : uris[0]);
        }
      },
    );
  };

  const renderField = (field: FormField) => {
    if (field.type === 'textarea') {
      return (
        <View key={field.name} style={styles.textAreaContainer}>
          <Text style={styles.label}>{field.label}</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={4}
            placeholder={field.placeholder}
            value={formData[field.name] || ''}
            onChangeText={(value) => onChange(field.name, value)}
          />
          {errors[field.name] && <Text style={styles.errorText}>{errors[field.name]}</Text>}
        </View>
      );
    } else {
      return (
        <FormField
          key={field.name}
          field={field}
          value={formData[field.name]}
          error={errors[field.name]}
          onChange={onChange}
          showPassword={showPassword[field.name] || false}
          toggleShowPassword={toggleShowPassword}
          showDatePicker={showDatePicker[field.name] || false}
          setShowDatePicker={(fieldName, show) => setShowDatePicker({ ...showDatePicker, [fieldName]: show })}
          currentField={currentField}
          setCurrentField={setCurrentField}
          expandedSelect={expandedSelect[field.name] || false}
          setExpandedSelect={(fieldName, expanded) => setExpandedSelect({ ...expandedSelect, [fieldName]: expanded })}
          handleFileUpload={handleFileUpload}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerTitle || 'Form'}</Text>
      </View>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
        {fields.map(renderField)}
      </ScrollView>
      <View style={[styles.footer, { justifyContent: singleButton ? 'center' : 'space-between' }]}>
        {!singleButton && (
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Icon name="close" size={20} color="#DC2626" />
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="check" size={20} color={COLORS.WHITE} />
          <Text style={styles.submitButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.GRADIENT_START,
    paddingVertical: normalize(20),
    paddingHorizontal: normalize(16),
    borderBottomLeftRadius: normalize(20),
    borderBottomRightRadius: normalize(20),
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerText: {
    color: COLORS.WHITE,
    fontSize: normalize(24),
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: normalize(16),
    paddingBottom: normalize(100),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: normalize(16),
    paddingBottom: isIos() ? normalize(32) : normalize(16),
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.NAVBAR_DIVIDER,
    gap: normalize(12),
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.ERROR,
    borderRadius: 12,
    paddingVertical: normalize(16),
    gap: normalize(8),
  },
  cancelButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: COLORS.ERROR,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
    shadowColor: COLORS.PRIMARY_BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: COLORS.WHITE,
  },
  textAreaContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: COLORS.PRIMARY,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.WHITE,
    textAlignVertical: 'top',
  },
  errorText: {
    color: COLORS.ERROR,
    fontSize: 12,
    marginTop: 4,
  },
});

export default React.memo(DynamicForm);