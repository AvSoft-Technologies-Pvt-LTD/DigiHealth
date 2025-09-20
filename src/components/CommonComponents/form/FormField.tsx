import React from 'react';
import { View, TouchableOpacity, Switch, Platform, StyleSheet,TextInput } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../constants/colors';
import AvText from "../../../elements/AvText";
import AvTextInput from "../../../elements/AvTextInput";
import { AvSelect } from '../../../elements/AvSelect';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'password'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'date'
  | 'file'
  | 'email'
  | 'phone'
  | 'number'
  | 'toggle';

interface FormFieldProps {
  field: {
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
  };
  value: any;
  error: string | undefined;
  onChange: (name: string, value: any) => void;
  showPassword: boolean;
  toggleShowPassword: (name: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (fieldName: string, show: boolean) => void;
  currentField: string | null;
  setCurrentField: (fieldName: string) => void;
  expandedSelect: boolean;
  setExpandedSelect: (fieldName: string, expanded: boolean) => void;
  handleFileUpload: (name: string, multiple?: boolean) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  field,
  value,
  error,
  onChange,
  showPassword,
  toggleShowPassword,
  showDatePicker,
  setShowDatePicker,
  setCurrentField,
  handleFileUpload,
}) => {

  const getFieldIcon = (type: FieldType) => {
    switch (type) {
      case 'email':
        return 'mail';
      case 'phone':
        return 'phone';
      case 'number':
        return 'tag';
      case 'password':
        return 'lock';
      case 'text':
        return 'person';
      case 'textarea':
        return 'description';
      case 'file':
        return 'image';
      case 'date':
        return 'calendar-today';
      default:
        return 'person';
    }
  };

  const renderField = () => {
    const hasError = Boolean(error);
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
        return (
          <View style={styles.fieldContainer}>
            <AvTextInput
              label={field.label}
              value={value?.toString()}
              onChangeText={(text) => onChange(field.name, text)}
              placeholder={field.placeholder}
              mode="outlined"
              keyboardType={
                field.type === 'email'
                  ? 'email-address'
                  : field.type === 'phone'
                    ? 'phone-pad'
                    : field.type === 'number'
                      ? 'numeric'
                      : 'default'
              }
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: hasError ? COLORS.ERROR : COLORS.LIGHT_GREY,
                }
              }}
              style={styles.input}
            />
            {field.helperText && !error && <AvText type="caption" style={styles.helperText}>{field.helperText}</AvText>}
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'password':
        return (
          <View style={styles.fieldContainer}>
            <AvTextInput
              label={field.label}
              value={value}
              onChangeText={(text) => onChange(field.name, text)}
              placeholder={field.placeholder}
              mode="outlined"
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye" : "eye-off"}
                  onPress={() => toggleShowPassword(field.name)}
                />
              }
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: hasError ? COLORS.ERROR : COLORS.LIGHT_GREY,
                }
              }}
              style={styles.input}
            />
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'textarea':
        return (
          <View style={styles.fieldContainer}>
            <AvTextInput
              label={field.label}
              value={value}
              onChangeText={(text) => onChange(field.name, text)}
              placeholder={field.placeholder}
              mode="outlined"
              multiline={true}
              numberOfLines={4}
              theme={{
                colors: {
                  primary: COLORS.SECONDARY,
                  outline: hasError ? COLORS.ERROR : COLORS.LIGHT_GREY,
                }
              }}
              style={[styles.input, styles.textarea]}
            />
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'checkbox':
        return (
          <View style={styles.fieldContainer}>
            <AvText type="body" style={styles.label}>
              {field.label}
              {field.required && <AvText type="body" style={styles.required}> *</AvText>}
            </AvText>
            <View style={styles.optionsContainer}>
              {field.options?.map((option) => {
                const isSelected = (value || []).includes(option.value);
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.checkboxItem, isSelected && styles.checkboxSelected]}
                    onPress={() => {
                      const newValue = isSelected
                        ? (value || []).filter((v: string) => v !== option.value)
                        : [...(value || []), option.value];
                      onChange(field.name, newValue);
                    }}
                  >
                    <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                      {isSelected && <Icon name="check" size={20} color="#FFFFFF" />}
                    </View>
                    <AvText type="body" style={styles.checkboxLabel}>{option.label}</AvText>
                  </TouchableOpacity>
                );
              })}
            </View>
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'radio':
        return (
          <View style={styles.fieldContainer}>
            <AvText type="body" style={styles.label}>
              {field.label}
              {field.required && <AvText type="body" style={styles.required}> *</AvText>}
            </AvText>
            <View style={styles.optionsContainer}>
              {field.options?.map((option) => {
                const isSelected = value === option.value;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.radioItem, isSelected && styles.radioSelected]}
                    onPress={() => onChange(field.name, option.value)}
                  >
                    <View style={[styles.radio, isSelected && styles.radioChecked]}>
                      {isSelected && <View style={styles.radioDot} />}
                    </View>
                    <AvText type="body" style={styles.radioLabel}>{option.label}</AvText>
                  </TouchableOpacity>
                );
              })}
            </View>
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'select':
        return (
          <View style={styles.fieldContainer}>
            <AvText type="body" style={styles.label}>
              {field.label}
              {field.required && <AvText type="body" style={styles.required}> *</AvText>}
            </AvText>
            <AvSelect
              items={field.options || []}
              selectedValue={value}
              onValueChange={(selectedValue) => onChange(field.name, selectedValue)}
              placeholder={field.placeholder || 'Select an option'}
              error={Boolean(error)}
              errorText={error}
            />
          </View>
        );
      case 'date':
        return (
          <View style={styles.fieldContainer}>
            <AvText type="body" style={styles.label}>
              {field.label}
              {field.required && <AvText type="body" style={styles.required}> *</AvText>}
            </AvText>
            <TouchableOpacity
              style={[styles.dateInputContainer, hasError && styles.inputError]}
              onPress={() => {
                setCurrentField(field.name);
                setShowDatePicker(field.name, true);
              }}
            >
              <Icon name="calendar-today" size={20} color={hasError ? COLORS.ERROR : COLORS.GREY} style={styles.dateInputIcon} />
              <AvTextInput
                value={value ? new Date(value).toLocaleDateString() : ''}
                placeholder={field.placeholder || 'Select date'}
                mode="flat"
                editable={false}
                style={styles.dateInput}
                theme={{
                  colors: {
                    primary: COLORS.SECONDARY,
                    background: COLORS.WHITE,
                  }
                }}
              />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    onChange(field.name, selectedDate);
                  }
                  setShowDatePicker(field.name, false);
                }}
              />
            )}
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'file':
        return (
          <View style={styles.fieldContainer}>
            <AvText type="body" style={styles.label}>
              {field.label}
              {field.required && <AvText type="body" style={styles.required}> *</AvText>}
            </AvText>
            <TouchableOpacity style={styles.uploadButton} onPress={() => handleFileUpload(field.name, field.multiple)}>
              <Icon name="cloud-upload" size={20} color={COLORS.SECONDARY} />
              <AvText type="body" style={styles.uploadText}>{field.multiple ? 'Upload Files' : 'Upload File'}</AvText>
            </TouchableOpacity>
            {value && (
              <View style={styles.filePreview}>
                {Array.isArray(value) ? (
                  value.map((uri: string, index: number) => (
                    <View key={index} style={styles.fileItem}>
                      <Icon name="image" size={20} color="#666" />
                      <AvText type="body" style={styles.fileName}>File {index + 1}</AvText>
                    </View>
                  ))
                ) : (
                  <View style={styles.fileItem}>
                    <Icon name="image" size={20} color="#666" />
                    <AvText type="body" style={styles.fileName}>File selected</AvText>
                  </View>
                )}
              </View>
            )}
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      case 'toggle':
        return (
          <View style={styles.fieldContainer}>
            <View style={styles.toggleContainer}>
              <View style={styles.toggleLeft}>
                <AvText type="body" style={styles.label}>
                  {field.label}
                  {field.required && <AvText type="body" style={styles.required}> *</AvText>}
                </AvText>
                {field.helperText && <AvText type="caption" style={styles.helperText}>{field.helperText}</AvText>}
              </View>
              <Switch
                value={value}
                onValueChange={(newValue) => onChange(field.name, newValue)}
                trackColor={{
                  false: COLORS.LIGHT_GREY,
                  true: COLORS.SECONDARY,
                }}
                thumbColor={COLORS.WHITE}
              />
            </View>
            {error && <AvText type="caption" style={styles.errorText}>{error}</AvText>}
          </View>
        );
      default:
        return null;
    }
  };

  return <>{renderField()}</>;
};

