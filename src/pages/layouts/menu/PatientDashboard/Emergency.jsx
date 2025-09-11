import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import axios from "axios";
import { format } from "date-fns";
import * as Lucide from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useNavigate } from "react-router-dom";
import PaymentGateway from "../../../../components/microcomponents/PaymentGatway";
import { getHospitalDropdown } from "../../../../utils/masterService";

// Fix for Leaflet's default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom hook for debouncing
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Filter options for the dropdown
const filterOptions = [
  {
    key: "ambulanceType",
    label: "Ambulance Type",
    options: [
      { label: "BLS", value: "bls" },
      { label: "ALS", value: "als" },
      { label: "ICU", value: "icu" },
    ],
  },
  {
    key: "category",
    label: "Category",
    options: [
      { label: "Government", value: "government" },
      { label: "Private", value: "private" },
      { label: "Hospital", value: "hospital" },
      { label: "NGO", value: "ngo" },
    ],
  },
  {
    key: "availability",
    label: "Availability",
    options: [
      { label: "Available", value: "available" },
      { label: "Busy", value: "busy" },
    ],
  },
];

// Filter Dropdown Component
const FilterDropdown = ({ filter, activeFilters, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = activeFilters[filter.key] || [];

  const handleCheckboxChange = (value) => {
    const newSelected = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    onChange(filter.key, newSelected);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] transition-all duration-200"
      >
        <Lucide.Filter className="text-[var(--primary-color)] w-4 h-4" />
        {filter.label || "Filter"}
        {selected.length > 0 && (
          <span className="ml-1 text-xs bg-blue-100 text-[var(--primary-color)] px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
        {isOpen ? (
          <Lucide.ChevronUp className="ml-1 w-3 h-3" />
        ) : (
          <Lucide.ChevronDown className="ml-1 w-3 h-3" />
        )}
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-2">
          {filter.options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => handleCheckboxChange(opt.value)}
                className="h-4 w-4 text-[var(--primary-color)] rounded focus:ring-[var(--primary-color)]"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
          {selected.length > 0 && (
            <button
              onClick={() => onChange(filter.key, [])}
              className="mt-2 text-xs text-red-500 hover:text-red-700 flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors"
            >
              <Lucide.X className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Mobile Filter Modal Component
const MobileFilterModal = ({
  isOpen,
  onClose,
  filters,
  activeFilters,
  onChange,
  onReset,
  onApply,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex flex-col bg-white">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-800 text-white">
          <h2 className="text-lg font-semibold">Filter</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={onReset}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filters.map((filter) => {
            const selected = activeFilters[filter.key] || [];
            return (
              <div key={filter.key} className="space-y-3">
                <h3 className="font-medium text-gray-900 uppercase text-sm tracking-wide">
                  {filter.label}
                </h3>
                <div className="space-y-2">
                  {filter.options.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors border-b border-gray-100"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(opt.value)}
                        onChange={() => {
                          const newSelected = selected.includes(opt.value)
                            ? selected.filter((v) => v !== opt.value)
                            : [...selected, opt.value];
                          onChange(filter.key, newSelected);
                        }}
                        className="h-5 w-5 text-[var(--primary-color)] rounded focus:ring-[var(--primary-color)]"
                      />
                      <span className="text-gray-700 flex-1">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onApply}
            className="w-full py-4 bg-[var(--accent-color)] text-white rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg"
          >
            APPLY
          </button>
        </div>
      </div>
    </div>
  );
};

// Floating Select Input Component
const FloatingSelectInput = ({
  label,
  value,
  displayValue,
  searchValue,
  onSearchChange,
  onFocus,
  onBlur,
  onToggleDropdown,
  readOnly = false,
  showDropdown = false,
  placeholder = " ",
  className = "",
  children,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = displayValue && displayValue.toString().length > 0;

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={hasValue && !showDropdown ? displayValue : searchValue || ""}
        onChange={(e) => onSearchChange?.(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        readOnly={readOnly}
        placeholder={placeholder}
        className={`
          peer w-full px-3 py-3 md:py-4 text-sm md:text-base
          border border-gray-300 rounded-lg
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
          bg-white transition-all duration-200
          ${readOnly ? "bg-gray-50 cursor-pointer" : ""}
          pr-10
        `}
        {...props}
      />
      <label
        className={`
          absolute left-3 transition-all duration-200 pointer-events-none
          ${
            isFocused || hasValue || (searchValue && searchValue.length > 0)
              ? "-top-2.5 text-xs bg-white px-1 text-blue-600 font-medium"
              : "top-3 md:top-4 text-sm md:text-base text-gray-500"
          }
        `}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={onToggleDropdown}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <Lucide.ChevronDown
          className={`transition-transform duration-200 ${
            showDropdown ? "rotate-180" : ""
          }`}
          size={16}
        />
      </button>
      {children}
    </div>
  );
};

// Main Emergency Component
const Emergency = () => {
  const [step, setStep] = useState(0);
  const [type, setType] = useState("");
  const [typeSearch, setTypeSearch] = useState("");
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const typeRef = useRef(null);
  const [cat, setCat] = useState("");
  const [catSearch, setCatSearch] = useState("");
  const [showCatDropdown, setShowCatDropdown] = useState(false);
  const catRef = useRef(null);
  const [pickupSearch, setPickupSearch] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  const pickupRef = useRef(null);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedHospitalId, setSelectedHospitalId] = useState("");
  const [hospitalSearch, setHospitalSearch] = useState("");
  const debouncedHospitalSearch = useDebounce(hospitalSearch, 300);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);
  const hospitalRef = useRef(null);
  const [equip, setEquip] = useState([]);
  const [date, setDate] = useState(new Date());
  const [pickup, setPickup] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [data, setData] = useState(null);
  const [showEquip, setShowEquip] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showNearbyView, setShowNearbyView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAmbulances, setFilteredAmbulances] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showMobileFilterModal, setShowMobileFilterModal] = useState(false);
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [mapPosition, setMapPosition] = useState([15.3647, 75.124]);
  const [markerPosition, setMarkerPosition] = useState([15.3647, 75.124]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapSearchQuery, setMapSearchQuery] = useState("");
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const mapSearchRef = useRef(null);
  const [addressForm, setAddressForm] = useState({
    type: "Other",
    flatNo: "",
    floor: "",
    locality: "",
    landmark: "",
    name: "",
    phone: "",
  });
  const equipRef = useRef(null);
  const searchRef = useRef(null);
  const BOOKING_API_URL = "https://mocki.io/v1/c183fd44-05e4-4659-9af9-f1917b1a0d6c";
  const navigate = useNavigate();
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});

  const filteredHospitals = useMemo(() => {
    if (!debouncedHospitalSearch.trim()) return hospitals;
    return hospitals.filter((hospital) =>
      hospital.hospitalName?.toLowerCase().includes(debouncedHospitalSearch.toLowerCase())
    );
  }, [hospitals, debouncedHospitalSearch]);

  const hospitalMap = useMemo(() => {
    const m = {};
    for (const hospital of hospitals) {
      m[String(hospital.id)] = hospital.hospitalName;
    }
    return m;
  }, [hospitals]);

  const fetchHospitals = async () => {
    try {
      const response = await getHospitalDropdown();
      const sortedHospitals = (response.data || []).sort((a, b) =>
        a.hospitalName.localeCompare(b.hospitalName)
      );
      setHospitals(sortedHospitals);
    } catch (error) {
      console.error("Failed to load hospitals:", error);
      toast.error("Failed to load hospitals");
    }
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      () => setCurrentLocation("Dharwad"),
      (e) => {
        setCurrentLocation("Dharwad");
      }
    );
    fetchHospitals();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await axios.get(BOOKING_API_URL);
        setData(res.data);
      } catch (e) {
        toast.error("Failed to load booking data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showEquip && equipRef.current && !equipRef.current.contains(e.target))
        setShowEquip(false);
      if (
        showTypeDropdown &&
        typeRef.current &&
        !typeRef.current.contains(e.target)
      )
        setShowTypeDropdown(false);
      if (
        showCatDropdown &&
        catRef.current &&
        !catRef.current.contains(e.target)
      )
        setShowCatDropdown(false);
      if (
        showPickupDropdown &&
        pickupRef.current &&
        !pickupRef.current.contains(e.target)
      )
        setShowPickupDropdown(false);
      if (
        showHospitalDropdown &&
        hospitalRef.current &&
        !hospitalRef.current.contains(e.target)
      )
        setShowHospitalDropdown(false);
      if (
        showSuggestions &&
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setTimeout(() => {
          setShowSuggestions(false);
        }, 150);
      }
      if (
        showLocationSuggestions &&
        mapSearchRef.current &&
        !mapSearchRef.current.contains(e.target)
      ) {
        setTimeout(() => {
          setShowLocationSuggestions(false);
        }, 150);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [
    showEquip,
    showSuggestions,
    showTypeDropdown,
    showCatDropdown,
    showPickupDropdown,
    showHospitalDropdown,
    showLocationSuggestions,
  ]);

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setMarkerPosition([e.latlng.lat, e.latlng.lng]);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data.display_name)
        setAddressForm((p) => ({ ...p, locality: data.display_name }));
    } catch (e) {
      console.error("Reverse geocoding failed:", e);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const pos = [coords.latitude, coords.longitude];
          setMapPosition(pos);
          setMarkerPosition(pos);
          reverseGeocode(...pos);
        },
        (err) => {
          toast.error("Unable to get current location");
        }
      );
    } else toast.error("Geolocation not supported");
  };

  const generateLocationSuggestions = async (query) => {
    if (!query.trim()) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=8&addressdetails=1`
      );
      const data = await res.json();
      const suggestions = data.map((item, index) => ({
        id: index,
        display_name: item.display_name,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        type: item.type || "location",
        address: item.address || {},
      }));
      setLocationSuggestions(suggestions);
      setShowLocationSuggestions(suggestions.length > 0);
    } catch (e) {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSearchInputChange = (value) => {
    setMapSearchQuery(value);
    if (value.trim().length > 2) {
      generateLocationSuggestions(value);
    } else {
      setLocationSuggestions([]);
      setShowLocationSuggestions(false);
    }
  };

  const handleLocationSuggestionSelect = (suggestion) => {
    setMapSearchQuery(suggestion.display_name);
    setShowLocationSuggestions(false);
    const pos = [suggestion.lat, suggestion.lon];
    setMapPosition(pos);
    setMarkerPosition(pos);
    setAddressForm((p) => ({ ...p, locality: suggestion.display_name }));
  };

  const searchLocation = async () => {
    if (!mapSearchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          mapSearchQuery
        )}`
      );
      const data = await res.json();
      if (data?.length) {
        const pos = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setMapPosition(pos);
        setMarkerPosition(pos);
        setAddressForm((p) => ({ ...p, locality: data[0].display_name }));
      } else toast.error("Location not found");
    } catch (e) {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

  const saveAddress = () => {
    if (!addressForm.name || !addressForm.phone)
      return toast.error("Please fill in your name and phone number");
    toast.success("Address saved successfully!");
    setShowLocationPopup(false);
  };

  const generateSuggestions = (query) => {
    if (!data || !query.trim()) return [];
    const queryLower = query.toLowerCase().trim();
    const locationAliases = {
      hubli: ["hubli", "hubballi", "huballi"],
      hubballi: ["hubli", "hubballi", "huballi"],
      huballi: ["hubli", "hubballi", "huballi"],
      dharwad: ["dharwad", "dharwar"],
      dharwar: ["dharwad", "dharwar"],
      bangalore: ["bangalore", "bengaluru"],
      bengaluru: ["bangalore", "bengaluru"],
    };
    const getLocationVariations = (query) => {
      const variations = [query];
      Object.entries(locationAliases).forEach(([key, aliases]) => {
        if (aliases.includes(query)) {
          variations.push(...aliases.filter((alias) => alias !== query));
        }
      });
      return variations;
    };
    const queryVariations = getLocationVariations(queryLower);
    const suggestions = [];
    data.ambulanceServices.forEach((ambulance) => {
      const nameMatches = ambulance.serviceName.toLowerCase().includes(queryLower);
      const locationMatches = queryVariations.some((variation) =>
        ambulance.location.toLowerCase().includes(variation)
      );
      const typeMatches = ambulance.type.toLowerCase().includes(queryLower);
      const categoryMatches = ambulance.category.toLowerCase().includes(queryLower);
      if (nameMatches || locationMatches || typeMatches || categoryMatches) {
        suggestions.push({
          type: "ambulance",
          value: ambulance.serviceName,
          location: ambulance.location,
          ambulanceType: ambulance.type,
          category: ambulance.category,
          available: ambulance.available,
          id: ambulance.id,
        });
      }
    });
    const locationCounts = {};
    data.ambulanceServices.forEach((ambulance) => {
      const locationMatches = queryVariations.some((variation) =>
        ambulance.location.toLowerCase().includes(variation)
      );
      if (
        locationMatches ||
        ambulance.location.toLowerCase().includes(queryLower)
      ) {
        if (!locationCounts[ambulance.location]) {
          locationCounts[ambulance.location] = 0;
        }
        locationCounts[ambulance.location]++;
      }
    });
    Object.entries(locationCounts).forEach(([location, count]) => {
      suggestions.push({
        type: "location",
        value: location,
        count: count,
        displayText: `${location} (${count} ambulances available)`,
      });
    });
    const serviceTypes = ["BLS", "ALS", "ICU", "Emergency", "Non-Emergency"];
    serviceTypes.forEach((serviceType) => {
      if (serviceType.toLowerCase().includes(queryLower)) {
        const matchingServices = data.ambulanceServices.filter((ambulance) =>
          ambulance.type.toLowerCase().includes(serviceType.toLowerCase())
        );
        if (matchingServices.length > 0) {
          suggestions.push({
            type: "service-type",
            value: serviceType,
            count: matchingServices.length,
            displayText: `${serviceType} Ambulances (${matchingServices.length} available)`,
          });
        }
      }
    });
    const uniqueSuggestions = suggestions
      .filter(
        (v, i, self) =>
          i === self.findIndex((t) => t.value === v.value && t.type === v.type)
      )
      .slice(0, 8);
    return uniqueSuggestions;
  };

  const handleSearchInputChange = (val) => {
    setSearchQuery(val);
    const suggest = generateSuggestions(val);
    setShowSuggestions(val.length > 0 && suggest.length > 0);
    setSuggestions(suggest);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.value);
    setShowSuggestions(false);
    setTimeout(() => {
      searchAmbulances(suggestion.value);
    }, 100);
  };

  const searchByCurrentLocation = () => setShowLocationPopup(true);

  const searchAmbulances = (query = searchQuery) => {
    if (!data || !query.trim()) {
      toast.error("Please enter a search term");
      return;
    }
    setSearchLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      const queryLower = query.toLowerCase();
      const locationAliases = {
        hubli: ["hubli", "hubballi", "huballi"],
        hubballi: ["hubli", "hubballi", "huballi"],
        huballi: ["hubli", "hubballi", "huballi"],
        dharwad: ["dharwad", "dharwar"],
        dharwar: ["dharwad", "dharwar"],
      };
      const getLocationVariations = (query) => {
        const variations = [query];
        Object.entries(locationAliases).forEach(([key, aliases]) => {
          if (aliases.includes(query)) {
            variations.push(...aliases.filter((alias) => alias !== query));
          }
        });
        return variations;
      };
      const queryVariations = getLocationVariations(queryLower);

      let results = data.ambulanceServices.filter((ambulance) => {
        const nameMatch = ambulance.serviceName.toLowerCase().includes(queryLower);
        const locationMatch =
          queryVariations.some((variation) =>
            ambulance.location.toLowerCase().includes(variation)
          ) || ambulance.location.toLowerCase().includes(queryLower);
        const typeMatch = ambulance.type.toLowerCase().includes(queryLower);
        const categoryMatch = ambulance.category.toLowerCase().includes(queryLower);
        const phoneMatch = ambulance.phone.includes(query);
        return (
          nameMatch || locationMatch || typeMatch || categoryMatch || phoneMatch
        );
      });

      // Apply active filters
      Object.entries(activeFilters).forEach(([key, values]) => {
        if (values.length > 0) {
          results = results.filter((ambulance) => {
            if (key === "ambulanceType") {
              return values.includes(ambulance.type.toLowerCase());
            } else if (key === "category") {
              return values.includes(ambulance.category.toLowerCase());
            } else if (key === "availability") {
              return values.includes(ambulance.available ? "available" : "busy");
            }
            return true;
          });
        }
      });

      results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
      setFilteredAmbulances(results);
      setSearchLoading(false);

      if (results.length === 0) {
        toast.info(`No ambulances found for "${query}". Try different search terms.`);
      } else {
        toast.success(`Found ${results.length} ambulances for "${query}"`);
      }
    }, 500);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowSuggestions(false);
      searchAmbulances();
    }
  };

  const handleLocationSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setShowLocationSuggestions(false);
      searchLocation();
    }
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleMobileFilterApply = () => {
    setShowMobileFilterModal(false);
    searchAmbulances();
  };

  const handleMobileFilterReset = () => {
    setActiveFilters({});
  };

  const getIcon = (name, size = 20) => {
    const icons = {
      Activity: Lucide.Activity,
      Ambulance: Lucide.Ambulance,
      Heart: Lucide.Heart,
      HeartPulse: Lucide.HeartPulse,
      Cylinder: Lucide.Cylinder,
      Bed: Lucide.Bed,
      Lungs: Lucide.Settings,
      Wheelchair: Lucide.Armchair,
      ActivitySquare: Lucide.ActivitySquare,
      Zap: Lucide.Zap,
    };
    return React.createElement(icons[name] || Lucide.Activity, { size });
  };

  const getAmbulanceTypeIcon = (type) =>
    ({
      ICU: <Lucide.Heart className="text-red-600" size={20} />,
      ALS: <Lucide.HeartPulse className="text-blue-600" size={20} />,
      BLS: <Lucide.Activity className="text-green-600" size={20} />,
    }[type.split(" ")[0]] || (
      <Lucide.Ambulance className="text-red-600" size={20} />
    ));

  const getCategoryColor = (c) =>
    ({
      government: "bg-blue-100 text-blue-700 border-blue-200",
      private: "bg-green-100 text-green-700 border-green-200",
      hospital: "bg-purple-100 text-purple-700 border-purple-200",
      ngo: "bg-orange-100 text-orange-700 border-orange-200",
    }[c.toLowerCase()] || "bg-gray-100 text-gray-700 border-gray-200");

  const calculateEquipmentTotal = () =>
    !data
      ? 0
      : equip.reduce(
          (t, id) => t + (data.equipment.find((e) => e.id === id)?.price || 0),
          0
        );

  const buildBooking = () => ({
    ambulanceType: data.ambulanceTypes.find((t) => t.id === type)?.name,
    category: data.categories.find((c) => c.id === cat)?.name,
    equipment: equip,
    pickupLocation: data.locations.find((l) => l.id === pickup)?.name,
    dropLocation: "N/A",
    hospitalLocation: selectedHospital,
    hospitalId: selectedHospitalId,
    date: format(date, "yyyy-MM-dd"),
    totalAmount: calculateEquipmentTotal(),
  });

  const resetForm = () => {
    setStep(0);
    setType("");
    setTypeSearch("");
    setCat("");
    setCatSearch("");
    setEquip([]);
    setPickup("");
    setPickupSearch("");
    setSelectedHospital("");
    setSelectedHospitalId("");
    setHospitalSearch("");
    setDate(new Date());
  };

  const handleSubmit = async () => {
    if (!data) return;
    const booking = buildBooking();
    try {
      await axios.post(BOOKING_API_URL, booking);
      toast.success("Booking submitted successfully!");
      resetForm();
    } catch {
      toast.error("Failed to submit booking.");
    }
  };

  const handlePayNow = () => {
    const booking = buildBooking();
    setSelectedBooking(booking);
    setShowPaymentGateway(true);
  };

  const handlePaymentSuccess = async (method, paymentData) => {
    try {
      await axios.post(BOOKING_API_URL, {
        ...selectedBooking,
        paymentId:
          paymentData.paymentId || "PAY-" + Math.floor(Math.random() * 10000),
        paymentMethod: method,
      });
      toast.success("Booking and payment completed successfully!");
      resetForm();
      setSelectedBooking(null);
      setShowPaymentGateway(false);
    } catch {
      toast.error("Failed to complete booking and payment.");
    }
  };

  const handlePaymentFailure = (error) => {
    toast.error(
      `Payment failed: ${
        error.reason || "Unknown error"
      }. Please try again or use a different payment method.`
    );
    setShowPaymentGateway(false);
  };

  const renderNearbyAmbulanceView = () => (
    <div className="w-full min-h-screen bg-gray-50 py-2 px-2 sm:py-4 sm:px-4 lg:py-8 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 sm:mb-4 lg:mb-6 gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#01B07A", color: "white" }}
              >
                <Lucide.MapPin className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                  Search Ambulances
                </h1>
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base">
                  Find ambulances by location, name, or service type
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNearbyView(false)}
              className="px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base"
            >
              <Lucide.X className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              Close
            </button>
          </div>
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="flex flex-col lg:flex-row gap-2 sm:gap-3">
              <div className="flex-1 max-w-full lg:max-w-xl relative" ref={searchRef}>
                <div className="relative">
                  <Lucide.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 z-10" />
                  <input
                    type="text"
                    placeholder="Search by location, ambulance name, service type..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="w-full pl-8 pr-8 sm:pl-10 sm:pr-10 lg:pl-12 lg:pr-12 py-2 sm:py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm lg:text-base"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setShowSuggestions(false);
                        setFilteredAmbulances([]);
                        setHasSearched(false);
                      }}
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 bg-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center transition-all duration-200 text-xs z-10"
                    >
                      ✕
                    </button>
                  )}
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-[99999] w-full mt-1 bg-white border border-gray-200 rounded-lg max-h-48 sm:max-h-60 overflow-y-auto shadow-2xl">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion.type}-${suggestion.value}-${index}`}
                        onClick={() => handleSuggestionSelect(suggestion)}
                        className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-left hover:bg-gray-50 flex items-center gap-1.5 sm:gap-2 lg:gap-3 border-b border-gray-100 last:border-b-0 transition-colors text-xs sm:text-sm"
                      >
                        {suggestion.type === "ambulance" && (
                          <Lucide.Ambulance className="text-red-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        {suggestion.type === "location" && (
                          <Lucide.MapPin className="text-blue-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        {suggestion.type === "service-type" && (
                          <Lucide.Activity className="text-green-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">
                            {suggestion.value}
                          </div>
                          {suggestion.location && (
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <span className="truncate">
                                {suggestion.location}
                              </span>
                              {suggestion.available !== undefined && (
                                <span
                                  className={`ml-1 px-1 py-0.5 rounded-full text-xs ${
                                    suggestion.available
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {suggestion.available ? "Available" : "Busy"}
                                </span>
                              )}
                            </div>
                          )}
                          {suggestion.displayText &&
                            suggestion.type !== "ambulance" && (
                              <div className="text-xs text-gray-500">
                                {suggestion.displayText}
                              </div>
                            )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button
                  onClick={searchByCurrentLocation}
                  style={{ backgroundColor: "var(--accent-color)" }}
                  className="px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-white rounded-lg hover:brightness-90 flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm lg:text-base"
                >
                  <Lucide.MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  <span className="hidden sm:inline">Current Location</span>
                  <span className="sm:hidden">Location</span>
                </button>
                <button
                  onClick={() => setShowMobileFilterModal(true)}
                  className="flex xl:hidden items-center justify-center w-10 h-10 bg-[var(--accent-color)] rounded-lg text-white transition-colors"
                >
                  <Lucide.Filter className="w-4 h-4" />
                </button>
                <div className="hidden xl:flex items-center gap-2">
                  {filterOptions.map((filter) => (
                    <FilterDropdown
                      key={filter.key}
                      filter={filter}
                      activeFilters={activeFilters}
                      onChange={handleFilterChange}
                    />
                  ))}
                </div>
                <button
                  onClick={() => searchAmbulances()}
                  disabled={searchLoading}
                  style={{ backgroundColor: "var(--accent-color)" }}
                  className={`px-2 py-2 sm:px-3 sm:py-2.5 lg:px-4 lg:py-3 text-white rounded-lg hover:brightness-90 flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-sm lg:text-base ${
                    searchLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {searchLoading ? (
                    <Lucide.Loader2
                      className="animate-spin w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                    />
                  ) : (
                    <Lucide.Search className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  )}
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        {filteredAmbulances.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-800">
                Found {filteredAmbulances.length} Ambulances
              </h2>
              <div className="text-xs sm:text-sm text-gray-600">
                Showing results for "{searchQuery}"
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {filteredAmbulances.map((ambulance) => (
                <div
                  key={ambulance.id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="p-3 sm:p-4 lg:p-6">
                    <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 lg:mb-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getAmbulanceTypeIcon(ambulance.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-1 truncate text-gray-800">
                          {ambulance.serviceName}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                          <Lucide.MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{ambulance.location}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 lg:gap-2 mb-2 sm:mb-3 lg:mb-4">
                      <span
                        className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium border ${getCategoryColor(
                          ambulance.category
                        )}`}
                      >
                        {ambulance.category}
                      </span>
                      <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                        {ambulance.type}
                      </span>
                      {ambulance.available && (
                        <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium border bg-green-100 text-green-700 border-green-200">
                          Available
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm mb-2 sm:mb-3 lg:mb-4">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Lucide.Navigation className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{ambulance.distance} km</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Lucide.Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        <span>{ambulance.rating}</span>
                      </div>
                    </div>
                    <div className="border rounded-lg p-2 sm:p-3 mb-2 sm:mb-3 lg:mb-4 bg-green-50 border-green-200">
                      <div className="flex items-center gap-1 sm:gap-2 text-green-600">
                        <Lucide.Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="font-semibold text-sm sm:text-base lg:text-lg">
                          {ambulance.phone}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        onClick={() =>
                          window.open(`tel:${ambulance.phone}`, "_self")
                        }
                        className="flex-1 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-3 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm"
                      >
                        <Lucide.Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                        Call Now
                      </button>
                      <button
                        onClick={() =>
                          toast.success(
                            `Booking request sent to ${ambulance.serviceName}`
                          )
                        }
                        className="flex-1 px-2 py-1 sm:px-3 sm:py-1.5 lg:px-3 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm"
                      >
                        <Lucide.Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {searchLoading && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
            <Lucide.Loader2
              className="animate-spin mx-auto mb-3 sm:mb-4 text-green-500 w-6 h-6 sm:w-8 sm:h-8"
            />
            <p className="text-gray-600 text-sm sm:text-base">
              Searching ambulances...
            </p>
          </div>
        )}
        {!searchLoading &&
          filteredAmbulances.length === 0 &&
          hasSearched &&
          searchQuery && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 lg:p-12 text-center">
              <Lucide.AlertCircle
                className="mx-auto mb-3 sm:mb-4 text-gray-400 w-6 h-6 sm:w-8 sm:h-8"
              />
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                No ambulances found for "<strong>{searchQuery}</strong>"
                {selectedFilter !== "all" && ` with filter "${selectedFilter}"`}
                .
              </p>
              <div className="text-xs sm:text-sm text-gray-500">
                <p>Try:</p>
                <ul className="list-disc list-inside mt-1.5 sm:mt-2 space-y-1">
                  <li>
                    Different search terms (e.g., "Hubli", "BLS", "Government")
                  </li>
                  <li>Removing filters</li>
                  <li>Checking spelling</li>
                </ul>
              </div>
            </div>
          )}
      </div>
      <MobileFilterModal
        isOpen={showMobileFilterModal}
        onClose={() => setShowMobileFilterModal(false)}
        filters={filterOptions}
        activeFilters={activeFilters}
        onChange={handleFilterChange}
        onReset={handleMobileFilterReset}
        onApply={handleMobileFilterApply}
      />
    </div>
  );

  const renderLocationPopup = () => (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/10 z-[99998] overflow-y-auto p-2 sm:p-4">
      <div className="mx-auto max-w-full sm:max-w-4xl bg-white rounded-lg border border-gray-300 min-h-[90vh] sm:h-[90vh] flex flex-col mt-2 sm:mt-4">
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
          <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-800">
            Enter complete address
          </h2>
          <button
            onClick={() => setShowLocationPopup(false)}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Lucide.X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 relative">
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-[99999] pointer-events-auto">
              <div className="bg-white rounded-lg border border-gray-300 p-2 sm:p-3 w-full max-w-full sm:max-w-3xl mx-auto">
                <div className="flex gap-1.5 sm:gap-2" ref={mapSearchRef}>
                  <div className="flex-1 relative">
                    <Lucide.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4 z-10" />
                    <input
                      type="text"
                      placeholder="Search location..."
                      value={mapSearchQuery}
                      onChange={(e) =>
                        handleLocationSearchInputChange(e.target.value)
                      }
                      onKeyPress={handleLocationSearchKeyPress}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                    />
                    {showLocationSuggestions &&
                      locationSuggestions.length > 0 && (
                        <div className="absolute z-[99999] w-full mt-1 bg-white border border-gray-200 rounded-lg max-h-48 sm:max-h-60 overflow-y-auto shadow-2xl">
                          {locationSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              onClick={() =>
                                handleLocationSuggestionSelect(suggestion)
                              }
                              className="w-full px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-3 text-left hover:bg-gray-50 flex items-center gap-1.5 sm:gap-2 lg:gap-3 border-b border-gray-100 last:border-b-0 transition-colors text-xs sm:text-sm"
                            >
                              <Lucide.MapPin
                                className="text-blue-500 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">
                                  {suggestion.display_name}
                                </div>
                                {suggestion.address &&
                                  suggestion.address.country && (
                                    <div className="text-xs text-gray-500 truncate">
                                      {suggestion.type} •{" "}
                                      {suggestion.address.country}
                                    </div>
                                  )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                  <button
                    onClick={searchLocation}
                    disabled={isSearching}
                    className="px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    {isSearching ? "Searching..." : "Search"}
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={getCurrentLocation}
              className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm"
            >
              <Lucide.MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Current location
            </button>
            <div className="h-64 sm:h-full">
              <MapContainer
                center={mapPosition}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                key={`${mapPosition[0]}-${mapPosition[1]}`}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler />
                {markerPosition && (
                  <Marker position={markerPosition}>
                    <Popup>
                      Selected Location
                      <br />
                      Lat: {markerPosition[0].toFixed(6)}
                      <br />
                      Lng: {markerPosition[1].toFixed(6)}
                    </Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
          </div>
          <div className="w-full lg:w-80 bg-gray-50 p-3 sm:p-4 overflow-y-auto">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                Add New Address
              </p>
              <input
                type="text"
                placeholder="Flat / House no / Building name *"
                value={addressForm.flatNo}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    flatNo: e.target.value,
                  }))
                }
                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              />
              <input
                type="text"
                placeholder="Floor (optional)"
                value={addressForm.floor}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    floor: e.target.value,
                  }))
                }
                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                  Area / Sector / Locality *
                </p>
                <input
                  type="text"
                  value={addressForm.locality}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      locality: e.target.value,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100 text-xs sm:text-sm"
                  readOnly
                />
              </div>
              <input
                type="text"
                placeholder="Nearby landmark (optional)"
                value={addressForm.landmark}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    landmark: e.target.value,
                  }))
                }
                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              />
              <div className="border-t border-gray-200 my-3 sm:my-4" />
              <p className="text-xs sm:text-sm text-gray-600 mb-2.5 sm:mb-3">
                Enter your details for seamless delivery experience
              </p>
              <input
                type="text"
                placeholder="Your name *"
                value={addressForm.name}
                onChange={(e) =>
                  setAddressForm((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
              />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1.5 sm:mb-2">
                  Your phone number *
                </p>
                <input
                  type="tel"
                  placeholder="9901341763"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-xs sm:text-sm"
                />
              </div>
              <button
                onClick={saveAddress}
                className="w-full px-3 py-1.5 sm:px-4 sm:py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium text-xs sm:text-sm"
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    if (!data) {
      return (
        <div className="text-center py-6 sm:py-8 lg:py-10">
          <Lucide.Loader2
            className="animate-spin mx-auto mb-3 sm:mb-4 text-blue-500 w-6 h-6 sm:w-8 sm:h-8"
          />
          <p className="text-gray-600 text-sm sm:text-base">
            Loading booking data...
          </p>
        </div>
      );
    }
    if (step === 0) {
      return (
        <div className="w-full space-y-3 sm:space-y-4 lg:space-y-6 min-h-[500px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="w-full relative" ref={pickupRef}>
              <div className="relative">
                <input
                  id="pickup-input"
                  type="text"
                  value={pickup ? data.locations.find((l) => l.id === pickup)?.name : pickupSearch}
                  onChange={(e) => {
                    setPickupSearch(e.target.value);
                    setShowPickupDropdown(true);
                  }}
                  onFocus={() => setShowPickupDropdown(true)}
                  className="peer block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] pr-10"
                />
                <label
                  htmlFor="pickup-input"
                  className={`
                    absolute left-3 transition-all duration-200 pointer-events-none
                    ${
                      pickup || pickupSearch
                        ? "-top-2.5 text-xs bg-white px-1 text-[var(--primary-color)] font-medium"
                        : "top-3 text-sm text-gray-500"
                    }
                  `}
                >
                  Search pickup location
                </label>
                <button
                  type="button"
                  onClick={() => setShowPickupDropdown(!showPickupDropdown)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  <Lucide.ChevronDown
                    className={`transition-transform duration-200 ${
                      showPickupDropdown ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
              </div>
              {showPickupDropdown && data.locations?.length > 0 && (
                <div className="absolute z-[10000] w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-2xl">
                  {data.locations
                    .filter((item) =>
                      item.name.toLowerCase().includes(pickupSearch.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setPickup(item.id);
                          setPickupSearch(item.name);
                          setShowPickupDropdown(false);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer hover:bg-blue-50 text-xs sm:text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="w-full relative" ref={hospitalRef}>
              <div className="relative">
                <input
                  id="hospital-input"
                  type="text"
                  value={selectedHospital || hospitalSearch}
                  onChange={(e) => {
                    setHospitalSearch(e.target.value);
                    setShowHospitalDropdown(true);
                  }}
                  onFocus={() => setShowHospitalDropdown(true)}
                  className="peer block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] pr-10"
                />
                <label
                  htmlFor="hospital-input"
                  className={`
                    absolute left-3 transition-all duration-200 pointer-events-none
                    ${
                      selectedHospital || hospitalSearch
                        ? "-top-2.5 text-xs bg-white px-1 text-[var(--primary-color)] font-medium"
                        : "top-3 text-sm text-gray-500"
                    }
                  `}
                >
                  Search hospital...
                </label>
                <button
                  type="button"
                  onClick={() => setShowHospitalDropdown(!showHospitalDropdown)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  <Lucide.ChevronDown
                    className={`transition-transform duration-200 ${
                      showHospitalDropdown ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
              </div>
              {showHospitalDropdown && (
                <div className="absolute z-[10000] w-full mt-1 bg-white border border-gray-200 rounded-lg max-h-60 overflow-hidden shadow-2xl">
                  <div className="max-h-48 overflow-y-auto">
                    {filteredHospitals.map((hospital) => (
                      <div
                        key={hospital.id}
                        onClick={() => {
                          setSelectedHospital(hospital.hospitalName);
                          setSelectedHospitalId(hospital.id);
                          setHospitalSearch(hospital.hospitalName);
                          setShowHospitalDropdown(false);
                        }}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0 text-xs sm:text-sm text-gray-900 transition-colors"
                      >
                        {hospital.hospitalName}
                      </div>
                    ))}
                    {filteredHospitals.length === 0 && (
                      <div className="px-3 py-4 text-center text-gray-500 text-xs sm:text-sm">
                        No hospitals found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
            <div className="w-full relative" ref={typeRef}>
              <div className="relative">
                <input
                  id="ambulance-type-input"
                  type="text"
                  value={type ? data.ambulanceTypes.find((t) => t.id === type)?.name : typeSearch}
                  onChange={(e) => setTypeSearch(e.target.value)}
                  onFocus={() => setShowTypeDropdown(true)}
                  className="peer block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] pr-10"
                />
                <label
                  htmlFor="ambulance-type-input"
                  className={`
                    absolute left-3 transition-all duration-200 pointer-events-none
                    ${
                      type || typeSearch
                        ? "-top-2.5 text-xs bg-white px-1 text-[var(--primary-color)] font-medium"
                        : "top-3 text-sm text-gray-500"
                    }
                  `}
                >
                  Search ambulance type
                </label>
                <button
                  type="button"
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  <Lucide.ChevronDown
                    className={`transition-transform duration-200 ${
                      showTypeDropdown ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
              </div>
              {showTypeDropdown && (
                <div className="absolute z-[10000] w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-2xl">
                  {data.ambulanceTypes
                    .filter((item) =>
                      item.name.toLowerCase().includes(typeSearch.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setType(item.id);
                          setTypeSearch(item.name);
                          setShowTypeDropdown(false);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer hover:bg-blue-50 text-xs sm:text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
            <div className="w-full relative" ref={catRef}>
              <div className="relative">
                <input
                  id="category-input"
                  type="text"
                  value={cat ? data.categories.find((c) => c.id === cat)?.name : catSearch}
                  onChange={(e) => setCatSearch(e.target.value)}
                  onFocus={() => setShowCatDropdown(true)}
                  className="peer block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[var(--primary-color)] focus:ring-1 focus:ring-[var(--primary-color)] pr-10"
                />
                <label
                  htmlFor="category-input"
                  className={`
                    absolute left-3 transition-all duration-200 pointer-events-none
                    ${
                      cat || catSearch
                        ? "-top-2.5 text-xs bg-white px-1 text-[var(--primary-color)] font-medium"
                        : "top-3 text-sm text-gray-500"
                    }
                  `}
                >
                  Search category
                </label>
                <button
                  type="button"
                  onClick={() => setShowCatDropdown(!showCatDropdown)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 z-20"
                >
                  <Lucide.ChevronDown
                    className={`transition-transform duration-200 ${
                      showCatDropdown ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
              </div>
              {showCatDropdown && (
                <div className="absolute z-[10000] w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-2xl">
                  {data.categories
                    .filter((item) =>
                      item.name.toLowerCase().includes(catSearch.toLowerCase())
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setCat(item.id);
                          setCatSearch(item.name);
                          setShowCatDropdown(false);
                        }}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 cursor-pointer hover:bg-blue-50 text-xs sm:text-sm border-b border-gray-100 last:border-b-0 transition-colors"
                      >
                        {item.name}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="w-full relative" ref={equipRef}>
              <button
                type="button"
                className="w-full px-2.5 py-2.5 sm:px-3 sm:py-3 border border-gray-300 rounded-lg flex justify-between items-center cursor-pointer hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
                onClick={() => setShowEquip((prev) => !prev)}
              >
                <span>
                  {equip.length === 0
                    ? "Select equipment"
                    : `${equip.length} items selected`}
                </span>
                <Lucide.ChevronDown
                  className={`transition-transform duration-200 ${
                    showEquip ? "rotate-180" : ""
                  }`}
                  size={14}
                />
              </button>
              {showEquip && (
                <div className="absolute z-[10000] mt-1 w-full bg-white border border-gray-200 rounded-lg max-h-48 overflow-auto shadow-2xl">
                  {data.equipment.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center justify-between px-2.5 py-1.5 sm:px-3 sm:py-2 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={equip.includes(item.id)}
                          onChange={() =>
                            setEquip((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((id) => id !== item.id)
                                : [...prev, item.id]
                            )
                          }
                          className="mr-1.5 sm:mr-2"
                        />
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          {getIcon(item.icon, 14)}
                          <span className="text-xs sm:text-sm">
                            {item.name}
                          </span>
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-green-600">
                        ₹{item.price}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {equip.length > 0 && (
                <div className="mt-1.5 sm:mt-2 p-2.5 sm:p-3 border rounded-lg bg-green-50 border-green-200">
                  <span className="font-semibold text-green-600 text-xs sm:text-sm">
                    Total: ₹{calculateEquipmentTotal()}
                  </span>
                </div>
              )}
            </div>
            <div className="w-full relative">
              <ReactDatePicker
                selected={date}
                onChange={(selectedDate) => setDate(selectedDate)}
                minDate={new Date()}
                className="w-full px-2.5 py-2.5 sm:px-3 sm:py-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-xs sm:text-sm"
                dateFormat="yyyy-MM-dd"
                popperProps={{
                  positionFixed: true,
                }}
                popperClassName="react-datepicker-popper-fixed"
              />
              <style jsx global>{`
                .react-datepicker-popper-fixed {
                  z-index: 99999 !important;
                }
                .react-datepicker {
                  z-index: 99999 !important;
                }
                .react-datepicker__triangle {
                  z-index: 99999 !important;
                }
              `}</style>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-3 sm:space-y-4 lg:space-y-6 min-h-[500px]">
        <div className="bg-gradient-to-r from-[#01B07A] to-[#1A223F] rounded-xl p-3 sm:p-4 lg:p-6 mb-3 sm:mb-4 lg:mb-6 text-white">
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Lucide.CheckCircle
                className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg lg:text-xl">
                Booking Confirmation
              </h3>
              <p className="text-white/90 text-xs sm:text-sm">
                Please review your booking details below
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
              <Lucide.Ambulance
                className="text-red-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
              />
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                Service Details
              </h4>
            </div>
            <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Ambulance Type:
                </span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {data.ambulanceTypes.find((t) => t.id === type)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Category:
                </span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {data.categories.find((c) => c.id === cat)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Pickup Location:
                </span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {data.locations.find((l) => l.id === pickup)?.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Hospital Location:
                </span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {selectedHospital || "Not specified"}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
              <Lucide.Calendar
                className="text-blue-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
              />
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
                Schedule & Location
              </h4>
            </div>
            <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Booking Date:
                </span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {format(date, "dd MMM yyyy")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2 border-b border-gray-100">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Day:
                </span>
                <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {format(date, "EEEE")}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 sm:py-1.5 lg:py-2">
                <span className="text-gray-600 font-medium text-xs sm:text-sm">
                  Status:
                </span>
                <span className="px-2 py-0.5 sm:px-2.5 sm:py-0.5 lg:px-3 lg:py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 mb-2 sm:mb-3 lg:mb-4">
            <Lucide.Package
              className="text-purple-600 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
            />
            <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">
              Equipment & Billing
            </h4>
          </div>
          {equip.length > 0 ? (
            <div className="space-y-2 sm:space-y-2.5 lg:space-y-3">
              {equip.map((eqId) => {
                const equipment = data.equipment.find((e) => e.id === eqId);
                return equipment ? (
                  <div
                    key={eqId}
                    className="flex items-center justify-between py-1 sm:py-1.5 lg:py-2 border-b border-gray-100"
                  >
                    <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
                      <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getIcon(equipment.icon, 14)}
                      </div>
                      <span className="text-gray-700 font-medium text-xs sm:text-sm">
                        {equipment.name}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-800 text-xs sm:text-sm">
                      ₹{equipment.price}
                    </span>
                  </div>
                ) : null;
              })}
              <div className="border-t-2 border-gray-200 pt-2 sm:pt-2.5 lg:pt-3 mt-2 sm:mt-2.5 lg:mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-800">
                    Total Equipment Cost:
                  </span>
                  <div className="text-right">
                    <span className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
                      ₹{calculateEquipmentTotal()}
                    </span>
                    <p className="text-xs text-gray-500">
                      Including all equipment
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 sm:py-6 lg:py-8">
              <Lucide.Package
                className="mx-auto mb-2 sm:mb-2.5 lg:mb-3 text-gray-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8"
              />
              <p className="text-gray-500 text-xs sm:text-sm">
                No additional equipment selected
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (showNearbyView) {
    return (
      <>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {showLocationPopup && renderLocationPopup()}
        {renderNearbyAmbulanceView()}
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 py-2 px-2 sm:py-4 sm:px-4 lg:py-8 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {showLocationPopup && renderLocationPopup()}
      {showPaymentGateway && (
        <PaymentGateway
          isOpen={showPaymentGateway}
          onClose={() => setShowPaymentGateway(false)}
          amount={calculateEquipmentTotal()}
          bookingId={
            selectedBooking?.id || "EMG-" + Math.floor(Math.random() * 10000)
          }
          onPay={handlePaymentSuccess}
          onFail={handlePaymentFailure}
          bookingDetails={{
            serviceType: "Emergency Ambulance",
            doctorName: "N/A",
            hospitalName: selectedHospital || "N/A",
            appointmentDate: format(date, "yyyy-MM-dd"),
            appointmentTime: "ASAP",
            patient: [
              {
                name: addressForm.name || "Patient Name",
                age: 30,
                gender: "Unknown",
                patientId: "PT-" + Math.floor(Math.random() * 10000),
              },
            ],
            contactEmail: "patient@example.com",
            contactPhone: addressForm.phone || "9999999999",
            fareBreakup: {
              consultationFee: calculateEquipmentTotal() * 0.8,
              taxes: calculateEquipmentTotal() * 0.15,
              serviceFee: calculateEquipmentTotal() * 0.05,
            },
          }}
        />
      )}
      {!showPaymentGateway && (
        <div className="max-w-full sm:max-w-4xl lg:max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden min-h-[500px]">
          <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-3 bg-gray-800">
            <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3">
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "#01B07A", color: "white" }}
              >
                <Lucide.Ambulance className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0">
                  Ambulance Booking
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 mb-0">
                  Book an ambulance from AV Swasthya's trusted network
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowNearbyView(true)}
              style={{ backgroundColor: "var(--accent-color)" }}
              className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 text-white rounded-lg hover:brightness-90 flex items-center gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm lg:text-base w-full sm:w-auto justify-center"
            >
              <Lucide.MapPin className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span>Near By Ambulance</span>
            </button>
          </div>
          <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 border-b border-gray-200">
            <div className="flex justify-center items-center w-full max-w-xs sm:max-w-md mx-auto">
              {["Details", "Confirm"].map((stepName, index) => (
                <React.Fragment key={index}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full mb-1 sm:mb-1.5 lg:mb-2 transition-all ${
                        step === index || step > index
                          ? "text-white"
                          : "bg-gray-200 text-gray-600 border border-gray-300"
                      }`}
                      style={
                        step === index || step > index
                          ? { backgroundColor: "var(--accent-color)" }
                          : {}
                      }
                    >
                      {step > index ? (
                        <Lucide.CheckCircle2
                          className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5"
                        />
                      ) : (
                        <span className="font-semibold text-xs sm:text-sm">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs font-medium transition-colors ${
                        step === index || step > index
                          ? "font-semibold"
                          : "text-gray-500"
                      }`}
                      style={
                        step === index || step > index
                          ? { color: "var(--accent-color)" }
                          : {}
                      }
                    >
                      {stepName}
                    </p>
                  </div>
                  {index < ["Details", "Confirm"].length - 1 && (
                    <div
                      className={`flex-1 h-0.5 sm:h-1 mx-2 sm:mx-3 lg:mx-4 mb-3 sm:mb-4 lg:mb-6 rounded transition-colors`}
                      style={
                        step > index
                          ? { backgroundColor: "var(--accent-color)" }
                          : { backgroundColor: "#D1D5DB" }
                      }
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6">
            {renderStep()}
          </div>
          <div className="px-3 py-2 sm:px-4 sm:py-3 lg:px-6 lg:py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row justify-between gap-2 sm:gap-3">
            {step > 0 && (
              <button
                onClick={() => setStep((prev) => prev - 1)}
                className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-xs sm:text-sm w-full sm:w-auto"
              >
                Back
              </button>
            )}
            <div
              className={`flex flex-col sm:flex-row gap-2 sm:gap-2.5 lg:gap-3 ${step === 0 ? "ml-auto" : ""}`}
            >
              {step === 1 ? (
                <>
                  <button
                    onClick={handleSubmit}
                    className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    Submit Booking
                  </button>
                  {calculateEquipmentTotal() > 0 && (
                    <button
                      onClick={handlePayNow}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1 sm:gap-1.5 lg:gap-2 text-xs sm:text-sm w-full sm:w-auto justify-center"
                    >
                      <Lucide.CreditCard
                        className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4"
                      />
                      Pay Now ₹{calculateEquipmentTotal()}
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setStep((prev) => prev + 1)}
                  disabled={!type || !cat || !pickup}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 lg:px-4 lg:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm w-full sm:w-auto ${
                    !type || !cat || !pickup
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Emergency;
