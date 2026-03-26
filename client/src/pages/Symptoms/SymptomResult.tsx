import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import { initialDiseases, type Disease } from "../../contexts/DiseaseContext";
import API from "../../services/api";

type MlPrediction = { disease: string; confidence: number };

type MlResponse = {
  predictions: MlPrediction[];
  matched_symptoms: string[];
  unmatched_symptoms: string[];
};

const SEVERITY_IMAGES: Record<string, string> = {
  Mild: "/images/low_severity.png",
  Low: "/images/low_severity.png",
  Moderate: "/images/moderate_severity.png",
  High: "/images/high_severity.png",
};

function getSeverityImage(severity: string): string {
  return SEVERITY_IMAGES[severity] ?? "/images/moderate_severity.png";
}

function formatMlDiseaseLabel(raw: string): string {
  return raw
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function findDiseaseForMlLabel(label: string, diseases: Disease[]): Disease | null {
  const lower = label.toLowerCase();
  const asHyphen = lower.replace(/_/g, "-");
  return (
    diseases.find(
      (d) =>
        d.id?.toLowerCase() === lower ||
        d.slug?.toLowerCase() === lower ||
        d.id?.toLowerCase() === asHyphen ||
        d.slug?.toLowerCase() === asHyphen ||
        d.name.toLowerCase().replace(/\s+/g, " ") === lower.replace(/_/g, " ")
    ) ?? null
  );
}

const FALLBACK_DISEASE: Disease = {
  id: "general",
  name: "General guidance",
  category: "General",
  createdAt: "",
  updatedAt: "",
  description:
    "Based on the symptoms you selected, we recommend monitoring your child and seeking professional medical advice if symptoms persist or worsen. This tool does not provide a diagnosis.",
  severity: "Moderate",
  summary: "When in doubt, consult a healthcare provider for personalized advice.",
  commonSymptoms: [],
  seekCareWhen: [
    "Symptoms worsen or last more than a few days",
    "High fever, difficulty breathing, or severe pain",
    "Your child is very sleepy or hard to wake",
    "Signs of dehydration (fewer wet nappies, dry mouth)",
  ],
  whatToDo: [
    "Keep your child comfortable and hydrated",
    "Monitor symptoms and note any changes",
    "Contact a doctor or clinic if you are concerned",
    "In an emergency, go to the nearest hospital",
  ],
};

function resolveDiseaseFromMlLabel(mlLabel: string, diseases: Disease[]): Disease {
  const found = findDiseaseForMlLabel(mlLabel, diseases);
  if (found) return found;
  return {
    ...FALLBACK_DISEASE,
    id: mlLabel,
    name: formatMlDiseaseLabel(mlLabel),
    description: `${FALLBACK_DISEASE.description} The symptom model suggests reviewing information related to ${formatMlDiseaseLabel(mlLabel)} with a healthcare professional.`,
  };
}

/** Full single-disease layout (same sections as the original results page, for one disease). */
function DiseaseFullDetail({ disease }: { disease: Disease }) {
  return (
    <div className="mt-6 space-y-6 border-t border-indigo-200/80 pt-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800">
            Diseases: {disease.name}
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl text-sm md:text-base">
            {disease.description}
          </p>
        </div>

        <div className="flex items-center justify-center md:justify-end shrink-0">
          <div className="h-48 w-48 md:h-56 md:w-56 rounded-full bg-[#E3F5FF] flex items-center justify-center overflow-hidden">
            <img
              src={getSeverityImage(disease.severity)}
              alt={`Severity: ${disease.severity}`}
              className="h-full w-full object-contain"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/images/mascot.png";
              }}
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-700">
            Severity Level: <span className="font-semibold">{disease.severity}</span>
          </p>
        </div>
        <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-400 relative">
          <div
            className="absolute -top-1 h-4 w-4 rounded-full bg-white border border-gray-300 shadow-md"
            style={{
              left:
                disease.severity === "Mild"
                  ? "16%"
                  : disease.severity === "High"
                    ? "83%"
                    : "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>
        <p className="mt-3 text-sm text-gray-600">{disease.summary}</p>
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-gray-800 text-center pt-2">
        Symptoms That Match Your Child&apos;s Condition
      </h3>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-blue-100 bg-[#E8F4FF] p-6">
          <h4 className="text-lg font-semibold text-[#0070C9] mb-3">
            Your child may experience:
          </h4>
          {disease.commonSymptoms.length > 0 ? (
            <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
              {disease.commonSymptoms.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-sm">
              General symptoms may vary. Discuss specific signs with a healthcare provider.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-yellow-200 bg-[#FFF7D6] p-6">
          <h4 className="text-lg font-semibold text-[#C69400] mb-3">
            When to Seek Medical Care
          </h4>
          <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
            {disease.seekCareWhen.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-purple-200 bg-[#F3E8FF] p-6">
        <h4 className="text-lg font-semibold text-[#7C3AED] mb-3">
          What You Should Do
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm">
          {disease.whatToDo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const SymptomResult = () => {
  const [diseases, setDiseases] = useState<Disease[]>(initialDiseases);
  const location = useLocation();
  const state = location.state as {
    selectedSymptoms?: string[];
    gender?: string;
    province?: string;
    ageCategory?: string;
  } | null;
  const selectedSymptoms = Array.isArray(state?.selectedSymptoms) ? state.selectedSymptoms : [];

  const [loading, setLoading] = useState(false);
  const [mlData, setMlData] = useState<MlResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [openLearnMore, setOpenLearnMore] = useState<Set<number>>(() => new Set([0]));

  useEffect(() => {
    API.get<Disease[]>('/diseases')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setDiseases(
            res.data.map((d) => ({
              ...d,
              id: d.slug ?? d.id ?? '',
              createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
              updatedAt: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '',
            }))
          );
        }
      })
      .catch(() => {
        setDiseases(initialDiseases);
      });
  }, []);

  const toggleLearnMore = (index: number) => {
    setOpenLearnMore((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  useEffect(() => {
    if (selectedSymptoms.length === 0) {
      setMlData(null);
      setErrorMessage(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMessage(null);
    setMlData(null);

    API.post<MlResponse>("/symptoms/predict", { symptoms: selectedSymptoms, k: 3 })
      .then((res) => {
        if (!cancelled) {
          setMlData(res.data);
          setOpenLearnMore(new Set([0]));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        const data = err.response?.data as
          | { error?: string; unmatched_symptoms?: string[] }
          | undefined;
        const msg = data?.error || err.message || "Prediction request failed.";
        let full = typeof msg === "string" ? msg : "Prediction request failed.";
        if (data?.unmatched_symptoms?.length) {
          full += ` Unmatched: ${data.unmatched_symptoms.join(", ")}.`;
        }
        setErrorMessage(full);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSymptoms]);

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/symptoms/start"
            className="inline-flex items-center text-sm text-[#34AADC] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to symptom checker
          </Link>
        </div>

        <div className="rounded-[32px] bg-white p-6 md:p-10 shadow-sm border border-blue-100">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-center mb-2">
            Symptom check results
          </h1>
          <p className="text-center text-gray-600 text-sm md:text-base mb-8 max-w-2xl mx-auto">
            Below are possible conditions suggested by the model. Use &quot;Learn more&quot; to see full
            guidance for each.
          </p>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 mb-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-4">
              3 Possible Diseases
            </h3>
            {loading && (
              <p className="text-sm text-gray-600">Loading predictions…</p>
            )}
            {!loading && errorMessage && (
              <p className="text-sm text-red-700">{errorMessage}</p>
            )}
            {!loading && !errorMessage && mlData && mlData.predictions.length > 0 && (
              <ul className="space-y-3 text-gray-700">
                {mlData.predictions.map((item, index) => {
                  const resolved = resolveDiseaseFromMlLabel(item.disease, diseases);
                  const isOpen = openLearnMore.has(index);
                  return (
                    <li
                      key={`${item.disease}-${index}`}
                      className="rounded-xl border border-indigo-100 bg-white overflow-hidden"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3">
                        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span className="font-semibold text-gray-800">
                            {index + 1}. {formatMlDiseaseLabel(item.disease)}
                          </span>
                          <span className="text-sm text-indigo-700">
                            {(item.confidence * 100).toFixed(1)}% confidence
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleLearnMore(index)}
                          className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#34AADC]/50 bg-white px-4 py-2 text-sm font-medium text-[#34AADC] hover:bg-[#34AADC]/5 transition-colors self-start sm:self-auto"
                          aria-expanded={isOpen}
                        >
                          {isOpen ? "Show less" : "Learn more"}
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>
                      {isOpen && (
                        <div className="px-4 pb-4">
                          <DiseaseFullDetail disease={resolved} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            {!loading && !errorMessage && selectedSymptoms.length === 0 && (
              <p className="text-sm text-gray-600">No symptoms were submitted.</p>
            )}
            {mlData && mlData.matched_symptoms.length > 0 && (
              <p className="mt-4 text-xs text-gray-500">
                Matched to model: {mlData.matched_symptoms.join(", ").replace(/_/g, " ")}
              </p>
            )}
          </div>

          <p className="mt-2 text-xs text-gray-500 border-t border-gray-200 pt-4">
            Important Note: This result is not a medical diagnosis. It provides
            general guidance based on the information entered and should not
            replace professional medical advice.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SymptomResult;
