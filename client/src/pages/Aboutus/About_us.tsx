import React from 'react';

const AboutUsPage: React.FC = () => {
  return (
    <div className="w-full bg-white">

      {/* HERO SECTION */}
      <section className="bg-sky-100 py-20 text-center px-4">
        <h1 className="text-4xl font-bold">
          About <span className="text-sky-500">Konn Yoeung</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          A data-driven web platform empowering Cambodian parents
          with reliable child healthcare guidance
        </p>
      </section>

      {/* MISSION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To empower Cambodian parents and caregivers with accessible,
            reliable, and age-specific child healthcare guidance. We aim to
            bridge the information gap, enabling informed decisions that lead
            to timely treatment and better health outcomes for every child.
          </p>
        </div>

       <div className="border-4 border-sky-400 flex items-center justify-center h-72">
            <span className="text-[140px] leading-none">🎯</span>
            </div>

      </section>

      {/* VISION SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div className="border-4 border-sky-400 flex items-center justify-center h-72">
        <span className="text-[140px] leading-none">👁️</span>
        </div>


        <div>
          <h2 className="text-3xl font-bold mb-4">Our Vision</h2>
          <p className="text-gray-600 leading-relaxed">
            To be the trusted, go-to digital platform for child health
            information in Cambodia. By providing immediate, accurate
            resources, we aim to reduce preventable health complications and
            foster a culture of proactive health awareness within families.
          </p>
        </div>
      </section>

      {/* TEAM TITLE */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-bold text-sky-500">Meet Our Team</h2>
      </section>

      {/* ADVISOR */}
      <section className="max-w-4xl mx-auto px-6">
        <div className="bg-sky-400 text-white rounded-xl py-6 text-center font-semibold text-lg">
          Ms. Kim Sokhey
          <div className="text-sm font-normal mt-1">Project Advisor</div>
        </div>
      </section>

      {/* TEAM MEMBERS */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {[
          { name: 'Khy Pichsreyvathanak', role: 'Data Analysis', color: 'bg-sky-400' },
          { name: 'Phon Seaklang', role: 'Data Visualization', color: 'bg-green-400' },
          { name: 'Chum Phalla', role: 'Data Collection', color: 'bg-red-500' },
          { name: 'Soeun Sokchetra', role: 'Data Collection', color: 'bg-yellow-400' },
          { name: 'Sry Kimsour', role: 'UX/UI Design', img: true },
          { name: 'Sokha Lida', role: 'System Architecture Design', img: true }
        ].map((member, index) => (
          <div
            key={index}
            className="border-2 border-sky-400 rounded-xl p-6 text-center"
          >
            {member.img ? (
              <img
                src="https://via.placeholder.com/80"
                alt={member.name}
                className="w-20 h-20 rounded-full mx-auto mb-4"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-full mx-auto mb-4 ${member.color}`}
              />
            )}

            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sky-500 text-sm mt-1">{member.role}</p>

            <div className="flex justify-center gap-4 mt-3 text-gray-500">
              <span>f</span>
              <span>in</span>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AboutUsPage;
