// PatientList.jsx
import React, { useState, useEffect, useRef } from "react";
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
  // This can be updated by child (via setTabActions) or parent (parentTabActions)
  const [tabActions, setTabActions] = useState([]);

  // Refs for tab components
  const opdTabRef = useRef();
  const ipdTabRef = useRef();
  const virtualTabRef = useRef();

  // Master data state
  const [masterData, setMasterData] = useState({
    genders: [],
    bloodGroups: [],
    departments: [],
    hospitals: [],
    loading: true,
  });

  // Build tabs array to pass to children / DynamicTable
  const tabs = [
    { label: "OPD", value: "OPD" },
    { label: "IPD", value: "IPD" },
    { label: "Virtual", value: "Virtual" },
  ];

  // Parent-level tab action that triggers child's modal via ref
  const parentTabActions = [
    {
      label: "Add Patient",
      onClick: () => {
        if (activeTab === "OPD") opdTabRef.current?.openAddPatientModal();
        else if (activeTab === "IPD") ipdTabRef.current?.openAddPatientModal();
        else if (activeTab === "Virtual") virtualTabRef.current?.openScheduleConsultationModal();
      },
      className: "btn btn-primary",
    },
  ];

  // Load master data
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        setMasterData((prev) => ({ ...prev, loading: true }));
        const [gendersRes, bloodGroupsRes, hospitalsRes] = await Promise.allSettled([
          getGenders(),
          getBloodGroups(),
          getAllHospitals(),
        ]);
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

  // Tab change handler (used as onTabChange passed to child)
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

  // Render active tab component with tabs & actions passed in
  const renderActiveTab = () => {
    const commonProps = {
      doctorName,
      masterData,
      location,
      setTabActions, // let child update parent tabActions if desired
      tabActions, // current parent tabActions value
    };

    const sharedTabProps = {
      tabs,
      tabActions: tabActions.length ? tabActions : parentTabActions,
      activeTab,
      onTabChange: handleTabChange,
    };

    switch (activeTab) {
      case "OPD":
        return <OpdTab ref={opdTabRef} {...commonProps} {...sharedTabProps} />;
      case "IPD":
        return <IpdTab ref={ipdTabRef} {...commonProps} {...sharedTabProps} />;
      case "Virtual":
        return <VirtualTab ref={virtualTabRef} {...commonProps} {...sharedTabProps} />;
      default:
        return <OpdTab ref={opdTabRef} {...commonProps} {...sharedTabProps} />;
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-2">
      {/* Compact Header: We removed the old tab nav UI (DynamicTable will render tabs).
          Keep title / optional desktop add button. */}
      {/* <div className="flex items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-semibold">Patients</h3>
        <div className="hidden lg:flex gap-3">
          <button
            onClick={() => parentTabActions[0].onClick()}
            className="btn btn-secondary"
          >
            Add Patient
          </button>
        </div>
      </div> */}

      {/* Render Active Tab */}
      <div className="mb-16 lg:mb-4">{renderActiveTab()}</div>

      {/* Action Buttons (Fixed at bottom in tablet and mobile view) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl backdrop-blur-sm z-30">
        <div className="flex gap-3 w-full mx-auto">
          <button
            onClick={() => parentTabActions[0].onClick()}
            className="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 shadow-md bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)] text-white hover:from-[var(--primary-color)] hover:to-[var(--primary-color)] shadow-lg hover:shadow-xl border-2 border-[var(--primary-color)]"
          >
            Add Patient
          </button>
        </div>
      </div>

      {/* Tab Actions for Mobile/Tablet View (if any provided by child via setTabActions) */}
      {tabActions.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl backdrop-blur-sm z-30">
          <div className="flex gap-3 w-full mx-auto">
            {tabActions.map((action, index) => (
              <button
                key={typeof action.label === "string" ? action.label : index}
                onClick={action.onClick}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 shadow-md ${
                  index === 0
                    ? "bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)] text-white hover:from-[var(--primary-color)] hover:to-[var(--primary-color)] shadow-lg hover:shadow-xl border-2 border-[var(--primary-color)]"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300 hover:border-gray-400"
                } ${action.className || ""}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
