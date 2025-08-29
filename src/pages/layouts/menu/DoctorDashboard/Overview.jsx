import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Pencil, Users, UserPlus, Video, UserCheck, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import DoctorAppointments from "./Appointments";
import { motion } from "framer-motion";

const Overview = () => {
  const user = useSelector((state) => state.auth.user);
  const [doctor, setDoctor] = useState(null);
  const [stats, setStats] = useState({ totalPatients: 0, opdPatients: 0, ipdPatients: 0, virtualPatients: 0 });
  const [appointments, setAppointments] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const doctorRes = await axios.get(`https://6801242781c7e9fbcc41aacf.mockapi.io/api/AV1/users?email=${encodeURIComponent(user?.email)}`);
        const allDoctors = doctorRes.data;
        const doctorData = allDoctors[0];
        if (!doctorData) {
          throw new Error('Doctor not found');
        }
        const dashboardRes = await axios.get('https://mocki.io/v1/16f62a47-cb52-4f02-b5cd-dc13feee53fe');
        const { appointments, payments } = dashboardRes.data;
        const patientsRes = await axios.get('https://681f2dfb72e59f922ef5774c.mockapi.io/addpatient');
        const allPatients = patientsRes.data;
        const doctorPatients = allPatients.filter(patient => patient.doctorId === doctorData.id);
        const patientStats = {
          totalPatients: doctorPatients.length,
          opdPatients: doctorPatients.filter(p => p.patientType?.toLowerCase().includes('opd')).length,
          ipdPatients: doctorPatients.filter(p => p.patientType?.toLowerCase().includes('ipd')).length,
          virtualPatients: doctorPatients.filter(p => p.patientType?.toLowerCase().includes('virtual')).length,
        };
        const formattedDoctor = {
          name: `${doctorData.firstName} ${doctorData.lastName}`,
          specialty: doctorData.roleSpecificData.specialization,
          qualifications: doctorData.roleSpecificData.qualification,
          registrationId: doctorData.roleSpecificData.registrationNumber,
          email: doctorData.email,
          photo: doctorData.photo,
        };
        setDoctor(formattedDoctor);
        setAppointments(appointments);
        const safePayments = Array.isArray(payments) ? payments : [];
        setRevenue({
          total: safePayments.reduce((s, p) => s + Number(p.amount), 0),
          breakdown: calculateRevenueBreakdown(safePayments)
        });
        setStats(patientStats);
      } catch ( err ) {
        console.error('Error fetching data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user?.email]);

  const handleEditClick = () => navigate('/doctordashboard/settings');

  const calculateRevenueBreakdown = (payments) => {
    const groups = {}, colors = {
      'Virtual Consultation': 'text-[var(--color-overlay)]',
      'Physical Consultation': 'text-[var(--color-overlay)]',
      'IPD Treatment': 'text-[var(--color-overlay)]',
      'OPD Treatment': 'text-[var(--color-overlay)]',
      'Lab Tests': 'text-[var(--color-overlay)]',
      'Other': 'text-[var(--primary-color)]-600'
    };
    payments.forEach(p => {
      const type = p.serviceType || 'Other';
      if (!groups[type]) groups[type] = { count: 0, amount: 0 };
      groups[type].count++;
      groups[type].amount += Number(p.amount);
    });
    return Object.entries(groups).map(([type, data]) => ({
      type,
      count: data.count,
      amount: data.amount,
      color: colors[type] || 'text-[var(--primary-color)]-600'
    }));
  };

  function getIconBgClass(type) {
    if (!type) return "card-icon-primary";
    const t = type.toLowerCase();
    if (t.includes("virtual") || t.includes("lab")) return "card-icon-accent";
    return "card-icon-primary";
  }

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent-color)]"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--primary-color)]-50">
        <div className="text-red-500">{error}</div>
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-[var(--primary-color)]-50 p-2 sm:p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      {/* Doctor Info Card */}
      <motion.div
        className="bg-[var(--color-surface)] text-[var(--color-surface)] p-2 sm:p-4 rounded-lg mb-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-[#0e1630] via-[#1b2545] to-[#038358] text-white p-3 rounded-xl flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full">
          <div className="relative flex-shrink-0">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-[var(--accent-color)]"
            />
          </div>
          <div className="flex flex-row flex-wrap gap-2 items-center flex-1 min-w-0">
            {[
              { label: "Name", value: doctor.name || "Guest" },
              { label: "Speciality", value: doctor.specialty || "N/A" },
              { label: "Qualification", value: doctor.qualifications || "N/A" },
              { label: "Reg.No.", value: doctor.registrationId || "N/A" },
               { label: "Email Id", value: doctor.email || "N/A" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col whitespace-nowrap text-xs sm:text-sm">
                <span className="text-[#01D48C] truncate">{item.label}</span>
                <span className="text-gray-200 truncate">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center sm:justify-end">
            <div className="relative group">
              <Pencil
                onClick={handleEditClick}
                className="w-5 h-5 sm:w-6 sm:h-6 p-1 rounded-full bg-white text-black cursor-pointer hover:scale-110 transition-transform duration-200"
              />
              <span className="absolute -top-6 sm:-top-10 left-1/2 -translate-x-1/2 text-[10px] sm:text-[11px] bg-white text-black rounded-md px-1.5 py-0.5 opacity-0 scale-90 translate-y-1 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg z-10">
                Edit
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="container mx-auto px-2 py-2 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {["Total Patients", "OPD Patients", "IPD Patients", "Virtual Patients"].map((label, i) => {
            const icons = [
              <Users className="h-4 w-4 sm:h-4 sm:w-4 card-icon-white" />,
              <UserPlus className="h-4 w-4 sm:h-4 sm:w-4 card-icon-white" />,
              <UserCheck className="h-4 w-4 sm:h-4 sm:w-4 card-icon-white" />,
              <Video className="h-4 w-4 sm:h-4 sm:w-4 card-icon-white" />
            ];
            const colors = ["primary", "accent", "primary", "accent"];
            const keys = ["totalPatients", "opdPatients", "ipdPatients", "virtualPatients"];
            const glowColor = colors[i] === "primary" ? "0 2px 12px 0 var(--primary-color)" : "0 2px 12px 0 var(--accent-color)";
            const tabValue = label === "Total Patients" ? "OPD" : label.split(" ")[0];
            return (
              <div key={label} className="w-full">
                <Link to={`/doctordashboard/patients?tab=${tabValue}`} className="block">
                  <motion.div
                    className={`card-stat card-border-${colors[i]} p-2 sm:p-4`}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    whileHover={{ boxShadow: glowColor }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1, type: "spring", bounce: 0.2 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="card-stat-label text-xs sm:text-sm">{label}</p>
                        <h3 className="card-stat-count text-lg sm:text-xl">{stats[keys[i]].toLocaleString()}</h3>
                      </div>
                      <motion.div
                        className={`card-icon card-icon-${colors[i]}`}
                        whileHover={{ scale: 1.08, boxShadow: glowColor }}
                        transition={{ type: "spring", stiffness: 250, damping: 18 }}
                      >
                        {icons[i]}
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Appointments & Revenue */}
        <div className="mt-4 sm:mt-6 grid grid-cols-1 gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4">
            {/* Appointments */}
            <motion.div
              className="overflow-hidden mt-2 sm:mt-3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">
                <h4 className="h4-heading flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                  <Calendar className="text-[var(--accent-color)]" />Recent Appointments
                </h4>
                <Link
                  to="/doctordashboard/appointments"
                  className="text-[var(--primary-color)] font-medium hover:text-[var(--accent-color)] text-bold transition-colors duration-200 flex items-center space-x-1 text-sm"
                >
                  <span>View All</span><ChevronRight className="text-xs" />
                </Link>
              </div>
              <DoctorAppointments showOnlyPending={true} isOverview={true} />
            </motion.div>

            {/* Revenue */}
            <motion.div
              className="p-2 sm:p-4 min-h-[300px]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="sub-heading py-2 sm:py-3 px-2 sm:px-4 w-full bg-[var(--primary-color)] text-[var(--color-surface)] font-semibold rounded-t">
                <h3 className="text-base sm:text-lg m-0">Revenue Generated</h3>
              </div>
              <motion.div
                className="bg-[var(--color-surface)] p-2 sm:p-4 rounded-b-lg h-full"
                style={{ marginTop: '0' }}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, type: "spring", bounce: 0.25, delay: 0.7 }}
              >
                <motion.div
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:mb-6 pt-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 0.9 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <div>
                    <p className="text-sm paragraph">Total Revenue</p>
                    <motion.h4
                      className="text-xl sm:text-2xl font-bold text-[var(--primary-color)]"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 1.2, type: "spring", bounce: 0.4 }}
                    >
                      ₹{revenue?.total.toLocaleString()}
                    </motion.h4>
                  </div>
                  <motion.div
                    className="sm:pt-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <Link
                      to="/doctordashboard/billing"
                      className="text-[var(--primary-color)] hover:text-[var(--accent-color)] flex items-center text-sm font-medium transition-colors duration-300"
                    >
                      View Billing & Payments <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Breakdown Cards */}
                <div className="space-y-2 sm:space-y-3">
                  {(revenue?.breakdown.slice(0, 3) || []).map((item, i) => {
                    const Icon = item.type.includes("Virtual") ? Video : item.type.includes("Physical") ? UserCheck : Users;
                    const isHovered = hoveredIndex === i;
                    const iconBgClass = getIconBgClass(item.type);
                    return (
                      <div className="shadow-sm rounded-sm p-2 sm:p-3" key={item.type}>
                        <motion.div
                          initial={{ opacity: 0, x: 40 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            scale: isHovered ? 1.04 : 1,
                            backgroundColor: isHovered ? "rgba(7, 143, 86, 0.1)" : "#fff",
                            boxShadow: isHovered ? "0 8px 32px 0 rgba(0, 255, 106, 0.15)" : "none"
                          }}
                          transition={{ duration: 0.25, type: "spring", bounce: 0.3, delay: 1.3 + i * 0.15 }}
                          className="rounded transition-colors duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredIndex(i)}
                          onMouseLeave={() => setHoveredIndex(null)}
                        >
                          <div className="flex items-center justify-between mb-1 sm:mb-2">
                            <div className="flex items-center">
                              <motion.div
                                className={`card-icon ${iconBgClass} shadow-sm mr-2 sm:mr-3`}
                                animate={{
                                  boxShadow: isHovered ? "0 0 0 4px rgba(0, 255, 85, 0.15), 0 4px 20px 0 rgba(14, 185, 105, 0.1)" : "none",
                                  backgroundColor: isHovered ? "var(--accent-color)" : ""
                                }}
                              >
                                <Icon className="h-4 w-4 sm:h-5 sm:w-5 card-icon-white" />
                              </motion.div>
                              <div>
                                <motion.p
                                  className="text-sm paragraph"
                                  animate={{ color: isHovered ? "var(--primary-color)" : "", scale: isHovered ? 1.08 : 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {item.type}
                                </motion.p>
                                <motion.p
                                  className="text-xs paragraph"
                                  animate={{ color: isHovered ? "var(--primary-color)" : "" }}
                                  transition={{ duration: 0.2 }}
                                >
                                  {item.count} consultations
                                </motion.p>
                              </div>
                            </div>
                            <motion.p
                              className="text-sm font-semibold paragraph"
                              animate={{ color: isHovered ? "var(--accent-color)" : "", scale: isHovered ? 1.08 : 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              ₹{item.amount.toLocaleString()}
                            </motion.p>
                          </div>
                          <motion.div
                            className="h-1 bg-[var(--color-overlay)]-100 rounded-full overflow-hidden"
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 0.7, delay: 1.6 + i * 0.15 }}
                          >
                            <motion.div
                              className="h-full"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(item.amount / revenue.total) * 100}%`,
                                backgroundColor: isHovered
                                  ? "var(--accent-color)"
                                  : iconBgClass === "card-icon-accent"
                                    ? "var(--accent-color)"
                                    : iconBgClass === "card-icon-primary"
                                      ? "var(--primary-color)"
                                      : "#e5e7eb"
                              }}
                              transition={{ duration: 1, delay: 1.7 + i * 0.15, type: "spring" }}
                            ></motion.div>
                          </motion.div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Overview;
