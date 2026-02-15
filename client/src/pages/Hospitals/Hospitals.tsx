import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import HospitalCard from "../../components/Layout/Sections/HospitalCard";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
interface Hospital {
  _id: string;
  name: string;
  address: string;
  latitude: number;  // Added
  longitude: number; // Added
}
const Hospital = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // New error state

    useEffect(() => {
        const fetchHospital = async () => {
            try {
                const response = await API.get("/hospitals");
                setHospitals(response.data);
            } catch (err: any) {
                console.error("Fetch error:", err);
                setError("The server encountered an error. Check backend logs.");
            } finally {
                setLoading(false);
            }
        };
        fetchHospital();
    }, []);

    if (loading) return <div className="text-center p-10 font-bold">Loading...</div>;
    
    // Show error message instead of a white page
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <DashboardLayout>
      <div className="flex item-center justify-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700">
              Hospitals Finder
        </h1>
      </div>
      <p className="flex item-center justify-center text-gray-400">
        Find your nearest hospital
      </p>
        <div className="container mx-auto p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <Link key={hospital._id} to={`/hospitals/${hospital._id}`}>
                <HospitalCard
                  key={hospital._id}
                  id={hospital._id}
                  name={hospital.name} // Matches JSON "name"
                  address={hospital.address} // Matches JSON "address"
                  image="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=400"
              />
              </Link>
              ))}
            </div>
      </div>
      </DashboardLayout>
    );
};
export default Hospital;