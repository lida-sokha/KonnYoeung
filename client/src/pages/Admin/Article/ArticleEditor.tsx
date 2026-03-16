import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from '../../../services/api';
import AdminDashboardLayout from "../../../components/Layout/Sections/AdminDashboardLayout";
import { Trash2, Plus, Image as ImageIcon, Type, List, Heading, ArrowLeft, Save, Send } from "lucide-react"; 
import toast from 'react-hot-toast';

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Draft");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  type ContentBlock=
    | { type: "parapragh"; text: string; order: number }
    | { type: "header"; text: string; order: number }
    | { type: "image"; file: File | null; preview: string | null; order: number }
    | { type: "bullet"; items: string[]; order: number };

  const [content, setContent] = useState<ContentBlock[]>([]);

useEffect(() => {
  if (isEditMode) {
    const fetchArticle = async () => {
      try {
        const response = await API.get(`/admin/article/${id}`);
        
        const art = response?.data?.data;

        if (!art) {
          console.error("API returned success but 'data' field is empty:", response.data);
          toast.error("Article not found or invalid response");
          return;
        }
        
        setTitle(art.article_title || "");
        setAuthor(art.article_author || "");
        setStatus(art.article_status || "Draft");
        setDate(art.publish_date ? new Date(art.publish_date).toISOString().split('T')[0] : "");
        
        const safeCategories = Array.isArray(art.categories) ? art.categories : [];
        setCategories(safeCategories);
        
        const rawBlocks = art.content_blocks || art.content_block || [];
        const mappedContent = rawBlocks.map((block: any) => {
          const type = (block.content_type || "").toLowerCase();
          const common = { order: block.content_order || 0 };

          if (type === 'image') {
            return { ...common, type: "image", file: null, preview: block.image_url };
          }
          if (type === 'bullet') {
            return { ...common, type: "bullet", items: block.items || [] };
          }
          return { 
            ...common, 
            type: (type === "parapragh" || type === "paragraph") ? "parapragh" : "header", 
            text: block.content || "" 
          };
        });

        setContent(mappedContent.sort((a: any, b: any) => a.order - b.order));
      } catch (err: any) {
        console.error("Fetch error:", err);
        const errorMsg = err.response?.data?.message || "Failed to connect to server";
        toast.error(errorMsg);
      }
    };
    fetchArticle();
  }
}, [id, isEditMode]);

