import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

const TOTAL_STEPS = 7;

type SymptomOption = { key: string; label: string };
type SymptomGroup = { title: string; subtitle: string; symptoms: SymptomOption[] };

const SYMPTOM_GROUPS: SymptomGroup[] = [
  {
    title: "Group 1: Respiratory",
    subtitle: "(Breathing & Airways)",
    symptoms: [
      { key: "sore_throat", label: "Sore throat" },
      { key: "nasal_congestion", label: "Nasal congestion" },
      { key: "wheezing", label: "Wheezing" },
      { key: "cough", label: "Cough" },
      { key: "mucus_in_throat", label: "Mucus in throat" },
      { key: "shortness_of_breath", label: "Shortness of breath" },
    ],
  },
  {
    title: "Group 2: General & Systemic",
    subtitle: "(Whole-body condition)",
    symptoms: [
      { key: "fever", label: "Fever" },
      { key: "weakness", label: "Weakness" },
      { key: "headache", label: "Headache" },
      { key: "joint_pain", label: "Joint pain" },
      { key: "feel_cold", label: "Feel cold" },
    ],
  },
  {
    title: "Group 3: Gastrointestinal",
    subtitle: "(Digestive system)",
    symptoms: [
      { key: "vomiting", label: "Vomiting" },
      { key: "nausea", label: "Nausea" },
      { key: "constipation", label: "Constipation" },
      { key: "weight_loss", label: "Weight loss" },
    ],
  },
  {
    title: "Group 4: Skin & Allergy",
    subtitle: "(External / immune reactions)",
    symptoms: [
      { key: "rash", label: "Rash" },
      { key: "itching_skin", label: "Itching skin" },
      { key: "skin_swelling", label: "Skin swelling" },
      { key: "skin_abnormality", label: "Skin abnormality" },
      { key: "lip_swelling", label: "Lip swelling" },
      { key: "red_eyes", label: "Red eyes" },
    ],
  },
  {
    title: "Group 5: Liver & Urinary Indicators",
    subtitle: "(Internal organ signals)",
    symptoms: [
      { key: "yellow_skin", label: "Yellow skin" },
      { key: "yellow_eyes", label: "Yellow eyes" },
      { key: "dark_urine", label: "Dark urine" },
      { key: "chest_pain", label: "Chest pain" },
    ],
  },
];

const PROVINCES = [
  "Select One",
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
  "Other"
];

