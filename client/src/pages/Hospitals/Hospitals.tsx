import { useEffect, useState } from "react";
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
  image?: string;
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
// Update this function at the top of your component
const getImageUrl = (hospital: any) => {
  const cloudName = "dprsygcvh";
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto`;
  
  // 1. Get the ID string. If both are missing, use a placeholder string.
  const imageId = hospital.image || hospital._id || "";

  // 2. Add a safety check: if imageId is empty, return a placeholder image
  if (!imageId) {
    return "https://via.placeholder.com/400x300?text=No+Image+Available";
  }

  // 3. Logic: New images use a 24-char MongoDB ID in the 'hospitals' folder
  // We use imageId.length safely now because we ensured it's at least an empty string
  if (imageId.length === 24) {
    return `${baseUrl}/hospitals/${imageId}`;
  }

  // 4. Fallback for old images in root
  return `${baseUrl}/${imageId}.jpg`;
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
              image={hospital.image} 
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