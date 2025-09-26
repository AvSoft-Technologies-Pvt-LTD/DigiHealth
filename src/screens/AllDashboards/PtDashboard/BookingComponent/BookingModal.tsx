import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Platform } from "react-native";
import AvModal from "../../../../elements/AvModal";
import AvText from "../../../../elements/AvText";
import AvButton from "../../../../elements/AvButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Doctor } from "../../../../constants/data";
import { COLORS } from "../../../../constants/colors";
import { normalize } from "../../../../constants/platform";

interface BookingModalProps {
  isVisible: boolean;
  onClose: () => void;
  selectedDoctor: Doctor | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  showDatePicker: boolean;
  onDateSelect: (event: any, selectedDate?: Date) => void;
  onTimeSelect: (time: string) => void;
  onConfirmBooking: () => void;
  getTimesForDate: (date: Date | null) => Array<{ time: string; isBooked: boolean }>;
  setShowDatePicker: (show: boolean) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  isVisible,
  onClose,
  selectedDoctor,
  selectedDate,
  selectedTime,
  showDatePicker,
  onDateSelect,
  onTimeSelect,
  onConfirmBooking,
  getTimesForDate,
  setShowDatePicker,
}) => {
  return (
    <AvModal isModalVisible={isVisible} setModalVisible={onClose} title="Book Appointment">
      {selectedDoctor && (
        <View style={styles.modalContent}>
          {/* Doctor Details Section */}
          <View style={styles.doctorDetailsContainer}>
            <Image
              source={{ uri: selectedDoctor.image }}
              style={styles.modalDoctorImage}
              resizeMode="cover"
            />
            <View style={styles.doctorDetailsText}>
              <AvText style={styles.modalDoctorName}>{selectedDoctor.name}</AvText>
              <AvText style={styles.modalDoctorSpecialty}>{selectedDoctor.specialty}</AvText>
              {selectedDoctor.hospital && (
                <AvText style={styles.modalDoctorHospital}>{selectedDoctor.hospital}</AvText>
              )}
              <AvText style={styles.modalDoctorFees}>₹{selectedDoctor.fees}</AvText>
            </View>
          </View>

          {/* Date Selection Section */}
          <AvText type="title_3" style={styles.sectionTitle}>
            Select Date
          </AvText>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <AvText style={styles.datePickerText}>
              {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
            </AvText>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={selectedDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              minimumDate={new Date()}
              onChange={onDateSelect}
            />
          )}

          {/* Time Slots Section */}
          {selectedDate && (
            <>
              <AvText type="title_3" style={styles.sectionTitle}>
                Available Time Slots
              </AvText>
              {getTimesForDate(selectedDate).length > 0 ? (
                <View style={styles.timeSlotsContainer}>
                  {getTimesForDate(selectedDate).map((slot, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.timeSlot,
                        selectedTime === slot.time ? styles.selectedTimeSlot : null,
                        slot.isBooked ? styles.bookedTimeSlot : null,
                      ]}
                      onPress={() => !slot.isBooked && onTimeSelect(slot.time)}
                      disabled={slot.isBooked}
                    >
                      <AvText
                        style={[
                          styles.timeSlotText,
                          selectedTime === slot.time ? { color: COLORS.WHITE } : { color: COLORS.BLACK },
                          slot.isBooked ? { color: COLORS.LIGHT_GREY } : {},
                        ]}
                      >
                        {slot.time}
                      </AvText>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <View style={styles.noSlotsContainer}>
                  <AvText style={styles.noSlotsText}>
                    No slots available for this date. Please select a different date.
                  </AvText>
                </View>
              )}
            </>
          )}

          {/* Confirm Button Section */}
          <AvButton
            mode="contained"
            onPress={onConfirmBooking}
            labelStyle={styles.confirmButtonText}
            buttonColor={COLORS.SECONDARY}
            style={styles.confirmButton}
            disabled={!selectedDate || !selectedTime || getTimesForDate(selectedDate).length === 0}
          >
            {getTimesForDate(selectedDate).length === 0
              ? "No Slots Available"
              : !selectedTime
              ? "Select Time Slot"
              : "Confirm Booking"}
          </AvButton>
        </View>
      )}
    </AvModal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    padding: normalize(20),
    backgroundColor: COLORS.WHITE,
    borderTopLeftRadius: normalize(16),
    borderTopRightRadius: normalize(16),
  },
  doctorDetailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: normalize(20),
    padding: normalize(12),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(12),
  },
  modalDoctorImage: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: normalize(35),
    marginRight: normalize(15),
  },
  doctorDetailsText: {
    flex: 1,
  },
  modalDoctorName: {
    fontSize: normalize(16),
    fontWeight: "bold",
    color: COLORS.BLACK,
    marginBottom: normalize(4),
  },
  modalDoctorSpecialty: {
    fontSize: normalize(14),
    color: COLORS.GREY,
    marginBottom: normalize(4),
  },
  modalDoctorHospital: {
    fontSize: normalize(12),
    color: COLORS.SECONDARY,
  },
  modalDoctorFees: {
    fontSize: normalize(14),
    color: COLORS.SECONDARY,
    fontWeight: "bold",
  },
  sectionTitle: {
    marginTop: normalize(16),
    marginBottom: normalize(12),
    color: COLORS.BLACK,
    fontWeight: "600",
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    padding: normalize(12),
  },
  datePickerText: {
    color: COLORS.BLACK,
    fontSize: normalize(14),
  },
  timeSlotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: normalize(8),
  },
  timeSlot: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(8),
    borderRadius: normalize(8),
    borderWidth: 1,
    borderColor: COLORS.SECONDARY,
    backgroundColor: COLORS.WHITE,
  },
  selectedTimeSlot: {
    backgroundColor: COLORS.SECONDARY,
  },
  bookedTimeSlot: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderColor: COLORS.LIGHT_GREY,
  },
  timeSlotText: {
    fontSize: normalize(12),
    textAlign: "center",
  },
  noSlotsContainer: {
    padding: normalize(16),
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: normalize(8),
    marginBottom: normalize(16),
    alignItems: "center",
  },
  noSlotsText: {
    color: COLORS.GREY,
    fontSize: normalize(12),
  },
  confirmButton: {
    marginTop: normalize(16),
    paddingVertical: normalize(4),
    borderRadius: normalize(8),
  },
  confirmButtonText: {
    color: COLORS.WHITE,
    fontSize: normalize(14),
    fontWeight: "bold",
  },
});

export default BookingModal;