const SymptomStart = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [province, setProvince] = useState("");
  const [ageCategory, setAgeCategory] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [provinceDropdownOpen, setProvinceDropdownOpen] = useState(false);

  const progressPercent = (step / TOTAL_STEPS) * 100;
  const currentGroupIndex = step - 3;
  const currentGroup =
    currentGroupIndex >= 0 && currentGroupIndex < SYMPTOM_GROUPS.length
      ? SYMPTOM_GROUPS[currentGroupIndex]
      : null;

  const toggleSymptom = (key: string) => {
    setSelectedSymptoms((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleNext = () => {
    if (step === 7) {
      navigate("/symptoms/result", {
        state: {
          gender,
          province,
          ageCategory,
          selectedSymptoms: Array.from(selectedSymptoms),
        },
      });
      return;
    }
    if (step < TOTAL_STEPS) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleProvinceSelect = (value: string) => {
    setProvince(value);
    setProvinceDropdownOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-2xl mx-auto">
        <div className="relative mb-8 flex min-h-[2.75rem] items-center justify-center">
          <Link
            to="/symptoms"
            className="absolute left-0 top-1/2 inline-flex -translate-y-1/2 items-center text-sm text-[#34AADC] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4 shrink-0" />
            Back
          </Link>
          <h1 className="text-center text-2xl font-bold text-gray-800 md:text-3xl">
            Check Symptom
          </h1>
        </div>

        {/* Step 1: Gender + Province */}
        {step === 1 && (
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-gray-800 font-medium mb-3">
                Please select your child&apos;s gender from birth.
              </p>
              <div className="space-y-3">
                {(["male", "female"] as const).map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                      gender === opt
                        ? "border-[#34AADC] bg-[#34AADC]/5"
                        : "border-[#34AADC]/40 bg-white hover:border-[#34AADC]/70"
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={opt}
                      checked={gender === opt}
                      onChange={() => setGender(opt)}
                      className="sr-only"
                    />
                    <span
                      className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                        gender === opt ? "border-[#34AADC] bg-[#34AADC]" : "border-[#34AADC]/60"
                      }`}
                    >
                      {gender === opt && (
                        <span className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="capitalize text-gray-800">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="text-gray-800 font-medium mb-3">
                Please select your province.
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProvinceDropdownOpen(!provinceDropdownOpen)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-[#34AADC]/40 bg-white text-left text-gray-700"
                >
                  <span>{province || "Select One"}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      provinceDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {provinceDropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 py-1 rounded-2xl border-2 border-[#34AADC]/40 bg-white shadow-lg max-h-60 overflow-auto">
                    {PROVINCES.map((p) => (
                      <li key={p}>
                        <button
                          type="button"
                          onClick={() => handleProvinceSelect(p)}
                          className={`w-full px-4 py-3 text-left hover:bg-[#34AADC]/10 ${
                            province === p ? "bg-[#34AADC]/10" : ""
                          }`}
                        >
                          {p}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Why this question was Ask?
              </p>
              <p className="text-sm text-gray-600">
                Demographic information such as gender and province is collected to enhance the
                accuracy of symptom assessment. Gender differences may influence disease
                prevalence, while geographic location supports region-specific risk
                consideration and healthcare facility recommendations.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Age category */}
        {step === 2 && (
          <div className="mt-8 space-y-6">
            <p className="text-gray-800 font-medium text-center">
              Please select your child&apos;s age category.
            </p>
            <div className="space-y-3">
              {[
                "Less than 1 year",
                "1 to 5 years",
                "5 to 18 years",
              ].map((opt) => (
                <label
                  key={opt}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    ageCategory === opt
                      ? "border-[#34AADC] bg-[#34AADC]/5"
                      : "border-[#34AADC]/40 bg-white hover:border-[#34AADC]/70"
                  }`}
                >
                  <input
                    type="radio"
                    name="ageCategory"
                    value={opt}
                    checked={ageCategory === opt}
                    onChange={() => setAgeCategory(opt)}
                    className="sr-only"
                  />
                  <span
                    className={`h-5 w-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      ageCategory === opt ? "border-[#34AADC] bg-[#34AADC]" : "border-[#34AADC]/60"
                    }`}
                  >
                    {ageCategory === opt && (
                      <span className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-gray-800">{opt}</span>
                </label>
              ))}
            </div>

            <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Why this question was Ask?
              </p>
              <p className="text-sm text-gray-600">
                A child&apos;s age plays a key role in understanding health conditions. Some
                illnesses are more common at certain ages, and the same symptom may have
                different meanings depending on a child&apos;s age. Knowing the age group helps
                us provide more appropriate guidance and safety recommendations.
              </p>
            </div>
          </div>
        )}

        {/* Step 3-7: Category-based symptom checkboxes */}
        {step >= 3 && step <= 7 && currentGroup && (
          <div className="mt-8 space-y-6">
            <div className="text-center">
              <p className="text-gray-800 font-medium">
                {currentGroup.title}
              </p>
              <p className="text-sm text-gray-600 mt-1">{currentGroup.subtitle}</p>
              <p className="text-sm text-gray-500 mt-3">
                Select symptoms for this category.
              </p>
            </div>
            <div className="space-y-3">
              {currentGroup.symptoms.map(({ key, label }) => (
                <label
                  key={key}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                    selectedSymptoms.has(key)
                      ? "border-[#34AADC] bg-[#34AADC]/5"
                      : "border-[#34AADC]/40 bg-white hover:border-[#34AADC]/70"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.has(key)}
                    onChange={() => toggleSymptom(key)}
                    className="sr-only"
                  />
                  <span
                    className={`h-5 w-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedSymptoms.has(key) ? "border-[#34AADC] bg-[#34AADC]" : "border-[#34AADC]/60"
                    }`}
                  >
                    {selectedSymptoms.has(key) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  <span className="text-gray-800">{label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-10">
          <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step circles + navigation */}
        <div className="mt-6 flex items-center justify-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handlePrev}
            disabled={step === 1}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34AADC] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2690c2] transition-colors"
            aria-label="Previous step"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s)}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step === s
                  ? "bg-[#34AADC] text-white"
                  : "border-2 border-[#34AADC]/50 text-[#34AADC] bg-white hover:border-[#34AADC]"
              }`}
            >
              {s}
            </button>
          ))}
          <button
            type="button"
            onClick={handleNext}
            disabled={step === 7 && selectedSymptoms.size === 0}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#34AADC] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#2690c2] transition-colors"
            aria-label={step === 7 ? "See results" : "Next step"}
            title={step === 7 ? "See results" : undefined}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SymptomStart;
