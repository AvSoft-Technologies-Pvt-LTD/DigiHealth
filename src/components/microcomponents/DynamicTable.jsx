import React, { useState, useRef } from "react";
import { Filter, X, Search, Menu, ChevronDown, ChevronUp } from "lucide-react";

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
        <Filter className="text-[var(--primary-color)] w-4 h-4" />
        {filter.label || "Filter"}
        {selected.length > 0 && (
          <span className="ml-1 text-xs bg-blue-100 text-[var(--primary-color)] px-2 py-0.5 rounded-full">
            {selected.length}
          </span>
        )}
        {isOpen ? (
          <ChevronUp className="ml-1 w-3 h-3" />
        ) : (
          <ChevronDown className="ml-1 w-3 h-3" />
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
              <X className="w-3 h-3" /> Clear All
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
  title,
  showTabs = true,
  showFilters = true,
  searchQuery: externalSearchQuery = "",
  onSearchChange,
}) => {
  const [hoveredRows, setHoveredRows] = useState([]);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [search, setSearch] = useState(externalSearchQuery);
  const searchInputRef = useRef(null);
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

  const shouldHideHeader = (header) => {
    const hiddenHeaders = [
      "date and time",
      "phone",
      "datetime",
      "created at",
      "updated at",
    ];
    return hiddenHeaders.some((hidden) =>
      header.toLowerCase().includes(hidden)
    );
  };

  const handleSearchToggle = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearch("");
      onSearchChange?.("");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    onSearchChange?.(value);
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

  // Find main columns
  const idColumn = columns.find(
    (col) => col.header === "ID" || col.accessor === "sequentialId"
  );
  const nameColumn = columns.find(
    (col) => col.header === "Name" || col.accessor === "name"
  );
  const actionColumn = columns.find((col) => col.header === "Actions");
  const statusColumn = columns.find(
    (col) => col.header === "Status" || col.accessor === "status"
  );
  const dateColumn = columns.find(
    (col) => col.header === "Date" || col.accessor === "date"
  );
  const doctorNameColumn = columns.find(
    (col) => col.header === "Doctor Name" || col.accessor === "doctorName"
  );
  const hospitalNameColumn = columns.find(
    (col) => col.header === "Hospital Name" || col.accessor === "hospitalName"
  );

  const dataColumns = columns.filter(
    (col) =>
      col.header !== "ID" &&
      col.header !== "Name" &&
      col.header !== "Actions" &&
      col.accessor !== "sequentialId" &&
      col.accessor !== "name" &&
      col.header !== dateColumn?.header &&
      col.accessor !== dateColumn?.accessor
  );

  const getColumnPairs = (columns) => {
    const pairs = [];
    for (let i = 0; i < columns.length; i += 2) {
      pairs.push(columns.slice(i, i + 2));
    }
    return pairs;
  };

  const columnPairs = getColumnPairs(dataColumns);

  const shouldHideColumn = (colHeader) => {
    const allMajorColumnsPresent =
      idColumn &&
      nameColumn &&
      doctorNameColumn &&
      hospitalNameColumn &&
      statusColumn &&
      actionColumn;
    if (
      colHeader === idColumn?.header ||
      colHeader === nameColumn?.header ||
      colHeader === doctorNameColumn?.header ||
      colHeader === hospitalNameColumn?.header ||
      colHeader === statusColumn?.header ||
      colHeader === actionColumn?.header
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {title && (
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            {title}
          </h2>
        )}
        {/* Tabs & Actions */}
        <div className="flex items-center mb-1 justify-between w-full">
          {tabs.length > 0 && (
            <div className="flex gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => handleTabClick(tab.value)}
                  className={`relative cursor-pointer flex items-center gap-1 px-4 font-medium transition-colors duration-300 ${activeTab === tab.value
                      ? "text-[var(--primary-color)] after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:w-full after:bg-[var(--primary-color)]"
                      : "text-gray-500 hover:text-[var(--accent-color)]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
          {tabActions.length > 0 && (
            <button
              onClick={tabActions[0].onClick}
              className="btn btn-secondary hidden lg:block text-sm flex items-center gap-2"
            >
              {tabActions[0].label}
            </button>
          )}
        </div>
      </div>

      {/* Mobile & Tablet Filter Toggle */}
      {filters.length > 0 && (
        <div className="block xl:hidden">
          <button
            onClick={() => setIsFilterDrawerOpen(!isFilterDrawerOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 w-full justify-between"
          >
            <span className="flex items-center gap-2">
              <Menu className="w-4 h-4" /> Filters
            </span>
            {isFilterDrawerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Filters + Search */}
      {filters.length > 0 && (
        <div
          className={`${isFilterDrawerOpen ? "block" : "hidden"
            } xl:block xl:flex xl:items-center xl:gap-2 xl:flex-wrap`}
        >
          <div className="flex flex-col xl:flex-row xl:items-center gap-2 p-2 bg-gray-50 xl:bg-transparent rounded-lg">
            {showSearchBar && (
              <div className="flex items-center gap-2 w-full xl:w-auto">
                <button
                  onClick={handleSearchToggle}
                  className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${isSearchExpanded
                      ? "bg-[var(--accent-color)]/100 text-white"
                      : "bg-gray-100 text-[var(--primary-color)] hover:bg-gray-200"
                    }`}
                >
                  <Search className="w-4 h-4" />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${isSearchExpanded
                      ? "w-full md:w-64 opacity-100"
                      : "w-0 opacity-0"
                    } overflow-hidden`}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] text-sm"
                  />
                </div>
              </div>
            )}
            <div className="flex gap-1 pb-2 custom-scrollbar">
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
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden xl:block bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    className={`px-6 py-4 text-left font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200 ${shouldHideHeader(col.header) ? "sr-only" : ""
                      }`}
                  >
                    {!shouldHideHeader(col.header) && col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-1 text-center"
                  >
                    <div className="text-gray-400">
                      <div className="text-4xl mb-2">📋</div>
                      <p className="text-lg font-medium">No records found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr
                    key={row.id}
                    onMouseEnter={() => handleRowMouseEnter(row.id)}
                    className={`hover:bg-blue-50 transition-colors duration-150 ${newRowIds.includes(row.id) &&
                        !hoveredRows.includes(row.id)
                        ? "bg-blue-50 border-l-4 border-blue-500"
                        : ""
                      } ${rowClassName ? rowClassName(row) : ""}`}
                  >
                    {columns.map((col, i) => (
                      <td
                        key={i}
                        className={`px-4 py-2 text-sm ${col.clickable
                            ? "text-blue-600 cursor-pointer hover:text-blue-800 hover:underline font-medium"
                            : "text-gray-900"
                          }`}
                        onClick={
                          col.clickable
                            ? () => onCellClick?.(row, col)
                            : undefined
                        }
                      >
                        {col.cell ? col.cell(row) : row[col.accessor] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="xl:hidden space-y-4">
        {filteredData.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-6xl mb-4 opacity-50">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredData.map((row) => (
            <div
              key={row.id}
              className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden ${newRowIds.includes(row.id)
                  ? "border-l-4 border-l-blue-500 bg-blue-50/30"
                  : ""
                } ${rowClassName ? rowClassName(row) : ""}`}
            >
              {/* Card Header - Reordered */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* 1. Doctor Name OR Name OR Hospital Name (First Priority) */}
                  {doctorNameColumn ? (
                    <h3
                      className={`text-lg font-semibold text-gray-900 truncate ${doctorNameColumn.clickable
                          ? "text-[var(--primary-color)] cursor-pointer hover:text-[var(--primary-color)] hover:underline"
                          : ""
                        }`}
                      onClick={
                        doctorNameColumn.clickable
                          ? () => onCellClick?.(row, doctorNameColumn)
                          : undefined
                      }
                    >
                      {doctorNameColumn.cell
                        ? doctorNameColumn.cell(row)
                        : row[doctorNameColumn.accessor] || "Unknown Doctor"}
                    </h3>
                  ) : nameColumn ? (
                    <h3
                      className={`text-lg font-semibold text-gray-900 truncate ${nameColumn.clickable
                          ? "text-[var(--primary-color)] cursor-pointer hover:text-[var(--primary-color)] hover:underline"
                          : ""
                        }`}
                      onClick={
                        nameColumn.clickable
                          ? () => onCellClick?.(row, nameColumn)
                          : undefined
                      }
                    >
                      {nameColumn.cell
                        ? nameColumn.cell(row)
                        : row[nameColumn.accessor] || "Untitled"}
                    </h3>
                  ) : hospitalNameColumn ? (
                    <h3
                      className={`text-lg font-semibold text-gray-900 truncate ${hospitalNameColumn.clickable
                          ? "text-[var(--primary-color)] cursor-pointer hover:text-[var(--primary-color)] hover:underline"
                          : ""
                        }`}
                      onClick={
                        hospitalNameColumn.clickable
                          ? () => onCellClick?.(row, hospitalNameColumn)
                          : undefined
                      }
                    >
                      {hospitalNameColumn.cell
                        ? hospitalNameColumn.cell(row)
                        : row[hospitalNameColumn.accessor] || "Unknown Hospital"}
                    </h3>
                  ) : null}
                  {/* ID Badge */}
                  {idColumn && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 flex-shrink-0">
                      #{idColumn.cell ? idColumn.cell(row) : row[idColumn.accessor]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  {/* 2. Actions (Second Priority) */}
                  {actionColumn && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200 shadow-sm">
                      {actionColumn.cell ? actionColumn.cell(row) : null}
                    </div>
                  )}
                  {/* 3. Status (Third Priority) */}
                  {statusColumn && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-[var(--accent-color)] border border-green-200">
                      {statusColumn.cell
                        ? statusColumn.cell(row)
                        : row[statusColumn.accessor]}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}

              <div className="p-4 space-y-2">
                {/* Two columns per row, excluding date column */}
                {columnPairs.map((pair, pairIndex) => (
                  <div key={pairIndex} className="grid grid-cols-2 gap-4">
                    {pair
                      .filter((col) => !shouldHideColumn(col.header) && col.accessor !== dateColumn?.accessor)
                      .map((col, colIndex) => (
                        <div key={colIndex} className="space-y-1">
                          <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            {col.header}
                          </div>
                          <div
                            className={`font-medium text-sm ${col.clickable
                                ? "text-[var(--primary-color)] cursor-pointer hover:text-[var(--primary-color)] hover:underline"
                                : "text-gray-900"
                              }`}
                            onClick={
                              col.clickable
                                ? () => onCellClick?.(row, col)
                                : undefined
                            }
                          >
                            {col.cell ? col.cell(row) : row[col.accessor] ?? "-"}
                          </div>
                        </div>
                      ))}
                  </div>
                ))}
                {/* Date Column in Card Body (only here) */}
                {dateColumn && (
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {dateColumn.header}
                    </div>
                    <div className="font-medium text-sm text-gray-900">
                      {dateColumn.cell
                        ? dateColumn.cell(row)
                        : row[dateColumn.accessor]}
                    </div>
                  </div>
                )}
              </div>

              {newRowIds.includes(row.id) && (
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-[var(--accent-color)] border border-green-200">
                    New
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Mobile & Tablet Bottom Actions */}
      {tabActions.length > 0 && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-xl backdrop-blur-sm">
          <div className="flex gap-3 w-full mx-auto">
            {tabActions.map((action, index) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 transform active:scale-95 shadow-md ${index === 0
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

export default DynamicTable;
