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
  