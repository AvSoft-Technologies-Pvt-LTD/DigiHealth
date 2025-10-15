// Auth Screens
import Login from './Auth/Login';
import Register from './Auth/Register';
import PatientRegister from './Auth/PatientRegister';
import DoctorRegister from './Auth/DoctorRegister';

// Main Screens
import Home from './App/Home';
import SplashScreen from './SplashScreen';
import PatientDashboard from './AllDashboards/PtDashboard/Overview/PtDashboard';
import PatientSetting from './AllDashboards/PtDashboard/PtSetting';
import Appointments from './AllDashboards/PtDashboard/Appointments';
import PatientDashboardView from './AllDashboards/PtDashboard/Overview/PatientDashboardView';
import LabBookingView from './AllDashboards/PtDashboard/LabBooking/LabBookingView';
import AmbulanceBookingView from './AllDashboards/PtDashboard/Ambulance/AmbulanceBooking';
import PharmacyFinderView from "./AllDashboards/PtDashboard/PharmacyFinderView";
import Billing from './AllDashboards/PtDashboard/Billing';
import PaymentGateway from '../elements/AvPayment';
import ViewAllDoctor from './AllDashboards/PtDashboard/BookingComponent/ViewAllDoctor';
import PaymentPage from './AllDashboards/PtDashboard/PaymentPage';
import SearchAmbulanceView from './AllDashboards/PtDashboard/Ambulance/SearchAmbulanceView';
import PaymentScreen from './AllDashboards/PtDashboard/Ambulance/PaymentScreen';
import InvoiceDetails from './AllDashboards/PtDashboard/Invoice/InvoiceComponent';
import InvoicePrintPreview from './AllDashboards/PtDashboard/Invoice/InvoicePrintPreview';
import DrBookAppointmentComponent from './AllDashboards/PtDashboard/BookingComponent/DrBookAppointmentComponent';
import ForgotPassword from '../components/CommonComponents/form/ForgotPassword';
import VerifyOTP from '../components/CommonComponents/form/VerifyOTP';
import ResetPassword from '../components/CommonComponents/form/ResetPassword';

import PasswordResetPage from './Auth/PasswordReset/PasswordResetPage';
import MedicalRecordsPreview from './AllDashboards/PtDashboard/MedicalRecord/secondOpinion'
import MedicalRecordScreen from './AllDashboards/PtDashboard/MedicalRecord/ptMedicalRecord'
import MedicalRecordDetails from './AllDashboards/PtDashboard/MedicalRecord/medicalRecordDetails';
export {
  // Auth
  Login,
  Register,
  PatientRegister,
  DoctorRegister,
  ForgotPassword,
  VerifyOTP,
  ResetPassword,
  PasswordResetPage,
  // Main
  Home,
  SplashScreen,
  PatientDashboardView,
  PatientDashboard,
  PatientSetting,
  Appointments,
  LabBookingView,
  AmbulanceBookingView,
  PharmacyFinderView,
  PaymentGateway,
  Billing,
  DrBookAppointmentComponent,
  MedicalRecordDetails,
  MedicalRecordsPreview,
  MedicalRecordScreen,
  ViewAllDoctor,
  PaymentPage,
  SearchAmbulanceView,
  PaymentScreen,
  InvoiceDetails,
  InvoicePrintPreview,
};
