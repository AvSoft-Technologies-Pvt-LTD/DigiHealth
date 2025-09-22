import PatientDashboardView from "../screens/AllDashboards/PtDashboard/Overview/PatientDashboardView";

export const PAGES = {
    HOME: "Home",
    SPLASH: "Splash",
    LOGIN: "Login",
    DRAWER: "Drawer",
    REGISTER: "Register",
    PATIENT_REGISTER: "Patient Register",
    HOSPITAL_REGISTER: "Hospital Register",
    DOCTOR_REGISTER: "Doctor Register",
    LABS_SCAN_REGISTER: "Labs Scan Register",
    DASHBOARD: "Dashboard",
    PATIENT_DASHBOARD:"Patient Dashboard",
    PATIENT_SETTINGS:"Patient Settings",
    PATIENT_HEALTHCARD:"Health Card",
    PATIENT_APPOINTMENTS:"Appointments",
    PATIENT_OVERVIEW:"PatientDashboardView",
    LAB_BOOKING:"LabBookingView",
    AMBULANCE_BOOKING_VIEW:"AmbulanceBookingView",
    PHARMACY_FINDER_VIEW:"PharmacyFinderView",
    NOTIFICATION_SCREEN:"NotificationsScreen",
    BOOKING_APPOITMENT:"BookAppoitment",
    BILLING:"Billing",

    // Lab Pages
    LAB_HOME:"Lab Home",
    LAB_CART:"Lab Cart",
    LAB_BOOK:"Lab Booking"
} as const;