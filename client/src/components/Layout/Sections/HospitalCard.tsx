import React from "react";
import { Hospital } from "../../../types/Hospital";


interface Props {
    hospital: Hospital;
    onToggleSave: (id: number) => void;
}

const HospitalCard: React.FC<Props> = ({ hospital, onToggleSave }) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden bg-white">
            <img
                src={hospital.image}
                alt={hospital.name}
                className="w-full h-40 object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-semibold">{hospital.name}</h2>

                <p className="text-sm text-gray-600">{hospital.location}</p>

                <p className="text-sm text-gray-500 mt-1">{hospital.distance}</p>

                <button
                    onClick={() => onToggleSave(hospital.id)}
                    className={`mt-3 px-4 py-2 rounded text-white ${hospital.saved ? "bg-red-500" : "bg-blue-500"
                        }`}
                >
                    {hospital.saved ? "Unsave" : "Save"}
                </button>
            </div>
        </div>
    );
};

export default HospitalCard;
