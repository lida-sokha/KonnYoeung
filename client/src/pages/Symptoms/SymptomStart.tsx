import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

const SymptomStart = () => {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-2xl mx-auto text-center">
        <Link
          to="/symptoms"
          className="inline-flex items-center text-sm text-[#34AADC] hover:underline mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Link>
        <h1 className="text-2xl font-semibold text-gray-800 mt-4">
          Symptom questionnaire
        </h1>
        <p className="mt-4 text-gray-600">
          The step-by-step symptom checker will go here. You can replace this page with your questionnaire flow.
        </p>
      </div>
    </DashboardLayout>
  );
};

export default SymptomStart;
