import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import { useDiseases } from "../../contexts/DiseaseContext";

const SEVERITY_OPTIONS = ["Mild", "Moderate", "High"];

const DiseaseEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDiseaseById, updateDisease } = useDiseases();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Moderate");
  const [summary, setSummary] = useState("");
  const [commonSymptoms, setCommonSymptoms] = useState<string[]>([]);
  const [seekCareWhen, setSeekCareWhen] = useState<string[]>([]);
  const [whatToDo, setWhatToDo] = useState<string[]>([]);

  const disease = id ? getDiseaseById(id) : null;

  useEffect(() => {
    if (disease) {
      setName(disease.name);
      setCategory(disease.category);
      setDescription(disease.description);
      setSeverity(disease.severity);
      setSummary(disease.summary);
      setCommonSymptoms([...disease.commonSymptoms]);
      setSeekCareWhen([...disease.seekCareWhen]);
      setWhatToDo([...disease.whatToDo]);
    }
  }, [disease]);

  const updateListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, ""]);
  };

  const removeListItem = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number
  ) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !disease) return;
    updateDisease(id, {
      name,
      category,
      description,
      severity,
      summary,
      commonSymptoms: commonSymptoms.filter(Boolean),
      seekCareWhen: seekCareWhen.filter(Boolean),
      whatToDo: whatToDo.filter(Boolean),
    });
    navigate(`/admin/diseases/${id}`);
  };

  if (!disease) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-3xl mx-auto">
          <Link
            to="/admin/diseases"
            className="inline-flex items-center text-sm text-[#34AADC] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manage Diseases
          </Link>
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800">Disease not found</h1>
            <p className="mt-2 text-gray-600">
              The requested disease could not be found. Please go back to the list.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-3xl mx-auto">
        <Link
          to="/admin/diseases"
          className="inline-flex items-center text-sm text-[#34AADC] hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Manage Diseases
        </Link>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Edit: {disease.name}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disease Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#34AADC] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#34AADC] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#34AADC] focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity Level
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#34AADC] focus:border-transparent"
            >
              {SEVERITY_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity Summary
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-[#34AADC] focus:border-transparent"
              placeholder="e.g. Most mild allergies can be managed at home..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your child may experience (one per line)
            </label>
            {commonSymptoms.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setCommonSymptoms, i, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setCommonSymptoms, i)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(setCommonSymptoms)}
              className="flex items-center gap-2 text-sm text-[#34AADC] hover:underline"
            >
              <Plus size={16} /> Add symptom
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              When to Seek Medical Care (one per line)
            </label>
            {seekCareWhen.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setSeekCareWhen, i, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setSeekCareWhen, i)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(setSeekCareWhen)}
              className="flex items-center gap-2 text-sm text-[#34AADC] hover:underline"
            >
              <Plus size={16} /> Add item
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What You Should Do (one per line)
            </label>
            {whatToDo.map((item, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(setWhatToDo, i, e.target.value)}
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-2"
                />
                <button
                  type="button"
                  onClick={() => removeListItem(setWhatToDo, i)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  aria-label="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addListItem(setWhatToDo)}
              className="flex items-center gap-2 text-sm text-[#34AADC] hover:underline"
            >
              <Plus size={16} /> Add item
            </button>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="rounded-xl bg-[#34AADC] px-6 py-2.5 text-white font-medium hover:bg-[#2690c2] transition-colors"
            >
              Save changes
            </button>
            <Link
              to={`/admin/diseases/${id}`}
              className="rounded-xl border border-gray-300 px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default DiseaseEdit;
