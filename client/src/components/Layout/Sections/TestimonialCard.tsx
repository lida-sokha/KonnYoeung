import { FaStar, FaUser } from "react-icons/fa";

interface TestimonialCardProps {
  name: string;
  location: string;
  description: string;
  rating: number;
}

const TestimonialCard = ({ name, location, description, rating }: TestimonialCardProps) => {
  return (
    <div className="bg-white rounded-2xl p-8 flex flex-col h-full border-2 border-slate-100 transition-all duration-300 hover:border-[#3ba8df] hover:scale-[1.02] text-left">
      
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-slate-200 rounded-full shrink-0 flex items-center justify-center">
          <FaUser className="text-slate-500 text-2xl" />
        </div>
        
        <div>
          <h4 className="text-lg font-bold text-slate-800 leading-tight">{name}</h4>
          <p className="text-sm text-slate-500">{location}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <FaStar 
            key={i} 
            className={i < rating ? "text-yellow-400" : "text-slate-200"} 
            size={18} 
          />
        ))}
      </div>

      <p className="text-slate-600 text-sm ">
        {description}
      </p>
    </div>
  );
};

export default TestimonialCard;