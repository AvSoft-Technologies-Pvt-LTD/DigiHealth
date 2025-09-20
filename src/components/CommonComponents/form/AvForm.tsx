import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';
import FormField, { FieldType } from '../form/FormField';

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
  onCancel: () => void;
  headerTitle?: string;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ fields, onSubmit, onCancel, headerTitle }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showDatePicker, setShowDatePicker] = useState<{ [key: string]: boolean }>({});
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});
  const [expandedSelect, setExpandedSelect] = useState<{ [key: string]: boolean }>({});

  const handleChange = (name: string, value: any) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateField = (name: string, value: any, field: FormField) => {
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

  const handleFileUpload = async (name: string, multiple: boolean = false) => {
    try {
      const options: any = {
        mediaType: 'photo',
        includeBase64: false,
        selectionLimit: multiple ? 0 : 1,
      };
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
          Alert.alert('Error', 'Failed to pick image');
        } else if (response.assets) {
          const files = response.assets.map((asset) => asset.uri!);
          handleChange(name, multiple ? files : files[0]);
        }
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const toggleShowPassword = (name: string) => {
    setShowPassword({ ...showPassword, [name]: !showPassword[name] });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{headerTitle || 'Form'}</Text>
      </View>
      <ScrollView style={styles.formContainer} contentContainerStyle={styles.scrollContent}>
        {fields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            error={errors[field.name]}
            onChange={handleChange}
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
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Icon name="close" size={20} color="#DC2626" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Icon name="check" size={20} color="#FFFFFF" />
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
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerText: {
    color: COLORS.WHITE,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    backgroundColor: COLORS.WHITE,
    borderTopWidth: 1,
    borderTopColor: COLORS.NAVBAR_DIVIDER,
    gap: 12,
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
    paddingVertical: 16,
    gap: 8,
  },
  cancelButtonText: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.WHITE,
  },
});

export default DynamicForm;