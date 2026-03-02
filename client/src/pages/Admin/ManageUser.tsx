import { useEffect, useState } from "react";
import AdminDashboardLayout from "../../components/Layout/Sections/AdminDashboardLayout";
import API from "../../services/api";
import { Loader2, Plus, Shield, Trash2, UserIcon } from "lucide-react";
interface User{
    _id: string;
    fullName: string;
    email: string;
    role: "admin" | "user";
    createdAt?: string;
}
const ManageUsers = () => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({ fullName: "", email: "", password: "", role: "user" });
    const fetchUser = async () => {
        try {
            setLoading(true);
            const response = await API.get("/admin/all-users");
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchUser();
    }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await API.post("/admin/create-user", newUser);
            if (response.data.success || response.status == 201) {
                setShowModal(false);
                setNewUser({ fullName: "", email: "", password: "", role: "parent" });
                await fetchUser();
            }
        } catch (error: any) {
            console.error("Creation failed:", error);
            alert(error.response?.data?.message || "Failed to create user");
        }
    }
    return (
        <AdminDashboardLayout>
       <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Users</h1>
                    <p className="text-gray-500">Control access and assign roles for KonnYoeung</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                    <Plus size={20} /> Add New User
                </button>
            </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-sky-500" size={40} />
                            </div>
                    ) : (
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                                        <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex item-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
                                                    <UserIcon size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.fullName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`} >
                                                    {user.role === 'admin' ? <Shield size={12} /> : null}
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                <Trash2 size={18} />
                                            </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                    )
                }
                </div>
            </div>
            {showModal && (
                <div className="fixed inset-0 bg-back/50 drop-blur-sm z-50 items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <input
                                type="text" placeholder="fullName" required className="w-full border p-3 rounded-xl"
                                onChange={(e) => setNewUser({...newUser,fullName:e.target.value})}
                            />
                            <input
                                type="email" placeholder="email" required className="w-full border p-3 rounded-xl"
                                onChange={(e) => setNewUser({...newUser,email:e.target.value})}
                            />
                            <input
                                type="password" placeholder="password" required className="w-full border p-3 rounded-xl"
                                onChange={(e) => setNewUser({...newUser,password:e.target.value})}
                            />
                            <select className="w-full border p-3 rounded-xl" 
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value})}
                            >
                                <option value="parent">Parent</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex gap-3 pt-4">
                                <button type="button" 
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 text-gray-500 font-semibold">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 bg-sky-500 text-white py-3 rounded-xl font-bold" onClick={()=> handleCreateUser}>
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminDashboardLayout>
    );
}
export default ManageUsers;