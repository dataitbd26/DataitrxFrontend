import React, { useState, useEffect, useCallback, useContext } from 'react';
import dayjs from 'dayjs';
import UseAxiosSecure from '../../Hook/UseAxioSecure';
import { AuthContext } from '../../providers/AuthProvider';
import {
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  Activity, Calendar, Users, FileText, Building2,
  MapPin, CloudSun, RefreshCw, UserPlus, Stethoscope, Clock
} from 'lucide-react';

const COLORS = ['#147bff', '#a04fff', '#00bda9', '#ccc141', '#cd3c84', '#ff7f50', '#87ceeb'];

const BranchDashboard = () => {
  const axiosSecure = UseAxiosSecure();
  // --- EXTRACTED CHAMBER FROM CONTEXT ---
  const { branch, user, chamber } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async (manualRefresh = false) => {
    try {
      if (manualRefresh) setIsRefreshing(true);
      else setLoading(true);

      const response = await axiosSecure.get('/dashboard/branch', {
        params: { branch: branch }
      });

      setData(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Branch Dashboard Fetch Error:", err);
      setError("Failed to load branch dashboard data.");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [axiosSecure, branch]);

  useEffect(() => {
    if (branch) {
      fetchDashboardData();
    }
  }, [fetchDashboardData, branch]);

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50/50">
      <div className="flex flex-col items-center gap-4">
        <span className="loading loading-ring loading-lg text-primary"></span>
        <p className="text-neutral/60 font-medium animate-pulse">Loading your dashboard...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-gray-50/50 p-6">
      <div className="alert alert-error max-w-lg shadow-xl rounded-2xl text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span>{error}</span>
        <button onClick={() => fetchDashboardData(true)} className="btn btn-sm btn-ghost">Retry</button>
      </div>
    </div>
  );

  if (!data) return <div className="p-10 text-center font-primary text-neutral/50">No data available.</div>;

  const {
    kpis, todaysActivity, thisMonthActivity, charts, recentTables, weather, doctorProfile
  } = data;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return dayjs(dateString).format('MMM D, hh:mm A');
  };

  const todayDateStr = dayjs().format('dddd, MMMM D, YYYY');

  const getAvatarInitials = (name) => {
    if (!name) return "DR";
    const parts = name.replace("Dr. ", "").trim().split(" ");
    return parts.map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 md:p-8 bg-[#F8FAFC] min-h-screen font-primary text-base-content space-y-8">

      {/* --- HERO BANNER --- */}
      <div className="relative overflow-hidden bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-48 h-48 bg-secondary/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* Profile Section */}
        <div className="flex items-center gap-5 z-10">
          <div className="avatar">
            {doctorProfile?.picture ? (
              <div className="w-20 h-20 rounded-full ring-4 ring-primary/10 shadow-md">
                <img src={doctorProfile.picture} alt={doctorProfile.name} />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full ring-4 ring-primary/10 shadow-md bg-gradient-to-br from-primary to-primary-focus text-white flex items-center justify-center text-2xl font-bold">
                <span>{getAvatarInitials(doctorProfile?.name)}</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
              Welcome back, <span className="text-primary">{doctorProfile?.name || user?.name || "Doctor"}</span>
            </h1>
            <div className="flex items-center flex-wrap gap-3 mt-2">
              <span className="badge border-primary/20 bg-primary/5 text-primary gap-1 py-3 px-3 rounded-lg font-medium">
                <Stethoscope size={14} /> {doctorProfile?.designation || "Staff"}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-gray-600 font-medium flex items-center gap-1">
                <Building2 size={16} className="text-gray-400" /> {doctorProfile?.department || "General"}
              </span>

              {/* --- ADDED ACTIVE CHAMBER BADGE --- */}
              {chamber && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="badge border-info/20 bg-info/5 text-info gap-1 py-3 px-3 rounded-lg font-medium">
                    <MapPin size={14} /> {chamber.chamberName}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action & Weather Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto z-10">
          <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 py-3 px-5 rounded-2xl w-full sm:w-auto shadow-sm">
            <div className="bg-white p-2 rounded-xl shadow-sm text-2xl">
              {weather?.icon || <CloudSun className="text-primary" />}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{todayDateStr}</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-800 leading-none">{weather?.temp || "--"}</p>
                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                <p className="text-sm font-medium text-gray-500">{weather?.location || "Unknown"} </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchDashboardData(true)}
            disabled={isRefreshing}
            className="btn btn-primary rounded-xl w-full sm:w-auto shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all"
          >
            <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
            {isRefreshing ? "Syncing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* --- ACTIVITY SPLIT (TODAY VS MONTH) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <Clock size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Today's Activity</h2>
            <span className="ml-auto flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-success"></span>
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="New Patients" value={todaysActivity?.newPatientsToday} icon={UserPlus} color="text-secondary" bg="bg-secondary/10" />
            <MetricCard title="Prescriptions" value={todaysActivity?.prescriptionsToday} icon={FileText} color="text-accent" bg="bg-accent/10" />
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-info/10 rounded-lg text-info">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Monthly Activity</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <MetricCard title="New Patients" value={thisMonthActivity?.newPatientsThisMonth} icon={Users} color="text-info" bg="bg-info/10" />
            <MetricCard title="Prescriptions" value={thisMonthActivity?.prescriptionsThisMonth} icon={FileText} color="text-primary" bg="bg-primary/10" />
          </div>
        </div>
      </div>

      {/* --- BRANCH OVERVIEW TOTALS --- */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4 px-2">Lifetime Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <Totalkpi title="Total Patients" value={kpis?.totalPatients} icon={Users} color="text-blue-500" />
          <Totalkpi title="Prescriptions" value={kpis?.totalPrescriptions} icon={FileText} color="text-purple-500" />
          <Totalkpi title="Staff Users" value={kpis?.totalUsers} icon={Activity} color="text-emerald-500" />
          <Totalkpi title="Rx Templates" value={kpis?.totalTemplates} icon={FileText} color="text-amber-500" />
          <Totalkpi title="Chambers" value={kpis?.totalChambers} icon={MapPin} color="text-rose-500" />
        </div>
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity size={20} className="text-primary" /> Prescription Trend
            </h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 30 Days</span>
          </div>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.prescriptionsTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Line type="monotone" dataKey="count" name="Prescriptions" stroke="#147bff" strokeWidth={4} dot={false} activeDot={{ r: 8, strokeWidth: 0, fill: '#147bff' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-secondary" /> Demographics
          </h2>
          <div className="flex-1 min-h-[250px] flex justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.patientGenders} cx="50%" cy="50%" innerRadius={60} outerRadius={80}
                  paddingAngle={5} dataKey="count" nameKey="_id" stroke="none"
                >
                  {charts?.patientGenders?.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legend */}
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {charts?.patientGenders?.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm font-medium text-gray-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                {entry._id || 'Unknown'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- DATA TABLES --- */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Prescriptions Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm xl:col-span-2 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Recent Prescriptions</h2>
            <button className="text-sm font-semibold text-primary hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="font-semibold rounded-tl-lg">Rx ID</th>
                  <th className="font-semibold">Patient</th>
                  <th className="font-semibold">Doctor</th>
                  <th className="font-semibold">Status</th>
                  <th className="font-semibold text-right rounded-tr-lg">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTables?.recentPrescriptions?.map((rx) => (
                  <tr key={rx._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <td className="font-bold text-primary">{rx.prescriptionId || "N/A"}</td>
                    <td>
                      <p className="font-semibold text-gray-800">{rx.patient?.name || "N/A"}</p>
                      <p className="text-xs text-gray-400">{rx.patient?.phone}</p>
                    </td>
                    <td className="text-gray-600 font-medium">{rx.doctorId?.name || "N/A"}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${rx.status === 'Completed' ? 'bg-success/10 text-success' :
                        rx.status === 'Draft' ? 'bg-warning/10 text-warning-content' : 'bg-error/10 text-error'
                        }`}>
                        {rx.status}
                      </span>
                    </td>
                    <td className="text-gray-400 text-sm text-right">{formatDate(rx.createdAt)}</td>
                  </tr>
                ))}
                {(!recentTables?.recentPrescriptions?.length) && (
                  <tr><td colSpan="5" className="text-center py-8 text-gray-400">No recent prescriptions found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Recent Patients</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="font-semibold">Patient</th>
                  <th className="font-semibold">Details</th>
                  <th className="font-semibold text-right">Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentTables?.recentPatients?.map((patient) => (
                  <tr key={patient._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <td>
                      <p className="font-semibold text-gray-800">{patient.fullName || "N/A"}</p>
                      <p className="text-xs text-gray-400">{patient.phone}</p>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{patient.gender?.charAt(0) || "-"}</span>
                        <span>•</span>
                        <span>{patient.age ? `${patient.age}y` : "-"}</span>
                        {patient.bloodGroup && (
                          <span className="badge badge-sm badge-ghost ml-1 text-[10px]">{patient.bloodGroup}</span>
                        )}
                      </div>
                    </td>
                    <td className="text-gray-400 text-sm text-right">{formatDate(patient.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Staff & Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs tracking-wider">
                <tr>
                  <th className="font-semibold">User</th>
                  <th className="font-semibold">Role/Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTables?.recentUsers?.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <td>
                      <p className="font-semibold text-gray-800">{u.name || "N/A"}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <span className="badge badge-sm bg-primary/10 text-primary border-0 font-medium capitalize">{u.role}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${u.status === 'active' ? 'text-success' : 'text-gray-400'}`}>
                          {u.status || "Unknown"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

// Reusable Sub-components

const MetricCard = ({ title, value, icon: Icon, color, bg }) => (
  <div className="flex items-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-colors">
    <div className={`p-3 rounded-xl ${bg} ${color} mr-4`}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-2xl font-black text-gray-800 leading-none">{value || 0}</h3>
    </div>
  </div>
);

const Totalkpi = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
    <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
      <Icon size={80} />
    </div>
    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 z-10">{title}</p>
    <div className="flex items-end gap-3 z-10">
      <h3 className={`text-3xl font-black ${color}`}>{value || 0}</h3>
    </div>
  </div>
);

export default BranchDashboard;