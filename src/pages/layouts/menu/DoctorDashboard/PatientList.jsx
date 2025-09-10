//Patientlist
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
// Import API functions
import {
  getGenders,
  getBloodGroups,
  getSpecializationsByPracticeType,
  getAllHospitals,
} from "../../../../utils/masterService";
// Import tab components
import OpdTab from "./OPDTab";
import IpdTab from "./IPDTab";
import VirtualTab from "./VirtualTab";

const PatientList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [activeTab, setActiveTab] = useState("OPD");
  const [doctorName, setDoctorName] = useState("");
  const [tabActions, setTabActions] = useState([]);

  // Master data state
  const [masterData, setMasterData] = useState({
    genders: [],
    bloodGroups: [],
    departments: [],
    hospitals: [],
    loading: true,
  });

  // Load master data
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setMasterData((prev) => ({ ...prev, loading: true }));
        const [gendersRes, bloodGroupsRes, hospitalsRes] =
          await Promise.allSettled([
            getGenders(),
            getBloodGroups(),
            getAllHospitals(),
          ]);
        // Process results
        const genders =
          gendersRes.status === "fulfilled"
            ? gendersRes.value.data.map((g) => ({
                value: g.genderName || g.name,
                label: g.genderName || g.name,
              }))
            : [
                { value: "Female", label: "Female" },
                { value: "Male", label: "Male" },
                { value: "Other", label: "Other" },
              ];
        const bloodGroups =
          bloodGroupsRes.status === "fulfilled"
            ? bloodGroupsRes.value.data.map((bg) => ({
                value: bg.bloodGroupName || bg.name,
                label: bg.bloodGroupName || bg.name,
              }))
            : [
                { value: "A+", label: "A+" },
                { value: "B+", label: "B+" },
                { value: "O+", label: "O+" },
                { value: "AB+", label: "AB+" },
              ];
        const hospitals =
          hospitalsRes.status === "fulfilled" ? hospitalsRes.value.data : [];
        // Try to get departments from practice types/specializations
        let departments = [];
        try {
          const specializationsRes = await getSpecializationsByPracticeType(1);
          departments = specializationsRes.data.map((spec) => ({
            value: spec.specializationName || spec.name,
            label: spec.specializationName || spec.name,
          }));
        } catch (error) {
          departments = [
            { value: "General Medicine", label: "General Medicine" },
            { value: "Surgery", label: "Surgery" },
            { value: "Cardiology", label: "Cardiology" },
            { value: "Orthopedics", label: "Orthopedics" },
            { value: "Pediatrics", label: "Pediatrics" },
            { value: "Gynecology", label: "Gynecology" },
          ];
        }
        setMasterData({
          genders,
          bloodGroups,
          departments,
          hospitals,
          loading: false,
        });
      } catch (error) {
        console.error("Error loading master data:", error);
        // Set fallback data
        setMasterData({
          genders: [
            { value: "Female", label: "Female" },
            { value: "Male", label: "Male" },
            { value: "Other", label: "Other" },
          ],
          bloodGroups: [
            { value: "A+", label: "A+" },
            { value: "B+", label: "B+" },
            { value: "O+", label: "O+" },
            { value: "AB+", label: "AB+" },
          ],
          departments: [
            { value: "General Medicine", label: "General Medicine" },
            { value: "Surgery", label: "Surgery" },
            { value: "Cardiology", label: "Cardiology" },
            { value: "Orthopedics", label: "Orthopedics" },
            { value: "Pediatrics", label: "Pediatrics" },
            { value: "Gynecology", label: "Gynecology" },
          ],
          hospitals: [],
          loading: false,
        });
        toast.error("Some master data failed to load, using defaults");
      }
    };
    loadMasterData();
  }, []);

  // Fetch doctor name
  useEffect(() => {
    const fetchDoctorName = async () => {
      if (!user?.email) {
        console.error("No user email found in Redux");
        return;
      }
      try {
        const API_USERS =
          "https://6801242781c7e9fbcc41aacf.mockapi.io/api/AV1/users";
        const res = await fetch(
          `${API_USERS}?email=${encodeURIComponent(user.email)}`
        );
        const users = await res.json();
        if (users.length === 0) {
          throw new Error("No user found with the provided email");
        }
        const doctor = users[0];
        const fullName = `${doctor.firstName} ${doctor.lastName}`.trim();
        const formattedDoctorName = `Dr. ${fullName}`;
        setDoctorName(formattedDoctorName);
      } catch (error) {
        console.error("Error fetching doctor name:", error);
        toast.error("Failed to fetch doctor name, using default.");
      }
    };
    fetchDoctorName();
  }, [user]);

  // Handle tab change from URL
  useEffect(() => {
    const tabFromUrl = new URLSearchParams(location.search).get("tab");
    const tabFromState = location.state?.tab;
    const autoNavigated = location.state?.autoNavigated;
    if (autoNavigated && tabFromState) {
      setActiveTab(tabFromState);
    } else if (tabFromUrl) {
      setActiveTab(tabFromUrl.charAt(0).toUpperCase() + tabFromUrl.slice(1));
    }
  }, [location.search, location.state]);

  // Tab change handler
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    navigate(`/doctordashboard/patients?tab=${tabValue}`);
  };

  // Show loading state while master data is loading
  if (masterData.loading) {
    return (
      <div className="p-4 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading master data...</span>
        </div>
      </div>
    );
  }

  // Render active tab
  const renderActiveTab = () => {
    const commonProps = {
      doctorName,
      masterData,
      location,
      setTabActions, // Pass setTabActions to child components
    };
    switch (activeTab) {
      case "OPD":
        return <OpdTab {...commonProps} />;
      case "IPD":
        return <IpdTab {...commonProps} />;
      case "Virtual":
        return <VirtualTab {...commonProps} />;
      default:
        return <OpdTab {...commonProps} />;
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-2">
      {/* Tab Navigation */}
      <div className="flex items-center mb-1 justify-between w-full">
        <div className="flex gap-4">
          {["OPD", "IPD", "Virtual"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`relative cursor-pointer flex items-center gap-1 px-4 font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? "text-[var(--primary-color)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[var(--primary-color)]"
                  : "text-gray-500 hover:text-[var(--accent-color)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {tabActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={action.className}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
      {/* Render Active Tab */}
      {renderActiveTab()}
    </div>
  );
};

export default PatientList;