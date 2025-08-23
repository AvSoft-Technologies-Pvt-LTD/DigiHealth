//Quick
import React, { useState } from "react";
import { ChevronRight, X, Grid3X3 } from "lucide-react";
import {
  BadgeCheck,
  Stethoscope,
  LogOut,
  Settings,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const QuickLinksPanel = ({ setActiveForm, patient: propPatient, onToggle }) => {
  const location = useLocation();
  const patient =
    location.state?.patient ||
    propPatient || {
      name: "Unknown Patient",
      email: "unknown@example.com",
      phone: "N/A",
      age: "N/A",
      gender: "N/A",
      diagnosis: "N/A",
      type: "IPD",
    };
  const isIPDPatient = patient?.type?.toLowerCase() === "ipd";
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const navigate = useNavigate();

  const handleOpen = () => {
    setIsOpen(true);
    if (onToggle) onToggle(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (onToggle) onToggle(false);
  };

  const links = [
    ...(isIPDPatient
      ? [
          {
            name: "Gate Pass",
            icon: BadgeCheck,
            color: "text-green-600",
            bgColor: "bg-green-50",
            hoverBgColor: "hover:bg-green-100",
          },
        ]
      : []),
    {
      name: "Nursing & Treatment",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      hoverBgColor: "hover:bg-blue-100",
    },
    ...(isIPDPatient
      ? [
          {
            name: "Discharge",
            icon: LogOut,
            color: "text-red-600",
            bgColor: "bg-red-50",
            hoverBgColor: "hover:bg-red-100",
          },
        ]
      : []),
    // {
    //   name: "Edit Profile",
    //   icon: Settings,
    //   color: "text-gray-600",
    //   bgColor: "bg-gray-50",
    //   hoverBgColor: "hover:bg-gray-100",
    // },
  ];

  const handleLinkClick = (link) => {
    setSelectedLink(link.name);
    if (link.name === "Nursing & Treatment") {
      navigate("Nursing-and-treatment", { state: { patient } });
      handleClose();
      return;
    }
    if (link.name === "Edit Profile") {
      navigate("/doctordashboard/settings");
      handleClose();
      return;
    }
    if (link.name === "Gate Pass") {
      navigate("/doctordashboard/form/Gate-pass", { state: { patient } });
      handleClose();
      return;
    }
    if (link.name === "Discharge") {
      navigate("/doctordashboard/form/Discharge-modal", { state: { patient } });
      handleClose();
      return;
    }
  };

  return (
    <>
      {/* Trigger Button */}
   <button
  onClick={handleOpen}
  className="flex items-center gap-2 px-3 py-2 bg-white text-[var(--primary-color)] rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium text-sm shadow-md hover:shadow-lg transform hover:scale-105 border border-gray-200"
>
  <Grid3X3 className="w-4 h-4" />
  <span className="hidden sm:inline">Quick Links</span>
  <ChevronRight className="w-3 h-3" />
</button>


      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100]"
          onClick={handleClose}
        />
      )}

      {/* Sliding Panel */}
      <div
        className={`fixed top-[6rem] right-0 h-[calc(100vh-4rem)] w-72 bg-white shadow-2xl z-[200] transform transition-transform duration-300 ease-in-out border-l border-gray-200 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--accent-color)] text-white p-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold">Quick Access</h3>
            <p className="text-xs opacity-90">Patient Services</p>
          </div>
          <button
            onClick={handleClose}
            className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Links */}
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="grid grid-cols-1 gap-2">
            {links.map((link, index) => (
              <button
                key={`${link.name}-${index}`}
                onClick={() => handleLinkClick(link)}
                className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all duration-200 text-left group ${
                  selectedLink === link.name
                    ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-md"
                    : `bg-white border-gray-200 ${link.hoverBgColor} hover:border-gray-300 hover:shadow-sm`
                }`}
              >
                <div
                  className={`p-1.5 rounded-md ${
                    selectedLink === link.name
                      ? "bg-white/20"
                      : `${link.bgColor} group-hover:scale-110 transition-transform duration-200`
                  }`}
                >
                  <link.icon
                    className={`w-4 h-4 ${
                      selectedLink === link.name ? "text-white" : link.color
                    }`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span
                    className={`text-xs font-medium ${
                      selectedLink === link.name
                        ? "text-white"
                        : "text-gray-800"
                    }`}
                  >
                    {link.name}
                  </span>
                  <p
                    className={`text-xs mt-0.5 ${
                      selectedLink === link.name
                        ? "text-white/80"
                        : "text-gray-500"
                    }`}
                  >
                    {link.name === "Gate Pass"
                      ? "Generate visitor passes"
                      : link.name === "Nursing & Treatment"
                      ? "View treatment details"
                      : link.name === "Discharge"
                      ? "Process discharge"
                      : "Update settings"}
                  </p>
                </div>
                <ChevronRight
                  className={`w-3 h-3 transition-all duration-200 ${
                    selectedLink === link.name
                      ? "text-white translate-x-1"
                      : "text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default QuickLinksPanel;