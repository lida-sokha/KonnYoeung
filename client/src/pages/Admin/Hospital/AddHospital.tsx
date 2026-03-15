import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../../services/api';
import AdminDashboardLayout from "../../../components/Layout/Sections/AdminDashboardLayout";
import toast from 'react-hot-toast';
import { Save, X, Upload, MapPin, Phone, Globe } from "lucide-react";

const Addhospital = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setImageFile(file); // This must be the raw file object
        setPreviewUrl(URL.createObjectURL(file)); // This is just for UI
    }
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
        const dataToSend = new FormData();

        // 1. Append Fields (Existing logic)
        dataToSend.append("name", formData.name);
        dataToSend.append("type", formData.type);
        dataToSend.append("province", formData.province);
        dataToSend.append("address", formData.address);
        dataToSend.append("latitude", String(formData.latitude));
        dataToSend.append("longitude", String(formData.longitude));
        dataToSend.append("phone_number", formData.phone_number || "");
        dataToSend.append("email", formData.email || "");
        dataToSend.append("website", formData.website || "");
        dataToSend.append("facebook_page", formData.facebook_page || "");
        dataToSend.append("is_24h_service", String(formData.is_24h_service));

        // 2. Append the Image
        if (imageFile) {
            dataToSend.append("image", imageFile); 
        } else {
            toast.error("Please select an image");
            setLoading(false);
            return;
        }

        const response = await API.post("/admin/hospitals", dataToSend, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        // 4. Success handling
        if (response.status === 201 || response.data.success) {
            toast.success("Hospital added successfully!");
            navigate("/admin/hospitals"); 
        }

    } catch (error: any) {
        console.error("Submission Error:", error.response?.data);
        const serverError = error.response?.data?.error || "Something went wrong";
        toast.error(serverError);
    } finally {
        setLoading(false);
    }
};

    return (
        <AdminDashboardLayout>
            <div className="p-6 max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Add New Hospital</h1>
                        <p className="text-gray-500">Enter hospital details and location info</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">
                            <X size={18} /> Cancel
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <Globe size={18} /> Basic Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-gray-600">Hospital Name</label>
                                    <input required name="name" value={formData.name} onChange={handleChange} type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" placeholder="Enter name" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Type</label>
                                    <select name="type" value={formData.type} onChange={handleChange} className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none">
                                        <option value="Public">Public</option>
                                        <option value="Private">Private</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Province</label>
                                    <input required name="province" value={formData.province} onChange={handleChange} type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="e.g. Phnom Penh" />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Address</label>
                                <input required name="address" value={formData.address} onChange={handleChange} type="text" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="Street number, district..." />
                            </div>
                            {/* Contact Information Card */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                    <Phone size={18} /> Contact Information
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Phone Number</label>
                                        <input 
                                            name="phone_number" 
                                            value={formData.phone_number} 
                                            onChange={handleChange} 
                                            type="text" 
                                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                                            placeholder="e.g. 023 888 999" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Email Address</label>
                                        <input 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            type="email" 
                                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                                            placeholder="hospital@example.com" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600 flex items-center gap-1">
                                            <Globe size={14} /> Website
                                        </label>
                                        <input 
                                            name="website" 
                                            value={formData.website} 
                                            onChange={handleChange} 
                                            type="url" 
                                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                                            placeholder="https://..." 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-600">Facebook Page</label>
                                        <input 
                                            name="facebook_page" 
                                            value={formData.facebook_page} 
                                            onChange={handleChange} 
                                            type="text" 
                                            className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500" 
                                            placeholder="facebook.com/page" 
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin size={18} /> GPS Coordinates
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Latitude</label>
                                    <input required name="latitude" value={formData.latitude} onChange={handleChange} type="number" step="any" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="11.5..." />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-600">Longitude</label>
                                    <input required name="longitude" value={formData.longitude} onChange={handleChange} type="number" step="any" className="w-full mt-1 p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none" placeholder="104.9..." />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                                <Upload size={18} /> Hospital Image
                            </h2>
                            <div className="relative group w-full h-48 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                                {previewUrl ? (
                                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                                ) : (
                                    <div className="text-center">
                                        <Upload className="mx-auto text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-400">Click to upload image</span>
                                    </div>
                                )}
                                <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" name="is_24h_service" checked={formData.is_24h_service} onChange={handleChange} className="w-5 h-5 accent-green-600" />
                                <span className="text-gray-700 font-medium">24h Service</span>
                            </label>
                            <button disabled={loading} type="submit" className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition disabled:opacity-50">
                                <Save size={20} /> {loading ? "Saving..." : "Save Hospital"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AdminDashboardLayout>
    );
};

export default Addhospital;