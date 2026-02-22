import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import API from "../../services/api"; 
import { Search, Mic, ThumbsUp, ThumbsDown, ArrowRight } from "lucide-react";

interface ContentBlock {
  content_order: number;
  content_type: 'Parapragh' | 'Image' | 'Header' | 'List';
  content?: string;
  image_url?: string;
}

interface Article {
  _id: string;
  article_ID: number;
  article_title: string;
  article_author: string;
  publish_date: string;
  categories: string[];
  content_blocks: ContentBlock[]; 
  isSaved?: boolean;
  onSaveToggle?: (id: String) => void;
}

const ArticlePage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const navigate = useNavigate();

  const tabs = ["All", "Symptoms", "Illness", "Emergency", "First-Aids", "Prevention & Care"];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const [articlesRes, userRes] = await Promise.all([
        API.get("/articles"),
        API.get("/users/check-auth")
        ]);
        const fetchedArticles = articlesRes.data;
        const savedArticleIds = userRes.data.user.savedArticles || [];

        const syncedArticles = fetchedArticles.map((art: Article) => ({
        ...art,
        isSaved: savedArticleIds.some((saved: any) => 
          (typeof saved === 'string' ? saved : saved._id) === art._id
        )
      }));
        setArticles(syncedArticles);
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const getImageUrl = (articleId: string) => {
    const cloudName = "dprsygcvh";
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${articleId}.jpg`;
  };

const filteredArticles = activeTab === "All" 
  ? articles 
  : articles.filter(art => 
      art.categories?.some(cat => 
        cat.trim().toLowerCase() === activeTab.trim().toLowerCase()
      )
    );

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);

  useEffect(() => {
    if (articles.length > 0) {
      console.log("Current Tab:", activeTab);
      console.log("Sample Article Categories:", articles[0].categories);
    }
  }, [activeTab, articles]);

const handleSaveToggle = async (articleId: string) => {
  try {
    const response = await API.post("/users/saveArticle", { articleId }); 
    
    if (response.status === 200) {
      setArticles((prevArticles) =>
        prevArticles.map((art) =>
          art._id === articleId 
            ? { ...art, isSaved: response.data.message === "Saved" } 
            : art
        )
      );
    }
  } catch (error) {
    console.error("Toggle error:", error);
  }
};

  return (
    <DashboardLayout>
      <div className="px-6 lg:px-10 py-6 max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center bg-gray-200 rounded-full px-4 py-2 w-full md:w-80">
            <Search size={18} className="text-gray-500" />
            <input placeholder="Search articles..." className="bg-transparent outline-none flex-1 mx-2 text-sm" />
            <Mic size={18} className="text-gray-500 cursor-pointer" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Health Articles</h1>
        </div>

        <div className="flex gap-8 overflow-x-auto border-b border-gray-200 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`pb-3 text-sm font-medium whitespace-nowrap relative transition-all ${
                activeTab === tab ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="h-72 bg-gray-100 animate-pulse rounded-xl" />)}
          </div>
        ) : (
          <div className="container mx-auto">
            {currentArticles.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentArticles.map((art) => (
                    <div
                      key={art._id}
                      onClick={() => navigate(`/articles/${art.article_ID}`)}
                      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full border border-gray-100 overflow-hidden"
                    >
                      <div className="relative h-48 bg-gray-100">
                        <img
                          src={getImageUrl(art._id)}
                          alt={art.article_title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/400x300?text=Image+Not+Found";
                          }}
                        />
                        <div className="absolute top-2 left-2">
                           <span className="bg-white/90 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-blue-600 shadow-sm">
                             {art.categories[0]}
                           </span>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-md font-bold text-gray-800 line-clamp-2 leading-snug">
                          {art.article_title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-2">
                          By {art.article_author} • {new Date(art.publish_date).toLocaleDateString()}
                        </p>

                        <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50 mt-4">
                          <div className="flex items-center gap-3 text-gray-400 text-[10px]">
                            {/* <span className="flex items-center gap-1"><ThumbsUp size={16} /> 1.2k</span> */}
                            <button 
                            className={`flex items-center gap-1 transition-all active:scale-90 ${
                              art.isSaved 
                                ? "text-blue-600" 
                                : "text-gray-400 hover:text-blue-500"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleSaveToggle(art._id);
                            }}
                          >
                            <ThumbsUp 
                            size={20} 
                            // 1. "fill" handles the inside of the thumb
                            fill={art.isSaved ? "currentColor" : "none"} 
                            className={`transition-all duration-300 ${
                              art.isSaved 
                                ? "text-blue-600"  // 2. Turns the stroke and fill blue when saved
                                : "text-gray-400"  // 3. Keeps it gray when not saved
                            }`}
                          />
                          </button>
                            <button 
                              className="flex item-center gap-1 hover:text-blue-500 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log("Disliked");
                              }}
                            >
                              <ThumbsDown size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center mt-12 mb-10">
                    <div className="flex items-center space-x-2 border border-sky-400 rounded-full px-4 py-1 shadow-sm bg-white">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium transition-all
                            ${currentPage === page ? "bg-sky-500 text-white shadow-md" : "text-gray-600 hover:bg-sky-50"}
                          `}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pl-2 disabled:opacity-30"
                      >
                        <ArrowRight className="w-5 h-5 text-gray-800" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 text-gray-500">
                No articles found in this category.
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ArticlePage;