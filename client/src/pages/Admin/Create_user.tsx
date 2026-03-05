import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboardLayout from "../../components/Layout/Sections/AdminDashboardLayout";
import API from "../../services/api";
import { ArrowLeft, UserPlus, Loader2, Mail, User, Lock, ShieldCheck } from "lucide-react";

const CreateUser = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "parent"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await API.post("/admin/create-user", formData);
      if (response.status === 201 || response.data.success) {
        navigate("/admin/users");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="h-full flex flex-col">
        {/* Header Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            >
              <ArrowLeft size={25} />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Add New User</h1>
              <p className="text-m text-gray-500">Configure account details and permissions</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
                          form="create-user-form"
                          type="submit"
                          disabled={isSubmitting}
                          onClick={() => navigate("/admin/all-users")}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-5 py-5 rounded-lg font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
              Create User Account
            </button>
          </div>
        </div>

        {/* Form Body - Full Width and Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gray-50/50">
          <form id="create-user-form" onSubmit={handleSubmit} className="space-y-8">
            
            {/* Section 1: Personal Information */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <User size={18} className="text-indigo-500" />
                  Personal Information
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Somboon Sak"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Security & Roles */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-500" />
                  Security & Access
                </h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      required
                      placeholder="Minimum 8 characters"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Assign Role</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white"
                    onChange={(e) => setFormData({ ...formData, role: e.target.value})}
                  >
                    <option value="parent">Parent (Limited Access)</option>
                    <option value="admin">Administrator (Full Access)</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1 italic">
                    Admins can manage other users and system settings.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default CreateUser;