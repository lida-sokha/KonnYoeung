import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from '../../../services/api'
import AdminDashboardLayout from "../../../components/Layout/Sections/AdminDashboardLayout";
import { Plus, Eye, Trash2, Edit, Search } from "lucide-react";
import toast from 'react-hot-toast';

interface Article {
  _id: string;
  article_ID: number;
  article_title: string;
  article_author: string;
  publish_date: string;
  article_status: string;
  content_block?: ContentBlock[]; 
  content_blocks?: ContentBlock[];
}

interface ContentBlock {
  content_order: number;
  content_type: 'Paragraph' | 'Image' | 'Header' | 'List' | 'Parapragh'; // Including the typo 'Parapragh' just in case
  content?: string;
  image_url?: string;
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
    console.log("Raw Data from Backend:", response.data.data);
    
    if (response.data.success) {
      setArticles(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching articles:", error);
  } finally {
    setLoading(false);
  }
  };
  
const openPreview = async (article: Article) => {
  navigate(`/admin/preview/${article.article_ID}`);
  };
  
  const openEdite = async (article: Article) => {
    navigate(`/admin/editArticle/${article.article_ID}`);
}
  
  
const executeDelete = async (id: string) => {
  const loadingToast = toast.loading("Deleting article...");
  try {
    const response = await API.delete(`admin/article/${id}`);
    
    if (response.data.success) {
      setArticles(articles.filter((art) => art._id !== id));
      toast.success("Article deleted successfully!", { id: loadingToast });
    }
  } catch (error: any) {
    toast.error(error.response?.data?.error || "Failed to delete the article", { id: loadingToast });
  }
};

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-3 p-1">
        <span className="text-sm font-medium text-gray-800">
          Delete this article? This cannot be undone.
        </span>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:bg-gray-100 rounded-lg transition"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              executeDelete(id);
            }}
            className="px-3 py-1.5 text-xs font-semibold bg-red-500 text-white hover:bg-red-600 rounded-lg shadow-sm transition"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 6000,
      position: 'top-center',
      style: { minWidth: '300px', border: '1px solid #fee2e2' }
    });
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
            <p className="text-gray-500 text-m">Create, edit, and manage your content</p>
          </div>
          <button
            onClick={() => navigate("/admin/createArticle")}
            className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-md"
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
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      onClick={() => openPreview(article)}>
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                        onClick={() => openEdite(article)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => confirmDelete(article._id)}
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