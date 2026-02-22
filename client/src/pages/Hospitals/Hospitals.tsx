import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import API from "../../services/api";
import HospitalCard from "../../components/Layout/Sections/HospitalCard";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
interface Hospital {
  _id: string;
  name: string;
  address: string;
  latitude: number;  
  longitude: number;
}
const Hospital = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); 
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerpage = 6;
  const [savedIds, setSavedIds] = useState<string[]>([]); 

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        // 1. Fetch all hospitals
        const hospitalRes = await API.get("/hospitals");
        
        // 2. Fetch user's saved hospitals to mark them
        const userRes = await API.get("users/check-auth");
        
        if (userRes.data.success) {
          // Store only the IDs for quick comparison
          const ids = userRes.data.user.savedHospitals.map((h: any) => h._id || h);
          setSavedIds(ids);
        }
        
        setHospitals(hospitalRes.data);
      } catch (err: any) {
        setError("The server encountered an error.");
      } finally {
        setLoading(false);
      }
    };
    fetchHospitalData();
  }, []);

  const handleSaveToggle = (id: string) => {
    setSavedIds((prev) => 
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

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

  const filteredHospital = hospitals.filter((h) =>
  h.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerpage;
  const indexOfFirstItem = indexOfLastItem - itemsPerpage;

  //This contains the 6 hospitals for the current view
  const currentHospitals = filteredHospital.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHospital.length / itemsPerpage);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setSearchTerm(e.target.value);
  setCurrentPage(1); 
  };  

  // Helper to generate the Cloudinary URL
  const getImageUrl = (hospitalId: string) => {
  const cloudName = "dprsygcvh";
  
 return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${hospitalId}.jpg`;
  };
  
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
      <div className="container mx-auto px-6 mt-6 ">
        <div className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <Search 
              className="w-6 h-6 text-gray-400 group-focus-within:text-blue-500 transition-colors" 
            />
          </div>
          <input
            type="text"
            placeholder="Search Hospital ..."
            className="w-full pl-14 py-1 text-m border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-100 transition-all"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>
        <div className="container mx-auto p-6">
        {filteredHospital.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentHospitals.map((hospital) => (
              <HospitalCard
              key={hospital._id}
              id={hospital._id}
              name={hospital.name}
              address={hospital.address}
              image={getImageUrl(hospital._id)}
              isSaved={savedIds.includes(hospital._id)} 
              onSaveToggle={handleSaveToggle}
                />
          ))}
        </div>
          
        ) : (
            <div className="text-center text-gray-500 mt-10">
            No hospitals found matching "{searchTerm}"
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex items-center space-x-2 border border-sky-400 rounded-full px-4 shadow-sm bg-white">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) =>
              (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-6 h-6 flex item-center justify-center rounded-full text-sm font-medium transition-all
                    ${currentPage === page ? "bg-sky-500 text-white shadow-md" : "text-gray-600 hover:bg-sky-50"}
                    `}
                > 
                  {page}
                </button>
                )
              )}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pl-2 disabled:opacity-30"
              >
                <ArrowRight className="w-5 h-5 text-gray-800" />
              </button>
              </div>
            </div>
        )
        }
      </div>
      </DashboardLayout>
    );
};
export default Hospital;