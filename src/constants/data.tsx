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




// Book an Appoitment


// types.ts
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fees: number;
  location?: string;
  doctorType?: string;
  consultationType?: string;
  hospital?: string;
  image?: string;
  qualification?: string;
  experience?: number;
  availability?: Array<{
    date: string;
    slots: Array<{
      time: string;
      isBooked: boolean;
    }>;
  }>;
}

export interface PostOffice {
  Name: string;
  District: string;
  State: string;
}

export interface PincodeApiResponse {
  Message: string;
  Status: string;
  PostOffice: PostOffice[];
}

export const CITIES_BY_STATE: Record<string, { label: string; value: string }[]> = {
  Maharashtra: [
    { label: "Mumbai", value: "Mumbai" },
    { label: "Pune", value: "Pune" },
    { label: "Nagpur", value: "Nagpur" },
    { label: "Thane", value: "Thane" },
  ],
  Delhi: [
    { label: "New Delhi", value: "New Delhi" },
    { label: "South Delhi", value: "South Delhi" },
    { label: "East Delhi", value: "East Delhi" },
  ],
  Karnataka: [
    { label: "Bangalore", value: "Bangalore" },
    { label: "Mysore", value: "Mysore" },
    { label: "Hubli", value: "Hubli" },
    { label: "Dharwad", value: "Dharwad" },
  ],
  Telangana: [
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Warangal", value: "Warangal" },
  ],
  Gujarat: [
    { label: "Ahmedabad", value: "Ahmedabad" },
    { label: "Surat", value: "Surat" },
  ],
};

export const INDIAN_STATES = [
  { label: "Maharashtra", value: "Maharashtra" },
  { label: "Delhi", value: "Delhi" },
  { label: "Karnataka", value: "Karnataka" },
  { label: "Telangana", value: "Telangana" },
  { label: "Gujarat", value: "Gujarat" },
  { label: "Tamil Nadu", value: "Tamil Nadu" },
  { label: "West Bengal", value: "West Bengal" },
  { label: "Rajasthan", value: "Rajasthan" },
  { label: "Uttar Pradesh", value: "Uttar Pradesh" },
  { label: "Madhya Pradesh", value: "Madhya Pradesh" },
  { label: "Punjab", value: "Punjab" },
  { label: "Haryana", value: "Haryana" },
  { label: "Bihar", value: "Bihar" },
  { label: "Odisha", value: "Odisha" },
  { label: "Kerala", value: "Kerala" },
  { label: "Assam", value: "Assam" },
  { label: "Jharkhand", value: "Jharkhand" },
  { label: "Uttarakhand", value: "Uttarakhand" },
  { label: "Himachal Pradesh", value: "Himachal Pradesh" },
  { label: "Jammu and Kashmir", value: "Jammu and Kashmir" },
  { label: "Goa", value: "Goa" },
  { label: "Tripura", value: "Tripura" },
  { label: "Meghalaya", value: "Meghalaya" },
  { label: "Manipur", value: "Manipur" },
  { label: "Nagaland", value: "Nagaland" },
  { label: "Mizoram", value: "Mizoram" },
  { label: "Arunachal Pradesh", value: "Arunachal Pradesh" },
  { label: "Sikkim", value: "Sikkim" },
  { label: "Andaman and Nicobar Islands", value: "Andaman and Nicobar Islands" },
  { label: "Chandigarh", value: "Chandigarh" },
  { label: "Dadra and Nagar Haveli", value: "Dadra and Nagar Haveli" },
  { label: "Daman and Diu", value: "Daman and Diu" },
  { label: "Lakshadweep", value: "Lakshadweep" },
  { label: "Puducherry", value: "Puducherry" },
];

export const HOSPITALS = [
  { label: "Apollo Hospitals", value: "Apollo Hospitals" },
  { label: "Fortis Healthcare", value: "Fortis Healthcare" },
  { label: "Max Healthcare", value: "Max Healthcare" },
  { label: "Manipal Hospitals", value: "Manipal Hospitals" },
  { label: "Kokilaben Dhirubhai Ambani Hospital", value: "Kokilaben Dhirubhai Ambani Hospital" },
  { label: "KLE Hospital", value: "KLE Hospital" },
  { label: "SDM Medical College", value: "SDM Medical College" },
  { label: "Karnataka Institute of Medical Sciences", value: "Karnataka Institute of Medical Sciences" },
  { label: "City Hospital", value: "City Hospital" },
  { label: "District Hospital", value: "District Hospital" },
  { label: "Apollo Clinic", value: "Apollo Clinic" },
];

export const DOCTOR_PANEL_OPTIONS = [
  { label: "All", value: "All" },
  { label: "Hospital Affiliated", value: "Hospital Affiliated" },
  { label: "Consultant Doctor", value: "Consultant Doctor" },
  { label: "Our Medical Expert", value: "Our Medical Expert" },
];

export const symptomSpecialtyMap: Record<string, string[]> = {
  fever: ["General Physician", "Pediatrics", "Pathology", "Psychiatry", "Oncology"],
  cough: ["General Physician", "Pulmonology", "ENT", "Oncology", "Pathology"],
  chestpain: ["Cardiology", "Pulmonology", "Gastroenterology", "General Medicine", "Orthopedics"],
  acne: ["Dermatology", "Endocrinology", "Psychiatry", "Pathology"],
  skinrash: ["Dermatology", "Pediatrics", "Pathology", "Oncology"],
  headache: ["Neurology", "General Medicine", "Psychiatry", "ENT"],
  stomachache: ["Gastroenterology", "General Medicine", "Pediatrics", "Endocrinology"],
  toothache: ["Dentistry", "Pediatrics", "General Medicine"],
  pregnancy: ["Gynecology", "Pediatrics", "Nephrology"],
  anxiety: ["Psychiatry", "Endocrinology", "General Medicine"],
  bloodinurine: ["Nephrology", "Hematology", "Urology"],
  fatigue: ["General Medicine", "Endocrinology", "Oncology", "Psychiatry"],
  jointpain: ["Orthopedics", "General Medicine", "Endocrinology"],
};




// Ambulance Booking dummy data

// data.ts
export interface SelectItem {
  label: string;
  value: string;
}

export interface EquipmentItem extends SelectItem {
  price: number;
}

export const pickupLocationData: SelectItem[] = [
  { label: "Dharwad Hubballi", value: "dharwad_hubballi" },
  { label: "Bangalore City", value: "bangalore_city" }
];

export const hospitalData: SelectItem[] = [
  { label: "City General Hospital", value: "city_general_hospital" },
  { label: "St. Mary's Clinic", value: "st_marys_clinic" }
];

export const ambulanceTypeData: SelectItem[] = [
  { label: "ICU Ambulance", value: "icu_ambulance" },
  { label: "ALS Ambulance", value: "als_ambulance" }
];

export const categoryData: SelectItem[] = [
  { label: "Cardiology", value: "cardiology" },
  { label: "Emergency", value: "emergency" }
];

export const equipmentData: EquipmentItem[] = [
  { label: "Oxygen Cylinder", value: "oxygen_cylinder", price: 500 },
  { label: "Stretcher", value: "stretcher", price: 300 },
  { label: "First Aid Kit", value: "first_aid_kit", price: 200 },
  { label: "Ventilator", value: "ventilator", price: 1000 },
  { label: "Defibrillator", value: "defibrillator", price: 1500 },
  { label: "ECG Monitor", value: "ecg_monitor", price: 2000 },
  { label: "Suction Machine", value: "suction_machine", price: 1200 },
  { label: "Spinal Board", value: "spinal_board", price: 800 }
];
