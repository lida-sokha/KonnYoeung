import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../services/api";
import AdminDashboardLayout from "../../../components/Layout/Sections/AdminDashboardLayout";
import { ArrowLeft } from "lucide-react";

const AdminPreview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<any>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await API.get(`/admin/article/${id}`);
                if (response.data.success) {
                    setArticle(response.data.data);
                }
            } catch (error) {
                console.error("Error loading preview", error);
            }
        };
        fetchArticle();
    }, [id]);

    if (!article) {
        return (
            <AdminDashboardLayout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </AdminDashboardLayout>
        );
    }

    return (
        <AdminDashboardLayout>
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="font-bold text-3xl text-gray-800">Article Preview</h1>
            </div>

            <div className="max-w-4xl mx-auto p-8 bg-white shadow-sm border border-gray-100 rounded-2xl">
                <div className="mb-8 border-b pb-6">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium uppercase tracking-wider">
                        {article.article_status}
                    </span>
                    <h1 className="text-4xl font-bold mb-4">{article.article_title}</h1>
                    <p className="text-gray-500 mb-8">
                        By {article.article_author} • {new Date(article.publish_date).toLocaleDateString()}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Check both content_blocks and content_block for safety */}
                    {(article.content_blocks || article.content_block || []).map((block: any, i: number) => {
                        const type = block.content_type?.toLowerCase();

                        // 1. HEADER
                        if (type === "header") {
                            return <h2 key={i} className="text-2xl font-semibold">{block.content}</h2>;
                        }

                        // 2. PARAGRAPH (Fixed spelling check)
                        if (type === "paragraph" || type === "parapragh") {
                            return <p key={i} className="text-lg leading-relaxed text-gray-700">{block.content}</p>;
                        }

                        // 3. IMAGE (Matching ArticlePage logic + folder fix)
                        if (type === "image") {
                            return (
                                <div key={i} className="my-6 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                                    <img
                                        src={(() => {
                                            const rawPath = block.image_url || block.url || "";
                                            if (!rawPath) return "https://placehold.co/800x400?text=No+Image+Provided";
                                            if (rawPath.startsWith("http")) return rawPath;
                                            const cloudName = "dprsygcvh";
                                            return `https://res.cloudinary.com/${cloudName}/image/upload/f_auto,q_auto/${rawPath}`;
                                        })()}
                                        alt="Article content"
                                        className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://placehold.co/800x400?text=Image+Not+Found";
                                        }}
                                    />
                                </div>
                            );
                        }
                        // 4. LIST
                        if (type === "list") {
                            return (
                                <ul key={i} className="list-disc ml-6 space-y-2 text-lg text-gray-600">
                                    {block.content?.split(';').map((item: string, idx: number) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            );
                        }

                        return null;
                    })}
                </div>
            </div>
        </AdminDashboardLayout>
    );
};

export default AdminPreview;