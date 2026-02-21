import { useState, useEffect } from "react";
import { Lock } from "lucide-react"; // Added Lock icon for style
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import API from "../../services/api"; 

const Settings = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [language, setLanguage] = useState("en");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // 1. Fetch User Data on Load
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/users/check-auth");
                if (response.data.success) {
                    // Fill both Name and Email from backend
                    setFullName(response.data.user.fullName || "");
                    setEmail(response.data.user.email || "");
                    setLanguage(response.data.user.language || "en");
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchUserData();
    }, []);

    // Inside your Settings component...
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await API.get("/users/check-auth");
                
                if (response.data.success && response.data.user) {
                    setEmail(response.data.user.email); 
                }
            } catch (error) {
                console.error("Failed to fetch email from database:", error);
            }
        };
        fetchUserData();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.href = "/";
    };

    return (
        <DashboardLayout>
            <div className="text-center mt-6 space-y-2">
                <h1 className="text-3xl font-bold text-gray-800">Profile Settings</h1>
                <p className="text-gray-500">Manage your account information</p>
            </div>

            <div className="max-w-2xl mx-auto mt-10 space-y-6 px-6">
                {/* FULL NAME */}
                <div>
                <label className="block text-gray-600 mb-2 font-medium">Full Name</label>
                <div className="relative">
                        {/* Styled as a display box instead of an editable field */}
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 font-medium">
                            {fullName || "Loading..."}
                        </div>
                        
                        {/* Subtle lock icon to signal it's permanent */}
                        <div className="absolute right-4 top-3.5">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                width="16" height="16" 
                                viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" strokeWidth="2" 
                                strokeLinecap="round" strokeLinejoin="round" 
                                className="text-gray-300"
                            >
                                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                            </svg>
                        </div>
                    </div>
                <p className="mt-1 text-xs text-gray-400">
                    Legal name as registered during account creation.
                </p>
            </div>
                {/* EMAIL (READ ONLY) */}
                <div>
                    <label className="block text-gray-600 mb-2 font-medium">Registered Email</label>
                    <div className="relative">
                        <div className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-gray-600 font-medium">
                        {email || "Loading email..."}
                        </div>
                        
                        <div className="absolute right-4 top-3.5 flex items-center gap-2">
                        <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-bold">VERIFIED</span>
                        <Lock className="w-4 h-4 text-gray-300" />
                        </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">
                        This email is securely linked to your account.
                    </p>
                    </div>
                {/* LANGUAGE */}
               <div>
        <label className="block text-gray-600 mb-2 font-medium">Preferred Language</label>
        <div className="relative group">
            <select
             value={language}
            onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-700 
                    appearance-none cursor-pointer outline-none transition-all
                    focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 
                    hover:border--300 pr-12 font-medium"
                >
                    <option value="" disabled className="text-gray-400">
                        Select your language...
                    </option>
                    
                    <option value="en" className="py-2 ">
                        English 
                    </option>
                    
                    <option value="kh" className="py-2">
                        Khmer 
                    </option>
                    </select>

                    {/* Custom Arrow Icon (Replacing the default browser arrow) */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
                    <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="18" height="18" 
                        viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" strokeWidth="2" 
                        strokeLinecap="round" strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6"/>
                    </svg>
                    </div>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                    This will update the app interface to your choice.
                </p>
                </div>

                {/* ACTIONS */}
                <div className="flex justify-between items-center pt-6">
                    
                    <button onClick={handleLogout} className="px-8 py-3 rounded-xl bg-red-50 text-red-500 font-semibold hover:bg-red-100 transition">
                        Log Out
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;