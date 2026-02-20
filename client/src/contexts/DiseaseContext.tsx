import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface Disease {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  severity: string;
  summary: string;
  commonSymptoms: string[];
  seekCareWhen: string[];
  whatToDo: string[];
}

const initialDiseases: Disease[] = [
  {
    id: "allergy",
    name: "Allergy",
    category: "Infectious Disease",
    createdAt: "Nov 1, 2025",
    updatedAt: "Dec 1, 2025",
    description:
      "Allergies occur when the body reacts to substances such as dust, pollen, food, or animal fur. In children, allergies often affect the skin, nose, eyes, or breathing and are usually not serious, but they can be uncomfortable.",
    severity: "Moderate",
    summary:
      "Most mild allergies can be managed at home, but symptoms should be monitored.",
    commonSymptoms: [
      "Sneezing or runny nose",
      "Itchy or watery eyes",
      "Skin rash or itching",
      "Mild cough or throat irritation",
    ],
    seekCareWhen: [
      "Symptoms become severe or persistent",
      "Breathing difficulty occurs",
      "Swelling of the face, lips, or tongue appears",
    ],
    whatToDo: [
      "Try to identify and avoid possible triggers (dust, pollen, certain foods)",
      "Keep your child's environment clean and well-ventilated",
      "Ensure your child gets enough rest and fluids",
      "Monitor symptoms over time",
    ],
  },
  {
    id: "malaria",
    name: "Malaria",
    category: "Infectious Disease",
    createdAt: "Oct 20, 2025",
    updatedAt: "Nov 28, 2025",
    description: "Malaria is a mosquito-borne infectious disease.",
    severity: "High",
    summary: "Requires prompt medical treatment.",
    commonSymptoms: ["Fever", "Chills", "Sweating", "Headache"],
    seekCareWhen: ["High fever", "Severe chills", "Confusion"],
    whatToDo: ["Seek medical care", "Prevent mosquito bites"],
  },
  {
    id: "hypertension",
    name: "Hypertension",
    category: "Cardiovascular",
    createdAt: "Jan 2, 2025",
    updatedAt: "Nov 25, 2025",
    description: "High blood pressure condition.",
    severity: "Moderate",
    summary: "Manage with lifestyle and medication.",
    commonSymptoms: ["Often no symptoms", "Headaches", "Dizziness"],
    seekCareWhen: ["Severe headache", "Chest pain", "Shortness of breath"],
    whatToDo: ["Monitor blood pressure", "Reduce salt intake", "Exercise regularly"],
  },
  {
    id: "type-2-diabetes",
    name: "Type 2 Diabetes",
    category: "Metabolic",
    createdAt: "Oct 25, 2025",
    updatedAt: "Nov 20, 2025",
    description: "Chronic condition affecting blood sugar regulation.",
    severity: "Moderate",
    summary: "Lifestyle and medication can help manage it.",
    commonSymptoms: ["Increased thirst", "Frequent urination", "Fatigue"],
    seekCareWhen: ["Very high or low blood sugar", "Confusion", "Fainting"],
    whatToDo: ["Follow diet plan", "Take medication as prescribed", "Monitor blood sugar"],
  },
  {
    id: "tuberculosis",
    name: "Tuberculosis",
    category: "Infectious Disease",
    createdAt: "Oct 20, 2025",
    updatedAt: "Nov 15, 2025",
    description: "Bacterial infection mainly affecting the lungs.",
    severity: "High",
    summary: "Requires long-term treatment.",
    commonSymptoms: ["Cough", "Fever", "Weight loss", "Night sweats"],
    seekCareWhen: ["Coughing blood", "Severe chest pain", "Difficulty breathing"],
    whatToDo: ["Complete full course of treatment", "Avoid spreading to others"],
  },
];

type DiseaseContextValue = {
  diseases: Disease[];
  getDiseaseById: (id: string) => Disease | null;
  updateDisease: (id: string, data: Partial<Omit<Disease, "id" | "createdAt">>) => void;
};

const DiseaseContext = createContext<DiseaseContextValue | null>(null);

const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export function DiseaseProvider({ children }: { children: ReactNode }) {
  const [diseases, setDiseases] = useState<Disease[]>(initialDiseases);

  const getDiseaseById = useCallback(
    (id: string) => diseases.find((d) => d.id === id) ?? null,
    [diseases]
  );

  const updateDisease = useCallback(
    (id: string, data: Partial<Omit<Disease, "id" | "createdAt">>) => {
      setDiseases((prev) =>
        prev.map((d) =>
          d.id === id
            ? { ...d, ...data, updatedAt: formatDate() }
            : d
        )
      );
    },
    []
  );

  return (
    <DiseaseContext.Provider value={{ diseases, getDiseaseById, updateDisease }}>
      {children}
    </DiseaseContext.Provider>
  );
}

export function useDiseases() {
  const ctx = useContext(DiseaseContext);
  if (!ctx) throw new Error("useDiseases must be used within DiseaseProvider");
  return ctx;
}
