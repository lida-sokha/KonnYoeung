import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import API from "../services/api";

export interface Disease {
  id?: string;
  name: string;
  category: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
  description: string;
  severity: string;
  severityLevel?: string;
  summary: string;
  commonSymptoms: string[];
  symptoms?: string[];
  seekCareWhen: string[];
  whenToSeek?: string[];
  whatToDo: string[];
}

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
  const [diseases, setDiseases] = useState<Disease[]>([]);

  useEffect(() => {
    API.get<Disease[]>('/diseases')
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setDiseases(
            res.data.map((d) => ({
              ...d,
              id: String((d as any)._id ?? d.id ?? d.name ?? ''),
              category: d.category ?? d.type ?? '',
              severity: d.severity ?? d.severityLevel ?? 'Moderate',
              commonSymptoms: d.commonSymptoms ?? d.symptoms ?? [],
              seekCareWhen: d.seekCareWhen ?? d.whenToSeek ?? [],
              summary: d.summary ?? '',
              whatToDo: d.whatToDo ?? [],
              createdAt: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : '',
              updatedAt: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : '',
            }))
          );
        }
      })
      .catch((err) => {
        console.warn('Could not load diseases from API; no fixed fallback is used.', err?.message || err);
        setDiseases([]);
      });
  }, []);

  const getDiseaseById = useCallback(
    (id: string) =>
      diseases.find(
        (d) =>
          d.id === id ||
          d.name?.toLowerCase() === id.toLowerCase() ||
          d.name?.toLowerCase().replace(/\s+/g, '_') === id.toLowerCase() ||
          d.name?.toLowerCase().replace(/\s+/g, '-') === id.toLowerCase()
      ) ?? null,
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