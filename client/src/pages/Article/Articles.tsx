import { useState } from "react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import { useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  ThumbsDown,
  Bookmark,
  Search,
  Mic,
} from "lucide-react";

const ArticlePage = () => {
  const [activeTab, setActiveTab] = useState("Symptoms");
  const navigate = useNavigate();
  const tabs = [
    "All",
    "Symptoms",
    "Illness",
    "Emergency",
    "First-Aids", 
    "Prevention & Care",
  ];

  const articles = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    title: "Why do some children have...",
    image: `https://source.unsplash.com/400x300/?child&sig=${i}`,
  }));

  return (
    <DashboardLayout>
      <div className="px-6 lg:px-10 py-6 max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            {/* Search */}
            <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 w-full md:w-72">
              <Search size={16} className="text-gray-500" />
              <input
                placeholder="Search"
                className="bg-transparent outline-none flex-1 mx-2 text-sm"
              />
              <Mic size={16} className="text-gray-500 cursor-pointer" />
            </div>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-700">
              Articles
            </h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 overflow-x-auto border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-base whitespace-nowrap relative transition-colors ${
                activeTab === tab
                  ? "font-medium text-black"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />
              )}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              onClick={()=>navigate(`/articles/${article.id}`)}
              className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col"
            >
              <img
                src={article.image}
                alt=""
                className="w-full h-56 object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://www.drpramsunder.co.za/images/services/high-risk-neonatal.jpg")
                }
              />

              <div className="p-3 flex flex-col">
                <h3 className="text-sm font-semibold">
                  {article.title}
                </h3>

                <p className="text-xs text-gray-500 mt-1">
                  Published: 27 Dec 2024
                </p>

                {/* Actions */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-2 text-gray-600 text-xs cursor-pointer">
                    <ThumbsUp size={14} className="text-gray-500 hover:text-gray-700" />
                    <span>445k</span>

                    <div className="w-px h-4 bg-gray-300" />

                    <ThumbsDown size={14} className="text-gray-500 hover:text-gray-700" />
                  </div>

                  <Bookmark
                    size={18}
                    className="text-gray-500 cursor-pointer hover:text-gray-700"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-10 flex-wrap">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((p) => (
            <button
              key={p}
              className={`px-3 py-1 rounded-md border text-sm text-gray-500 cursor-pointer hover:text-gray-700 ${
                p === 1
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white"
              }`}
            >
              {p}
            </button>
          ))}
          <button className="px-3 py-1 border rounded-md text-gray-500 cursor-pointer hover:text-gray-700">
            →
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default ArticlePage;
