import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
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

function findDiseaseForMlLabel(label: string): Disease | null {
  const lower = label.toLowerCase();
  const asHyphen = lower.replace(/_/g, "-");
  return (
    initialDiseases.find(
      (d) =>
        d.id === lower ||
        d.id === asHyphen ||
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

function resolvePrimaryDisease(mlTopLabel: string | null): Disease {
  if (!mlTopLabel) return FALLBACK_DISEASE;
  const found = findDiseaseForMlLabel(mlTopLabel);
  if (found) return found;
  return {
    ...FALLBACK_DISEASE,
    id: mlTopLabel,
    name: formatMlDiseaseLabel(mlTopLabel),
    description: `${FALLBACK_DISEASE.description} The symptom model suggests reviewing information related to ${formatMlDiseaseLabel(mlTopLabel)} with a healthcare professional.`,
  };
}

const SymptomResult = () => {
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

  const topMlLabel = mlData?.predictions?.[0]?.disease ?? null;
  const primaryDisease = resolvePrimaryDisease(topMlLabel);

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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
                Diseases: {loading ? "…" : primaryDisease.name}
              </h1>
              <p className="mt-4 text-gray-600 max-w-2xl">
                {primaryDisease.description}
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="h-64 w-64 rounded-full bg-[#E3F5FF] flex items-center justify-center overflow-hidden">
                <img
                  src={getSeverityImage(primaryDisease.severity)}
                  alt={`Severity: ${primaryDisease.severity}`}
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/images/mascot.png";
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-gray-700">
                Severity Level: <span className="font-semibold">{primaryDisease.severity}</span>
              </p>
            </div>
            <div className="h-2 rounded-full bg-gradient-to-r from-green-400 via-yellow-300 to-red-400 relative">
              <div
                className="absolute -top-1 h-4 w-4 rounded-full bg-white border border-gray-300 shadow-md"
                style={{
                  left:
                    primaryDisease.severity === "Mild"
                      ? "16%"
                      : primaryDisease.severity === "High"
                        ? "83%"
                        : "50%",
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <p className="mt-3 text-sm text-gray-600">{primaryDisease.summary}</p>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6 mb-6">
            <h3 className="text-lg font-semibold text-indigo-700 mb-3">
              3 Possible Diseases (model)
            </h3>
            {loading && (
              <p className="text-sm text-gray-600">Loading predictions…</p>
            )}
            {!loading && errorMessage && (
              <p className="text-sm text-red-700">{errorMessage}</p>
            )}
            {!loading && !errorMessage && mlData && mlData.predictions.length > 0 && (
              <ul className="space-y-2 text-gray-700">
                {mlData.predictions.map((item, index) => (
                  <li
                    key={`${item.disease}-${index}`}
                    className="flex items-center justify-between rounded-xl bg-white px-4 py-3 border border-indigo-100"
                  >
                    <span className="font-medium">
                      {index + 1}. {formatMlDiseaseLabel(item.disease)}
                    </span>
                    <span className="text-sm text-indigo-700">
                      {(item.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {!loading && !errorMessage && selectedSymptoms.length === 0 && (
              <p className="text-sm text-gray-600">No symptoms were submitted.</p>
            )}
            {mlData && mlData.matched_symptoms.length > 0 && (
              <p className="mt-3 text-xs text-gray-500">
                Matched to model: {mlData.matched_symptoms.join(", ").replace(/_/g, " ")}
              </p>
            )}
          </div>

          <h2 className="mt-8 mb-4 text-xl md:text-2xl font-semibold text-gray-800 text-center">
            Symptoms That Match Your Child&apos;s Condition
          </h2>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="rounded-3xl border border-blue-100 bg-[#E8F4FF] p-6">
              <h3 className="text-lg font-semibold text-[#0070C9] mb-3">
                Your child may experience:
              </h3>
              {primaryDisease.commonSymptoms.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {primaryDisease.commonSymptoms.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600 text-sm">
                  You selected: {selectedSymptoms.length > 0 ? selectedSymptoms.join(", ").replace(/_/g, " ") : "—"}
                </p>
              )}
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-[#FFF7D6] p-6">
              <h3 className="text-lg font-semibold text-[#C69400] mb-3">
                When to Seek Medical Care
              </h3>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {primaryDisease.seekCareWhen.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-purple-200 bg-[#F3E8FF] p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#7C3AED] mb-3">
              What You Should Do
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {primaryDisease.whatToDo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
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
