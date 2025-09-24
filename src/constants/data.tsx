// Home Dyummy Data
export interface StatItem {
  id: string;
  value: number;
  label: string;
  suffix: string;
}

export const stats: StatItem[] = [
  { id: '1', value: 500, label: 'Expert Doctors', suffix: '+' },
  { id: '2', value: 25000, label: 'Happy Patients', suffix: '+' },
  { id: '3', value: 1000, label: 'Lab Tests', suffix: '+' },
  { id: '4', value: 50, label: 'Medical Centers', suffix: '+' },
];


export interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}
  
export const features: Feature[] = [
    { id: '1', title: 'Consult Doctor', description: 'Talk to top specialists', icon: 'stethoscope' },
    { id: '2', title: 'Medical Records', description: 'Track securely', icon: 'file-document' },
    { id: '3', title: 'Book Lab/Scans', description: 'Book tests easily', icon: 'microscope' },
    { id: '4', title: 'Online Shopping', description: 'Eletronic Medical Record', icon: 'medical-bag' },
];
  
export interface Benefit {
    id: string;
    text: string;
  }
  
export const benefits: Benefit[] = [
    { id: '1', text: 'Secure & Trusted' },
    { id: '2', text: 'Seamless Access' },
    { id: '3', text: 'AI-Driven Insights' },
    { id: '4', text: 'Exclusive Benefits' },
];
  // data.tsx
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: string;
  period: string;
  color: string;
  icon: string;
  isPopular?: boolean;
  benefits: string[];
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: "₹299",
    period: "/month",
    color: "#225993ff",
    icon: "shield-outline",
    benefits: [
      "Basic health card",
      "QR code access",
      "Emergency contacts",
      "Basic medical history",
    ],
  },
  {
    id: "silver",
    name: "Silver",
    price: "₹599",
    period: "/month",
    color: "#666668ff",
    icon: "star-outline",
    benefits: [
      "Enhanced health card design",
      "Priority medical support",
      "Detailed health analytics",
      "Family member cards",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    price: "₹999",
    period: "/month",
    color: "#ffa600ff",
    icon: "crown",
    isPopular: true,
    benefits: [
      "Premium gold card design",
      "24/7 health concierge",
      "Advanced health monitoring",
      "Specialist consultations",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "₹1,499",
    period: "/month",
    color: "#9B59B6",
    icon: "lightning-bolt",
    benefits: [
      "Exclusive platinum card",
      "Personal health manager",
      "AI-powered health insights",
      "Global medical coverage",
    ],
  },
];
// data.ts
export interface DoctorAppointment {
  recordId: string;
  doctorName: string;
  specialty: string;
  time: string;
  date: string;
  status: 'Rejected' | 'Confirmed' | 'Pending';
  reason?: string;
  isHidden: boolean;
}

export interface LabAppointment {
  recordId: string;
  testName: string;
  labName: string;
  status: 'Paid' | 'Pending' | 'Cancelled';
  isHidden: boolean;
}

export interface FilterOption {
  id: string;
  displayName: string;
}

export interface Tab {
  key: string;
  label: string;
}

// Doctor Appointments Data
export const DoctorAppointmentsData: DoctorAppointment[] = [
  {
    recordId: 'APT123',
    doctorName: 'Dr. Kavya Patil',
    specialty: 'Cardiology',
    time: '09:30 AM',
    date: '2025-09-09',
    status: 'Rejected',
    reason: 'Conflict',
    isHidden: false,
  },
  {
    recordId: 'APT456',
    doctorName: 'Dr. Kavya Patil',
    specialty: 'Cardiology',
    time: '01:00 PM',
    date: '2025-09-10',
    status: 'Confirmed',
    isHidden: false,
  },
];

// Lab Appointments Data
export const LabAppointmentsData: LabAppointment[] = [
  {
    recordId: 'APTI47557',
    testName: "Women's Health Package",
    labName: 'HealthPlus Diagnostics',
    status: 'Paid',
    isHidden: false,
  },
  {
    recordId: 'APT050970',
    testName: 'Complete Blood Count (CBC), Blood Sugar Fasting',
    labName: 'HealthPlus Diagnostics',
    status: 'Paid',
    isHidden: false,
  },
  {
    recordId: 'APT906602',
    testName: 'Complete Blood Count (CBC)',
    labName: 'HealthPlus Diagnostics',
    status: 'Paid',
    isHidden: false,
  },
  {
    recordId: 'APT970490',
    testName: 'Thyroid Profile',
    labName: 'HealthPlus Diagnostics',
    status: 'Paid',
    isHidden: false,
  },
  {
    recordId: 'APT906606',
    testName: 'Complete Blood Count (CBC)',
    labName: 'HealthPlus Diagnostics',
    status: 'Paid',
    isHidden: false,
  },
  {
    recordId: 'APT970491',
    testName: 'Thyroid Profile',
    labName: 'HealthPlus Diagnostics',
    status: 'Paid',
    isHidden: false,
  },
];

// Filter Options
export const FilterOptions: FilterOption[] = [
  { id: 'upcoming', displayName: 'Upcoming' },
  { id: 'past', displayName: 'Past' },
  { id: 'rejected', displayName: 'Rejected' },
  { id: 'confirmed', displayName: 'Confirmed' },
];

// Tabs
export const AppointmentTabs: Tab[] = [
  { key: 'doctor', label: 'Doctor Appointments' },
  { key: 'lab', label: 'Lab Appointments' },
];

// Billing Data// Billing Data
export interface DataRecord {
  recordId: string;
  isHidden: boolean;
  patientName: string;
  service: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
}
const billingData: DataRecord[] = [
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
];
export default billingData;
