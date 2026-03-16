import { useState, useEffect } from "react";
import API from '../../../services/api';
import AdminDashboardLayout from '../../../components/Layout/Sections/AdminDashboardLayout';
import { Users, Building2, Stethoscope, FileText } from 'lucide-react';
const AdminDashboard = () => {
    const [counts, setCounts] = useState({
        users: 0,
        hospitals: 0,
        diseases: 0,
        articles: 0
    });
   const [activityData, setActivityData] = useState([
    { day: 'Mon', date: '', hospitals: 0, articles: 0, users: 0 },
    { day: 'Tue', date: '', hospitals: 0, articles: 0, users: 0 },
    { day: 'Wed', date: '', hospitals: 0, articles: 0, users: 0 },
    { day: 'Thu', date: '', hospitals: 0, articles: 0, users: 0 },
    { day: 'Fri', date: '', hospitals: 0, articles: 0, users: 0 },
    { day: 'Sat', date: '', hospitals: 0, articles: 0, users: 0 },
    { day: 'Sun', date: '', hospitals: 0, articles: 0, users: 0 },
]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await API.get('/admin/activity-chart');
                if (res.data.success) {
                    setActivityData(res.data.data);
                }
            } catch (err) {
                // If API fails, we keep the zeros or use some default mock data
                console.log("Chart data fetch failed");
            }
        };
        fetchData();
    }, []);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await API.get('/admin/stats');
                if (response.data.success) {
                    setCounts(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
            fetchStats();
        }, []);
    const stats = [
    { 
        label: 'Total Users', 
        value: (counts?.users || 0).toLocaleString(), 
        icon: <Users size={32} />, 
        color: 'bg-green-500' 
    },
    { 
        label: 'Total Hospitals', 
        value: (counts?.hospitals || 0).toLocaleString(), 
        icon: <Building2 size={32} />, 
        color: 'bg-sky-500' 
    },
    { 
        label: 'Disease Count', 
        value: (counts?.diseases || 0).toLocaleString(), 
        icon: <Stethoscope size={32} />, 
        color: 'bg-amber-400' 
    },
    { 
        label: 'Article Count', 
        value: (counts?.articles || 0).toLocaleString(), 
        icon: <FileText size={32} />, 
        color: 'bg-purple-500' 
    },
];
    const [activeTab, setActiveTab] = useState<'hospitals' | 'articles' | 'users'>('hospitals');
    const [activities, setActivities] = useState<any[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState(true);
    const currentValues = activityData.map(d => Number(d[activeTab]) || 0);
    const maxValue = Math.max(...currentValues, 1); 

useEffect(() => {
    const fetchActivities = async () => {
        try {
            const response = await API.get('/admin/Activity');
            if (response.data.success) {
                setActivities(response.data.data); 
            }
        } catch (error) {
            console.error("Error fetching activities:", error);
        } finally {
            setActivitiesLoading(false);
        }
    };
    fetchActivities();
}, []);

    return (
        <AdminDashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                </header>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className={`${stat.color} rounded-xl p-6 text-white shadow-sm flex justify-between items-center transition-transform hover:scale-105`}>
                            <div>
                                <p className="font-bold text-lg opacity-90">{stat.label}</p>
                                <p className="text-3xl font-black mt-2">
                                    {loading ? "..." : stat.value}
                                </p>
                            </div>
                            <div className="opacity-30">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* System Activity Chart Placeholder */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Registration Trends</h3>
                    <p className="text-xs text-gray-500">Growth overview for the last 7 days</p>
                </div>
                
                {/* Tabs for switching data */}
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {(['hospitals', 'articles', 'users'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                activeTab === tab 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Container */}
            <div className="h-64 w-full bg-gray-50/50 rounded-xl flex items-end justify-around p-6 border-b border-l border-gray-100 relative">
                {activityData.map((data, i) => {
                    const val = data[activeTab];
                    // Dynamic height calculation
                    const heightPercent = (val / maxValue) * 100;

                            return (
                                <div key={i} className="flex flex-col items-center w-full group relative">
                                    {/* The Bar */}
                                    <div 
                                        style={{ height: `${Math.max(heightPercent, 5)}%` }} 
                                        className={`w-10 sm:w-14 rounded-t-md transition-all duration-500 ease-out cursor-pointer relative group-hover:brightness-110 ${
                                            activeTab === 'hospitals' ? 'bg-sky-500' : 
                                            activeTab === 'articles' ? 'bg-purple-500' : 'bg-green-500'
                                        } ${val === 0 ? 'opacity-20' : 'opacity-80'}`}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                                            {val} New {activeTab}
                                        </div>
                                    </div>
                                    {/* Day Label */}
                                    <span className="text-[10px] font-bold text-gray-400 mt-3 uppercase tracking-wider">{data.day}</span>
                                </div>
                            );
                        })}

                        {/* Grid Lines (Optional for extra polish) */}
                        <div className="absolute inset-x-0 top-1/2 border-t border-gray-100 w-full pointer-events-none"></div>
                        <div className="absolute inset-x-0 top-1/4 border-t border-gray-100 w-full pointer-events-none"></div>
                        <div className="absolute inset-x-0 top-3/4 border-t border-gray-100 w-full pointer-events-none"></div>
                    </div>
                </div>

                {/* Recent Activities Table */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50">
                        <h3 className="font-bold text-gray-800">Recent Activities</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Action</th>
                                <th className="px-6 py-3 font-medium">User</th>
                                <th className="px-6 py-3 font-medium">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {activities.map((act, i) => (
                                <tr key={act._id || i} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${
                                                act.type === 'registration' ? 'bg-green-100 text-green-600' :
                                                act.type === 'article_published' ? 'bg-purple-100 text-purple-600' :
                                                'bg-sky-100 text-sky-600'
                                            }`}>
                                                {act.type === 'registration' && <Users size={16} />}
                                                {act.type === 'article_published' && <FileText size={16} />}
                                                {act.type === 'hospital_added' && <Building2 size={16} />}
                                            </div>
                                            <span className="font-medium">{act.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {act.user?.fullName || "System Admin"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">
                                        {new Date(act.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminDashboardLayout>
    )
}
export default AdminDashboard;