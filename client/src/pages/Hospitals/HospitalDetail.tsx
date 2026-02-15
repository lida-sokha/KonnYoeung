import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../services/api";

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

  if (loading) return <div>Loading details...</div>;
  if (!hospital) return <div>Hospital not found.</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{hospital.name}</h1>
      <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800" alt={hospital.name} className="w-full h-64 object-cover rounded-xl mb-6" />
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <p><strong>Province:</strong> {hospital.province}</p>
        <p><strong>Address:</strong> {hospital.address}</p>
        <p><strong>Phone:</strong> {hospital.phone_number}</p>
        <p><strong>24h Service:</strong> {hospital.is_24h_service ? "Yes" : "No"}</p>
        {hospital.website && (
           <a href={hospital.website} className="text-blue-600 underline">Visit Website</a>
        )}
      </div>
    </div>
  );
};

export default HospitalDetail;