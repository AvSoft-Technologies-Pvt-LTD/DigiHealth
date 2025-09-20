import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";

const BedMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editData = location.state?.editData;
  const isEditMode = !!editData;

  const [roomAddErrors, setRoomAddErrors] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [bedMasterData, setBedMasterData] = useState({
    departments: [],
    wards: [],
    rooms: [],
    beds: [],
    roomAmenities: [],
    bedAmenities: [],
    selectedDepartment: null,
    selectedWard: null,
    selectedRoom: null,
    selectedBed: null,
    activeDepartmentId: null,
    activeWardId: null,
    activeRoomId: null,
    roomAmenitiesByWard: {},
    bedAmenitiesByRoom: {},
  });

  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecializationId, setSelectedSpecializationId] = useState("");
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [specializationError, setSpecializationError] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomNumber, setNewRoomNumber] = useState("");
  const [bedCount, setBedCount] = useState(1);
  const [bedCountByRoom, setBedCountByRoom] = useState({});
  const [newRoomNameByWard, setNewRoomNameByWard] = useState({});
  const [addingWard, setAddingWard] = useState({});
  const [editingNameById, setEditingNameById] = useState({});
  const [addingRoomByWard, setAddingRoomByWard] = useState({});

  const hardcodedSpecializations = [
    { id: "hard1", name: "ENT" },
    { id: "hard2", name: "Pediatrics" },
    { id: "hard3", name: "Orthopedics" },
  ];

  const combinedSpecializations = [...hardcodedSpecializations, ...specializations];

  const steps = [
    { id: 0, title: "Department Setup", icon: Building, color: "text-[var(--primary-color)]" },
    { id: 1, title: "Ward Creation", icon: Building2, color: "text-purple-600" },
    { id: 2, title: "Room & Amenities", icon: Door, color: "text-[var(--accent-color)]" },
    { id: 3, title: "Bed Configuration", icon: Bed, color: "text-orange-600" },
    { id: 4, title: "Review & Save", icon: Check, color: "text-gray-600" },
  ];

  const wardTypes = [
    {
      id: "general",
      name: "General Ward",
      icon: Users,
      color: "bg-blue-50 text-blue-700 border-blue-200",
      description: "Multi-bed general patient care",
    },
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

  // Populate edit form when editData is present
  useEffect(() => {
    if (!editData) return;
    const base = Date.now();
    const defaultRoomAmenities = ["ac", "wifi"];
    const defaultBedAmenities = ["monitor", "sidetable"];

    const safeRooms = Array.isArray(editData.rooms) ? editData.rooms : [];
    const safeBeds = Array.isArray(editData.beds) ? editData.beds : [];
    const roomKeyToId = {};

    const roomsMapped = safeRooms.map((room, i) => {
      const incomingKey = room.roomNumber || room.number || room.name || `roomIdx-${i}`;
      const generatedId = `room-${base}-${i}`;
      roomKeyToId[incomingKey] = generatedId;
      return {
        id: generatedId,
        name:
          room.name ||
          `${editData.department || "Dept"} - ${editData.ward || "Ward"} - Room ${i + 1}`,
        number: room.roomNumber || room.number || incomingKey,
        wardId: null,
        amenities: Array.isArray(room.amenities) && room.amenities.length > 0
          ? room.amenities
          : room.roomAmenities || defaultRoomAmenities,
        ...( "capacity" in room ? { capacity: room.capacity } : {}),
      };
    });

    const wardId = `ward-${base}-1`;
    const departmentId = `dept-${base}-1`;
    const roomsWithWard = roomsMapped.map((r) => ({ ...r, wardId }));

    const bedsMapped = safeBeds.map((bed, idx) => {
      const incomingRoomKey = bed.roomNumber || bed.room || bed.roomId || bed.roomName || null;
      let mappedRoomId = null;
      if (incomingRoomKey && roomKeyToId[incomingRoomKey]) {
        mappedRoomId = roomKeyToId[incomingRoomKey];
      } else {
        if (bed.roomName) {
          const found = roomsWithWard.find((r) => r.name === bed.roomName || r.number === bed.roomName);
          if (found) mappedRoomId = found.id;
        }
        mappedRoomId = mappedRoomId || (roomsWithWard.length > 0 ? roomsWithWard[0].id : `room-${base}-0`);
      }
      return {
        id: `bed-${base}-${idx}`,
        name: bed.name || `Bed ${idx + 1}`,
        number: `${mappedRoomId}-${idx + 1}`,
        roomId: mappedRoomId,
        status: bed.status || (idx < (editData.occupied || 0) ? "occupied" : "available"),
        wardId: wardId,
        amenities: Array.isArray(bed.amenities) && bed.amenities.length > 0
          ? bed.amenities
          : bed.bedAmenities || defaultBedAmenities,
      };
    });

    const department = { id: departmentId, name: editData.department || "Unknown Department", locked: true };
    const ward = { id: wardId, name: editData.ward || "Ward 1", type: (editData.ward || "").toLowerCase() || "general", departmentId: department.id };

    const roomAmenitiesByWard = {};
    roomsWithWard.forEach((r) => {
      roomAmenitiesByWard[ward.id] = [...(roomAmenitiesByWard[ward.id] || []), ...(Array.isArray(r.amenities) ? r.amenities : [])];
    });
    Object.keys(roomAmenitiesByWard).forEach((k) => {
      roomAmenitiesByWard[k] = Array.from(new Set(roomAmenitiesByWard[k]));
    });

    const bedAmenitiesByRoom = {};
    bedsMapped.forEach((b) => {
      bedAmenitiesByRoom[b.roomId] = [...(bedAmenitiesByRoom[b.roomId] || []), ...(Array.isArray(b.amenities) ? b.amenities : [])];
    });
    Object.keys(bedAmenitiesByRoom).forEach((k) => {
      bedAmenitiesByRoom[k] = Array.from(new Set(bedAmenitiesByRoom[k]));
    });

    setBedMasterData((prev) => ({
      ...prev,
      departments: [department],
      wards: [ward],
      rooms: roomsWithWard,
      beds: bedsMapped,
      selectedDepartment: department,
      selectedWard: ward,
      selectedRoom: roomsWithWard.length > 0 ? roomsWithWard[0] : null,
      activeDepartmentId: department.id,
      activeWardId: ward.id,
      activeRoomId: roomsWithWard.length > 0 ? roomsWithWard[0].id : null,
      roomAmenitiesByWard,
      bedAmenitiesByRoom,
    }));
  }, [editData]);

  // fetch specializations (kept but non-blocking)
  const fetchSpecializations = async () => {
    setLoadingSpecializations(true);
    setSpecializationError(null);
    try {
      const response = await fetch("/api/master/specializations", {
        method: "GET",
        mode: "cors",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to fetch specializations");
      const data = await response.json();
      setSpecializations(Array.isArray(data) ? data : []);
    } catch (error) {
      setSpecializationError("Failed to load specializations. Using hardcoded data.");
      console.error("Fetch error:", error);
    } finally {
      setLoadingSpecializations(false);
    }
  };

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const checkBedOccupancy = (wardName, departmentName) => {
    try {
      const ipdData = JSON.parse(localStorage.getItem("ipdPatients") || "[]");
      return ipdData.filter(
        (patient) =>
          patient.status === "Admitted" &&
          patient.ward?.includes(wardName) &&
          patient.department === departmentName
      ).length;
    } catch (error) {
      console.error("Error checking bed occupancy:", error);
      return 0;
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0: return bedMasterData.departments.length > 0;
      case 1: return bedMasterData.wards.length > 0;
      case 2: return Array.isArray(bedMasterData.rooms) && bedMasterData.rooms.length > 0;
      case 3: return Array.isArray(bedMasterData.beds) && bedMasterData.beds.length > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (canGoNext()) setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    else toast.warning("Please complete the current step before proceeding.");
  };

  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const addDepartment = (specializationData) => {
    if (!specializationData) return;
    const departmentName = specializationData.name || specializationData.specializationName || specializationData.description;
    const existingDept = bedMasterData.departments.find((d) => d.name === departmentName);
    if (existingDept) {
      toast.warning("Department already exists");
      return;
    }
    const newDept = {
      id: `dept-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: departmentName,
      specializationId: specializationData.id || specializationData.specializationId,
      createdAt: new Date().toISOString(),
    };
    setBedMasterData((prev) => ({ ...prev, departments: [...prev.departments, newDept] }));
    setSelectedSpecializationId("");
    toast.success("Department added successfully");
  };

  const addWard = async (wardTypeId, departmentId) => {
    try {
      setAddingWard((prev) => ({ ...prev, [`${departmentId}_${wardTypeId}`]: true }));
      const wardCount = bedMasterData.wards.filter(
        (w) => String(w.departmentId) === String(departmentId) && String(w.type) === String(wardTypeId)
      ).length;
      const wardType = wardTypes.find((t) => String(t.id) === String(wardTypeId));
      const defaultName = `${wardType?.name || "Ward"} ${wardCount + 1}`;
      const newWard = {
        id: `ward-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: defaultName,
        type: wardTypeId,
        departmentId,
      };
      setBedMasterData((prev) => ({
        ...prev,
        wards: [...prev.wards, newWard],
        selectedDepartment: prev.selectedDepartment,
        activeDepartmentId: departmentId,
      }));
      setTimeout(() => setBedMasterData((prev) => ({ ...prev, selectedWard: newWard })), 120);
      toast.success("Ward added successfully");
      return newWard;
    } catch (err) {
      console.error("Failed to add ward", err);
      toast.error("Failed to add ward");
      return null;
    } finally {
      setAddingWard((prev) => {
        const next = { ...prev };
        delete next[`${departmentId}_${wardTypeId}`];
        return next;
      });
    }
  };

  const addRoom = async (roomName, roomNumber, wardId, wardAmenities) => {
    try {
      setBedMasterData((prev) => ({ ...prev, activeWardId: wardId }));
      const newRoom = {
        id: `room-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: roomName,
        number: roomNumber,
        wardId,
        amenities: wardAmenities || [],
      };
      setBedMasterData((prev) => ({
        ...prev,
        rooms: [...prev.rooms, newRoom],
        activeWardId: null,
        selectedRoom: newRoom,
        roomAmenitiesByWard: {
          ...prev.roomAmenitiesByWard,
          [wardId]: Array.from(new Set([...(prev.roomAmenitiesByWard[wardId] || []), ...(wardAmenities || [])])),
        },
      }));
      toast.success("Room added successfully");
    } catch (err) {
      console.error("addRoom error:", err);
      setBedMasterData((prev) => ({ ...prev, activeWardId: null }));
    }
  };

  const addBed = async (roomId, count = 1) => {
    try {
      setBedMasterData((prev) => ({ ...prev, activeRoomId: roomId }));
      const room = bedMasterData.rooms.find((r) => String(r.id) === String(roomId));
      const existingCount = bedMasterData.beds.filter((b) => String(b.roomId) === String(roomId)).length;
      const newBeds = Array.from({ length: count }).map((_, idx) => ({
        id: `bed-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
        name: `Bed ${existingCount + idx + 1}`,
        number: `${roomId}-${existingCount + idx + 1}`,
        roomId,
        status: "available",
        amenities: Array.isArray(room?.amenities) ? room.amenities : [],
      }));
      setBedMasterData((prev) => ({
        ...prev,
        beds: [...prev.beds, ...newBeds],
        activeRoomId: null,
        selectedBed: newBeds[0] || prev.selectedBed,
        bedAmenitiesByRoom: {
          ...prev.bedAmenitiesByRoom,
          [roomId]: Array.from(new Set([...(prev.bedAmenitiesByRoom[roomId] || []), ...(Array.isArray(room?.amenities) ? room.amenities : [])])),
        },
      }));
      toast.success(`${count} bed(s) added successfully`);
    } catch (err) {
      console.error("addBed error:", err);
      setBedMasterData((prev) => ({ ...prev, activeRoomId: null }));
    }
  };

  const deleteDepartment = (id) => {
    setBedMasterData((prev) => ({
      ...prev,
      departments: prev.departments.filter((d) => d.id !== id),
      wards: prev.wards.filter((w) => w.departmentId !== id),
    }));
    toast.success("Department deleted successfully");
  };

  const deleteWard = async (wardId) => {
    try {
      setBedMasterData((prev) => {
        const newWards = prev.wards.filter((w) => String(w.id) !== String(wardId));
        const selectedWard = prev.selectedWard?.id === wardId ? null : prev.selectedWard;
        const newRoomAmenitiesByWard = { ...prev.roomAmenitiesByWard };
        delete newRoomAmenitiesByWard[wardId];
        // also delete rooms and beds belonging to this ward
        const remainingRooms = prev.rooms.filter((r) => String(r.wardId) !== String(wardId));
        const remainingBeds = prev.beds.filter((b) => {
          const roomBelongs = prev.rooms.find((r) => String(r.id) === String(b.roomId));
          return roomBelongs && String(roomBelongs.wardId) !== String(wardId);
        });
        return {
          ...prev,
          wards: newWards,
          selectedWard,
          rooms: remainingRooms,
          beds: remainingBeds,
          roomAmenitiesByWard: newRoomAmenitiesByWard,
        };
      });
      toast.success("Ward deleted successfully");
    } catch (err) {
      console.error("deleteWard error:", err);
    }
  };

  const deleteRoom = async (roomId) => {
    try {
      setBedMasterData((prev) => {
        const newRooms = prev.rooms.filter((r) => String(r.id) !== String(roomId));
        const selectedRoom = prev.selectedRoom?.id === roomId ? null : prev.selectedRoom;
        const newBeds = prev.beds.filter((b) => String(b.roomId) !== String(roomId));
        const newBedAmenitiesByRoom = { ...prev.bedAmenitiesByRoom };
        delete newBedAmenitiesByRoom[roomId];
        return { ...prev, rooms: newRooms, beds: newBeds, selectedRoom, bedAmenitiesByRoom: newBedAmenitiesByRoom };
      });
      toast.success("Room deleted successfully");
    } catch (err) {
      console.error("deleteRoom error:", err);
    }
  };

  const deleteBed = async (bedId) => {
    try {
      setBedMasterData((prev) => {
        const newBeds = prev.beds.filter((b) => String(b.id) !== String(bedId));
        const selectedBed = prev.selectedBed?.id === bedId ? null : prev.selectedBed;
        return { ...prev, beds: newBeds, selectedBed };
      });
      toast.success("Bed deleted successfully");
    } catch (err) {
      console.error("deleteBed error:", err);
    }
  };

  // ---------------------------
  // handleSave - critical fix for edit propagation
  // ---------------------------
  const handleSave = () => {
    // Create summary entries for each ward in bedMasterData
    const summaryData = bedMasterData.wards.map((ward) => {
      const department = bedMasterData.departments.find((d) => String(d.id) === String(ward.departmentId));
      const wardRooms = bedMasterData.rooms.filter((r) => String(r.wardId) === String(ward.id));
      const wardBeds = bedMasterData.beds.filter((b) => wardRooms.some((room) => String(room.id) === String(b.roomId)));
      const occupiedBeds = wardBeds.filter((b) => b.status === "occupied").length;
      return {
        // temporarily assign id; we'll preserve editData.id for the first ward if editing
        id: `master-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        department: department?.name || "Unknown",
        ward: ward.name,
        rooms: wardRooms.map((room) => ({
          id: room.id,
          name: room.name,
          number: room.number,
          roomNumber: room.number,
          amenities: room.amenities || [],
          roomAmenities: room.amenities || [],
          capacity: room.capacity,
        })),
        beds: wardBeds.map((bed) => ({
          id: bed.id,
          name: bed.name,
          number: bed.number,
          roomId: bed.roomId,
          roomNumber: wardRooms.find((r) => String(r.id) === String(bed.roomId))?.number,
          roomName: wardRooms.find((r) => String(r.id) === String(bed.roomId))?.name,
          status: bed.status || "available",
          amenities: bed.amenities || [],
          bedAmenities: bed.amenities || [],
        })),
        totalBeds: wardBeds.length,
        occupied: occupiedBeds,
        available: wardBeds.length - occupiedBeds,
        status: "Active",
        roomAmenitiesByWard: bedMasterData.roomAmenitiesByWard,
        bedAmenitiesByRoom: bedMasterData.bedAmenitiesByRoom,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    // compute how many new wards/rooms/beds added vs incoming editData (for user confirmation)
    const origWardCount = editData ? 1 : 0;
    const origRoomCount = editData?.rooms?.length || 0;
    const origBedCount = editData?.beds?.length || 0;

    const totalRoomsAfter = summaryData.reduce((acc, s) => acc + (Array.isArray(s.rooms) ? s.rooms.length : 0), 0);
    const totalBedsAfter = summaryData.reduce((acc, s) => acc + (Array.isArray(s.beds) ? s.beds.length : 0), 0);

    const newWardCount = Math.max(0, summaryData.length - origWardCount);
    const newRoomCount = Math.max(0, totalRoomsAfter - origRoomCount);
    const newBedCount = Math.max(0, totalBedsAfter - origBedCount);

    if (isEditMode && (newWardCount > 0 || newRoomCount > 0 || newBedCount > 0)) {
      const messageParts = [];
      if (newWardCount > 0) messageParts.push(`${newWardCount} new ward(s)`);
      if (newRoomCount > 0) messageParts.push(`${newRoomCount} new room(s)`);
      if (newBedCount > 0) messageParts.push(`${newBedCount} new bed(s)`);
      const proceed = window.confirm(
        `You're about to update this master and add ${messageParts.join(", ")}.\n\nProceed and save changes?`
      );
      if (!proceed) return;
    }

    try {
      const existingData = JSON.parse(localStorage.getItem("bedMasterData") || "[]");
      let updatedData;

      if (isEditMode && editData?.id) {
        // Remove the old master from existingData (if present)
        const remaining = existingData.filter((item) => item.id !== editData.id);

        // For the summaryData, preserve the original id/createdAt for the first summarized ward (primary)
        const mappedSummary = summaryData.map((s, idx) => {
          if (idx === 0) {
            return { ...s, id: editData.id, createdAt: editData.createdAt || s.createdAt };
          }
          // others remain as new entries with their generated ids
          return s;
        });

        updatedData = [...remaining, ...mappedSummary];

        toast.success("Bed management configuration updated successfully!");
      } else {
        // Create new entries
        updatedData = [...existingData, ...summaryData];
        toast.success("Bed management configuration saved successfully!");
      }

      // persist
      localStorage.setItem("bedMasterData", JSON.stringify(updatedData));

      // update IPD patients if editing (keeps relationships consistent)
      if (isEditMode) {
        try {
          const ipdPatients = JSON.parse(localStorage.getItem("ipdPatients") || "[]");
          const updatedIpdPatients = ipdPatients.map((patient) => {
            if (patient.department === editData.department && patient.ward === editData.ward) {
              const updatedPatient = { ...patient };
              // try to remap bed ids/numbers from summaryData
              summaryData.forEach((summary) => {
                summary.beds.forEach((bed) => {
                  if (patient.bedNumber === bed.number || patient.bedId === bed.id) {
                    updatedPatient.bedId = bed.id;
                    updatedPatient.bedNumber = bed.number;
                    updatedPatient.roomNumber = bed.roomNumber;
                    updatedPatient.roomName = bed.roomName;
                  }
                });
              });
              return updatedPatient;
            }
            return patient;
          });
          localStorage.setItem("ipdPatients", JSON.stringify(updatedIpdPatients));
        } catch (err) {
          console.error("Error updating ipdPatients mapping:", err);
        }
      }

      // Emit events: try StorageEvent (best-effort) and always CustomEvent
      try {
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "bedMasterData",
            newValue: JSON.stringify(updatedData),
            url: window.location.href,
          })
        );
      } catch (err) {
        // ignore
      }
      window.dispatchEvent(new CustomEvent("bedMasterUpdated", { detail: updatedData }));

      navigate("/doctordashboard/bedroommanagement");
    } catch (error) {
      console.error("Error saving to localStorage:", error);
      toast.error("Failed to save configuration. Please try again.");
    }
  };

  // ---------- Render helpers (same logic as your code) ----------
  const renderStepIndicator = () => (
    <div className="max-w-7xl mx-auto mb-6 sm:mb-8 px-2 sm:px-4 w-full">
      <div className="flex items-center justify-center w-full overflow-hidden">
        <div className="flex items-center justify-center w-full space-x-1 sm:space-x-2 md:space-x-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const IconComponent = step.icon;
            return (
              <React.Fragment key={step.id}>
                <motion.div
                  className="flex flex-col items-center min-w-[60px] sm:min-w-[80px] md:min-w-[100px]"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                      isCompleted
                        ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)] shadow-lg"
                        : isCurrent
                        ? "bg-[var(--accent-color)] text-white border-[var(--accent-color)] shadow-xl transform scale-110"
                        : "bg-white text-gray-400 border-gray-300"
                    }`}
                  >
                    <IconComponent size={14} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  </div>
                  <div className={`mt-1 text-center transition-all duration-300 text-[10px] sm:text-xs md:text-sm ${isCurrent ? "text-[var(--primary-color)] font-semibold" : "text-gray-500"}`}>
                    {step.title}
                  </div>
                </motion.div>
                {index < steps.length - 1 && (
                  <div className={`hidden sm:flex flex-1 h-0.5 mx-1 sm:mx-2 md:mx-4 transition-all duration-300 ${isCompleted ? "bg-[var(--primary-color)]" : "bg-gray-300"}`} />
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
      {!isEditMode && (
        <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm">
          <h3 className="text-base sm:text-lg font-semibold mb-4">Add Department from Specializations</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <select
                value={selectedSpecializationId}
                onChange={(e) => setSelectedSpecializationId(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] appearance-none bg-white"
                disabled={loadingSpecializations}
              >
                <option value="">Select a specialization</option>
                {combinedSpecializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name || spec.specializationName || spec.description || "Unknown Specialization"}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (selectedSpecializationId) {
                    const specializationData = combinedSpecializations.find((spec) => spec.id === selectedSpecializationId);
                    addDepartment(specializationData);
                  }
                }}
                disabled={!selectedSpecializationId || loadingSpecializations}
                className="btn btn-primary flex-shrink-0"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>
          {specializationError && <p className="text-red-500 text-sm mt-2">{specializationError}</p>}
          {loadingSpecializations && <p className="text-[var(--accent-color)] text-sm mt-2 flex items-center gap-2"><Loader2 size={16} className="animate-spin" />Loading specializations...</p>}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <AnimatePresence>
          {bedMasterData.departments.map((dept) => (
            <motion.div key={dept.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`bg-white rounded-lg p-4 border shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer ${bedMasterData.selectedDepartment?.id === dept.id ? "border-[var(--accent-color)] ring-2 ring-[var(--accent-color)] ring-opacity-20" : "border-gray-200"}`} onClick={() => setBedMasterData((prev) => ({ ...prev, selectedDepartment: dept }))}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-[var(--primary-color)] rounded-full flex items-center justify-center flex-shrink-0">
                    <Building className="text-white" size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    {bedMasterData.selectedDepartment?.id === dept.id && editingNameById[dept.id] ? (
                      <input value={editingNameById[dept.id]} onChange={(e) => setEditingNameById((prev) => ({ ...prev, [dept.id]: e.target.value }))} onBlur={() => {
                        const newName = editingNameById[dept.id]?.trim();
                        if (newName) setBedMasterData((prev) => ({ ...prev, departments: prev.departments.map((d) => d.id === dept.id ? { ...d, name: newName } : d) }));
                        setEditingNameById((prev) => ({ ...prev, [dept.id]: undefined }));
                      }} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} className="text-base font-semibold bg-white px-2 py-1 rounded border w-full" />
                    ) : (
                      <h3 className="text-base font-semibold text-gray-900 truncate cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditingNameById((prev) => ({ ...prev, [dept.id]: dept.name })); }}>
                        {dept.name}
                      </h3>
                    )}
                    <p className="text-sm text-gray-600">Wards: {bedMasterData.wards.filter((w) => String(w.departmentId) === String(dept.id)).length}</p>
                  </div>
                </div>
                {!dept.locked && (
                  <button onClick={(e) => { e.stopPropagation(); deleteDepartment(dept.id); }} className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                )}
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
        bedMasterData.departments.map((department) => {
          const isActiveDepartment = String(bedMasterData.selectedDepartment?.id) === String(department.id);
          const isAddingWard = String(bedMasterData.activeDepartmentId) === String(department.id);
          return (
            <div key={department.id} className={`bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm mb-6 cursor-pointer ${isActiveDepartment || isAddingWard ? "ring-2 ring-green-500 border-green-500 bg-green-50" : ""}`} onClick={() => setBedMasterData((prev) => ({ ...prev, selectedDepartment: isActiveDepartment ? null : department }))}>
              <h3 className="text-base sm:text-lg font-semibold mb-4 text-gray-900 flex items-center gap-2"><Building className="text-[var(--primary-color)]" size={16} /> <span className="break-words">Ward Creation ({department.name})</span></h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 mb-4">
                {wardTypes.map((wardType) => {
                  const IconComponent = wardType.icon;
                  const wardCount = bedMasterData.wards.filter((w) => String(w.departmentId) === String(department.id) && String(w.type) === String(wardType.id)).length;
                  return (
                    <motion.div key={wardType.id} className={`relative p-3 sm:p-4 rounded-lg border transition-all duration-200 ${wardCount > 0 ? "bg-green-50 border-green-200" : wardType.color}`} whileHover={{ scale: 1.02 }}>
                      <button onClick={async (e) => {
                        e.stopPropagation();
                        setBedMasterData((prev) => ({ ...prev, selectedDepartment: department, activeDepartmentId: department.id }));
                        await addWard(wardType.id, department.id);
                      }} disabled={!!addingWard[`${department.id}_${wardType.id}`]} className="absolute top-3 right-3 inline-flex items-center gap-1 text-xs text-[var(--accent-color)] font-medium">
                        <Plus size={12} />
                        {addingWard[`${department.id}_${wardType.id}`] ? "Adding..." : "Add Ward"}
                      </button>

                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <IconComponent size={14} />
                          <span className="font-medium text-xs sm:text-sm">{wardType.name}</span>
                        </div>
                      </div>
                      <p className="text-xs opacity-70 text-left mb-6">{wardType.description}</p>
                      {wardCount > 0 && <span className="absolute bottom-3 right-3 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">{wardCount} added</span>}
                    </motion.div>
                  );
                })}
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">Created Wards:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  <AnimatePresence>
                    {bedMasterData.wards.filter((w) => String(w.departmentId) === String(department.id)).map((ward) => {
                      const wardType = wardTypes.find((t) => String(t.id) === String(ward.type));
                      const IconComponent = wardType?.icon || Building2;
                      const isHighlighted = String(bedMasterData.selectedWard?.id) === String(ward.id);
                      return (
                        <motion.div key={ward.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${isHighlighted ? "border-[var(--accent-color)] bg-[var(--accent-color)] bg-opacity-10 ring-1 ring-[var(--accent-color)]" : wardType?.color || "bg-gray-50"}`} onClick={() => setBedMasterData((prev) => ({ ...prev, selectedWard: ward }))}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <IconComponent size={14} />
                            <div className="min-w-0">
                              {bedMasterData.selectedWard?.id === ward.id && editingNameById[ward.id] ? (
                                <input value={editingNameById[ward.id]} onChange={(e) => setEditingNameById((prev) => ({ ...prev, [ward.id]: e.target.value }))} onBlur={() => {
                                  const newName = editingNameById[ward.id]?.trim();
                                  if (newName) setBedMasterData((prev) => ({ ...prev, wards: prev.wards.map((w) => w.id === ward.id ? { ...w, name: newName } : w) }));
                                  setEditingNameById((prev) => ({ ...prev, [ward.id]: undefined }));
                                }} onKeyDown={(e) => e.key === "Enter" && e.target.blur()} className="text-sm font-medium block truncate bg-white px-1 py-0.5 rounded border" />
                              ) : (
                                <span className="font-medium text-sm block truncate cursor-pointer" onClick={(e) => { e.stopPropagation(); setEditingNameById((prev) => ({ ...prev, [ward.id]: ward.name })); }}>
                                  {ward.name}
                                </span>
                              )}
                              <div className="text-xs opacity-70">{wardType?.description}</div>
                            </div>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); deleteWard(ward.id); }} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors flex-shrink-0"><Trash2 size={12} /></button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })
      )}
    </motion.div>
  );

  const renderRoomStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Door className="text-[var(--accent-color)]" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Room & Amenities Setup</h2>
      </div>

      {bedMasterData.wards.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <Building2 className="mx-auto mb-4 text-gray-400" size={40} />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">No Wards Created</h3>
          <p className="text-sm sm:text-base text-gray-500">Please create wards first</p>
        </div>
      ) : (
        bedMasterData.wards.map((ward) => {
          const department = bedMasterData.departments.find((d) => String(d.id) === String(ward.departmentId));
          const isActiveWard = String(bedMasterData.selectedWard?.id) === String(ward.id);
          const isAddingRoom = String(bedMasterData.activeWardId) === String(ward.id);
          const wardAmenities = bedMasterData.roomAmenitiesByWard?.[ward.id] || [];
          const prefix = `${department?.name || "Dept"} - ${ward.name} - `;
          const fullStored = newRoomNameByWard?.[ward.id] || prefix;
          const inputRoomNo = fullStored.split("-").pop().trim();

          return (
            <div key={ward.id} className={`bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm mb-6 cursor-pointer ${isActiveWard || isAddingRoom ? "ring-2 ring-[var(--accent-color)] border-[var(--accent-color)] bg-[var(--accent-color)]/5" : ""}`} onClick={() => {
              setBedMasterData((prev) => ({ ...prev, selectedWard: isActiveWard ? null : ward, activeWardId: ward.id }));
              setNewRoomNameByWard((prev) => ({ ...prev, [ward.id]: prefix }));
            }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Building2 className="text-purple-600" size={16} />
                  <div>
                    <div className="text-xs text-gray-500">Department - Ward</div>
                    <div className="font-semibold text-gray-900 text-sm truncate">{department?.name || "Unknown"} - {ward.name}</div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setBedMasterData((prev) => ({ ...prev, selectedWard: isActiveWard ? null : ward, activeWardId: ward.id })); }} className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 shadow-sm" title="Ward actions">
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room No:</label>
                <div className="flex items-center gap-3">
                  <input type="text" value={inputRoomNo} onChange={(e) => {
                    const rawRoomNo = e.target.value;
                    setRoomAddErrors((prev) => { const next = { ...prev }; delete next[ward.id]; return next; });
                    setBedMasterData((prev) => ({ ...prev, selectedWard: ward, activeWardId: ward.id }));
                    setNewRoomNameByWard((prev) => ({ ...prev, [ward.id]: `${prefix}${rawRoomNo}` }));
                  }} placeholder="e.g. 101" className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:outline-none text-sm ${roomAddErrors[ward.id] ? "border-red-400 focus:ring-red-300" : "border-gray-300 focus:ring-[var(--accent-color)]"}`} onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRoom(ward, department, wardAmenities);
                    }
                  }} />
                  <button onClick={(e) => { e.stopPropagation(); handleAddRoom(ward, department, wardAmenities); }} disabled={!!addingRoomByWard[ward.id]} className={`btn view-btn flex-shrink-0 text-sm ${addingRoomByWard[ward.id] ? "opacity-60 cursor-not-allowed" : ""}`}>
                    <Plus size={14} /> {addingRoomByWard[ward.id] ? "Adding..." : "Add Room"}
                  </button>
                </div>
                {roomAddErrors[ward.id] && <div className="mt-2 text-xs text-red-600">{roomAddErrors[ward.id]}</div>}

                <div className="mt-3">
                  <div className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2"><Settings size={14} /> Amenities</div>
                  <div className="flex flex-wrap gap-2">
                    {roomAmenityOptions.map((amenity) => {
                      const IconComponent = amenity.icon;
                      const isSelected = wardAmenities.includes(amenity.id);
                      return (
                        <button key={amenity.id} onClick={(e) => {
                          e.stopPropagation();
                          setBedMasterData((prev) => {
                            const prevWardAmenities = prev.roomAmenitiesByWard?.[ward.id] || [];
                            const nextWardAmenities = prevWardAmenities.includes(amenity.id) ? prevWardAmenities.filter((id) => id !== amenity.id) : [...prevWardAmenities, amenity.id];
                            return {
                              ...prev,
                              selectedWard: ward,
                              activeWardId: ward.id,
                              roomAmenitiesByWard: { ...(prev.roomAmenitiesByWard || {}), [ward.id]: nextWardAmenities },
                            };
                          });
                        }} className={`flex items-center justify-center px-3 py-2 rounded-lg border transition-all duration-200 text-sm space-x-2 ${isSelected ? "border-[var(--accent-color)] bg-[var(--accent-color)] text-white shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50 hover:border-[var(--accent-color)]"}`}>
                          <IconComponent className={isSelected ? "text-white" : amenity.color} size={14} />
                          <span className="text-xs font-medium ml-1">{amenity.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <AnimatePresence>
                  {Array.isArray(bedMasterData.rooms) && bedMasterData.rooms.filter((r) => String(r.wardId) === String(ward.id)).map((room) => {
                    const isHighlighted = String(bedMasterData.selectedRoom?.id) === String(room.id);
                    const roomNumberOnly = String(room.name || "").split("-").pop().trim();
                    return (
                      <motion.div key={room.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.08)" }} className={`relative rounded-lg p-4 border border-gray-200 bg-white shadow-md ${isHighlighted ? "ring-2 ring-[var(--accent-color)]" : ""}`}>
                        <button onClick={(e) => { e.stopPropagation(); deleteRoom(room.id); }} className="absolute top-3 right-3 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-red-50 hover:bg-red-100 text-red-600 shadow-sm">
                          <Trash2 size={18} />
                        </button>
                        <div className="mb-3">
                          <div className="text-xs text-gray-500">Room No:</div>
                          <div className="font-semibold text-gray-800 text-lg">{roomNumberOnly}</div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(room.amenities) && room.amenities.map((amenityId) => {
                            const amenity = roomAmenityOptions.find((a) => a.id === amenityId);
                            if (!amenity) return null;
                            const IconComponent = amenity.icon;
                            return (
                              <span key={amenityId} className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 shadow-sm" title={amenity.name}>
                                <IconComponent className={amenity.color} size={16} />
                              </span>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })
      )}
    </motion.div>
  );

  const renderBedStep = () => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Bed className="text-orange-600" size={20} />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Bed Configuration</h2>
      </div>

      {bedMasterData.rooms.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <Door className="mx-auto mb-4 text-gray-400" size={40} />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600">No Rooms Created</h3>
          <p className="text-sm sm:text-base text-gray-500">Please create rooms first</p>
        </div>
      ) : (
        bedMasterData.rooms.map((room) => {
          const ward = bedMasterData.wards.find((w) => String(w.id) === String(room.wardId));
          const department = bedMasterData.departments.find((d) => String(d.id) === String(ward?.departmentId));
          const isActiveRoom = String(bedMasterData.selectedRoom?.id) === String(room.id);
          const isAddingBed = String(bedMasterData.activeRoomId) === String(room.id);
          const roomBedAmenities = bedMasterData.bedAmenitiesByRoom?.[room.id] || room.amenities || [];

          return (
            <div key={room.id} className={`bg-white rounded-lg p-4 sm:p-6 border border-gray-200 shadow-sm mb-6 ${isActiveRoom || isAddingBed ? "ring-2 ring-[var(--accent-color)] border-[var(--accent-color)] bg-[var(--accent-color)] bg-opacity-10" : ""}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Door className="text-[var(--accent-color)]" size={16} />
                  <span className="break-words">Bed Configuration - {room.name}</span>
                </h3>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold mb-2 text-gray-700 flex items-center gap-2"><Settings size={14} /> Bed Amenities</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {bedAmenityOptions.map((amenity) => {
                    const IconComponent = amenity.icon;
                    const isSelected = roomBedAmenities.includes(amenity.id);
                    return (
                      <button key={amenity.id} onClick={() => {
                        setBedMasterData((prev) => {
                          const updatedRoom = {
                            ...room,
                            amenities: isSelected ? (room.amenities?.filter((id) => id !== amenity.id) || []) : [...(room.amenities || []), amenity.id],
                          };
                          const updatedBedAmenitiesByRoom = { ...prev.bedAmenitiesByRoom, [room.id]: updatedRoom.amenities };
                          return {
                            ...prev,
                            rooms: prev.rooms.map((r) => String(r.id) === String(room.id) ? updatedRoom : r),
                            bedAmenitiesByRoom: updatedBedAmenitiesByRoom,
                            beds: prev.beds.map((b) => String(b.roomId) === String(room.id) ? { ...b, amenities: updatedRoom.amenities } : b),
                          };
                        });
                      }} className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${isSelected ? "border-orange-500 bg-orange-50 shadow-sm" : "border-gray-200 bg-white hover:bg-gray-50 hover:border-orange-300"}`}>
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <IconComponent className={amenity.color} size={12} />
                          <span className="text-xs font-medium truncate">{amenity.name}</span>
                        </div>
                        <div className={`w-4 h-2 flex items-center rounded-full p-0.5 transition-all duration-200 flex-shrink-0 ${isSelected ? "bg-orange-500 justify-end" : "bg-gray-300 justify-start"}`}>
                          <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4">
                <input type="number" min="1" max="20" value={bedCountByRoom[room.id] ?? 1} onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  setBedCountByRoom((prev) => ({ ...prev, [room.id]: isNaN(v) ? 1 : Math.max(1, Math.min(20, v)) }));
                }} placeholder="Beds" className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm w-full sm:w-20" />

                <button onClick={async () => {
                  if (!room.number) return;
                  const count = Math.max(1, parseInt(bedCountByRoom[room.id] ?? 1, 10));
                  setBedMasterData((prev) => ({ ...prev, selectedRoom: room, activeRoomId: room.id }));
                  await addBed(room.id, count);
                }} disabled={!room.number || String(bedMasterData.activeRoomId) === String(room.id)} className="btn view-btn text-sm flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus size={14} /> Add Beds
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                <AnimatePresence>
                  {Array.isArray(bedMasterData.beds) && bedMasterData.beds.filter((b) => String(b.roomId) === String(room.id)).map((bed) => {
                    const statusColorsMap = { available: "bg-green-500", occupied: "bg-red-500", maintenance: "bg-yellow-500", reserved: "bg-blue-500" };
                    return (
                      <motion.div key={bed.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Bed className="text-orange-600 flex-shrink-0" size={14} />
                            <span className="font-medium text-xs sm:text-sm truncate">{bed.name}</span>
                          </div>
                          <button onClick={() => deleteBed(bed.id)} className="text-red-500 hover:text-red-600 p-1 rounded hover:bg-red-50 flex-shrink-0"><Trash2 size={10} /></button>
                        </div>

                        <select value={bed.status || "available"} onChange={(e) => {
                          e.stopPropagation();
                          setBedMasterData((prev) => ({ ...prev, beds: prev.beds.map((b) => String(b.id) === String(bed.id) ? { ...b, status: e.target.value } : b) }));
                        }} className="w-full text-xs border border-gray-300 rounded mb-2 px-2 py-1" onClick={(e) => e.stopPropagation()}>
                          <option value="available">Available</option>
                          <option value="occupied">Occupied</option>
                          <option value="maintenance">Maintenance</option>
                          <option value="reserved">Reserved</option>
                        </select>

                        <div className={`h-2 rounded-full ${statusColorsMap[bed.status || "available"]}`} />
                        <div className="flex flex-wrap gap-1 mt-2">
                          {Array.isArray(bed.amenities) && bed.amenities.map((amenityId) => {
                            const amenity = bedAmenityOptions.find((a) => a.id === amenityId);
                            if (!amenity) return null;
                            const IconComponent = amenity.icon;
                            return (
                              <span key={amenityId} className="inline-flex items-center gap-1 px-1 py-0.5 bg-gray-100 rounded-full text-xs" title={amenity.name}>
                                <IconComponent className={amenity.color} size={8} />
                              </span>
                            );
                          })}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          );
        })
      )}
    </motion.div>
  );

  const renderReviewStep = () => {
    const summaryData = bedMasterData.wards.map((ward) => {
      const department = bedMasterData.departments.find((d) => String(d.id) === String(ward.departmentId));
      const wardRooms = bedMasterData.rooms.filter((r) => String(r.wardId) === String(ward.id));
      const wardBeds = bedMasterData.beds.filter((b) => wardRooms.some((room) => String(room.id) === String(b.roomId)));
      const occupiedBeds = wardBeds.filter((b) => b.status === "occupied").length;
      return {
        id: ward.id,
        department: department?.name || "Unknown",
        ward: ward.name,
        rooms: wardRooms.length,
        totalBeds: wardBeds.length,
        occupied: occupiedBeds,
        available: wardBeds.length - occupiedBeds,
        status: "Active",
      };
    });

    const SmallDynamicTable = ({ columns, data }) => (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row[column.accessor]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    const columns = [
      { header: "Department", accessor: "department" },
      { header: "Ward", accessor: "ward" },
      { header: "Rooms", accessor: "rooms" },
      { header: "Total Beds", accessor: "totalBeds" },
      { header: "Occupied", accessor: "occupied" },
      { header: "Available", accessor: "available" },
    ];

    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Check className="text-green-600" size={20} />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Review & Save</h2>
        </div>

        {summaryData.length > 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold pt-4 sm:pt-6 px-4 sm:px-6 pb-2">Data Summary</h3>
            <div className="px-4 sm:px-6 pb-4">
              <SmallDynamicTable columns={columns} data={summaryData} />
            </div>
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
            <AlertTriangle className="mx-auto mb-4 text-gray-400" size={40} />
            <h3 className="text-base sm:text-lg font-semibold text-gray-600">No Data to Review</h3>
            <p className="text-sm sm:text-base text-gray-500">Please add departments, wards, rooms, and beds first.</p>
          </div>
        )}
      </motion.div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderDepartmentStep();
      case 1: return renderWardStep();
      case 2: return renderRoomStep();
      case 3: return renderBedStep();
      case 4: return renderReviewStep();
      default: return null;
    }
  };

  // small helper used by room step
  const handleAddRoom = async (ward, department, wardAmenities) => {
    const wardId = ward.id;
    const key = String(wardId);
    if (addingRoomByWard[key]) return;
    setAddingRoomByWard((p) => ({ ...p, [key]: true }));
    try {
      const prefix = `${department?.name || "Dept"} - ${ward.name} - `;
      const nameToSend = (newRoomNameByWard?.[wardId] || prefix).trim();
      if (!nameToSend) return;
      const numMatch = nameToSend.match(/(\d+(?:-\d+)*)$/);
      const roomNumber = numMatch ? numMatch[1] : "";
      await addRoom(nameToSend, roomNumber, wardId, wardAmenities);
      setNewRoomNameByWard((prev) => {
        const next = { ...prev };
        delete next[wardId];
        return next;
      });
      setBedMasterData((prev) => ({ ...prev, selectedWard: ward, activeWardId: wardId }));
    } catch (err) {
      console.error("addRoom failed", err);
    } finally {
      setAddingRoomByWard((p) => {
        const next = { ...p };
        delete next[key];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-20 p-2 sm:p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <motion.div className="mb-3 sm:mb-4 md:mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2 sm:mb-3 md:mb-4">
                <button onClick={() => navigate("/doctordashboard/bedroommanagement")} className="flex items-center text-xs sm:text-sm text-[var(--primary-color)] hover:underline">← Back to List</button>
              </div>
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{editData ? "Edit" : "Create"} Bed Management Master</h1>
            </motion.div>
            {renderStepIndicator()}
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="p-2 sm:p-4 md:p-6 lg:p-8">
              {renderStepContent()}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="w-full sm:w-auto flex justify-start">
              <button onClick={handleBack} disabled={currentStep === 0} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${currentStep === 0 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 hover:text-gray-900 hover:shadow-sm"}`}>
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </button>
            </div>

            <div className="w-full sm:w-auto flex justify-end">
              {currentStep < steps.length - 1 ? (
                <button onClick={handleNext} className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm font-medium transition-all duration-200 ${canGoNext() ? "bg-[var(--accent-color)] hover:bg-opacity-90 text-white shadow-md hover:shadow-lg" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`} disabled={!canGoNext()}>
                  <span className="hidden sm:inline">Next</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-3 bg-[var(--accent-color)] hover:bg-opacity-90 text-white rounded-lg transition-all duration-200 font-medium shadow-lg text-sm">
                  <Save size={16} />
                  <span>{editData ? "Update" : "Save"} & Finish</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BedMaster;
