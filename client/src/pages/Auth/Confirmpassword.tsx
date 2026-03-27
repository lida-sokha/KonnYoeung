import React, { useState } from "react";
import Sidebar from "../Dashboard/Dashboard"; 

const ConfirmNewPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("New Password:", password);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 p-6">
                {/* Header */}
                <h1 className="text-2xl font-bold mb-6">
                    Confirm New Password
                </h1>

                {/* Card (same style as hospital page) */}
                <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm password"
                                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            Save Password
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConfirmNewPassword;