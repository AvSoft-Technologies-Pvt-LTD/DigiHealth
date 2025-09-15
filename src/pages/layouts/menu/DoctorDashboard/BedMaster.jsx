import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Building,
  Building2,
  Bed,
  DoorOpen as Door,
  Settings,
  Plus,
  Trash2,
  Check,
  ArrowLeft,
  ArrowRight,
  Save,
  Users,
  Heart,
  Baby,
  Shield,
  AlertTriangle,
  Activity,
  Snowflake,
  Thermometer,
  Wifi,
  Phone,
  Monitor,
  ShowerHead,
  Eye,
  Circle,
  ChevronDown,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { getAllSpecializations } from "../../../../utils/masterService";

const BedMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const [currentStep, setCurrentStep] = useState(0);
  const [bedMasterData, setBedMasterData] = useState({
    departments: [],
    wards: [],
    rooms: [],
    beds: [],
    selectedDepartment: null,
    selectedWard: null,
    roomAmenities: [],
    bedAmenities: [],
  });
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [specializationError, setSpecializationError] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedWardForRoom, setSelectedWardForRoom] = useState(null);
  const [bedCount, setBedCount] = useState(1);

  const fallbackDepartments = [
    { id: "fallback-1", name: "Cardiology", specializationId: "fallback-1" },
    { id: "fallback-2", name: "Neurology", specializationId: "fallback-2" },
    { id: "fallback-3", name: "Orthopedics", specializationId: "fallback-3" },
    { id: "fallback-4", name: "Pediatrics", specializationId: "fallback-4" },
    { id: "fallback-5", name: "Oncology", specializationId: "fallback-5" },
    { id: "fallback-6", name: "Gastroenterology", specializationId: "fallback-6" },
    { id: "fallback-7", name: "Dermatology", specializationId: "fallback-7" },
    { id: "fallback-8", name: "Psychiatry", specializationId: "fallback-8" },
    { id: "fallback-9", name: "Urology", specializationId: "fallback-9" },
    { id: "fallback-10", name: "Endocrinology", specializationId: "fallback-10" },
    { id: "fallback-11", name: "Ophthalmology", specializationId: "fallback-11" },
  ];

  const steps = [
    { id: 0, title: "Department Setup", icon: Building, description: "Create and manage hospital departments", color: "text-[var(--primary-color)]" },
    { id: 1, title: "Ward Creation", icon: Building2, description: "Set up wards within departments", color: "text-purple-600" },
    { id: 2, title: "Room & Amenities", icon: Door, description: "Configure rooms and their amenities", color: "text-[var(--accent-color)]" },
    { id: 3, title: "Bed Configuration", icon: Bed, description: "Set up beds and bed-specific amenities", color: "text-orange-600" },
    { id: 4, title: "Review & Save", icon: Check, description: "Review configuration and save", color: "text-gray-600" },
  ];

  const wardTypes = [
    { id: "general", name: "General Ward", icon: Users, color: "bg-blue-50 text-blue-700 border-blue-200", description: "Multi-bed general patient care" },
    { id: "icu", name: "ICU", icon: Heart, color: "bg-red-50 text-red-700 border-red-200", description: "Intensive Care Unit" },
    { id: "iccu", name: "ICCU", icon: Activity, color: "bg-purple-50 text-purple-700 border-purple-200", description: "Intensive Cardiac Care Unit" },
    { id: "maternity", name: "Maternity", icon: Baby, color: "bg-pink-50 text-pink-700 border-pink-200", description: "Maternity and childcare" },
    { id: "private", name: "Private Room", icon: Shield, color: "bg-green-50 text-green-700 border-green-200", description: "Single private rooms" },
    { id: "emergency", name: "Emergency", icon: AlertTriangle, color: "bg-orange-50 text-orange-700 border-orange-200", description: "Emergency treatment area" },
  ];

  const roomAmenityOptions = [
    { id: "ac", name: "Air Conditioning", icon: Snowflake, color: "text-blue-500" },
    { id: "oxygen", name: "Oxygen Supply", icon: Activity, color: "text-green-500" },
    { id: "heating", name: "Heating System", icon: Thermometer, color: "text-orange-500" },
    { id: "wifi", name: "WiFi Access", icon: Wifi, color: "text-purple-500" },
    { id: "phone", name: "Phone System", icon: Phone, color: "text-indigo-500" },
    { id: "tv", name: "Television", icon: Monitor, color: "text-gray-500" },
    { id: "bathroom", name: "Private Bathroom", icon: ShowerHead, color: "text-cyan-500" },
  ];

  const bedAmenityOptions = [
    { id: "monitor", name: "Patient Monitor", icon: Monitor, color: "text-blue-500" },
    { id: "adjustable", name: "Adjustable Bed", icon: Settings, color: "text-green-500" },
    { id: "sidetable", name: "Bedside Table", icon: Circle, color: "text-gray-500" },
    { id: "oxygenpipeline", name: "Oxygen Pipeline", icon: Activity, color: "text-red-500" },
    { id: "callbutton", name: "Call Button", icon: Phone, color: "text-purple-500" },
    { id: "lighting", name: "Adjustable Lighting", icon: Eye, color: "text-yellow-500" },
  ];

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    setLoadingSpecializations(true);
    setSpecializationError(null);
    try {
      const response = await getAllSpecializations();
      const data = response.data?.data || response.data || [];
      setSpecializations(Array.isArray(data) ? data : fallbackDepartments);
    } catch (error) {
      setSpecializationError("Failed to load specializations");
      toast.error("Failed to load specializations, using fallback options.");
      setSpecializations(fallbackDepartments);
    } finally {
      setLoadingSpecializations(false);
    }
  };

  useEffect(() => {
    if (editData) {
      setBedMasterData((prev) => ({
        ...prev,
        departments: [{ id: 1, name: editData.department }],
        wards: [
          {
            id: 1,
            name: editData.ward,
            type: editData.ward.toLowerCase(),
            departmentId: 1,
          },
        ],
        beds: Array.from({ length: editData.totalBeds }, (_, i) => ({
          id: i + 1,
          name: `Bed ${i + 1}`,
          status: i < editData.occupied ? "occupied" : "available",
          wardId: 1,
        })),
      }));
    }
  }, [editData]);

  const canGoNext = () => {
    switch (currentStep) {
      case 0:
        return bedMasterData.departments.length > 0;
      case 1:
        return bedMasterData.wards.length > 0;
      case 2:
        return bedMasterData.rooms.length > 0;
      case 3:
        return bedMasterData.beds.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (canGoNext()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.warning("Please complete the current step before proceeding.");
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const addDepartment = (specializationData) => {
    if (!specializationData) return;
    const departmentName = specializationData.name || specializationData.specializationName || specializationData.description;
    const existingDept = bedMasterData.departments.find(d => d.name === departmentName);
    if (existingDept) {
      toast.warning("Department already exists");
      return;
    }
    const newDept = {
      id: Date.now(),
      name: departmentName,
      specializationId: specializationData.id || specializationData.specializationId,
      createdAt: new Date().toISOString()
    };
    setBedMasterData((prev) => ({ ...prev, departments: [...prev.departments, newDept] }));
    setSelectedSpecialization("");
    toast.success("Department added successfully");
  };

  const addWard = (wardType, departmentId) => {
    const wardTypeData = wardTypes.find((w) => w.id === wardType);
    const existingWard = bedMasterData.wards.find(w => w.departmentId === departmentId && w.type === wardType);
    if (existingWard) {
      toast.warning("Ward type already exists in this department");
      return;
    }
    const newWard = {
      id: Date.now(),
      name: wardTypeData.name,
      type: wardType,
      departmentId,
      capacity: 0,
      createdAt: new Date().toISOString(),
    };
    setBedMasterData((prev) => ({ ...prev, wards: [...prev.wards, newWard] }));
    toast.success("Ward added successfully");
  };

  const addRoom = (name, wardId) => {
    if (!name.trim()) return;
    const existingRoom = bedMasterData.rooms.find(r => r.wardId === wardId && r.name.toLowerCase() === name.trim().toLowerCase());
    if (existingRoom) {
      toast.warning("Room with this name already exists in the ward");
      return;
    }
    const newRoom = {
      id: Date.now(),
      name: name.trim(),
      wardId,
      amenities: [...bedMasterData.roomAmenities],
      createdAt: new Date().toISOString(),
    };
    setBedMasterData((prev) => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
    toast.success("Room added successfully");
  };

  const addBed = (roomId, count = 1) => {
    const roomBeds = bedMasterData.beds.filter((b) => b.roomId === roomId);
    const newBeds = [];
    for (let i = 0; i < count; i++) {
      const newBed = {
        id: Date.now() + i,
        name: `Bed ${roomBeds.length + i + 1}`,
        roomId,
        status: "available",
        amenities: [...bedMasterData.bedAmenities],
        createdAt: new Date().toISOString(),
      };
      newBeds.push(newBed);
    }
    setBedMasterData((prev) => ({ ...prev, beds: [...prev.beds, ...newBeds] }));
    toast.success(`${count} bed(s) added successfully`);
  };

  const deleteDepartment = (id) => {
    setBedMasterData((prev) => ({
      ...prev,
      departments: prev.departments.filter((d) => d.id !== id),
      wards: prev.wards.filter((w) => w.departmentId !== id),
    }));
    toast.success("Department deleted successfully");
  };

  const deleteWard = (id) => {
    setBedMasterData((prev) => ({
      ...prev,
      wards: prev.wards.filter((w) => w.id !== id),
      rooms: prev.rooms.filter((r) => r.wardId !== id),
    }));
    toast.success("Ward deleted successfully");
  };

  const deleteRoom = (id) => {
    setBedMasterData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((r) => r.id !== id),
      beds: prev.beds.filter((b) => b.roomId !== id),
    }));
    toast.success("Room deleted successfully");
  };

  const deleteBed = (id) => {
    setBedMasterData((prev) => ({ ...prev, beds: prev.beds.filter((b) => b.id !== id) }));
    toast.success("Bed deleted successfully");
  };

  const handleSave = () => {
    const summaryData = bedMasterData.wards.map((ward) => {
      const department = bedMasterData.departments.find((d) => d.id === ward.departmentId);
      const wardRooms = bedMasterData.rooms.filter((r) => r.wardId === ward.id);
      const wardBeds = bedMasterData.beds.filter((b) => wardRooms.some((room) => room.id === b.roomId));
      const occupiedBeds = wardBeds.filter((b) => b.status === "occupied").length;
      return {
        department: department?.name || "Unknown",
        ward: ward.name,
        totalBeds: wardBeds.length,
        occupied: occupiedBeds,
        available: wardBeds.length - occupiedBeds,
        status: "Active",
        rooms: wardRooms.length,
      };
    });
    const existingData = JSON.parse(localStorage.getItem("bedMasterData") || "[]");
    const updatedData = editData
      ? existingData.map((item) => (item.id === editData.id ? { ...summaryData[0], id: editData.id } : item))
      : [...existingData, ...summaryData];
    localStorage.setItem("bedMasterData", JSON.stringify(updatedData));
    toast.success("Bed management configuration saved successfully!");
    navigate("/doctordashboard/bedroommanagement");
  };

  const renderStepIndicator = () => (
    <div className="max-w-7xl mx-auto mb-6 sm:mb-8">
      <div className="flex items-center justify-center px-2 sm:px-4 overflow-x-auto custom-scrollbar">
        <div className="flex items-center min-w-max space-x-2 sm:space-x-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const IconComponent = step.icon;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  className="flex flex-col items-center min-w-max"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isCompleted
                        ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-lg"
                        : isCurrent
                        ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-xl transform scale-110"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    <IconComponent size={16} className="sm:w-5 sm:h-5" />
                  </div>
                  <div
                    className={`mt-2 text-center transition-all duration-300 ${
                      isCurrent ? "text-[var(--primary-color)] font-semibold" : "text-gray-500"
                    }`}
                  >
                    <div className="text-xs sm:text-sm whitespace-nowrap max-w-20 sm:max-w-none">{step.title}</div>
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 sm:mx-4 transition-all duration-300 min-w-8 sm:min-w-12 ${
                      isCompleted ? "bg-[var(--primary-color)]" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDepartmentStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Add Department from Specializations</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-white"
              disabled={loadingSpecializations}
            >
              <option value="">Select a specialization</option>
              {specializations.map((spec) => (
                <option key={spec.id || spec.specializationId} value={JSON.stringify(spec)}>
                  {spec.name || spec.specializationName || spec.description || 'Unknown Specialization'}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (selectedSpecialization) {
                  const specializationData = JSON.parse(selectedSpecialization);
                  addDepartment(specializationData);
                }
              }}
              disabled={!selectedSpecialization || loadingSpecializations}
              className="btn btn-primary flex-shrink-0"
            >
              <Plus size={16} /> Add
            </button>
          </div>
        </div>
        {specializationError && (
          <p className="text-red-500 text-sm mt-2">{specializationError}</p>
        )}
        {loadingSpecializations && (
          <p className="text-[var(--accent-color)] text-sm mt-2 flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Loading specializations...
          </p>
        )}
        {!loadingSpecializations && specializations.length === 0 && !specializationError && (
          <p className="text-gray-500 text-sm mt-2">No specializations available</p>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence>
          {bedMasterData.departments.map((dept) => (
            <motion.div
              key={dept.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="text-white" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-gray-900 truncate">{dept.name}</h3>
                    <p className="text-sm text-gray-600">Wards: {bedMasterData.wards.filter((w) => w.departmentId === dept.id).length}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteDepartment(dept.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );

  const renderWardStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Building2 className="text-purple-600" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ward Creation</h2>
      </div>
      {bedMasterData.departments.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <Building className="mx-auto mb-4 text-gray-400" size={40} />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">No Departments Created</h3>
          <p className="text-sm sm:text-base text-gray-500">Please create a department first</p>
        </div>
      ) : (
        bedMasterData.departments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Building className="text-[var(--primary-color)]" size={16} />
              <span className="break-words">{department.name}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-3 mb-4">
              {wardTypes.map((wardType) => {
                const IconComponent = wardType.icon;
                const isAdded = bedMasterData.wards.some((w) => w.departmentId === department.id && w.type === wardType.id);
                return (
                  <motion.button
                    key={wardType.id}
                    onClick={() => {
                      if (!isAdded) addWard(wardType.id, department.id);
                    }}
                    disabled={isAdded}
                    className={`p-3 sm:p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isAdded ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300" : `${wardType.color} hover:shadow-md`
                    }`}
                    whileHover={!isAdded ? { scale: 1.02 } : {}}
                    whileTap={!isAdded ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent size={14} />
                      <span className="font-medium text-xs sm:text-sm">{wardType.name}</span>
                      {isAdded && <Check size={12} className="text-green-600" />}
                    </div>
                    <p className="text-xs opacity-70 text-left">{wardType.description}</p>
                  </motion.button>
                );
              })}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Created Wards:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <AnimatePresence>
                  {bedMasterData.wards
                    .filter((w) => w.departmentId === department.id)
                    .map((ward) => {
                      const wardType = wardTypes.find((w) => w.id === ward.type);
                      const IconComponent = wardType?.icon || Building2;
                      return (
                        <motion.div
                          key={ward.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            wardType?.color || "bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <IconComponent size={14} />
                            <div className="min-w-0">
                              <span className="font-medium text-sm block truncate">{ward.name}</span>
                              <div className="text-xs opacity-70">{wardType?.description}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteWard(ward.id)}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={12} />
                          </button>
                        </motion.div>
                      );
                    })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );

  const renderRoomStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Door className="text-[var(--accent-color)]" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Room & Amenities Setup</h2>
      </div>
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={16} /> Room Amenities
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2 sm:gap-3">
          {roomAmenityOptions.map((amenity) => {
            const IconComponent = amenity.icon;
            const isSelected = bedMasterData.roomAmenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                onClick={() =>
                  setBedMasterData((prev) => ({
                    ...prev,
                    roomAmenities: isSelected
                      ? prev.roomAmenities.filter((id) => id !== amenity.id)
                      : [...prev.roomAmenities, amenity.id],
                  }))
                }
                className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-[var(--accent-color)] bg-[var(--accent-color)] shadow-md"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-[var(--accent-color)]"
                }`}
              >
                <IconComponent className={amenity.color} size={16} />
                <span className="text-xs font-medium mt-1 text-center leading-tight">{amenity.name}</span>
                <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full mt-1 ${isSelected ? "bg-[var(--accent-color)]" : "bg-gray-300"}`} />
              </button>
            );
          })}
        </div>
      </div>
      {bedMasterData.wards.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <Building2 className="mx-auto mb-4 text-gray-400" size={40} />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">No Wards Created</h3>
          <p className="text-sm sm:text-base text-gray-500">Please create wards first</p>
        </div>
      ) : (
        bedMasterData.wards.map((ward) => (
          <div key={ward.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Building2 className="text-purple-600" size={16} />
              <span className="break-words">Room Setup ({ward.name})</span>
            </h3>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                type="text"
                value={selectedWardForRoom === ward.id ? newRoomName : ""}
                onChange={(e) => {
                  setNewRoomName(e.target.value);
                  setSelectedWardForRoom(ward.id);
                }}
                placeholder="Enter room name"
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] text-sm"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && newRoomName.trim()) {
                    addRoom(newRoomName, ward.id);
                    setNewRoomName("");
                    setSelectedWardForRoom(null);
                  }
                }}
              />
              <button
                onClick={() => {
                  if (newRoomName.trim()) {
                    addRoom(newRoomName, ward.id);
                    setNewRoomName("");
                    setSelectedWardForRoom(null);
                  }
                }}
                className="btn view-btn flex-shrink-0 text-sm"
              >
                <Plus size={14} /> Add Room
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
              <AnimatePresence>
                {bedMasterData.rooms
                  .filter((r) => r.wardId === ward.id)
                  .map((room) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-gradient-to-r from-[var(--accent-color)] to-green-100 rounded-lg p-3 sm:p-4 border border-[var(--accent-color)]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <Door className="text-[var(--accent-color)] flex-shrink-0" size={14} />
                          <span className="font-semibold text-sm text-gray-900 truncate">{room.name}</span>
                        </div>
                        <button
                          onClick={() => deleteRoom(room.id)}
                          className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 flex-shrink-0"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenityId) => {
                          const amenity = roomAmenityOptions.find((a) => a.id === amenityId);
                          if (!amenity) return null;
                          const IconComponent = amenity.icon;
                          return (
                            <span
                              key={amenityId}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs"
                              title={amenity.name}
                            >
                              <IconComponent className={amenity.color} size={10} />
                            </span>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );

  const renderBedStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Bed className="text-orange-600" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bed Configuration</h2>
      </div>
      <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
        <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={16} /> Bed Amenities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {bedAmenityOptions.map((amenity) => {
            const IconComponent = amenity.icon;
            const isSelected = bedMasterData.bedAmenities.includes(amenity.id);
            return (
              <button
                key={amenity.id}
                onClick={() =>
                  setBedMasterData((prev) => ({
                    ...prev,
                    bedAmenities: isSelected
                      ? prev.bedAmenities.filter((id) => id !== amenity.id)
                      : [...prev.bedAmenities, amenity.id],
                  }))
                }
                className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="p-1 sm:p-2 rounded-full bg-gray-100 flex-shrink-0">
                    <IconComponent className={amenity.color} size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium truncate">{amenity.name}</span>
                </div>
                <div
                  className={`w-5 h-3 sm:w-6 sm:h-4 flex items-center rounded-full p-0.5 transition-all duration-200 flex-shrink-0 ${
                    isSelected ? "bg-orange-500 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white shadow-sm" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {bedMasterData.rooms.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <Door className="mx-auto mb-4 text-gray-400" size={40} />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">No Rooms Created</h3>
          <p className="text-sm sm:text-base text-gray-500">Please create rooms first</p>
        </div>
      ) : (
        bedMasterData.rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Door className="text-[var(--accent-color)]" size={16} />
                <span className="break-words">{room.name}</span>
              </h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={bedCount}
                  onChange={(e) => setBedCount(parseInt(e.target.value) || 1)}
                  placeholder="Beds"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-full sm:w-20"
                />
                <button onClick={() => addBed(room.id, bedCount)} className="btn view-btn text-sm flex-shrink-0">
                  <Plus size={14} /> Add Beds
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              <AnimatePresence>
                {bedMasterData.beds
                  .filter((b) => b.roomId === room.id)
                  .map((bed) => {
                    const statusColors = {
                      available: "bg-green-500",
                      occupied: "bg-red-500",
                      maintenance: "bg-yellow-500",
                      reserved: "bg-blue-500",
                    };
                    return (
                      <motion.div
                        key={bed.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Bed className="text-orange-600 flex-shrink-0" size={14} />
                            <span className="font-medium text-xs sm:text-sm truncate">{bed.name}</span>
                          </div>
                          <button
                            onClick={() => deleteBed(bed.id)}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 flex-shrink-0"
                          >
                            <Trash2 size={10} />
                          </button>
                        </div>
                        <select
                          value={bed.status || "available"}
                          onChange={(e) =>
                            setBedMasterData((prev) => ({
                              ...prev,
                              beds: prev.beds.map((b) => (b.id === bed.id ? { ...b, status: e.target.value } : b)),
                            }))
                          }
                          className="w-full text-xs border border-gray-300 rounded mb-2 px-2 py-1"
                        >
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="reserved">Reserved</option>
                        </select>
                        <div className={`h-2 rounded-full ${statusColors[bed.status || "available"]}`} />
                      </motion.div>
                    );
                  })}
              </AnimatePresence>
            </div>
          </div>
        ))
      )}
    </motion.div>
  );

  const renderReviewStep = () => {
    const summaryData = bedMasterData.wards.map((ward) => {
      const department = bedMasterData.departments.find((d) => d.id === ward.departmentId);
      const wardRooms = bedMasterData.rooms.filter((r) => r.wardId === ward.id);
      const wardBeds = bedMasterData.beds.filter((b) => wardRooms.some((room) => room.id === b.roomId));
      const occupiedBeds = wardBeds.filter((b) => b.status === "occupied").length;
      return {
        department: department?.name || "Unknown",
        ward: ward.name,
        totalBeds: wardBeds.length,
        occupied: occupiedBeds,
        available: wardBeds.length - occupiedBeds,
        status: "Active",
        rooms: wardRooms.length,
      };
    });
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Check className="text-green-600" size={20} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Review & Save</h2>
        </div>

        {summaryData.length > 0 && (
          <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Data Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">Department</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">Ward</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">Rooms</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">Total Beds</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">Occupied</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-gray-900 text-xs sm:text-sm">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summaryData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 sm:p-3 text-xs sm:text-sm break-words max-w-32">{row.department}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm break-words max-w-24">{row.ward}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{row.rooms}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm">{row.totalBeds}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-red-600">{row.occupied}</td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-green-600">{row.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-color)] hover:bg-opacity-90 text-white rounded-lg transition-all duration-200 font-medium shadow-lg text-sm"
          >
            <Save size={16} /> {editData ? "Update" : "Save"} & Finish
          </button>
        </div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDepartmentStep();
      case 1:
        return renderWardStep();
      case 2:
        return renderRoomStep();
      case 3:
        return renderBedStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <motion.div className="mb-4 sm:mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <button
                onClick={() => navigate("/doctordashboard/bedroommanagement")}
                className="flex items-center text-xs sm:text-sm text-[var(--primary-color)] hover:underline"
              >
                ← Back to List
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {editData ? "Edit" : "Create"} Bed Management Master
            </h1>
          </motion.div>
          {renderStepIndicator()}
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderStepContent()}
            {/* Stepper Navigation Footer */}
            <div className="flex justify-between items-center mt-6 sm:mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentStep === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900"
                }`}
              >
                <ArrowLeft size={16} /> Back
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={handleNext}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    canGoNext()
                      ? "bg-[var(--accent-color)] hover:bg-opacity-90 text-white"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  disabled={!canGoNext()}
                >
                  Next <ArrowRight size={16} />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedMaster;
