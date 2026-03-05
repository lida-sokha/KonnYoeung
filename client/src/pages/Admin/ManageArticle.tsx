import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../services/api'
import AdminDashboardLayout from "../../components/Layout/Sections/AdminDashboardLayout";
import { Plus, Eye, Trash2, Edit, Search } from "lucide-react";

interface Article {
  _id: string;
  article_ID: number;
  article_title: string;
  article_author: string;
  publish_date: string;
  article_status: string;
}

const ManageArticle = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchArticles();
  }, []);
const fetchArticles = async () => {
  try {
    const response = await API.get("/admin/articles");
    console.log("Raw Data from Backend:", response.data.data); // Inspect this!
    
    if (response.data.success) {
      setArticles(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    setLoading(false);
  }
    };
    
const deleteArticle = async (id: string) => {
  if (window.confirm("Are you sure you want to delete this article?")) {
    try {
      const response = await API.delete(`admin/article/${id}`);
      
      if (response.data.success) {
        setArticles(articles.filter((art) => art._id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert("Failed to delete article");
    }
  }
};

  const filteredArticles = articles.filter((art) =>
    art.article_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminDashboardLayout>
      <div className="px-8 py-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manage Articles</h1>
            <p className="text-gray-500 text-sm">Create, edit, and manage your content</p>
          </div>
          <button
            onClick={() => navigate("/admin/createArticle")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition shadow-md"
          >
            <Plus size={20} />
            Create Article
          </button>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by title..."
            className="flex-1 outline-none text-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Article Title</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Author</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">Loading articles...</td>
                </tr>
              ) : filteredArticles.map((article) => (
                <tr key={article._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-800 block truncate max-w-xs">
                      {article.article_title}
                    </span>
                    <span className="text-xs text-gray-400">ID: {article.article_ID}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{article.article_author}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">
                    {new Date(article.publish_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.article_status === 'Published' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-orange-100 text-orange-600'
                    }`}>
                      {article.article_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => deleteArticle(article._id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ManageArticle;