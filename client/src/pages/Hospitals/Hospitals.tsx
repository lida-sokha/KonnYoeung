import React, { useState } from "react";
import Sidebar from "../Dashboard/Dashboard";
import HospitalCard from "../../components/Layout/Sections/HospitalCard";


import calmetteImg from "../../../images/1. Calmette Hospital.png";
import maxicareImg from "../../../images/3. Maxicare Children Hospital.png";
import domreyImg from "../../../images/5. Domrey Mother & Child Clinic.png";
import kantha1Img from "../../../images/4. Kantha Bopha IV Children's Hospital.png";
import kantha2Img from "../../../images/6. Jayavarman VII Children's Hospital.png";
import pediatricImg from "../../../images/7. K id Pediatric Clinic.png";
 
export interface Hospital {
    id: number;
    name: string;
    image: string;
    location: string;
    distance: string;
    saved: boolean;
}

const HospitalFinderPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const [hospitals, setHospitals] = useState<Hospital[]>([
        {
            id: 1,
            name: "Calmette Hospital",
            image: calmetteImg,
            location: "Phnom Penh",
            distance: "1 km from you",
            saved: false,
        },
        {
            id: 2,
            name: "Maxicare Children Hospital",
            image: maxicareImg,
            location: "Phnom Penh",
            distance: "2 km from you",
            saved: false,
        },
        {
            id: 3,
            name: "Domrey Mother & Child Clinic",
            image: domreyImg,
            location: "Phnom Penh",
            distance: "4.5 km from you",
            saved: false,
        },
        {
            id: 4,
            name: "Kantha Bopha Children's Hospital I",
            image: kantha1Img,
            location: "Phnom Penh",
            distance: "2 km from you",
            saved: false,
        },
        {
            id: 5,
            name: "Kantha Bopha Children's Hospital II",
            image: kantha2Img,
            location: "Phnom Penh",
            distance: "2.3 km from you",
            saved: false,
        },
        {
            id: 6,
            name: "Pediatric Medical Hospital",
            image: pediatricImg,
            location: "Phnom Penh",
            distance: "3.9 km from you",
            saved: false,
        },
    ]);

    const toggleSave = (id: number) => {
        setHospitals((prev) =>
            prev.map((hospital) =>
                hospital.id === id
                    ? { ...hospital, saved: !hospital.saved }
                    : hospital
            )
        );
    };

    const filteredHospitals = hospitals.filter(
        (hospital) =>
            hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            hospital.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex">
            {/* Sidebar Section */}
            <Sidebar />

            {/* Main Content */}
            <div className="p-8 w-full">
                <h1 className="text-4xl font-bold mb-6">Hospital Finder</h1>

                <input
                    type="text"
                    placeholder="Search hospitals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 mb-6 border rounded-lg"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredHospitals.map((hospital) => (
                        <HospitalCard
                            key={hospital.id}
                            hospital={hospital}
                            onToggleSave={toggleSave}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HospitalFinderPage;
