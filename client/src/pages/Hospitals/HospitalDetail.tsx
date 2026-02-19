import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";
import { MapPin, Phone, Clock, Mail, Globe, Share2, MessageCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const HospitalDetail = () => {
  const { id } = useParams(); // Gets the ID from the URL
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // Ensure your backend has a GET /hospitals/:id route
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
  const getImageUrl = (hospitalId: string) => {
  const cloudName = "dprsygcvh";
  
 return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${hospitalId}.jpg`;
  };

const position: [number, number] = [
  parseFloat(hospital.latitude) || 11.5564, 
  parseFloat(hospital.longitude) || 104.9282
];
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
          src={getImageUrl(hospital._id)} 
          alt={hospital.name} 
          className="w-full h-full object-cover rounded-3xl shadow-lg" 
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
      <div className="rounded-3xl overflow-hidden shadow-md border border-gray-200 h-100 z-0 mb-10">
        <MapContainer center={position} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="font-sans">
                <strong className="text-blue-600">{hospital.name}</strong><br />
                {hospital.address}
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default HospitalDetail;