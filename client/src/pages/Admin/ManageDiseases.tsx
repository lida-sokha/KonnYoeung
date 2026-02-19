import { Link } from "react-router-dom";
import { Edit2 } from "lucide-react";
import DashboardLayout from "../../components/Layout/Sections/DashboardLayout";

interface DiseaseRow {
  id: string;
  name: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

const diseases: DiseaseRow[] = [
  {
    id: "allergy",
    name: "Allergy",
    category: "Infectious Disease",
    createdAt: "Nov 1, 2025",
    updatedAt: "Dec 1, 2025",
  },
  {
    id: "malaria",
    name: "Malaria",
    category: "Infectious Disease",
    createdAt: "Oct 20, 2025",
    updatedAt: "Nov 28, 2025",
  },
  {
    id: "hypertension",
    name: "Hypertension",
    category: "Cardiovascular",
    createdAt: "Jan 2, 2025",
    updatedAt: "Nov 25, 2025",
  },
  {
    id: "type-2-diabetes",
    name: "Type 2 Diabetes",
    category: "Metabolic",
    createdAt: "Oct 25, 2025",
    updatedAt: "Nov 20, 2025",
  },
  {
    id: "tuberculosis",
    name: "Tuberculosis",
    category: "Infectious Disease",
    createdAt: "Oct 20, 2025",
    updatedAt: "Nov 15, 2025",
  },
];

const ManageDiseases = () => {
  return (
    <DashboardLayout>
      <div className="px-4 sm:px-6 lg:px-10 py-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
            Manage Diseases
          </h1>
          <p className="mt-2 text-gray-500">
            View and edit disease information
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Disease Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Create
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {diseases.map((disease) => (
                  <tr
                    key={disease.id}
                    className="hover:bg-blue-50/40 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {disease.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {disease.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {disease.createdAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {disease.updatedAt}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        type="button"
                        className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:border-blue-400 hover:text-blue-600"
                      >
                        <Edit2 className="mr-1.5 h-4 w-4" />
                        Edit
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right text-sm">
                      <Link
                        to={`/admin/diseases/${disease.id}`}
                        className="inline-flex items-center rounded-full bg-[#34AADC] px-4 py-1.5 text-xs font-semibold text-white shadow hover:bg-[#2690c2] transition-colors"
                      >
                        View More
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageDiseases;

