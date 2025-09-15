import React, { useState, useEffect } from "react";
import { FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import DynamicTable from "../../../../components/microcomponents/DynamicTable";
import { toast } from "react-toastify";

const statusColors = {
  Active: "text-green-600 bg-green-100",
  Inactive: "text-red-600 bg-red-100",
};

const BedRoomList = () => {
  const navigate = useNavigate();
  const [bedData, setBedData] = useState([
    {
      id: "1",
      department: "Cardiology",
      ward: "ICU",
      totalBeds: 20,
      occupied: 10,
      available: 10,
      status: "Active",
      rooms: 5,
      createdAt: "2024-01-15",
    },
    {
      id: "2", 
      department: "Orthopedics",
      ward: "General",
      totalBeds: 30,
      occupied: 18,
      available: 12,
      status: "Active",
      rooms: 8,
      createdAt: "2024-01-14",
    },
    {
      id: "3",
      department: "Pediatrics", 
      ward: "Private",
      totalBeds: 15,
      occupied: 7,
      available: 8,
      status: "Inactive",
      rooms: 6,
      createdAt: "2024-01-13",
    },
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("bedMasterData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setBedData(parsedData);
        }
      } catch (error) {
        console.error("Error parsing saved bed data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever bedData changes
  useEffect(() => {
    localStorage.setItem("bedMasterData", JSON.stringify(bedData));
  }, [bedData]);

  const handleCreateMaster = () => {
    navigate("/doctordashboard/bedroommanagement/bedmaster");
  };

  const handleEdit = (row) => {
    navigate("/doctordashboard/bedroommanagement/bedmaster", {
      state: { editData: row },
    });
  };

  const handleDelete = (id) => {
    setBedData(bedData.filter((item) => item.id !== id));
    toast.success("Record deleted successfully");
  };

  const handleView = (row) => {
    // Create a detailed view modal or navigate to a detail page
    toast.info(`Viewing details for ${row.department} - ${row.ward}`);
  };

  // Function to add new bed data from BedMaster
  const addBedData = (newData) => {
    setBedData(prev => [...prev, {
      ...newData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    }]);
  };

 const columns = [
  {
    header: "Department",
    accessor: "department",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-gray-900">{row.department}</span>
      </div>
    ),
  },
  {
    header: "Ward",
    accessor: "ward",
    cell: (row) => {
      const wardColors = {
        'ICU': 'bg-red-50 text-red-700 border-red-200',
        'ICCU': 'bg-purple-50 text-purple-700 border-purple-200',
        'General': 'bg-blue-50 text-blue-700 border-blue-200',
        'Private': 'bg-green-50 text-green-700 border-green-200',
        'Emergency': 'bg-orange-50 text-orange-700 border-orange-200',
        'Maternity': 'bg-pink-50 text-pink-700 border-pink-200',
      };
      return (
        <span className={`px-2 py-1 rounded-full text-sm font-medium border ${wardColors[row.ward] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
          {row.ward}
        </span>
      );
    },
  },
  {
    header: "Beds (Occupied/Total)",
    accessor: "beds",
    cell: (row) => (
      <div className="flex items-center gap-1">
        <span className="font-medium text-red-600">{row.occupied}</span>
        <span className="font-medium text-gray-900">/{row.totalBeds}</span>
      </div>
    ),
  },
  {
    header: "Available",
    accessor: "available",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-green-600">
          {row.totalBeds - row.occupied}
        </span>
      </div>
    ),
  },
  {
    header: "Status",
    accessor: "status",
    cell: (row) => (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[row.status] || ""}`}>
        {row.status}
      </span>
    ),
  },
  {
    header: "Actions",
    accessor: "actions",
    cell: (row) => (
      <div className="flex items-center gap-2">
       
        <button
          onClick={() => handleEdit(row)}
          className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
          title="Edit"
        >
          <FaEdit size={14} />
        </button>
        <button
          onClick={() => handleDelete(row.id)}
          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <FaTrash size={14} />
        </button>
      </div>
    ),
  },
];


  const filters = [
    {
      key: "department",
      label: "Department",
      options: [
        { value: "Cardiology", label: "Cardiology" },
        { value: "Orthopedics", label: "Orthopedics" },
        { value: "Pediatrics", label: "Pediatrics" },
        { value: "Neurology", label: "Neurology" },
        { value: "Emergency", label: "Emergency" },
      ],
    },
    {
      key: "ward",
      label: "Ward Type",
      options: [
        { value: "ICU", label: "ICU" },
        { value: "ICCU", label: "ICCU" },
        { value: "General", label: "General" },
        { value: "Private", label: "Private" },
        { value: "Emergency", label: "Emergency" },
        { value: "Maternity", label: "Maternity" },
      ],
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bed Management</h1>
        </div>
        <div className="flex items-center gap-3">
      
          <button
            onClick={handleCreateMaster}
            className="btn btn-primary flex items-center gap-2"
          >
            <FaPlus className="text-sm" />
            Create Master
          </button>
        </div>
      </div>

      <div >
        <DynamicTable
          columns={columns}
          data={bedData}
          filters={filters}
          title=""
          showSearchBar={true}
          showPagination={true}
        />
      </div>

   
    </div>
  );
};

export default BedRoomList;