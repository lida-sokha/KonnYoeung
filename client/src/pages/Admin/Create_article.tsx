import { useState } from "react";
import API from '../../services/api';
import AdminDashboardLayout from "../../components/Layout/Sections/AdminDashboardLayout";
import { Trash2, Plus, Image as ImageIcon, Type, List, Heading, Calendar} from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
const CreateArticle = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  type ContentBlock =
    | { type: "paragraph"; text: string; order: number }
    | { type: "header"; text: string; order: number }
    | { type: "image"; file: File | null; preview: string | null; order: number }
    | { type: "bullet"; items: string[]; order: number };

  const [content, setContent] = useState<ContentBlock[]>([]);

  const handlePublish = async () => {
    if (!title || !author) return alert("Please fill in Title and Author");
    
    setLoading(true);
    const loadingToast = toast.loading("Publishing article...");
    const formData = new FormData();
    
    formData.append("title", title);
    formData.append("author", author);
    formData.append("date", date);
    formData.append("status", "Published");

    const contentData = content.map((block, index) => {
      const { ...rest } = block;
      return { ...rest, order: index + 1 };
    });

    formData.append("content", JSON.stringify(contentData));

    content.forEach((block) => {
      if (block.type === "image" && block.file) {
        formData.append("articleImages", block.file);
      }
    });

    try {
      const response = await API.post("/admin/create-article", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Article published sucessfully!", { id: loadingToast });
        setTimeout(() => {
          navigate("/admin/articles");
        }, 1500);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to publish", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type: ContentBlock["type"]) => {
    const order = content.length + 1;
    if (type === "paragraph") setContent([...content, { type: "paragraph", text: "", order }]);
    if (type === "header") setContent([...content, { type: "header", text: "", order }]);
    if (type === "image") setContent([...content, { type: "image", file: null, preview: null, order }]);
    if (type === "bullet") setContent([...content, { type: "bullet", items: [""], order }]);
  };

  const deleteBlock = (index: number) => {
    setContent(content.filter((_, i) => i !== index));
  };

  return (
    <AdminDashboardLayout>
      <div className="max-w-auto mx-auto px-6 py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Create New Article</h1>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-white bg-red-400 hover:bg-gray-100 rounded-xl transition">Save Draft</button>
            <button 
              onClick={handlePublish}
              disabled={loading}
              className={`px-8 py-2 bg-blue-600 text-white rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition ${loading ? 'opacity-50' : ''}`}
            >
              {loading ? "Publishing..." : "Publish"}
            </button>
          </div>
        </header>

        {/* Info Section */}
        <section className="bg-white p-6 border-blue-200 border-2 rounded-3xl shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-m font-medium text-gray-500 ml-1">Title</label>
              <input
                type="text"
                className="w-full mt-1 bg-gray-50 border-blue-200 border-2 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-m font-medium text-gray-500 ml-1">Author Name</label>
              <input
                type="text"
                className="w-full mt-1 bg-gray-50 border-2 border-blue-200 p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Who wrote this?"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/3 group">
            <label className="text-m font-medium text-gray-500 ml-1">
              Publish Date
            </label>
            
            <div className={`relative mt-1 rounded-2xl border-2 transition-all duration-200 bg-gray-100/50
              ${date ? 'border-blue-200' : 'border-gray-100'} 
              group-focus-within:border-blue-500 group-focus-within:ring-4 group-focus-within:ring-blue-50`}
            >
              <input 
                type="date" 
                className="w-full p-4 bg-transparent outline-none text-gray-700 font-medium cursor-pointer
                          [&::-webkit-calendar-picker-indicator]:absolute
                          [&::-webkit-calendar-picker-indicator]:w-full
                          [&::-webkit-calendar-picker-indicator]:h-full
                          [&::-webkit-calendar-picker-indicator]:left-0
                          [&::-webkit-calendar-picker-indicator]:top-0
                          [&::-webkit-calendar-picker-indicator]:opacity-0
                          [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
              />
              
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-blue-500">
                <Calendar size={18} />
              </div>
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="sticky top-6 z-30 flex item-center gap-1 mb-10 p-1.5 bg-white/80 backdrop-blur-md border border-gray-200 shadow-2xl rounded-2xl w-fit mx-auto transition-all duration-300">
          <button
            onClick={() => addBlock("header")} className="px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-medium">
            <div className="p-1.5 bg-blue-100/50 rounded-lg group-hover:bg-blue-100 transition-colors flex">
              <Heading size={18} className="text-blue-600" />
            </div>
            Header
          </button>
          <button
            onClick={() => addBlock("paragraph")} className="px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-medium">
            <div className="p-1.5 bg-emerald-100/50 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <Type size={18} className="text-emerald-600" />
            </div>
            Paragraph
          </button>
          <button onClick={() => addBlock("image")} className="px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-medium">
            <div className="p-1.5 bg-purple-100 rounded-lg group-hover:bg-purple-100 transition-colors">
              <ImageIcon size={18} className="text-purple-600" />
            </div>
            Image
          </button>
          <button onClick={() => addBlock("bullet")} className="px-4 py-3 rounded-xl transition-all flex items-center gap-2 text-sm font-medium">
            <div className="p-1.5 bg-orange-100/50 rounded-lg group-hover:bg-orange-100 transition-colors">
              <List size={18} className="text-orange-600"/>
            </div>
            List
          </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
          {content.map((block, index) => (
            // 
            <div
              key={index} className="group relative bg-white rounded-xl tansition-all duration-200 border-2 border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-50 shadow-sm hover:shadow-md">
              <div className="flex item-center justify-between px-6 py-2 border-b border-gray-100  rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-widest font-bold bg-white px-2 py-1 rounded-md border border-gray-100 shadow-sm">
                    {block.type}
                  </span>
                </div>
                <button 
                  onClick={() => deleteBlock(index)}
                  className="p-2 text-gray-400 text-red-500 bg-red-50 rounded-lg transition-colors"
                  title="Delete Block"
                >
                  <Trash2 size={18}/>
                </button>
              </div>
              {block.type === "header" && (
                <input
                  className="w-full text-2xl font-bold p-2 outline-none placeholder:text-gray-300"
                  placeholder="Enter section header..."
                  value={block.text}
                  onChange={(e) => {
                    const newContent = [...content];
                    (newContent[index] as any).text = e.target.value;
                    setContent(newContent);
                  }}
                />
              )}

              {block.type === "paragraph" && (
                <textarea
                  rows={3}
                  className="w-full p-2 outline-none text-gray-600 leading-relaxed placeholder:text-gray-300 resize-none"
                  placeholder="Start writing your story..."
                  value={block.text}
                  onChange={(e) => {
                    const newContent = [...content];
                    (newContent[index] as any).text = e.target.value;
                    setContent(newContent);
                  }}
                />
              )}

              {block.type === "image" && (
                <div className="w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-gray-50 transition overflow-hidden">
                    {block.preview ? (
                      <img src={block.preview} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400">
                        <Plus size={40} className="mb-2" />
                        <p>Upload Illustration</p>
                      </div>
                    )}
                    <input 
                        type="file" 
                        hidden 
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const newContent = [...content];
                            newContent[index] = { ...block, file, preview: URL.createObjectURL(file) };
                            setContent(newContent);
                        }} 
                    />
                  </label>
                </div>
              )}

              {block.type === "bullet" && (
                <div className="space-y-2 p-2">
                  {block.items.map((item, iIndex) => (
                    <div key={iIndex} className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full" />
                      <input
                        className="flex-1 outline-none text-gray-600"
                        placeholder="List item..."
                        value={item}
                        onChange={(e) => {
                          const newContent = [...content];
                          (newContent[index] as any).items[iIndex] = e.target.value;
                          setContent(newContent);
                        }}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                        const newContent = [...content];
                        (newContent[index] as any).items.push("");
                        setContent(newContent);
                    }}
                    className="text-blue-500 text-sm font-semibold ml-5 mt-2 hover:underline"
                  >
                    + Add Item
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default CreateArticle;