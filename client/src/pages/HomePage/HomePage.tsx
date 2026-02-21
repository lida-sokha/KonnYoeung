import { TbStethoscope, TbBuildingHospital, TbCheck, } from 'react-icons/tb';
import Button from '../../components/ui/Button';
import StartGrid from '../../components/Layout/Sections/StatsGrid';
import TrustedGrid from '../../components/Layout/Sections/TrustedDataGrid';
import ProcessSection from '../../components/Layout/Sections/ProcessSection';
import ExistsSection from '../../components/Layout/Exists';
import ParentSaidSection from '../../components/Layout/Parentsaid';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const handleNavigation = () => {
  // 1. Check if token exists in localStorage
  const token = localStorage.getItem("token"); 

  if (token) {
    // User is verified/logged in
    navigate("/dashboard");
  } else {
    // User is not verified
    navigate("/login"); // or "/verify"
  }
  };
  
  const navigate = useNavigate();
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-white to-blue-50/30 flex flex-col">
      
      <div className="relative flex-grow flex items-center py-12 md:py-0 min-h-[500px]">
        <div 
          className="hidden md:block absolute inset-y-0 right-0 w-1/2 z-0"
          style={{
            backgroundImage: "url('/images/landing_page_bg.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right center',
            backgroundSize: 'contain',
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="w-full max-w-2xl space-y-6 md:space-y-8">
            <h1 className="text-4xl sm:text-3xl md:text-3xl lg:text-5xl font-extrabold text-slate-900 leading-tight font-['Jockey_One']">
              Smart Parenting Starts <br className="hidden sm:block" />
              with <span className="text-[#3ba8df]">KonnYoeung</span>
            </h1>
            
            <p className=" text-base sm:text-md md:text-md leading-relaxed max-w-lg">
              Your trusted digital partner for children's health in Cambodia.
              Check your child's symptoms, learn about common diseases, and
              find nearby hospitals—all in one safe and easy-to-use platform.
            </p>

            <div className="pt-2 sm:pt-4">
              <Button
                text='Get Started Now'
                onClick={handleNavigation}
                />
            </div>

            <div className="md:hidden w-full max-w-md mx-auto pt-8">
              <img 
                src="/images/landing_page_bg.png" 
                alt="KonnyYoeung illustration" 
                className="w-full h-auto"
              />
            </div>
          </div>
        </div> 
      </div>

      <div className="w-full bg-white flex justify-center items-center py-10 md:py-16">
      <div className="w-full border-t border-b border-gray-500 relative px-6 md:px-12 lg:px-20 justify-center items-center flex">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 ">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-5 group p-2 rounded-xl transition-all">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <TbStethoscope className="w-8 h-8 text-[#3ba8df]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 ">30+ Diseases</h3>
              <p className="text-sm text-slate-600 leading-tight">Comprehensive childhood illness information</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-5 group p-2 rounded-xl transition-all">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <TbBuildingHospital className="w-8 h-8 text-[#3ba8df]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl  font-bold text-slate-900 ">50+ Hospitals</h3>
              <p className="text-sm text-slate-600 leading-tight">Trusted partner medical facilities</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-5 group p-2 rounded-xl transition-all sm:col-span-2 md:col-span-1">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
              <TbCheck className="w-8 h-8 text-[#3ba8df]" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900 ">Always Free</h3>
              <p className="text-sm text-slate-600 leading-tight">Available 24/7 for every parent</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    {/* Trusted by Families Across Cambodia */}
    <div className='flex justify-center items-center py-5 md:py-10 bg-white flex flex-col space-y-3 px-6 text-center '>

        <h1 className="text-2xl sm:text-md md:text-2xl lg:text-4xl font-bold text-[#3ba8df] font-['Jockey_One'] ">Trusted by Families Across Cambodia</h1>
        <p className='text-md sm:text-md md:text-md leading-relaxed max-w-lg'>Join a Growing Community of Smart Parents, where you could find peace of mind with reliable health information for your children</p>

        <div className='grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mt-8 w-full px-20 py-4'>

            <TrustedGrid 
                title="1500 +"
                description="Total Users"
                content="Parents already using KonnYoeung"
            />
            <TrustedGrid
                title="50 +"
                description="Hospitals"
                content="Ready to provide care when needed"
            />
            
            <TrustedGrid
                title="30 +"
                description="Childhood Diseases"
                content="Covered over 30 childhood diseases"
            />
        </div>
    </div>

{/* Everything you need */}
       <div id="features-section" className='flex justify-center items-center py-5 md:py-20 bg-white flex flex-col space-y-3 px-6'>

        <h1 className="text-2xl sm:text-md md:text-2xl lg:text-4xl font-bold text-[#3ba8df] font-['Jockey_One'] ">Everything You Need in One Place</h1>
        <p className='text-md sm:text-md md:text-md leading-relaxed max-w-lg text-center'>Comprehensive tools and resources to help you care for your child’s health with confidence.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-20">
             
              <StartGrid 
                iconName="activity" 
                title="Check Symptoms Easily"
                description="Answer simple questions about your child’s symptoms. Get a list of possible conditions, home care tips, and advice on whether to visit a clinic or hospital."
                linkTo="/health"
                iconBgColor='bg-green-100'
                iconColor='text-green-500'
              />
              <StartGrid
              iconName="book"
                title="Learn About Common Diseases"
                description='Explore educational articles written to help parents understand common childhood illnesses, how to prevent them, and when to seek care.'
                linkTo="/diseases"
                iconBgColor='bg-red-100'
                iconColor='text-red-500'
              />
              <StartGrid
              iconName="hospital-lu"
                title="Find the Right Hospital"
                description='Discover hospitals and clinics near you that specialize in child healthcare, no matter which province you live in.'
                linkTo="/hospitals"
                iconBgColor='bg-blue-100'
                iconColor='text-blue-500'
              />
              <StartGrid
              iconName="growth"
                title="Read and Grow With Us"
                description='Access a growing library of trusted child-health articles in both Khmer and English, designed to help parents make informed and confident decisions.'
                linkTo="/articles"
                iconBgColor='bg-yellow-100'
                iconColor='text-yellow-500'
              />
        </div>
      </div>
      <ProcessSection />
      <ExistsSection />
      <ParentSaidSection />
    </div>
  );
}