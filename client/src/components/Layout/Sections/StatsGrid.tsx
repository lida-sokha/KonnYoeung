import { 
  TbStethoscope, 
  TbActivity, 
  TbUsers, 
  TbHeart, 
  TbCoin, 
  TbShieldCheck ,
  TbSchool,
  TbWorld,
  TbAlarm,
} from 'react-icons/tb';
import { BookOpen, Hospital, BarChart3 } from 'lucide-react';
import { Link } from "react-router-dom";

// Added the new icon names to the type
export type IconName = 
  | 'stethoscope' | 'activity' | 'book' | 'hospital-lu' | 'growth'
  | 'people' | 'heart' | 'dollar-sign' | 'shield' | 'education' | 'world'| 'alarm';

interface StatsGridProps {
  title: string;
  description: string;
  iconName: IconName;
  linkTo?: string; // Made optional with '?'
  iconColor?: string;
  iconBgColor?: string;
  className?: string;
}

const iconMap: Record<IconName, any> = {
  stethoscope: TbStethoscope,
  activity: TbActivity,
  book: BookOpen,
  'hospital-lu': Hospital,
  growth: BarChart3,
  people: TbUsers,
  heart: TbHeart,
  'dollar-sign': TbCoin,
  shield: TbShieldCheck,
  education: TbSchool,
  'world': TbWorld,
  alarm: TbAlarm,
};

const StatsGrid = ({ 
  title, 
  description, 
  iconName, 
  linkTo, 
  iconColor = "text-[#3ba8df]", 
  iconBgColor = "bg-blue-50",
  className 
}: StatsGridProps) => {
  const SelectedIcon = iconMap[iconName] || TbStethoscope;

  return (
      <div className={`
        bg-white 
        rounded-2xl 
        p-6 
        flex 
        flex-col 
        h-full 
        border-2
        border-slate-100 
        transition-all 
        duration-300
        hover:border-[#3ba8df] 
        hover:scale-[1.02]
        ${className}
      `}>
      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shrink-0 mb-4`}>
        <SelectedIcon className={`w-6 h-6 ${iconColor}`} />
      </div>

      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-tight">{title}</h3>
      <p className="text-slate-500 text-xs font-medium leading-relaxed flex-grow">
        {description}
      </p>
      
      {linkTo && (
        <Link to={linkTo} className='text-[#3ba8df] text-sm font-bold mt-4 flex items-center hover:underline group'>
          Learn More <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
};

export default StatsGrid;