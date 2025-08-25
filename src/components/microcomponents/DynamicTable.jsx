import React, { useState } from "react";
import {
  FiFilter,
  FiX,
  FiSearch,
  FiMenu,
  FiChevronLeft,
  FiChevronDown,
} from "react-icons/fi";

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
        className="input-field peer flex items-center gap-2 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)]"
      >
        <FiFilter className="text-[var(--primary-color)]" />
        {filter.label || "Filter"}
        {selected.length > 0 && (
          <span className="ml-1 text-xs text-gray-500">
            ({selected.length})
          </span>
        )}
        <FiChevronDown className="ml-1 text-xs" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10 p-2">
          {filter.options.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 p-1 hover:bg-gray-100 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt.value)}
                onChange={() => handleCheckboxChange(opt.value)}
                className="h-4 w-4"
              />
              {opt.label}
            </label>
          ))}
          {selected.length > 0 && (
            <button
              onClick={() => onChange(filter.key, [])}
              className="mt-1 text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              <FiX className="text-xs" /> Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const DynamicTable = ({
  columns,
  data,
  onCellClick,
  filters = [],
  tabs = [],
  tabActions = [],
  activeTab,
  onTabChange,
  showSearchBar = true,
  newRowIds = [],
  rowClassName,
}) => {
  const [hoveredRows, setHoveredRows] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState({});
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleRowMouseEnter = (rowId) => {
    if (newRowIds.includes(rowId) && !hoveredRows.includes(rowId)) {
      setHoveredRows([...hoveredRows, rowId]);
    }
  };

  const handleTabClick = (tabValue) => {
    onTabChange?.(tabValue);
  };

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredData = data.filter((row) => {
    const matchesSearch = Object.values(row).some((val) =>
      val?.toString().toLowerCase().includes(search.toLowerCase())
    );
    const matchesFilters = filters.every((filter) => {
      const selected = activeFilters[filter.key] || [];
      if (selected.length === 0) return true;
      return selected.includes(row[filter.key]);
    });
    return matchesSearch && matchesFilters;
  });

  return (
    <div className="space-y-4">
      {/* Tabs (responsive) */}
      {tabs.length > 0 && (
        <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 rounded-lg p-2 min-h-[56px] custom-scrollbar">
          <div className="flex gap-4 whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabClick(tab.value)}
                className={`relative cursor-pointer flex items-center gap-1 px-4 py-2 font-medium transition-colors duration-300 ${
                  activeTab === tab.value
                    ? "text-[var(--primary-color)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[var(--primary-color)]"
                    : "text-gray-500 hover:text-[var(--accent-color)] before:content-[''] before:absolute before:left-0 before:bottom-0 before:h-[2px] before:w-0 before:bg-[var(--accent-color)] before:transition-all before:duration-300 hover:before:w-full"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {tabActions.length > 0 && (
            <div className="flex gap-3">
              {tabActions.map((action) => (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className={action.className}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mobile Filter Drawer Toggle (only if filters exist) */}
      {filters.length > 0 && (
        <div className="block md:hidden">
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            <FiMenu /> {isFilterDrawerOpen ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      )}

      {/* Filters and Search (Drawer for Mobile, only if filters exist) */}
      {filters.length > 0 && (
        <div
          className={`${
            isFilterDrawerOpen ? "block" : "hidden"
          } md:block md:space-y-0 md:flex md:items-center md:gap-2 md:flex-wrap`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-2 p-4 md:p-0 bg-gray-50 md:bg-transparent rounded-lg md:rounded-none">
            {showSearchBar && (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="input-field peer w-full md:w-auto"
                />
                <FiSearch className="absolute right-3 text-gray-400" />
              </div>
            )}
            {filters.map((filter) => (
              <FilterDropdown
                key={filter.key}
                filter={filter}
                activeFilters={activeFilters}
                onChange={handleFilterChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Table (responsive) */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="table-container w-full min-w-[600px]">
          <thead>
            <tr className="table-head text-left text-sm">
              {columns.map((col, i) => (
                <th key={i} className="px-4 py-2 border-b">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="table-body overflow-visible text-sm">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-2 text-center">
                  No records found
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr
                  key={row.id}
                  onMouseEnter={() => handleRowMouseEnter(row.id)}
                  className={`border-t even:bg-gray-50 ${
                    newRowIds.includes(row.id) && !hoveredRows.includes(row.id)
                      ? "font-bold bg-[var(--accent-color)] bg-opacity-20"
                      : ""
                  } ${rowClassName ? rowClassName(row) : ""}`}
                >
                  {columns.map((col, i) => (
                    <td
                      key={i}
                      className={`px-4 py-2 ${
                        col.clickable
                          ? "text-[var(--primary-color)] underline cursor-pointer hover:text-[var(--accent-color)]"
                          : ""
                      }`}
                      onClick={
                        col.clickable
                          ? () => onCellClick?.(row, col)
                          : undefined
                      }
                    >
                      {col.cell ? col.cell(row) : row[col.accessor] || "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;
