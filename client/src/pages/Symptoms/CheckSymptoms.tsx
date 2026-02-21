import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

const STEPS = [
  "Identify possible health conditions",
  "Know when to seek medical care",
  "Designed for parents and caregivers",
];

const CheckSymptoms = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          Check Your Child&apos;s Symptoms
        </h1>
        <p className="mt-2 text-gray-500 text-lg">
          Get guidance on possible conditions and next steps
        </p>

        <p className="mt-6 text-gray-600">
          Answer a few simple questions to understand what may be affecting your child.
          Quick, easy, and takes about 3 minutes.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">
          <div className="flex flex-col items-center md:items-start justify-start w-full md:-mt-8">
            <img
              src="/images/check_symptom_welcome.png"
              alt="Symptom check - friendly character with magnifying glass and heart"
              className="w-full max-w-sm h-auto object-contain object-top"
            />
          </div>

          <div className="flex flex-col justify-center space-y-4 w-full md:pt-16">
            {STEPS.map((label, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl bg-[#34AADC] px-5 py-4 text-white shadow-sm"
              >
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white text-[#34AADC] font-bold">
                  {i + 1}
                </span>
                <span className="font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 md:p-5">
          <h2 className="font-bold text-gray-800">Important Notice</h2>
          <p className="mt-1 text-sm text-gray-700">
            This tool does not provide a medical diagnosis and should not replace
            professional medical advice.
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/symptoms/start")}
            className="rounded-2xl bg-[#34AADC] px-8 py-3.5 text-white font-semibold shadow-md hover:bg-[#2690c2] transition-colors"
          >
            Start Checking Symptoms
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CheckSymptoms;
