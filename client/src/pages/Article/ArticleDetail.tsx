import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import { Search, Mic, Globe, ArrowLeft } from "lucide-react";
import API from "../../services/api"; // Ensure this path is correct

// Interface to match your MongoDB structure
interface ContentBlock {
  content_order: number;
  content_type: "Parapragh" | "Image" | "Header" | "List";
  content?: string;
  image_url?: string;
}

interface Article {
  _id: string;
  article_ID: number;
  article_title: string;
  article_author: string;
  publish_date: string;
  reviewer?: string; // Optional if not in DB yet
  content_blocks: ContentBlock[];
}

const ArticleDetail = () => {
  const { id } = useParams(); // This gets the article_ID from URL
  const navigate = useNavigate();

  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState("EN");
  const [activeTab, setActiveTab] = useState("All");

  const tabs = ["All", "Symptoms", "Illness", "Emergency", "First-Aids", "Prevention & Care"];

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        setLoading(true);
        // Assuming your backend route is /articles/:id
        const response = await API.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticleDetail();
  }, [id]);

  // Cloudinary Helper (matches your ArticlePage logic)
  const getImageUrl = (imgName: string) => {
    const cloudName = "dprsygcvh";
    // If the DB provides the full name like "article1_image1.jpg"
    const publicId = imgName.split(".")[0];
    return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${publicId}.jpg`;
  };

  if (loading) return <DashboardLayout><div className="p-10 text-center">Loading article...</div></DashboardLayout>;
  if (!article) return <DashboardLayout><div className="p-10 text-center">Article not found.</div></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Header Section (Kept your design) */}
      <div className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
            onClick={() => navigate("/articles")} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go Back"
            >
            <ArrowLeft size={26} className="text-gray-600" />
            </button>
            <div className="flex items-center bg-gray-200 rounded-full px-3 py-2 flex-1 md:w-72">
        <Search size={16} className="text-gray-500" />
        <input placeholder="Search" className="bg-transparent outline-none flex-1 mx-2 text-sm" />
        <Mic size={16} className="text-gray-500 cursor-pointer" />
      </div>
          </div>
          <div className="flex items-center gap-4 self-end md:self-auto">
            <button onClick={() => setLanguage(language === "EN" ? "KH" : "EN")} className="flex items-center gap-1 text-gray-700 hover:text-black">
              <Globe size={18} /><span className="font-medium">{language}</span>
            </button>
            <img 
                src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" 
                alt="Profile" 
                onClick={() => navigate("/profile")}
                className="w-10 h-10 rounded-full cursor-pointer border hover:opacity-80 ml-6" 
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-10 overflow-x-auto border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                  setActiveTab(tab);
                  navigate('/articles'); // Navigate back to list to filter
              }}
              className={`pb-2 text-base whitespace-nowrap relative ${activeTab === tab ? "font-medium text-black" : "text-gray-400 hover:text-gray-600"}`}
            >
              {tab}
              {activeTab === tab && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-black" />}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic Article Content */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 leading-tight">
            {article.article_title}
          </h1>

          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Written by :</span> {article.article_author}</p>
            <p><span className="font-medium">Published on :</span> {new Date(article.publish_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><span className="font-medium">Reviewed by :</span> {article.reviewer || "Medical Review Team"}</p>
          </div>

          <div className="space-y-6 mt-8">
            {article.content_blocks
              .sort((a, b) => a.content_order - b.content_order)
              .map((block, i) => {
                switch (block.content_type) {
                  case "Parapragh":
                    return <p key={i} className="text-gray-700 leading-relaxed text-lg">{block.content}</p>;
                  
                  case "Header":
                    return <h2 key={i} className="text-2xl font-bold text-gray-800 pt-4">{block.content}</h2>;
                  
                  case "Image":
                    return (
                      <div key={i} className="py-4">
                        <img 
                          src={getImageUrl(block.image_url || "")} 
                          alt="Article visual" 
                          className="rounded-2xl w-full object-cover shadow-sm"
                        />
                      </div>
                    );

                  case "List":
                    // Splitting the semicolon-separated string from your DB
                    const listItems = block.content?.split(';') || [];
                    return (
                      <ul key={i} className="list-disc pl-6 space-y-2 text-gray-700 text-lg">
                        {listItems.map((item, j) => (
                          <li key={j} className="pl-2">{item.trim()}</li>
                        ))}
                      </ul>
                    );
                  
                  default:
                    return null;
                }
            })}
          </div>
        </div>

        {/* Sidebar (Kept identical to your design) */}
        <div className="space-y-6">
          <a href="https://cadt.edu.kh/" target="_blank" rel="noreferrer">
            <img src="https://cambodiainvestmentreview.com/wp-content/uploads/2022/03/CADT-0-scaled.jpg" className="rounded-lg w-full object-cover hover:opacity-90 transition" />
          </a>

          <div>
            <h3 className="font-semibold border-y my-3 pb-2 text-xl text-center">Latest post</h3>
            <div className="space-y-1">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex gap-3 hover:bg-gray-50 p-2 rounded cursor-pointer border-b border-gray-100">
                  <img src="https://www.beyfortus.com/.imaging/default/dam/Marketing/Beyfortus-new-consumer-sites/what-is-rsv/GettyImages-1369926465.png/jcr:content.png" className="w-24 h-20 object-cover rounded" />
                  <div>
                    <p className="text-sm font-medium line-clamp-2">Why should babies be vaccinated?</p>
                    <p className="text-xs text-gray-500 mt-1">15 Sept 2025</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <a href="https://www.airbnb.com/" target="_blank" rel="noreferrer">
            <img src="https://a0.muscache.com/im/pictures/hosting/Hosting-1496408576612343725/original/18f510c4-44bb-4546-ab01-4fba94df223d.jpeg" className="rounded-lg w-full object-cover hover:opacity-90 transition" />
          </a>

          <div>
            <h3 className="font-semibold my-3 border-y pb-2 text-xl text-center">Recommend</h3>
            <div className="space-y-4">
              {[4, 5, 6].map((n) => (
                <div key={n} className="relative cursor-pointer group">
                  <img src={`https://www.vickerypediatrics.com/wp-content/uploads/2019/12/winter-viruses-impacting-kids.jpg.webp`} className="rounded-lg w-full h-48 object-cover group-hover:brightness-75 transition" />
                  <div className="absolute inset-0 bg-black/30 rounded-lg flex items-end p-4">
                    <p className="text-white text-sm font-semibold leading-snug">These diseases often occur in young children in the winter...</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ArticleDetail;