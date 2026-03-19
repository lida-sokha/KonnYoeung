import { MapPin, Navigation, Bookmark } from "lucide-react";
import API from '../../../services/api';
import { Link } from 'react-router-dom';
import calculateDistance from "../../../utils/CalculateDistance";
interface HospitalProps {
  id: string;
  name: string;
  image?: string;
  address?: string;
  latitude?: number; 
  longitude?: number;
  userLocation?: { lat: number; lng: number } | null;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
}

const HospitalCard = ({
  id,
  name,
  image,
  address,
  latitude, longitude, userLocation,
  isSaved,
  onSaveToggle,
}: HospitalProps) => {
const getImageUrl = (imageField: string | undefined, hospitalId: string) => {
  const cloudName = "dprsygcvh";
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto`;

  // If the image field exists (e.g., "hospitals/69b6...")
  if (imageField) {
    return `${baseUrl}/${imageField}.jpg`;
  }

  return `${baseUrl}/${hospitalId}.jpg`;
};
  const fallbackImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=500";

  const handleSaveToggle = async (hospitalId: string) => {
    try {
      const response = await API.post("/users/save", { hospitalId });

      if (response.status === 200) {
        if (onSaveToggle) onSaveToggle(hospitalId);
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || "Error saving hospital";
      alert(errorMsg);
    }
  };
const getDistanceDisplay = () => {
    if (!userLocation || !latitude || !longitude) {
      return "Checking distance...";
    }

    const d = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      latitude,
      longitude
    );
    return `${d} Km from you`;
  };
  
  return (
    <div className="bg-white rounded-[24px] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
      <Link to={`/hospitals/${id}`} className="flex flex-col flex-1">
        <div className="relative h-48 w-full">
         <img
            src={getImageUrl(image, id)} 
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = fallbackImage;
            }}
          />
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col gap-2">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {name}
          </h2>

          {/* Address with Icon */}
          <div className="flex items-start gap-2 text-gray-500">
            <MapPin size={18} className="shrink-0 mt-0.5" />
            <p className="text-sm leading-tight">{address || "No address provided"}</p>
          </div>
        </div>
      </Link>

      {/* Footer Section - Outside the Link to keep button separate */}
      <div className="px-5 pb-5 flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-400">
          <Navigation size={16} className="rotate-45" />
          <span className="text-sm font-medium">
            {getDistanceDisplay()} from you
          </span>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // Prevents link trigger
            e.stopPropagation(); 
            handleSaveToggle(id);
          }} 
          className="p-2 transition-transform active:scale-90 relative z-10"
        >
          <Bookmark
            size={24}
            fill={isSaved ? "#2563eb": "transparent"}
            className={`transition-color duration-300 ${isSaved ? "text-blue-600" : "text-gray-400 hover:text-blue-400"}`}
          />
        </button>
      </div>
    </div>
  );
};

export default HospitalCard;