import { Link, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";
import { initialDiseases, type Disease } from "../../contexts/DiseaseContext";

const SYMPTOM_KEYWORDS: Record<string, string[]> = {
  cough: ["cough"],
  fever: ["fever"],
  headache: ["headache", "head"],
  joint_pain: ["joint", "pain"],
  nausea: ["nausea"],
  rash: ["rash", "itching"],
  vomiting: ["vomit"],
  weakness: ["weakness", "fatigue"],
  weight_loss: ["weight", "loss"],
  yellow_eyes: ["yellow", "eyes", "jaundice"],
};

function matchDisease(selectedSymptoms: string[]): Disease | null {
  if (selectedSymptoms.length === 0) return null;
  let best: { disease: Disease; score: number } | null = null;
  for (const disease of initialDiseases) {
    const symptomText = disease.commonSymptoms.join(" ").toLowerCase();
    let score = 0;
    for (const key of selectedSymptoms) {
      const keywords = SYMPTOM_KEYWORDS[key];
      if (!keywords) continue;
      if (keywords.some((kw) => symptomText.includes(kw))) score += 1;
    }
    if (score > 0 && (!best || score > best.score)) {
      best = { disease, score };
    }
  }
  return best ? best.disease : null;
}

const SEVERITY_IMAGES: Record<string, string> = {
  Mild: "/images/low_severity.png",
  Low: "/images/low_severity.png",
  Moderate: "/images/moderate_severity.png",
  High: "/images/high_severity.png",
};

function getSeverityImage(severity: string): string {
  return SEVERITY_IMAGES[severity] ?? "/images/moderate_severity.png";
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

const SymptomResult = () => {
  const location = useLocation();
  const state = location.state as {
    selectedSymptoms?: string[];
    gender?: string;
    province?: string;
    ageCategory?: string;
  } | null;
  const selectedSymptoms = Array.isArray(state?.selectedSymptoms) ? state.selectedSymptoms : [];
  const disease = matchDisease(selectedSymptoms) ?? FALLBACK_DISEASE;

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
                Diseases: {disease.name}
              </h1>
              <p className="mt-4 text-gray-600 max-w-2xl">
                {disease.description}
              </p>
            </div>

            <div className="flex items-center justify-center md:justify-end">
              <div className="h-64 w-64 rounded-full bg-[#E3F5FF] flex items-center justify-center overflow-hidden">
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

          <div className="mb-6">
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

          <h2 className="mt-8 mb-4 text-xl md:text-2xl font-semibold text-gray-800 text-center">
            Symptoms That Match Your Child&apos;s Condition
          </h2>

          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <div className="rounded-3xl border border-blue-100 bg-[#E8F4FF] p-6">
              <h3 className="text-lg font-semibold text-[#0070C9] mb-3">
                Your child may experience:
              </h3>
              {disease.commonSymptoms.length > 0 ? (
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {disease.commonSymptoms.map((item) => (
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
                {disease.seekCareWhen.map((item) => (
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
              {disease.whatToDo.map((item) => (
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
