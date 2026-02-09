import { useState } from "react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

const CreateArticle = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [date, setDate] = useState("");

  type ContentBlock =
    | { type: "paragraph"; text: string }
    | { type: "header"; text: string }
    | { type: "image"; file: File | null; preview: string | null };

  const [content, setContent] = useState<ContentBlock[]>([]);

  const handleDraft = () => {
    console.log("Saved as draft");
  };

  const handlePublish = () => {
    console.log("Published article");
  };

  const addParagraph = () => {
    setContent([...content, { type: "paragraph", text: "" }]);
  };

  const addHeader = () => {
    setContent([...content, { type: "header", text: "" }]);
  };

  const addImageBlock = () => {
    setContent([
      ...content,
      { type: "image", file: null, preview: null },
    ]);
  };

  const deleteBlock = (index: number) => {
    const newContent = content.filter((_, i) => i !== index);
    setContent(newContent);
  };

  return (
    <DashboardLayout>
      <div className="px-10 pb-10 pt-2">
        <h1 className="text-3xl font-bold mb-8">Create New Article</h1>

        {/* Title */}
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            type="text"
            placeholder="Typing here"
            className="w-full border border-gray-300 p-4 rounded-2xl"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Author */}
        <div className="mb-4">
          <label className="block mb-2">Author</label>
          <input
            type="text"
            placeholder="Typing here"
            className="w-full border border-gray-300 p-4 rounded-2xl"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block mb-2">Date</label>
          <input
            type="date"
            className="border border-gray-300 p-3 rounded-2xl"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* Content blocks */}
        <div className="mb-4">
          <label className="block mb-2">Content</label>

          <div className="flex gap-2 mb-3">
            <button
                onClick={addParagraph}
                className="bg-[#33A6DC] text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                + Paragraph
            </button>

            <button
                onClick={addHeader}
                className="bg-[#33A6DC] text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                + Header
            </button>

            <button
                onClick={addImageBlock}
                className="bg-[#33A6DC] text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
                + Image
            </button>
         </div>


          {content.map((block, index) => {
            if (block.type === "paragraph") {
              return (
                <div key={index} className="mb-3">
                  <textarea
                    className="w-full border border-gray-300 p-3 rounded-2xl"
                    placeholder="Paragraph"
                    value={block.text}
                    onChange={(e) => {
                      const newContent = [...content];
                      (newContent[index] as { text: string }).text = e.target.value;
                      setContent(newContent);
                    }}
                  />

                  <button
                    onClick={() => deleteBlock(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            if (block.type === "header") {
              return (
                <div key={index} className="mb-3">
                  <input
                    className="w-full border border-gray-300 p-3 rounded-2xl font-bold"
                    placeholder="Section header"
                    value={block.text}
                    onChange={(e) => {
                      const newContent = [...content];
                      (newContent[index] as { text: string }).text = e.target.value;
                      setContent(newContent);
                    }}
                  />

                  <button
                    onClick={() => deleteBlock(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            if (block.type === "image") {
              return (
                <div key={index} className="mb-3">
                  <label className="border border-gray-300 rounded-2xl h-64 flex items-center justify-center cursor-pointer p-4">
                    {block.preview ? (
                      <img
                        src={block.preview}
                        className="max-h-full object-contain"
                      />
                    ) : (
                      "Upload Image"
                    )}

                    <input
                      hidden
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        const preview = URL.createObjectURL(file);

                        const newContent = [...content];
                        newContent[index] = {
                          type: "image",
                          file,
                          preview,
                        };

                        setContent(newContent);
                      }}
                    />
                  </label>

                  <button
                    onClick={() => deleteBlock(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md mt-2 hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handleDraft}
            className="bg-orange-500 text-white px-6 py-2 rounded-md"
          >
            Draft
          </button>

          <button
            onClick={handlePublish}
            className="bg-green-500 text-white px-6 py-2 rounded-md"
          >
            Publish
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CreateArticle;
