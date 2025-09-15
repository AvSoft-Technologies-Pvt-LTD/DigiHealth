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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

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
  const [newDeptName, setNewDeptName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedWardForRoom, setSelectedWardForRoom] = useState(null);
  const [bedCount, setBedCount] = useState(1);

  const steps = [
    { id: 0, title: "Department Setup", icon: Building, description: "Create and manage hospital departments", color: "text-blue-600" },
    { id: 1, title: "Ward Creation", icon: Building2, description: "Set up wards within departments", color: "text-purple-600" },
    { id: 2, title: "Room & Amenities", icon: Door, description: "Configure rooms and their amenities", color: "text-green-600" },
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

  const addDepartment = (name) => {
    const newDept = { id: Date.now(), name: name.trim(), createdAt: new Date().toISOString() };
    setBedMasterData((prev) => ({ ...prev, departments: [...prev.departments, newDept] }));
    toast.success("Department added successfully");
  };

  const addWard = (wardType, departmentId) => {
    const wardTypeData = wardTypes.find((w) => w.id === wardType);
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
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
    <div className="flex items-center justify-center mb-8 px-4 overflow-x-auto custom-scrollbar">
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
                className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isCompleted
                    ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-lg"
                    : isCurrent
                    ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-xl transform scale-110"
                    : "bg-white text-gray-400 border-gray-300"
                }`}
              >
                <IconComponent size={20} />
              </div>
              <div
                className={`mt-2 text-center transition-all duration-300 ${
                  isCurrent ? "text-[var(--primary-color)] font-semibold" : "text-gray-500"
                }`}
              >
                <div className="text-sm whitespace-nowrap">{step.title}</div>
              </div>
            </motion.div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-4 transition-all duration-300 min-w-12 ${
                  isCompleted ? "bg-[var(--accent-color)]" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  const renderDepartmentStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Add New Department</h3>
        <div className="flex gap-3">
          <input
            type="text"
            value={newDeptName}
            onChange={(e) => setNewDeptName(e.target.value)}
            placeholder="Enter department name"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === "Enter" && newDeptName.trim()) {
                addDepartment(newDeptName);
                setNewDeptName("");
              }
            }}
          />
          <button
            onClick={() => {
              if (newDeptName.trim()) {
                addDepartment(newDeptName);
                setNewDeptName("");
              }
            }}
            className="btn btn-primary"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
  <AnimatePresence>
    {bedMasterData.departments.map((dept) => (
      <motion.div
        key={dept.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-3 border border-blue-200 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Building className="text-white" size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">{dept.name}</h3>
              <p className="text-xs text-gray-600">
                Wards: {bedMasterData.wards.filter((w) => w.departmentId === dept.id).length}
              </p>
            </div>
          </div>
          <button
            onClick={() => deleteDepartment(dept.id)}
            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
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
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="text-purple-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Ward Creation</h2>
      </div>
      {bedMasterData.departments.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Building className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-600">No Departments Created</h3>
          <p className="text-gray-500">Please create a department first</p>
        </div>
      ) : (
        bedMasterData.departments.map((department) => (
          <div key={department.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
              <Building className="text-blue-600" size={20} />
              {department.name}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-4">
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
                    className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                      isAdded ? "opacity-50 cursor-not-allowed bg-gray-100 border-gray-300" : `${wardType.color} hover:shadow-md`
                    }`}
                    whileHover={!isAdded ? { scale: 1.02 } : {}}
                    whileTap={!isAdded ? { scale: 0.98 } : {}}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <IconComponent size={18} />
                      <span className="font-medium text-sm">{wardType.name}</span>
                      {isAdded && <Check size={16} className="text-green-600" />}
                    </div>
                    <p className="text-xs opacity-70">{wardType.description}</p>
                  </motion.button>
                );
              })}
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Created Wards:</h4>
              <div className="space-y-2">
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
                          <div className="flex items-center gap-2">
                            <IconComponent size={16} />
                            <div>
                              <span className="font-medium">{ward.name}</span>
                              <div className="text-xs opacity-70">{wardType?.description}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteWard(ward.id)}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} />
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
  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
    <div className="flex items-center gap-2 mb-6">
      <Door className="text-green-600" size={24} />
      <h2 className="text-2xl font-bold text-gray-900">Room & Amenities Setup</h2>
    </div>
    <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Settings size={18} /> Room Amenities
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
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
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all duration-200 ${
                isSelected
                  ? "border-green-500 bg-green-50 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-green-300"
              }`}
            >
              <IconComponent className={amenity.color} size={20} />
              <span className="text-xs font-medium mt-1">{amenity.name}</span>
              <div className={`w-3 h-3 rounded-full mt-1 ${isSelected ? "bg-green-500" : "bg-gray-300"}`} />
            </button>
          );
        })}
      </div>
    </div>
    {bedMasterData.wards.length === 0 ? (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <Building2 className="mx-auto mb-4 text-gray-400" size={48} />
        <h3 className="text-lg font-semibold text-gray-600">No Wards Created</h3>
        <p className="text-gray-500">Please create wards first</p>
      </div>
    ) : (
      bedMasterData.wards.map((ward) => (
        <div key={ward.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2">
            <Building2 className="text-purple-600" size={20} />
            Room Setup ({ward.name})
          </h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={selectedWardForRoom === ward.id ? newRoomName : ""}
              onChange={(e) => {
                setNewRoomName(e.target.value);
                setSelectedWardForRoom(ward.id);
              }}
              placeholder="Enter room name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
              className="btn view-btn"
            >
              <Plus size={16} /> Add Room
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence>
              {bedMasterData.rooms
                .filter((r) => r.wardId === ward.id)
                .map((room) => (
                  <motion.div
                    key={room.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Door className="text-green-600" size={16} />
                        <span className="font-semibold text-gray-900">{room.name}</span>
                      </div>
                      <button
                        onClick={() => deleteRoom(room.id)}
                        className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50"
                      >
                        <Trash2 size={14} />
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
                            <IconComponent className={amenity.color} size={12} />
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
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bed className="text-orange-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Bed Configuration</h2>
      </div>
      <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Settings size={18} /> Bed Amenities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-orange-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100">
                    <IconComponent className={amenity.color} size={20} />
                  </div>
                  <span className="text-sm font-medium">{amenity.name}</span>
                </div>
                <div
                  className={`w-6 h-4 flex items-center rounded-full p-0.5 transition-all duration-200 ${
                    isSelected ? "bg-orange-500 justify-end" : "bg-gray-300 justify-start"
                  }`}
                >
                  <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      {bedMasterData.rooms.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Door className="mx-auto mb-4 text-gray-400" size={48} />
          <h3 className="text-lg font-semibold text-gray-600">No Rooms Created</h3>
          <p className="text-gray-500">Please create rooms first</p>
        </div>
      ) : (
        bedMasterData.rooms.map((room) => (
          <div key={room.id} className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Door className="text-green-600" size={20} />
                {room.name}
              </h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  min="1"
                  value={bedCount}
                  onChange={(e) => setBedCount(parseInt(e.target.value) || 1)}
                  placeholder="Number of beds"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button onClick={() => addBed(room.id, bedCount)} className="btn view-btn">
                  <Plus size={16} /> Add Beds
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Bed className="text-orange-600" size={16} />
                            <span className="font-medium text-sm">{bed.name}</span>
                          </div>
                          <button
                            onClick={() => deleteBed(bed.id)}
                            className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={12} />
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
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Check className="text-green-600" size={24} />
          <h2 className="text-2xl font-bold text-gray-900">Review & Save</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Building className="text-blue-600" size={20} />
              <span className="font-semibold text-blue-900">Departments</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{bedMasterData.departments.length}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="text-purple-600" size={20} />
              <span className="font-semibold text-purple-900">Wards</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{bedMasterData.wards.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <Door className="text-green-600" size={20} />
              <span className="font-semibold text-green-900">Rooms</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{bedMasterData.rooms.length}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-2">
              <Bed className="text-orange-600" size={20} />
              <span className="font-semibold text-orange-900">Beds</span>
            </div>
            <p className="text-2xl font-bold text-orange-700">{bedMasterData.beds.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Configuration Preview</h3>
          <div className="space-y-4">
            {bedMasterData.departments.map((dept) => (
              <div key={dept.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                  <Building className="text-blue-600" size={18} />
                  {dept.name}
                </h4>
                <div className="space-y-3 pl-4">
                  {bedMasterData.wards
                    .filter((w) => w.departmentId === dept.id)
                    .map((ward) => (
                      <div key={ward.id} className="border-l-2 border-gray-200 pl-4">
                        <h5 className="font-medium text-gray-800 flex items-center gap-2 mb-2">
                          <Building2 className="text-purple-600" size={16} />
                          {ward.name}
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-4">
                          {bedMasterData.rooms
                            .filter((r) => r.wardId === ward.id)
                            .map((room) => {
                              const roomBeds = bedMasterData.beds.filter((b) => b.roomId === room.id);
                              return (
                                <div key={room.id} className="text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <Door size={14} />
                                    {room.name} ({roomBeds.length} beds)
                                  </span>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {summaryData.length > 0 && (
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Data Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 font-semibold text-gray-900">Department</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Ward</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Rooms</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Total Beds</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Occupied</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Available</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {summaryData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3">{row.department}</td>
                      <td className="p-3">{row.ward}</td>
                      <td className="p-3">{row.rooms}</td>
                      <td className="p-3">{row.totalBeds}</td>
                      <td className="p-3 text-red-600">{row.occupied}</td>
                      <td className="p-3 text-green-600">{row.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <motion.div className="mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => navigate("/doctordashboard/bedroommanagement")}
                className="flex items-center text-sm text-blue-600 hover:underline"
              >
                ← Back to List
              </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{editData ? "Edit" : "Create"} Bed Management Master</h1>
          </motion.div>
          {renderStepIndicator()}
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-8">{renderStepContent()}</div>
        </div>
        <div className="flex justify-between items-center mt-8 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200 font-medium ${
              currentStep === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            <ArrowLeft size={18} /> Back
          </button>
          <div className="text-gray-500 text-sm">Step {currentStep + 1} of {steps.length}</div>
          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
            >
              <Save size={18} /> {editData ? "Update" : "Save"} & Finish
            </button>
          ) : (
            <button onClick={nextStep} className="btn view-btn">
              Next <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BedMaster;
