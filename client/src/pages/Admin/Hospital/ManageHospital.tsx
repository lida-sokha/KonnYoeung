import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../../services/api'
import AdminDashboardLayout from "../../../components/Layout/Sections/AdminDashboardLayout";
import { Plus, Trash2, Edit, Search } from "lucide-react";
import toast from 'react-hot-toast';

interface Hospital {
    _id?: string; 
    name: string;
    type: string;
    province: string;
    address: string;
    is_24h_service?: boolean;
}

const ManageHospital = () => {
    const navigate = useNavigate();
    const [hospitals, setHospitals] = useState<Hospital[]>([]); 
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await API.get("/admin/hospitals");
            if (response.data.success) {
                setHospitals(response.data.data);
            }
        } catch (error) {
            console.error("Error Fetching hospitals:", error);
        } finally {
            setLoading(false);
        }
    }

    const filteredHospitals = hospitals.filter((h) =>
        h.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
const handleDelete = async (hospitalId: string) => {
    const loadingToast = toast.loading("Deleting article...");
        try {
            const response = await API.delete(`/admin/hospitals/${hospitalId}`);
            if (response.data.success) {
                setHospitals((prev) => prev.filter((h) => h._id !== hospitalId));
                toast.success("Hospital deleted successfully!", { id: loadingToast });
            }
        } catch (error:any) {
            toast.error(error.response?.data?.message || "Failed to delete hospital");
    }
    };
    const confirmDelete = (id: string) => {
        toast((t) => (
            <div className="flex flex-col gap-3 p-1">
                <span className="text-sm font-medium text-gray-800">
                    Delete this hospital? This cannot be undone.
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
    };
    return (
        <AdminDashboardLayout>
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Manage Hospitals</h1>
                        <p className="text-gray-500 text-m">Add and manage hospital information</p>
                    </div>
                    <button
                        onClick={() => navigate("/admin/Addhospital")}
                        className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
                    >
                        <Plus size={20} />
                        Add Hospital
                    </button>
                </div>

                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                    <Search className="text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="flex-1 outline-none text-gray-600"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Hospital Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Province</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">24h Service</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">Loading hospitals...</td>
                                </tr>
                            ) : filteredHospitals.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">No hospitals found.</td>
                                </tr>
                            ) : filteredHospitals.map((h) => (
                                <tr key={h._id || h.name} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-gray-800 block">{h.name}</span>
                                        <span className="text-xs text-gray-400 truncate block max-w-xs">{h.address}</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{h.type}</td>
                                    <td className="px-6 py-4 text-gray-600 text-sm">{h.province}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            h.is_24h_service 
                                            ? 'bg-green-100 text-green-600' 
                                            : 'bg-gray-100 text-gray-600'
                                        }`}>
                                            {h.is_24h_service ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition"
                                            onClick={() => navigate(`/admin/EditHospital/${h._id}`)}
                                            >
                                            <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                onClick={() => confirmDelete(h._id!)}
                                            ><Trash2 size={18} /></button>
                                        </div>
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

export default ManageHospital;