import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import {  Mail, MessageCircle, ArrowRight } from "lucide-react";

const HospitalDetail = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await API.get(`/hospitals/${id}`);
        setHospital(response.data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
  }
const getImageUrl = (imageField: string | undefined, hospitalId: string) => {
  const cloudName = "dprsygcvh";
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto`;

  if (imageField) {
    return `${baseUrl}/${imageField}`;
  }

  return `${baseUrl}/${hospitalId}.jpg`;
};

  if (!hospital) return <div>Hospital not found.</div>;

  return (
    <div className="max-full mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex item-center mb-4">
        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-200 rounded-full mr-2">
          <ArrowRight className="w-6 h-6 rotate-180" /> {/* Back arrow placeholder */}
        </button>
        <h1 className="w-full text-center text-2xl font-bold text-gray-800 justify-center">{hospital.name}</h1>
      </div>
      <div className="relative h-64 md:h-100 w-full mb-6">
           <img
          src={getImageUrl(hospital.image, hospital._id)}
          alt={hospital.name}
          className="w-full h-full object-cover rounded-3xl shadow-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (!target.dataset.retried) {
              target.dataset.retried = "true";
              setTimeout(() => {
                const freshUrl = getImageUrl(hospital.image, hospital._id);
                target.src = `${freshUrl}${freshUrl.includes('?') ? '&' : '?'}t=${Date.now()}`;
              }, 2000);
            } else {
              // If the retry also fails, show the fallback building
              target.src = "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800";
            }
          }}
        />
      </div>
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-4 text-gray-700">
            <p><span className="font-bold">Type:</span> {hospital.type}</p>
            <p><span className="font-bold">Provinces:</span> {hospital.province}</p>
            <p className="flex items-center gap-2">
                <span className="font-bold">Phone Number:</span> {hospital.phone_number}
            </p>
            <p className="flex items-center gap-2">
                <span className="font-bold">Work Hours:</span> {hospital.is_24h_service ? "24/7" : "8:00 AM - 5:00 PM"}
            </p>
            <p className="flex items-center gap-2">
                <span className="font-bold">Email:</span> {hospital.email || "info@hospital.gov.kh"}
            </p>
          </div>
          <div className="flex gap-3">
             <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
               <MessageCircle className="w-6 h-6" />
             </button>
             <button className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
               <Mail className="w-6 h-6" />
             </button>
          </div>
        </div>
        <div className="border-t pt-4">
            <p className="text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-800">Address:</span> {hospital.address}
            </p>
        </div>
      </div>
      {/* Auto-generated Google Map using Coordinates */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-gray-200 h-100 z-0 mb-10">
        <a href={`https://www.google.com/maps/search/?api=1&query=${hospital.latitude},${hospital.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 z-10 cursor-pointer"
          title="Click to open in Google Maps"
        >
          <div className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-full text-xs font-bold text-blue-600 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
          Open in Google Maps
        </div>
        </a>
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${hospital.latitude},${hospital.longitude}&hl=es;z=14&output=embed`}
        ></iframe>
      </div>
    </div>
  );
};

export default HospitalDetail;