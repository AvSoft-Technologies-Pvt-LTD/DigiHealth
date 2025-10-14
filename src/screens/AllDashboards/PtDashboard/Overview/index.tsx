import React from "react";
import PersonalHealthModal from "./PersonalHealthModal";
import FamilyModal from "./FamilyModal";
import AdditionalDetailsModal from "./AdditionanlDetailsModal"; // New import

type ModalNames = "personalHealth" | "family" | "additionalDetails";
type PatientModalsProps = {
  modalVisible: {
    personalHealth: boolean;
    family: boolean;
    additionalDetails: boolean;
  };
  closeModal: (modalName: ModalNames) => void;
  handleSave: (section: ModalNames) => void;
  formData: any;
  handleInputChange: (field: string, value: string | boolean | Date) => void;
  handleToggleChange: (field: string) => void;
  dispatch: any;
};

const PatientModals: React.FC<PatientModalsProps> = ({
  modalVisible,
  closeModal,
  handleSave,
  formData,
  handleInputChange,
  handleToggleChange,
  dispatch,
}) => {
  return (
    <>
      <PersonalHealthModal
        modalVisible={modalVisible.personalHealth}
        closeModal={() => closeModal("personalHealth")}
        formData={formData}
        handleInputChange={handleInputChange}
        handleToggleChange={handleToggleChange}
      />

      <FamilyModal
        modalVisible={modalVisible.family}
        closeModal={() => closeModal("family")}
        dispatch={dispatch}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSave={() => handleSave("family")}
      />

      <AdditionalDetailsModal
        modalVisible={modalVisible.additionalDetails}
        closeModal={() => closeModal("additionalDetails")}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSave={() => handleSave("additionalDetails")}
      />
    </>
  );
};

export default PatientModals;
