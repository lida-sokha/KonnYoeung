import React from 'react';
import { FaFacebook, FaLinkedin } from 'react-icons/fa';
const AboutUsPage: React.FC = () => {
  return (
    <div className="w-full bg-white">

      {/* HERO SECTION */}
      <section className="bg-sky-300 py-20 text-center px-4">
        <h1 className="text-4xl font-bold">
          About <span className="text-white">Konn Yoeung</span>
        </h1>
        <p className="mt-4 text-blue-900 max-w-2xl mx-auto">
          A data-driven web platform empowering Cambodian parents
          with reliable child healthcare guidance
        </p>
      </section>

      {/* MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To empower Cambodian parents and caregivers with accessible,
            reliable, and age-specific child healthcare guidance. We aim to
            bridge the information gap, enabling informed decisions that lead
            to timely treatment and better health outcomes for every child.
          </p>
        </div>

       <div className="border-4 border-sky-400 flex items-center justify-center h-72">
            <img src="/images/goal.png" alt="Goal" className="w-full h-full object-contain" />
            </div>
      </section>

      {/* VISION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="border-4 border-sky-400 flex items-center justify-center h-72">
        <img src="/images/eye.png" alt="Vision" className="w-full h-full object-contain" />
        </div>


        <div>
          <h2 className="text-4xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the trusted, go-to digital platform for child health
            information in Cambodia. By providing immediate, accurate
            resources, we aim to reduce preventable health complications and
            foster a culture of proactive health awareness within families.
          </p>
        </div>
      </section>

      {/* TEAM TITLE */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-12">
        <div className="flex flex-col items-center text-center">
          {/* Main Title - Increased to 4xl for prominence */}
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Meet Our <span className="text-[#34AADC]">Team</span>
          </h2>
          
          {/* Brand Accent Bar */}
          <div className="h-1.5 w-20 bg-[#34AADC] mt-6 rounded-full" />
        </div>
      </section>

      {/* ADVISOR */}
     <section className="max-w-7xl mx-auto px-6">
          <div className="bg-sky-400 rounded-[32px] py-10 text-center shadow-lg shadow-sky-100 relative overflow-hidden group">
            
            {/* Subtle animated background circle for a premium feel */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-500" />
            
            <div className="relative z-10">
              {/* Font sizes now match the team cards: text-xl for name */}
              <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Ms. Kim Sokhey
              </h3>
              
              <div className="mt-2 inline-block px-4 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
                <p className="text-white text-xs font-bold uppercase tracking-[0.2em]">
                  Project Advisor
                </p>
              </div>
            </div>
          </div>
      </section>

      {/* TEAM MEMBERS */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {[
          {
            name: 'Khy Pichsreyvathanak',
            role: 'Data Scientist',
            img: 'https://res.cloudinary.com/dprsygcvh/image/upload/v1774689115/IMG_8092_xtief8.jpg',
            initial: 'KP'
          },
          {
            name: 'Phon Seaklang',
            role: 'Data Scientist',
            img:'https://res.cloudinary.com/dprsygcvh/image/upload/v1774689215/DSC_2852_copy_gybmcc.jpg',
            initial: 'PS'
          },
          {
            name: 'Chum Phalla',
            role: 'Data Scientist',
            img: 'https://res.cloudinary.com/dprsygcvh/image/upload/v1774688908/phalla_qautmn.png',
            initial: 'CP'
          },
          {
            name: 'Soeun Sokchetra',
            role: 'Data Scientist',
            img: 'https://res.cloudinary.com/dprsygcvh/image/upload/v1774689204/photo_2026-03-28_16-13-11_bvbecv.jpg',
            initial: 'SS'
            
           },
          {
            name: 'Sry Kimsour',
            role: 'Frontend Developer',
            img: 'https://res.cloudinary.com/dprsygcvh/image/upload/v1774689371/photo_2026-03-28_16-16-00_depcqx.jpg',
            initial: 'SK'
          },
          { 
            name: 'Sokha Lida', 
            role: 'Backend Developer', 
            img: "https://res.cloudinary.com/dprsygcvh/image/upload/c_thumb,g_face,w_1000,h_1000,f_auto/v1774583605/lida_rmiypq.jpg", 
            initial: 'SL',
            facebook:null,
            linkedin:'https://www.linkedin.com/in/sokha-lida-aa97552b9/'
          }
        ].map((member, index) => (
          <div
            key={index}
            className="group bg-white rounded-[32px] p-8 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-blue-200"
          >
            {/* Avatar Container */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Soft decorative glow behind the avatar */}
              <div className={`absolute inset-0 rounded-3xl blur-lg opacity-20 transition-opacity group-hover:opacity-40`} />
              
              {member.img ? (
                <img
                  src={typeof member.img === 'string' ? member.img : "https://via.placeholder.com/150"}
                  alt={member.name}
                  className="relative w-full h-full rounded-3xl object-cover shadow-md border-2 border-white"
                />
              ) : (
                <div className={`relative w-full h-full rounded-3xl flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                  {member.initial}
                </div>
              )}
            </div>

            {/* Name and Role */}
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#34AADC] transition-colors">
              {member.name}
            </h3>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
              {member.role}
            </p>

            {/* Social Links - Cleaned up */}
            <div className="flex justify-center gap-4 mt-8 pt-6 border-t border-gray-50">
              <a 
                href={member.facebook!} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-gray-50 text-[#34AADC] hover:bg-[#34AADC] hover:text-white transition-all duration-300 shadow-sm"
              >
                <FaFacebook size={20} />
              </a>
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-gray-50 text-[#34AADC] hover:bg-[#34AADC] hover:text-white transition-all duration-300 shadow-sm"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AboutUsPage;
