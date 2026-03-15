import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from '../../../services/api';
import AdminDashboardLayout from "../../../components/Layout/Sections/AdminDashboardLayout";
import { X, Save, Upload } from "lucide-react";
import toast from 'react-hot-toast';

const HospitalEditor = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [formData, setFormData] = useState({
        name: "",
        type: "Public",
        province: "",
        address: "",
        latitude: "",
        longitude: "",
        phone_number: "",
        email: "",
        website: "",
        facebook_page: "",
        is_24h_service: false
    });

    useEffect(() => {
        const fetchHospitalDetails = async () => {
           try {
            const response = await API.get(`/admin/hospitals/${id}`);
            
            if (response.data && response.data.success) {
                const hospitalData = response.data.data;
                
                setFormData({
                    ...hospitalData,
                    latitude: String(hospitalData.latitude),
                    longitude: String(hospitalData.longitude)
                });

                if (hospitalData.image) {
                    const cloudName = "dprsygcvh";
                    setPreviewUrl(`https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${hospitalData.image}`);
                }
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load hospital data");
            navigate("/admin/hospitals");
        } finally {
            setFetching(false);
        }
        };
        fetchHospitalDetails();
    }, [id, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = new FormData();
            
            Object.entries(formData).forEach(([key, value]) => {
                dataToSend.append(key, String(value));
            });

            if (imageFile) {
                dataToSend.append("image", imageFile);
            }

            const response = await API.put(`/admin/hospitals/${id}`, dataToSend, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (response.data.success) {
                toast.success("Hospital updated successfully!");
                navigate("/admin/hospitals");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-10 text-center text-gray-500">Loading data...</div>;

    return (
        <AdminDashboardLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <form onSubmit={handleSubmit}>
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Edit Hospital</h1>
                            <p className="text-gray-500">Update information for {formData.name}</p>
                        </div>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
                                <X size={18} /> Cancel
                            </button>
                            <button type="submit" disabled={loading} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
                                <Save size={18} /> {loading ? "Saving..." : "Update Hospital"}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Side: Form Fields */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">
                                    General Information
                                </h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border outline-none">
                                            <option value="Public">Public</option>
                                            <option value="Private">Private</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
                                        <input type="text" name="province" value={formData.province} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border outline-none" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input type="text" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border outline-none" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2 border-b pb-3 mb-4">Location & Contact</h3>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="text-xs text-gray-500">Latitude</label>
                                        <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border outline-none" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500">Longitude</label>
                                        <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} required className="w-full px-4 py-2 rounded-lg border outline-none" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <input type="text" name="phone_number" placeholder="Phone" value={formData.phone_number} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border outline-none" />
                                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-lg border outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Image & Status */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-semibold text-gray-800 mb-4">Hospital Image</h3>
                                <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                <label className="cursor-pointer bg-white text-gray-800 px-4 py-2 rounded-lg font-medium">Change Image</label>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <Upload className="mx-auto text-gray-400 mb-2" />
                                            <span className="text-xs text-gray-500">Upload Image</span>
                                        </div>
                                    )}
                                    <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <span className="font-medium text-gray-700">24h Service</span>
                                <input 
                                    type="checkbox" 
                                    name="is_24h_service" 
                                    checked={formData.is_24h_service} 
                                    onChange={handleChange}
                                    className="w-5 h-5 accent-blue-600"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default HospitalEditor;