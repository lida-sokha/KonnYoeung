import AdminDashboardLayout from '../../../components/Layout/Sections/AdminDashboardLayout';
import { Users, Building2, Stethoscope, FileText } from 'lucide-react';
const AdminDashboard = () => {

    const stats = [
        { label: 'Total Users', value: '2,847', icon: <Users size={32} />, color: 'bg-green-500' },
        { label: 'Total Hospitals', value: '156', icon: <Building2 size={32} />, color: 'bg-sky-500' },
        { label: 'Disease Count', value: '432', icon: <Stethoscope size={32} />, color: 'bg-amber-400' },
        { label: 'Article Count', value: '89', icon: <FileText size={32} />, color: 'bg-purple-500' },
    ];

    const activities = [
        { action: "New user registration", user: "Sok Dara", time: "5 minutes ago" },
        { action: "Hospital updated", user: "Admin User", time: "12 minutes ago" },
        { action: "Article published", user: "Dr. Chantha", time: "1 hour ago" },
        { action: "Disease information updated", user: "Admin User", time: "2 hours ago" },
        { action: "New hospital added", user: "Admin User", time: "3 hours ago" },
    ];
    return (
        <AdminDashboardLayout>
            <div className="max-w-7xl mx-auto p-6">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                </header>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className={`${stat.color} rounded-xl p-6 text-white shadow-sm flex justify-between items-center`}>
                            <div>
                                <p className="font-bold text-lg opacity-90">{stat.label}</p>
                                <p className="text-3xl font-black mt-2">{stat.value}</p>
                            </div>
                            <div className="opacity-30">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </div>

                {/* System Activity Chart Placeholder */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-8">
                    <h3 className="font-bold text-gray-800 mb-4">System Activity</h3>
                    <div className="h-64 w-full bg-gray-50 rounded-lg flex items-end justify-between p-4 border-b border-l border-gray-200">
                        {/* CSS-only simple bar visualization placeholder */}
                        {[40, 70, 45, 90, 100, 80, 75].map((h, i) => (
                            <div key={i} style={{ height: `${h}%` }} className="w-12 bg-sky-400 rounded-t-md opacity-60"></div>
                        ))}
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
                                <tr key={i} className="hover:bg-gray-50 transition-colors text-sm text-gray-700">
                                    <td className="px-6 py-4">{act.action}</td>
                                    <td className="px-6 py-4">{act.user}</td>
                                    <td className="px-6 py-4 text-gray-400">{act.time}</td>
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