const handleSave = async (targetStatus?: string) => {
  if (!title || !author) {
    return toast.error("Title and Author are required");
  }

  setLoading(true);
  const loadingToast = toast.loading("Syncing with database...");
  
  try {
    const formData = new FormData();

    formData.append("article_title", title);
    formData.append("article_author", author);
    formData.append("article_status", targetStatus || status);
    formData.append("publish_date", date);
    
    formData.append("categories", JSON.stringify(categories));
// Inside handleSave function
const contentBlockData = content.map((block, index) => {
  const base = { content_order: index + 1 };

  if (block.type === "image") {
    return { ...base, content_type: "Image", image_url: block.file ? null : block.preview };
  }
  
  if (block.type === "bullet") {
    return { ...base, content_type: "List", content: block.items?.join(";") || "" };
  }
  
  return { 
        ...base, 
        content_type: block.type === "parapragh" ? "Parapragh" : "Header", 
        content: (block as any).text || "" 
      };
});

// CHANGE THIS FROM 'content_block' TO 'content_blocks'
formData.append("content_blocks", JSON.stringify(contentBlockData));

    content.forEach((block) => {
      if (block.type === "image" && block.file) {
        formData.append("articleImages", block.file);
      }
    });

    const response = await API.put(`/admin/article/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data?.success) {
      toast.success(isEditMode ? "Changes saved!" : "Article published!", { id: loadingToast });
      
      const updatedArt = response.data.data;
      if (updatedArt) {
        setCategories(updatedArt.categories || []);
        setStatus(updatedArt.article_status || status);
      }

      setTimeout(() => navigate("/admin/articles"), 1500);
    } else {
      throw new Error(response.data?.message || "Update failed");
    }

  } catch (error: any) {
    console.error("Frontend caught error:", error);
    
    const errorMsg = error.response?.data?.error || 
                     error.response?.data?.message || 
                     "Connection lost to server";
                     
    toast.error(errorMsg, { id: loadingToast });
  } finally {
    setLoading(false);
  }
};

  const addBlock = (type: ContentBlock["type"]) => {
    const order = content.length + 1;
    if (type === "parapragh") setContent([...content, { type: "parapragh", text: "", order }]);
    if (type === "header") setContent([...content, { type: "header", text: "", order }]);
    if (type === "image") setContent([...content, { type: "image", file: null, preview: null, order }]);
    if (type === "bullet") setContent([...content, { type: "bullet", items: [""], order }]);
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-5xl mx-auto px-6 py-10">
        
        {/* RESTRUCTURED HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-all shadow-sm">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                {isEditMode ? "Edit Article" : "Create New Article"}
              </h1>
              <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                Current Status: {status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => handleSave("Draft")} className="flex items-center gap-2 px-6 py-3 text-sm font-bold text-gray-600 bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl transition-all">
              <Save size={18} /> Save as Draft
            </button>
            <button onClick={() => handleSave("Published")} disabled={loading} className={`flex items-center gap-2 px-8 py-3 text-sm font-bold text-white rounded-2xl shadow-lg transition-all ${loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'}`}>
              <Send size={18} /> {loading ? "Saving..." : "Publish Article"}
            </button>
          </div>
        </header>

        {/* METADATA EDITOR */}
        <section className="bg-white p-8 rounded-[2rem] border-2 border-blue-50 shadow-sm mb-10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Title</label>
                <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-200 focus:bg-white p-4 rounded-2xl outline-none transition-all" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-black text-blue-400 uppercase tracking-widest ml-1">Author</label>
                <input className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-200 focus:bg-white p-4 rounded-2xl outline-none transition-all" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>
          </div>
        </section>

        {/* TOOLBAR */}
        <div className="sticky top-6 z-30 flex items-center gap-2 mb-10 p-2 bg-white/90 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl w-fit mx-auto">
          <button onClick={() => addBlock("header")} className="p-3 rounded-xl hover:bg-blue-50 text-blue-600 transition-all flex items-center gap-2 text-sm font-bold"><Heading size={20}/> Header</button>
          <button onClick={() => addBlock("parapragh")} className="p-3 rounded-xl hover:bg-emerald-50 text-emerald-600 transition-all flex items-center gap-2 text-sm font-bold"><Type size={20}/> Text</button>
          <button onClick={() => addBlock("image")} className="p-3 rounded-xl hover:bg-purple-50 text-purple-600 transition-all flex items-center gap-2 text-sm font-bold"><ImageIcon size={20}/> Image</button>
          <button onClick={() => addBlock("bullet")} className="p-3 rounded-xl hover:bg-orange-50 text-orange-700 transition-all flex items-center gap-2 text-sm font-bold"><List size={20}/> List</button>
        </div>

        {/* CONTENT AREA */}
        <div className="space-y-8 min-h-[400px]">
          {content.map((block, index) => (
            <div key={index} className="group relative bg-white rounded-[2rem] border-2 border-gray-50 hover:border-blue-100 p-8 transition-all shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <span className="px-4 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase">{block.type}</span>
                <button onClick={() => setContent(content.filter((_, i) => i !== index))} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={20}/></button>
              </div>

              {block.type === "header" && (
                <input className="w-full text-2xl font-bold outline-none bg-transparent" value={block.text} onChange={(e) => {
                  const next = [...content];
                  (next[index] as any).text = e.target.value;
                  setContent(next);
                }} />
              )}

              {block.type === "parapragh" && (
                <textarea className="w-full text-lg leading-relaxed text-gray-600 outline-none resize-none bg-transparent" rows={3} value={block.text} onChange={(e) => {
                  const next = [...content];
                  (next[index] as any).text = e.target.value;
                  setContent(next);
                }} />
              )}

              {block.type === "image" && (
             <div className="aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-gray-100 hover:border-blue-200 transition-all relative">
                  {block.preview ? (
                    <img 
                      src={(() => {
                        if (block.preview.startsWith("blob:")) return block.preview;
                        
                        if (block.preview.startsWith("http")) return block.preview;
                        
                        return `https://res.cloudinary.com/dprsygcvh/image/upload/f_auto,q_auto/${block.preview}`;
                      })()} 
                      className="w-full h-full object-cover" 
                      alt="Article" 
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Found";
                      }}
                    />
                  ) : (
                    <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
                      <Plus size={40} className="text-gray-300 mb-2"/>
                      <span className="text-gray-400 font-medium text-sm">Upload Image</span>
                      <input type="file" hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                          const next = [...content];
                          next[index] = {...block, file, preview: URL.createObjectURL(file)};
                          setContent(next);
                        }
                      }} />
                    </label>
                  )}
                </div>
              )}

              {block.type === "bullet" && (
                <div className="space-y-3">
                    {block.items.map((item, iIdx) => (
                        <div key={iIdx} className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                            <input className="flex-1 outline-none text-gray-700" value={item} onChange={(e) => {
                                const next = [...content];
                                const items = [...(next[index] as any).items];
                                items[iIdx] = e.target.value;
                                (next[index] as any).items = items;
                                setContent(next);
                            }} />
                        </div>
                    ))}
                    <button onClick={() => {
                        const next = [...content];
                        (next[index] as any).items.push("");
                        setContent(next);
                    }} className="text-xs font-bold text-blue-600 ml-5 hover:underline">+ Add Item</button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ArticleEditor;