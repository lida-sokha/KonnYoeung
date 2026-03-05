import { useState } from "react";
import axios from "axios";
import AdminDashboardLayout from "../../components/Layout/Sections/AdminDashboardLayout";
import { Trash2, Plus, Image as ImageIcon, Type, List, Heading } from "lucide-react"; // Using lucide for better icons

const CreateArticle = () => {
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

  // --- API CONNECTION LOGIC ---
  const handlePublish = async () => {
    if (!title || !author) return alert("Please fill in Title and Author");
    
    setLoading(true);
    const formData = new FormData();
    
    // 1. Append basic fields
    formData.append("title", title);
    formData.append("author", author);
    formData.append("date", date);
    formData.append("status", "Published");

    // 2. Separate files and text content
    // We send 'content' as a stringified JSON and 'articleImages' as files
    const contentData = content.map((block, index) => {
      const { ...rest } = block;
      return { ...rest, order: index + 1 };
    });

    formData.append("content", JSON.stringify(contentData));

    // 3. Append all images to the same key 'articleImages' (matches backend upload.array)
    content.forEach((block) => {
      if (block.type === "image" && block.file) {
        formData.append("articleImages", block.file);
      }
    });

    try {
      const response = await axios.post("http://localhost:5000/api/admin/create-article", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Article published successfully!");
        // Reset form or redirect
      }
    } catch (error: any) {
      console.error("Upload Error:", error);
      alert(error.response?.data?.error || "Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER FUNCTIONS ---
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
      <div className="max-w-4xl mx-auto px-6 py-10">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">Create New Article</h1>
          <div className="flex gap-3">
            <button className="px-5 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition">Save Draft</button>
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
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500 ml-1">Title</label>
              <input
                type="text"
                className="w-full mt-1 bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500 ml-1">Author Name</label>
              <input
                type="text"
                className="w-full mt-1 bg-gray-50 border-none p-4 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Who wrote this?"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>
          </div>
          <div className="w-1/3">
             <label className="text-sm font-medium text-gray-500 ml-1">Publish Date</label>
             <input type="date" className="w-full mt-1 bg-gray-50 border-none p-4 rounded-2xl outline-none" value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>
        </section>

        {/* Toolbar */}
        <div className="flex items-center gap-4 mb-6 p-2 bg-gray-100 rounded-2xl w-fit mx-auto">
          <button onClick={() => addBlock("header")} className="p-3 hover:bg-white rounded-xl transition flex items-center gap-2 text-sm font-medium"><Heading size={18}/> Header</button>
          <button onClick={() => addBlock("paragraph")} className="p-3 hover:bg-white rounded-xl transition flex items-center gap-2 text-sm font-medium"><Type size={18}/> Paragraph</button>
          <button onClick={() => addBlock("image")} className="p-3 hover:bg-white rounded-xl transition flex items-center gap-2 text-sm font-medium"><ImageIcon size={18}/> Image</button>
          <button onClick={() => addBlock("bullet")} className="p-3 hover:bg-white rounded-xl transition flex items-center gap-2 text-sm font-medium"><List size={18}/> List</button>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {content.map((block, index) => (
            <div key={index} className="group relative bg-white p-2 rounded-2xl hover:shadow-md transition border border-transparent hover:border-gray-200">
              <button 
                onClick={() => deleteBlock(index)}
                className="absolute -right-2 -top-2 p-2 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm"
              >
                <Trash2 size={16}/>
              </button>

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