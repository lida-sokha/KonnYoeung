import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

const diseaseContent = {
  allergy: {
    name: "Allergy",
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
} as const;

const DiseaseDetail = () => {
  const { id } = useParams<{ id: string }>();

  const disease =
    (id && (diseaseContent as Record<string, (typeof diseaseContent)[keyof typeof diseaseContent]>)[id]) ??
    null;

  if (!disease) {
    return (
      <DashboardLayout>
        <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-5xl mx-auto">
          <Link
            to="/admin/diseases"
            className="inline-flex items-center text-sm text-[#34AADC] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Manage Diseases
          </Link>
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-800">
              Disease not found
            </h1>
            <p className="mt-2 text-gray-600">
              The requested disease could not be found. Please go back to the
              list and try again.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/admin/diseases"
            className="inline-flex items-center text-sm text-[#34AADC] hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
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
              <div className="h-32 w-32 rounded-full bg-[#E3F5FF] flex items-center justify-center">
                <img
                  src="/images/mascot.png"
                  alt="Mascot"
                  className="h-24 w-24 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
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
              <div className="absolute -top-1 h-4 w-4 rounded-full bg-white border border-gray-300 shadow-md left-1/2 -translate-x-1/2" />
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
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {disease.commonSymptoms.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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

export default DiseaseDetail;

