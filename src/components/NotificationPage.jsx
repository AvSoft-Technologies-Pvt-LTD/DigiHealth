import React, { useState, useEffect } from "react";
import { Bell, MessageCircle, ArrowLeft, Search, Filter, CheckCircle, Circle, Users, Calendar, FileText, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const DoctorNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://67e631656530dbd3110f0322.mockapi.io/drnotifiy");
      const sorted = res.data
        .map((n) => ({
          ...n,
          createdAt: n.createdAt && !isNaN(new Date(n.createdAt)) ? n.createdAt : new Date().toISOString(),
          unread: n.unread ?? true,
          message: n.message || "New notification",
          type: n.type || "appointment",
          category: n.category || "general",
          priority: n.priority || "normal",
          patientName: n.patientName || "Unknown Patient",
        }))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(sorted);
      setFilteredNotifications(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    let filtered = notifications;

    if (searchTerm) {
      filtered = filtered.filter((n) =>
        n.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.patientName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter((n) =>
        filterType === "unread" ? n.unread : !n.unread
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter((n) => n.category === categoryFilter);
    }

    setFilteredNotifications(filtered);
  }, [notifications, searchTerm, filterType, categoryFilter]);

  const getTimeAgo = (time) => {
    const date = new Date(time);
    if (isNaN(date)) return "Unknown time";
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
    return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? "s" : ""} ago`;
  };

  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, unread: false } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "appointment":
        return <Calendar className="h-4 w-4" />;
      case "patient":
        return <Users className="h-4 w-4" />;
      case "report":
        return <FileText className="h-4 w-4" />;
      case "medical":
        return <Stethoscope className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "appointment", label: "Appointments" },
    { value: "patient", label: "Patients" },
    { value: "report", label: "Reports" },
    { value: "medical", label: "Medical" },
    { value: "general", label: "General" },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Doctor Notifications</h1>
                <p className="text-sm text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notifications and patients..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterType("all")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "all"
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterType("unread")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "unread"
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Circle className="h-3 w-3" />
                  Unread
                </button>
                <button
                  onClick={() => setFilterType("read")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === "read"
                      ? "bg-[var(--primary-color)] text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CheckCircle className="h-3 w-3" />
                  Read
                </button>
              </div>
              
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Mark All Read Button - Mobile */}
        {unreadCount > 0 && (
          <div className="sm:hidden mb-4">
            <button
              onClick={markAllAsRead}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary-color)] text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CheckCircle className="h-4 w-4" />
              Mark all as read
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || filterType !== "all" || categoryFilter !== "all" ? "No notifications found" : "No notifications yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You'll see your notifications here"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  notification.unread
                    ? "border-l-4 border-l-[var(--primary-color)] border-gray-200 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${getPriorityColor(notification.priority)}`}>
                      {getCategoryIcon(notification.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {notification.unread && (
                          <div className="w-2 h-2 bg-[var(--primary-color)] rounded-full flex-shrink-0" />
                        )}
                        <span className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                          {notification.category || "General"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{getTimeAgo(notification.createdAt)}</span>
                        {notification.priority === "high" && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium text-red-600">High Priority</span>
                          </>
                        )}
                        {notification.patientName && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs font-medium text-[var(--primary-color)]">
                              {notification.patientName}
                            </span>
                          </>
                        )}
                      </div>
                      <p className="text-gray-900 font-medium leading-relaxed mb-2">
                        {notification.message}
                      </p>
                      {notification.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {notification.description}
                        </p>
                      )}
                      {notification.showPayButton && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log("Pay now clicked for", notification.id);
                          }}
                          className="mt-4 bg-gradient-to-r from-[var(--accent-color)] to-yellow-400 hover:from-yellow-400 hover:to-[var(--accent-color)] text-[var(--primary-color)] text-sm font-semibold px-6 py-2 rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                        >
                          Pay Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Spacing for Mobile */}
        <div className="h-20"></div>
      </div>
    </div>
  );
};

export default DoctorNotificationsPage;