import { TbUserPlus, TbFilePlus, TbSearch, TbMapPin } from 'react-icons/tb';
import ProcessStep from './Sections/ProcessStep';
const steps = [
  {
    title: "Create Your Account",
    description: "Join KonnYoeung for free.",
    Icon: TbUserPlus,
  },
  {
    title: "Add Your Child's Info",
    description: "Age, gender, and province help personalize care suggestions.",
    Icon: TbFilePlus,
  },
  {
    title: "Check Symptoms or Explore Articles",
    description: "Receive reliable insights and local recommendations instantly.",
    Icon: TbSearch,
  },
  {
    title: "Find Nearby Hospitals",
    description: "Get suggestions for specialized care closest to you.",
    Icon: TbMapPin,
  },
];

const HowItWorks = () => {
  return (
   <section className="bg-white overflow-hidden"> 
      <div className="max-w-5xl mx-auto px-6 py-5 sm:py-20">
       
        
        <div className="relative">
          <div className="absolute left-1/2 -top-12 -bottom-12 w-[2px] bg-[#3ba8df] -translate-x-1/2">
            <div className="absolute -top-1 -left-[4px] w-2.5 h-2.5 bg-[#3ba8df] rounded-full shadow-[0_0_8px_#3ba8df]" />
            <div className="absolute -bottom-1 -left-[4px] w-2.5 h-2.5 bg-[#3ba8df] rounded-full shadow-[0_0_8px_#3ba8df]" />
          </div>

          <div className="relative z-10">
            {steps.map((step, index) => (
              <ProcessStep
                key={index}
                number={index + 1}
                title={step.title}
                description={step.description}
                Icon={step.Icon}
                isLeft={index % 2 === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;