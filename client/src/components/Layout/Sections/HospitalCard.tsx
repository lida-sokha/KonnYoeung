import { MapPin, Navigation, Bookmark } from "lucide-react";

interface HospitalProps {
  id: string;
  name: string;
  image?: string;
  address?: string;
  distance?: string;
  isSaved?: boolean;
  onSaveToggle?: (id: string) => void;
}
const HospitalCard = ({
  id,
  name,
  address,
  distance,
  isSaved,
  onSaveToggle,
}: HospitalProps) => {
  const getImageUrl = (hospitalId: string) => {
    const cloudName = "dprsygcvh";
return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${hospitalId}.jpg`;
 }
const fallbackImage = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=500";
  return (
    <div className="bg-white rounded-[24px] shadow-smbg-white shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <img
          src={getImageUrl(id)}
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

        {/* Distance with Icon */}
        <div className="flex justify-between items-center mt-1">
          <div className="flex items-center gap-2 text-gray-400">
            <Navigation size={16} className="rotate-45" />
            <span className="text-sm font-medium">
              {distance || "1"} km from you
            </span>
          </div>

          {/* Minimalist Save Button (Bookmark Icon) */}
          <button
            onClick={() => onSaveToggle && onSaveToggle(id)}
            className="p-2 transition-transform active:scale-90"
          >
            <Bookmark
              size={24}
              fill={isSaved ? "currentColor" : "none"}
              className={isSaved ? "text-gray-900" : "text-gray-400"}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;