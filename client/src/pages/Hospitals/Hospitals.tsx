import React, { useState } from "react";
import HospitalCard, { Hospital } from "../components/HospitalCard";

// Import your local images
import calmetteImg from "../assets/hospitals/calmette.jpg";
import maxicareImg from "../assets/hospitals/maxicare.jpg";
import domreyImg from "../assets/hospitals/domrey.jpg";
import kantha1Img from "../assets/hospitals/kantha1.jpg";
import kantha2Img from "../assets/hospitals/kantha2.jpg";
import pediatricImg from "../assets/hospitals/pediatric.jpg";

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
        <div className="p-8">
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
    );
};

export default HospitalFinderPage;
