import type { IconType } from "react-icons";
import type { LucideIcon } from "lucide-react";

interface StepProps {
  number: number;
  title: string;
  description: string;
  Icon: IconType | LucideIcon; 
  isLeft: boolean;
}

const ProcessStep = ({ number, title, description, Icon, isLeft }: StepProps) => {
  return (
    <div className={`flex items-center justify-center w-full mb-16 last:mb-0 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
    
      <div className={`w-[60%] ${isLeft ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div className={`flex items-center gap-3 mb-2 ${isLeft ? 'justify-end' : 'justify-start'}`}>
             <span className="bg-[#3ba8df] text-white w-8 h-8 shrink-0 rounded-full flex items-center justify-center font-bold">
               {number}
             </span>
          <div className={`flex items-center gap-3 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
             <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          </div>
        </div>
        <p className="text-slate-500 text-sm leading-relaxed max-w-xs ml-auto mr-0">
          {description}
        </p>
      </div>

      <div className="w-[45%] flex justify-center relative">
        <div className=" z-10 p-2 rounded-full ">
          <Icon size={65} className="text-slate-700" />
        </div>
      </div>

      <div className="w-[45%]" />
    </div>
  );
};

export default ProcessStep;