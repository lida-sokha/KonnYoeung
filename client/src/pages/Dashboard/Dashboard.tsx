import { useState, useEffect } from "react"; 
import API from '../../services/api'; 
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/Sections/DashboardLayout';
import { 
  Clock, Lightbulb, Bookmark, BookOpen, 
  Hospital, ChevronRight, Heart, Activity 
} from 'lucide-react';

interface HospitalData {
  _id: string;
  name: string;
  address: string;
}
const DashboardPage = () => {
  const [savedHospitals, setSavedHospitals] = useState<HospitalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await API.get("users/check-auth");
        if (response.data.success) {
          setSavedHospitals(response.data.user.savedHospitals || []);
        }
      } catch (err) {
        console.error("Error fetching saved hospitals ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Parent!</h1>
          <p className="text-gray-500">Here's your health overview and recommendations</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
              <div className="bg-green-400 p-4 text-white flex items-center gap-2">
                <Clock size={20} />
                <span className="font-semibold">Recent Activity</span>
              </div>
              <div className="p-4 space-y-6">
                <ActivityItem icon={<BookOpen className="text-blue-500"/>} title="Read Article" desc="Understanding Dengue Fever Prevention" time="2 hours ago" />
                <ActivityItem icon={<Hospital className="text-blue-400"/>} title="Viewed Hospital" desc="Calmette Hospital - Phnom Penh" time="1 day ago" />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
              <div className="bg-[#A855F7] p-4 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={20} />
                  <span className="font-semibold">Recommended For You</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                 <h3 className="font-bold text-gray-700">Health Insights</h3>
                 <InsightItem title="Managing Diabetes Through Diet" category="Metabolic" readTime="8 min read" />
                 <InsightItem title="Heart Health and Exercise" category="Cardiovascular" readTime="6 min read" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            
            {/* Saved Hospital */}
            <div className="space-y-1">
              <div className="bg-[#FFD700] p-4 rounded-t-2xl text-white flex items-center gap-2 font-bold">
                <Bookmark size={20} fill="white" />
                Saved Hospital ({savedHospitals.length})
              </div>
              <div className="p-4 border border-gray-100 rounded-b-2xl bg-white shadow-sm space-y-4">
              {loading ? (
                <p className="text-xs text-gray-400 animate-pulse">Loading your bookmarks...</p>
              ) : savedHospitals.length > 0 ? (
                savedHospitals.map((hospital) => (
                  <div 
                    key={hospital._id} 
                    className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors p-1 rounded-lg"
                  >
                    {/* Icon Container */}
                    <div className="bg-blue-30 p-2.5 rounded-xl text-blue-500 shrink-0">
                      <Hospital size={20} />
                    </div>

                    {/* Text Content */}
                    <Link 
                        {...({ to: `/hospitals/${hospital._id}` } as any)}
                        className="flex-1 min-w-0 hover:opacity-70 transition-opacity"
                      >
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 truncate">
                          {hospital.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 truncate">
                          {hospital.address}
                        </p>
                      </div>
                    </Link>
                      <ChevronRight size={14} className="text-gray-300" />
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-400">No hospitals saved yet.</p>
                </div>
              )}
            </div>
            </div>

            {/* Tips for Parents */}
            <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
              <div className="bg-[#4DBCE9] p-4 text-white flex items-center gap-2">
                <Lightbulb size={20} />
                <span className="font-semibold">Tips for Parents</span>
              </div>
              <div className="p-4 space-y-4">
                <TipItem icon={<Heart size={16} className="text-red-500" />} title="Hand Hygiene" text="Teach children to wash hands with soap..." />
                <TipItem icon={<Heart size={16} className="text-red-500" />} title="Balanced Diet" text="Include fruits, vegetables, and whole grains..." />
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Sub-components for cleaner code
interface ActivityItemProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
}

const ActivityItem = ({ icon, title, desc, time }: ActivityItemProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="bg-gray-100 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-sm font-bold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
    <span className="text-xs text-gray-400">{time}</span>
  </div>
);

interface InsightItemProps {
  title: string;
  category: string;
  readTime: string;
}

const InsightItem = ({ title, category, readTime }: InsightItemProps) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 cursor-pointer transition-colors">
    <div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-gray-400">{category} • {readTime}</p>
    </div>
    <ChevronRight size={18} className="text-gray-300" />
  </div>
);

interface TipItemProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

const TipItem = ({ icon, title, text }: TipItemProps) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-bold text-gray-700">{title}</span>
    </div>
    <p className="text-[10px] text-gray-500 leading-relaxed pl-6">{text}</p>
  </div>
);

export default DashboardPage;