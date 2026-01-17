import { TbStethoscope, TbCheck, TbActivity, TbChartHistogram} from 'react-icons/tb';
import { BookOpen, Hospital } from 'lucide-react'; 
import { Link } from "react-router-dom";

// Define the valid icon names for better TypeScript support
type IconName = 'stethoscope'  | 'check' | 'activity' | 'book' | 'hospital-lu' | 'growth';

interface StatsGridProps {
  title: string;
  description: string;
  linkTo: string;
  iconName: IconName; 
  className?: string;
  iconColor?: string;
  iconBgColor?: string;
}

// The Mapping Object
const iconMap: Record<IconName, any> = {
  stethoscope: TbStethoscope,
  check: TbCheck,
  activity: TbActivity,
  book: BookOpen,
  growth: TbChartHistogram,
  'hospital-lu': Hospital,
};

const StartGrid = ({ 
  title, 
  description, 
  linkTo, 
  iconName, 
  className,
  iconColor = "text-green-500",
  iconBgColor = "bg-green-100"
}: StatsGridProps) => {
  
  // Select the icon based on the string passed
  const SelectedIcon = iconMap[iconName];

  return (
    <div className={`bg-white rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] p-8 flex flex-col transition-transform hover:scale-105 h-full ${className}`}>
      <div className={`w-16 h-16 ${iconBgColor} rounded-xl flex items-center justify-center shrink-0 mb-4`}>
        {SelectedIcon && <SelectedIcon className={`w-8 h-8 ${iconColor}`} />}
      </div>

      <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 text-md font-medium mb-6 flex-grow">{description}</p>

      <Link to={linkTo} className='text-[#3ba8df] font-bold flex items-center hover:underline group justify-center'>
        Learn More <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
      </Link>
    </div>
  );
};

export default StartGrid;