// File: DrForm/Header.jsx
import React, { useState, useEffect } from "react";
import {
  Heart,
  FileText,
  FlaskRound as Flask,
  Pill,
  Stethoscope,
  Eye,
  StickyNote,
  Printer,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
} from "lucide-react";
import QuickLinksPanel from "../QuickLinksPanel"; // relative import inside DrForm

const formTypes = {
  all: { id: "all", name: "All", icon: null },
  template: { id: "template", name: "Case", icon: StickyNote },
  vitals: { id: "vitals", name: "Vital Signs", icon: Heart },
  prescription: { id: "prescription", name: "Prescription", icon: Pill },
  clinical: { id: "clinical", name: "Clinical Notes", icon: FileText },
  lab: { id: "lab", name: "Lab Tests", icon: Flask },
  dental: { id: "dental", name: "Dental Exam", icon: Stethoscope },
  eye: { id: "eye", name: "Eye Test", icon: Eye },
};

const Header = ({
  patient = {},
  activeForm = "all",
  setActiveForm = () => {},
  printAllForms = () => {},
  getPatientName = () => patient?.name || "Unknown Patient",
  getPatientAge = () => patient?.age || "N/A",
  getCombinedWardInfo = () => "N/A",
  isIPDPatient = false,
  showPatientDetails = true,
  setShowPatientDetails = () => {},
}) => {
  const [showMoreForms, setShowMoreForms] = useState(false);
  const [localIsIPD, setLocalIsIPD] = useState(isIPDPatient);
  const [quickLinksOpen, setQuickLinksOpen] = useState(false);

  useEffect(() => {
    setLocalIsIPD(isIPDPatient);
  }, [isIPDPatient]);

  const handleFormTypeClick = (formId) => {
    if (formId === "template") setActiveForm("template");
    else setActiveForm(formId);
    setQuickLinksOpen(false);
  };

  const openQuickLinks = () => setQuickLinksOpen(true);

  const initials = (name) =>
    (name || "")
      .split(" ")
      .map((n) => (n && n[0] ? n[0] : ""))
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
<div className="sticky top-0 z-[50] overflow-visible bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-b-xl shadow-md ml-6 mr-6 max-w-7xl">
      {/* Mobile */}
      <div className="md:hidden flex flex-col items-center gap-2 p-2 xs:p-4 w-full text-white">
        <div className="relative flex flex-nowrap xs:flex-wrap items-center xs:items-start gap-4 p-4 w-full">
          {localIsIPD && (
            <div className="absolute top-4 right-2 z-10">
              <button
                type="button"
                onClick={openQuickLinks}
                className="flex items-center gap-2 px-3 py-2 bg-white text-[#01B07A] rounded-lg hover:bg-gray-100 transition-all text-sm"
                aria-expanded={quickLinksOpen}
              >
                <MoreHorizontal className="w-4 h-4 text-[#01B07A]" />
                <span className="hidden sm:inline text-xs text-[#01B07A]">Quick Links</span>
              </button>
            </div>
          )}

          <div className="w-14 h-14 flex mb-18 items-center justify-center rounded-full bg-white text-[#01B07A] font-bold uppercase shadow flex-shrink-0">
            {initials(getPatientName())}
          </div>

          <div className="flex flex-col text-sm space-y-1 min-w-0 break-words max-w-[calc(100%-56px)]">
            <h2 className="text-base font-semibold">Name: {getPatientName()}</h2>
            <p>Contact: {patient?.phone || patient?.contact || "N/A"}</p>
            <p>Age: {getPatientAge() || "N/A"}</p>
            <p>Gender: {patient?.gender || "N/A"}</p>
            <p>Diagnosis: {patient?.diagnosis || "N/A"}</p>
            {localIsIPD && <p>Ward: {getCombinedWardInfo()}</p>}
          </div>
        </div>

        {/* Tab bar (mobile): relative so chevron can be positioned to the right */}
        <div style={{ backgroundColor: "#F8FAF9" }} className="w-full rounded-xl mt-2 pt-2 pb-2 z-20 relative">
          {/* Scrollable tab row with padding-right to avoid overlap with chevron */}
          <div className="w-full px-2 overflow-x-auto">
            <div className="flex flex-nowrap gap-2 border-b border-gray-200 pr-12">
              {["template", "vitals", "prescription", "eye"].map((fid) => {
                const isActive = activeForm === fid;
                return (
                  <button
                    key={fid}
                    onClick={() => handleFormTypeClick(fid)}
                    className={`flex items-center gap-1 px-3 py-2 whitespace-nowrap rounded-md text-[14px] ${
                      isActive ? "text-[#01B07A] bg-white border-b-2 border-[#01B07A]" : "text-gray-700"
                    }`}
                  >
                    <span className="ps-1">{formTypes[fid].name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chevron placed absolutely to the right, vertically centered relative to the tab row */}
          <div className="absolute top-1/2 transform -translate-y-1/2 right-3">
            <button
              onClick={() => setShowMoreForms((s) => !s)}
              className="flex items-center justify-center rounded-full text-[#01B07A] bg-white p-1 shadow"
              aria-expanded={showMoreForms}
              aria-label={showMoreForms ? "Collapse extra tabs" : "Show more tabs"}
            >
              {showMoreForms ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>

          {/* Expanded extra tabs row */}
          {showMoreForms && (
            <div className="w-full mt-3 px-2">
              <div className="flex overflow-x-auto flex-nowrap gap-2 border-b border-gray-200 py-1 pr-12">
                {["clinical", "lab", "dental"].map((fid) => (
                  <button
                    key={fid}
                    onClick={() => handleFormTypeClick(fid)}
                    className="px-3 py-2 whitespace-nowrap text-[12px] font-medium text-gray-700 rounded-md"
                  >
                    {formTypes[fid].name}
                  </button>
                ))}
                <button onClick={printAllForms} className="px-3 py-2 whitespace-nowrap rounded text-[12px] font-medium bg-[#1A223F] text-white">
                  <Printer className="w-3 h-3 inline-block mr-1" /> Print All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tablet */}
      <div className="hidden md:flex lg:hidden flex-col items-center gap-4 p-4 w-[95%] mx-auto text-white">
        <div className="relative flex flex-wrap items-start gap-6 p-4 w-full">
          {localIsIPD && (
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                onClick={openQuickLinks}
                className="flex items-center gap-2 px-3 py-2 bg-white text-[#01B07A] rounded-lg hover:bg-gray-100 transition-all text-sm"
                aria-expanded={quickLinksOpen}
              >
                <MoreHorizontal className="w-4 h-4 text-[#01B07A]" />
                <span className="hidden sm:inline text-xs text-[#01B07A]">Quick Links</span>
              </button>
            </div>
          )}

          <div className="w-20 h-20 flex items-center justify-center rounded-full bg-white text-[#01B07A] text-xl font-bold uppercase shadow">
            {initials(getPatientName())}
          </div>

          <div className="flex flex-col text-sm space-y-1 min-w-0 break-words">
            <h2 className="text-2xl font-semibold">Name: {getPatientName()}</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col">
                <p className="text-base">Age: {getPatientAge() || "N/A"}</p>
                <p className="text-base">Gender: {patient?.gender || "N/A"}</p>
                {localIsIPD && <p className="text-base">Ward: {getCombinedWardInfo()}</p>}
              </div>
              <div className="flex flex-col">
                <p className="text-base">Contact: {patient?.phone || patient?.contact || "N/A"}</p>
                <p className="text-base">Diagnosis: {patient?.diagnosis || "N/A"}</p>
                {localIsIPD && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-base font-medium">Status:</span>
                    <span
                      className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        (patient?.status || "").toLowerCase() === "admitted"
                          ? "bg-green-200 text-green-900"
                          : (patient?.status || "").toLowerCase() === "under treatment"
                          ? "bg-yellow-200 text-yellow-900"
                          : (patient?.status || "").toLowerCase() === "discharged"
                          ? "bg-gray-200 text-gray-900"
                          : "bg-blue-200 text-blue-900"
                      }`}
                    >
                      {patient?.status || "N/A"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar (tablet): similar approach as mobile */}
        <div style={{ backgroundColor: "#F8FAF9" }} className="w-full rounded-2xl mt-4 pt-2 pb-3 z-20 relative">
          <div className="w-full px-4 overflow-x-auto">
            <div className="flex flex-nowrap items-center gap-5 border-b-3 border-gray-200 pr-14">
              {["template", "vitals", "prescription", "eye"].map((formId) => {
                const formType = formTypes[formId];
                const Icon = formType.icon;
                const isActive = activeForm === formType.id;
                return (
                  <button
                    key={formType.id}
                    onClick={() => handleFormTypeClick(formType.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-[18px] whitespace-nowrap rounded-md ${
                      isActive ? "text-[#01B07A] border-b-2 border-[#01B07A]" : "text-gray-700 hover:text-[#01B07A]"
                    }`}
                  >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{formType.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chevron absolute right next to the tab row (keeps distance from last tab) */}
          <div className="absolute top-1/2 transform -translate-y-1/2 right-4">
            <button
              onClick={() => setShowMoreForms((s) => !s)}
              className="flex items-center justify-center rounded-full text-[#01B07A] bg-white p-1 shadow"
              aria-expanded={showMoreForms}
            >
              {showMoreForms ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {showMoreForms && (
            <div className="w-full mt-3 px-4">
              <div className="flex overflow-x-auto flex-nowrap gap-2 border-b border-gray-200 py-1 pr-14">
                {["clinical", "lab", "dental"].map((formId) => {
                  const formType = formTypes[formId];
                  const Icon = formType.icon;
                  const isActive = activeForm === formType.id;
                  return (
                    <button
                      key={formType.id}
                      onClick={() => handleFormTypeClick(formType.id)}
                      className={`flex items-center gap-3 px-3 py-2 whitespace-nowrap text-[18px] rounded-md ${
                        isActive ? "text-[#01B07A] border-b-2 border-[#01B07A]" : "text-gray-700 hover:text-[#01B07A]"
                      }`}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                      <span>{formType.name}</span>
                    </button>
                  );
                })}
                <button onClick={printAllForms} className="flex items-center gap-2 px-4 py-1 rounded-xl text-[18px] font-semibold whitespace-nowrap bg-[#1A223F] text-white hover:bg-[#01B07A]">
                  <Printer className="w-5 h-5" />
                  <span>Print All</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block w-full mx-auto text-white rounded-b-xl shadow-md">
        <div className="w-full px-3 py-2 sm:px-4 md:px-6 sm:py-3">
          {showPatientDetails && (
            <div className="flex flex-col gap-2 md:gap-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                <div className="flex flex-row items-center md:items-start gap-2 md:gap-4 w-full">
                  <div className="w-10 h-10 sm:w-12 md:w-12 md:h-12 flex md:px-4 sm:h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white text-xs sm:text-sm md:text-lg font-bold text-[#01B07A] shadow-md uppercase mb-10 sm:mb-0">
                    {initials(getPatientName())}
                  </div>
                  <div className="flex flex-col text-left w-full md:w-auto">
                    <h2 className="text-sm sm:text-base md:text-xl font-medium md:font-semibold mb-0.5 truncate max-w-[200px] sm:max-w-[300px] md:max-w-none">
                      {getPatientName() || "Unknown Patient"}
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-2 sm:gap-x-3 md:gap-x-4 gap-y-1 text-[10px] sm:text-xs md:text-sm">
                      <div className="flex items-center gap-1 truncate">
                        <span className="font-medium">Contact:</span>
                        <span className="break-all truncate max-w-[120px]">{patient?.phone || patient?.contact || "N/A"}</span>
                      </div>
                      <div className="truncate">
                        <span className="font-medium">Age:</span>
                        <span> {getPatientAge() || "N/A"}</span>
                      </div>
                      <div className="truncate">
                        <span className="font-medium">Gender:</span>
                        <span> {patient?.gender || "N/A"}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 md:col-span-1 truncate">
                        <span className="font-medium">Diagnosis:</span>
                        <span> {patient?.diagnosis || "N/A"}</span>
                      </div>

                      {localIsIPD && (
                        <>
                          <div className="col-span-2 sm:col-span-1 truncate">
                            <span className="font-medium">Ward:</span>
                            <span> {getCombinedWardInfo()}</span>
                          </div>
                          <div className="col-span-2 sm:col-span-1 md:col-span-2 flex">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Status:</span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                                  (patient?.status || "").toLowerCase() === "admitted"
                                    ? "bg-green-200 text-green-900"
                                    : (patient?.status || "").toLowerCase() === "under treatment"
                                    ? "bg-yellow-200 text-yellow-900"
                                    : (patient?.status || "").toLowerCase() === "discharged"
                                    ? "bg-gray-200 text-gray-900"
                                    : "bg-blue-200 text-blue-900"
                                }`}
                              >
                                {patient?.status || "N/A"}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {localIsIPD && (
                    <div className="w-full md:w-auto md:ml-auto mt-2 md:mt-0">
                      <button
                        type="button"
                        onClick={openQuickLinks}
                        className="flex items-center gap-2 px-3 py-2 bg-white text-[#01B07A] rounded-lg hover:bg-gray-100 transition-all text-sm"
                        aria-expanded={quickLinksOpen}
                      >
                        <MoreHorizontal className="w-4 h-4 text-[#01B07A]" />
                        <span className="hidden sm:inline text-xs text-[#01B07A]">Quick Links</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 md:gap-2 justify-start mt-3 md:mt-4">
                {Object.values(formTypes).map((formType) => {
                  const Icon = formType.icon;
                  const isActive = activeForm === formType.id;
                  return (
                    <button
                      key={formType.id}
                      onClick={() => handleFormTypeClick(formType.id)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs md:text-sm font-medium transition-all ${
                        isActive ? "bg-white text-[#01B07A] shadow-md" : "bg-white/10 hover:bg-white/20 text-white"
                      }`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      {formType.name}
                    </button>
                  );
                })}

                <button onClick={printAllForms} className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-md bg-white text-[#01B07A] text-xs md:text-sm font-medium hover:shadow-lg transition-all">
                  <Printer className="w-4 h-4" />
                  Print All
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Controlled QuickLinksPanel (single instance) */}
      <QuickLinksPanel
        isOpen={quickLinksOpen}
        onToggle={(open) => setQuickLinksOpen(Boolean(open))}
        setActiveForm={(form) => {
          if (setActiveForm) setActiveForm(form);
          setQuickLinksOpen(false);
        }}
        patient={patient}
        showTrigger={false}
        usePortal={true} /* allow automatic sticky detection */
        nudgeUpPx={28} /* raise the panel by 28px above header bottom; tweak as needed */
      />
    </div>
  );
};

export default Header;
