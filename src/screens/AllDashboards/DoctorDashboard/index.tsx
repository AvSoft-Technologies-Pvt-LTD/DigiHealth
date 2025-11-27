import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { COLORS } from '../../../constants/colors';
import { AvText, AvIcons } from '../../../elements';
import Header from '../../../components/Header';
import { PAGES } from '../../../constants/pages';
import { normalize } from '../../../constants/platform';
import DoctorDashboardView from './DoctorDashboardView';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { RootState } from '../../../store';
import { fetchDoctorData, DoctorData } from '../../../store/slices/doctorSlice';

const { width } = Dimensions.get('window');

// Mock appointments data - replace with actual API calls
const mockRecentAppointments = [
    {
        id: 1,
        name: 'Sarah',
        lastName: 'Johnson',
        date: '2024-11-26',
        time: '10:00 AM',
        reason: 'Regular Checkup',
        type: 'Physical',
        action: 'Completed'
    },
    {
        id: 2,
        name: 'Mike',
        date: '2024-11-26',
        time: '11:30 AM',
        reason: 'Follow-up',
        type: 'Virtual',
        action: 'Pending'
    },
];

interface DoctorDashboardProps {
    // Add props if needed for navigation or other functionality
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = (props) => {
    const [recentAppointments, setRecentAppointments] = useState(mockRecentAppointments);
    const dispatch = useAppDispatch();
    
    // Get doctor data from Redux
    const { doctorData, loading, error } = useAppSelector((state: RootState) => state.doctor);
    
    // Get user data from Redux
    const userProfile = useAppSelector((state: RootState) => state.user.userProfile);
    const [patientCounts,setPatientCounts] = useState()
    const isAuthenticated = useAppSelector((state: RootState) => state);

    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // Fetch doctor data on component mount
    const patientCountings={
    totalPatients: 2000,
    opdPatients: 1000,
    ipdPatients: 500,
    virtualPatients: 500,
}
    useEffect(() => {
        if (userProfile.doctorId) {
            // Dispatch the async thunk to fetch doctor data
            dispatch(fetchDoctorData(userProfile.doctorId));
            setPatientCounts(patientCountings)
        }
        fetchRecentAppointments();
    }, [userProfile.userId, dispatch]);
    

    const fetchRecentAppointments = async () => {
        try {
            // Replace with actual API call
            // const response = await appointmentService.getRecentAppointments();
            // setRecentAppointments(response.data);
            
            // For now, use mock data
            setRecentAppointments(mockRecentAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const handleViewAllAppointments = () => {
        // Navigate to appointments page
        setSnackbarMessage('Show All Appointments');
        setSnackbarVisible(true);
        console.log('Navigate to all appointments');
        
        // navigation.navigate(PAGES.APPOINTMENTS);
    };

    const handleViewBilling = () => {
        // Navigate to billing page
        setSnackbarVisible(true);
        console.log('Navigate to billing');
        // navigation.navigate(PAGES.BILLING);
    };

    const handleAppointmentAction = (appointmentId: number, action: string) => {
        console.log('Handle appointment action:', appointmentId, action);
        // Handle appointment actions (complete, reschedule, cancel, etc.)
        switch (action) {
            case 'Completed':
                // Mark appointment as completed
                break;
            case 'Pending':
                // Show appointment details
                break;
            default:
                break;
        }
    };

    const handleRefresh = () => {
        if (userProfile.userId) {
            dispatch(fetchDoctorData(userProfile.userId));
        }
        fetchRecentAppointments();
    };

    // Default doctor data if Redux data is not available
    const defaultDoctorData: DoctorData = {
        firstName: 'John',
        lastName: 'Smith',
        specialization: 'Smile Specialist',
        qualification: 'MBBS',
        email: 'dr.johnsmith@hospital.com',
        registrationNumber: 'A12345678',
        totalRevenue: '₹20000',
    };

    // Use Redux data if available, otherwise use default
    const displayDoctorData =  doctorData || defaultDoctorData;
        const onSnackbarDismiss = () => {
            setSnackbarVisible(false);
        };

    // Pass all data and handlers to the view component
    const dashboardProps = {
        loading,
        doctorData: displayDoctorData,
        patientCounts: patientCounts,
        recentAppointments,
        onRefresh: handleRefresh,
        onViewAllAppointments: handleViewAllAppointments,
        onViewBilling: handleViewBilling,
        onAppointmentAction: handleAppointmentAction,
        snackbarVisible,
        snackbarMessage,
        onSnackbarDismiss,
    };


    return (
        <DoctorDashboardView {...dashboardProps} />
    );
};

export default DoctorDashboard;