const styles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 14,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.PRIMARY_TXT,
    marginBottom: 2,
    lineHeight: 22,
  },
  required: {
    color: COLORS.ERROR,
    fontWeight: '400',
  },
  input: {
    marginBottom: 2,
    backgroundColor: COLORS.WHITE,
    borderRadius: 30,
  },
  textarea: {
    minHeight: 100,
  },
  helperText: {
    fontSize: 14,
    color: COLORS.GREY,
    marginTop: 4,
    lineHeight: 18,
  },
  errorText: {
    fontSize: 14,
    color: COLORS.ERROR,
    marginTop: 4,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 8,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  checkboxSelected: {
    borderColor: COLORS.GREY,
    backgroundColor: COLORS.WHITE,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkboxChecked: {
    backgroundColor: COLORS.SECONDARY,
    borderColor: COLORS.WHITE,
  },
  checkboxLabel: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
    flex: 1,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  radioSelected: {
    borderColor: COLORS.GREY,
    backgroundColor: COLORS.BG_OFF_WHITE,
  },
  radio: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioChecked: {
    borderColor: COLORS.SECONDARY,
  },
  radioDot: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.SECONDARY,
    borderRadius: 6,
  },
  radioLabel: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
    flex: 1,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 4,
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: COLORS.ERROR,
  },
  dateInputIcon: {
    marginRight: 8,
  },
  dateInput: {
    flex: 1,
    paddingVertical: 0,
    backgroundColor: COLORS.WHITE,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TXT,
    flex: 1,
    paddingVertical: 12,
  },
  placeholder: {
    color: COLORS.GREY,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.WHITE,
    borderWidth: 2,
    borderColor: COLORS.LIGHT_GREY,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    gap: 8,
  },
  uploadText: {
    fontSize: 16,
    color: COLORS.PRIMARY,
    fontWeight: '600',
  },
  filePreview: {
    marginTop: 12,
    gap: 8,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.BG_OFF_WHITE,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  fileName: {
    fontSize: 14,
    color: COLORS.PRIMARY_TXT,
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    backgroundColor: COLORS.WHITE,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: 12,
    shadowColor: COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleLeft: {
    flex: 1,
    marginRight: 16,
  },
});

export default FormField;