import { useState } from "react";
import { Camera } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

const Settings = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [language, setLanguage] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSave = () => {
        console.log({
            email,
            password,
            language,
            newPassword,
            confirmPassword,
        });
        alert("Changes saved!");
    };

    const handleLogout = () => {
        console.log("User logged out");
        alert("Logged out!");
    };

    return (
        <DashboardLayout>
            {/* HEADER */}
            <div className="text-center mt-6 space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Profile Settings
                </h1>
                <p className="text-gray-500">
                    Manage your account information
                </p>
            </div>

            {/* PROFILE IMAGE */}
            <div className="flex justify-center mt-8">
                <div className="relative">
                    <img
                        src="https://via.placeholder.com/150"
                        className="w-28 h-28 rounded-full object-cover border shadow"
                    />

                    {/* CAMERA ICON BUTTON */}
                    <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow hover:bg-gray-100 transition">
                        <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            {/* FORM */}
            <div className="max-w-2xl mx-auto mt-10 space-y-6 px-6">

                {/* EMAIL */}
                <div>
                    <label className="block text-gray-600 mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* CURRENT PASSWORD */}
                <div>
                    <label className="block text-gray-600 mb-2">Current Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* LANGUAGE */}
                <div>
                    <label className="block text-gray-600 mb-2">Language</label>
                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                        <option value="">Select Language</option>
                        <option value="en">English</option>
                        <option value="kh">Khmer</option>
                    </select>
                </div>

                {/* CHANGE PASSWORD */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-between items-center pt-6">
                    <button
                        onClick={handleSave}
                        className="px-6 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition"
                    >
                        Save Changes
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;