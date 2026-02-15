import React from "react";


interface hospital {
    id: number;
    name: string;
    image: string;
    location: string;
    distance: string;
    saved: boolean;
    onToggleSave: IdleDeadline;
}

const HospitalCard = ({ id, name, image, location, distance, saved}:hospital) => {
    return (
        <div className="border rounded-lg shadow-md overflow-hidden bg-white">
            <img
                src={image}
                alt={name}
                className="w-full h-40 object-cover"
            />

            <div className="p-4">
                <h2 className="text-lg font-semibold">{name}</h2>

                <p className="text-sm text-gray-600">{location}</p>

                <p className="text-sm text-gray-500 mt-1">{distance}</p>

                <button
                    onClick={()=>null}
                    className={`mt-3 px-4 py-2 rounded text-white ${saved ? "bg-red-500" : "bg-blue-500"
                        }`}
                >
                    {saved ? "Unsave" : "Save"}
                </button>
            </div>
        </div>
    );
};

export default HospitalCard;
