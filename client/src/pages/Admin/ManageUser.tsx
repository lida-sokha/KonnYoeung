import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../../components/Layout/Sections/AdminDashboardLayout";
import API from "../../services/api";
import { Loader2, Plus, Shield, Trash2, Search, Mail, Calendar } from "lucide-react";
import toast from 'react-hot-toast';
interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "parent";
  createdAt?: string;
}

const ManageUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/admin/all-users");
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (userId: string) => {
    const loadingToast = toast.loading("Deleting user...");
    try {
      const response = await API.delete(`/admin/delete-user/${userId}`);
      if (response.status === 200 || response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      }
      if (response.data.success) {
        setUsers((prevUsers) => prevUsers.filter((h) => h._id !== userId));
        toast.success("User deleted successfully", { id: loadingToast });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete user");
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <span className="text-sm font-medium text-gray-800">
                    Delete this User? This cannot be undone.
                </span>
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition"
                    >
                        cancel
                    </button>
                    <button
                        onClick={() => {
                            toast.dismiss(t.id);
                            handleDelete(id);
                        }}
                        className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg shadow-sm transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: 3000,
            position: 'top-center',
            style: { minWidth: '300px', border: '1px solid #fee2e2' }
        }
        );
  }

  return (
    <AdminDashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-20 max-w-6xl mx-auto">
        
        {/* Header Section: Stacked on mobile, side-by-side on md+ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 mt-1 text-sm md:text-base">Manage platform access and permissions.</p>
          </div>
          <button 
            onClick={() => navigate("/admin/create-user")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold transition-all shadow-md active:scale-95"
          >
            <Plus size={18} /> Add New User
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3 focus-within:ring-2 focus-within:ring-[#34AADC]/20 transition-all">
          <Search className="text-gray-400 shrink-0" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="flex-1 outline-none text-gray-600 bg-transparent w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <Loader2 className="animate-spin text-[#34AADC] mb-4" size={40} />
            <p className="text-gray-500 font-medium text-sm">Loading user database...</p>
          </div>
        ) : (
          <>
            {/* 1. Mobile & Tablet View: Card Grid (Hidden on Desktop) */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {filteredUsers.map((user) => (
                <div key={user._id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#34AADC]/10 flex items-center justify-center text-[#34AADC] font-bold text-lg">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{user.fullName}</h3>
                        <span className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {user.role === 'admin' && <Shield size={10} />}
                          {user.role}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="pt-2 space-y-2 border-t border-gray-50 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-gray-400" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-gray-400" /> Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. Desktop View: Standard Table (Hidden on Mobile/Tablet) */}
            <div className="hidden lg:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">User Details</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Joined Date</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#34AADC]/20 to-sky-100 flex items-center justify-center text-[#34AADC] font-bold">
                              {user.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{user.fullName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                            user.role === 'admin' 
                              ? 'bg-purple-50 text-purple-700 ring-1 ring-purple-200' 
                              : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                          }`}>
                            {user.role === 'admin' && <Shield size={12} />}
                            {user.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            onClick={() =>confirmDelete(user._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default ManageUsers;