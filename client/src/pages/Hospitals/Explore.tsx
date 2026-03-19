import { useEffect, useState } from 'react';
import API from '../../services/api';
import HospitalCard from '../../components/Layout/Sections/HospitalCard';
import useUserLocation from "../AskForLocation/UserLocation"; 

const ExplorePage = () => {
  const [hospitals, setHospitals] = useState([]);
  const { position, error } = useUserLocation(); 

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await API.get('/hospitals');
        setHospitals(res.data);
      } catch (err) {
        console.error("Failed to fetch hospitals", err);
      }
    };
    fetchHospitals();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Nearby Hospitals</h1>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-4">
          Please enable location to see distances to hospitals.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hospital: any) => (
          <HospitalCard
            key={hospital._id}
            id={hospital._id}
            name={hospital.name}
            image={hospital.image}
            address={hospital.address}
            latitude={Number(hospital.latitude)}
            longitude={Number(hospital.longitude)}
            userLocation={position} 
            isSaved={hospital.isSaved}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplorePage;