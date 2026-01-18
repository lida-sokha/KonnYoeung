import TestimonialCard from "../Layout/Sections/TestimonialCard";

const testimonials = [
  {
    name: "Sokchetra Soeun",
    location: "Takeo",
    rating: 4,
    description: "As a first-time mother, I often worry about every little cough. KonnYoeung’s symptom checker is so easy to use and gave me clear guidance on whether I should stay home or see a doctor. It’s like having a digital nurse available 24/7."
  },
  {
    name: "Seaklang Phon",
    location: "Siem Reap",
    rating: 5,
    description: "When we moved to a new province, we didn't know which hospitals were best for kids. This platform helped us find a trusted pediatric clinic nearby in minutes. The bilingual support is a lifesaver for our family!"
  },
  {
    name: "Phalla Chum",
    location: "Siem Reap",
    rating: 4,
    description: "I love reading the health articles on KonnYoeung. The information is reliable and specifically tailored for Cambodian parents. It has helped me feel much more confident in managing my children's health at home."
  }
];

const ParentSaidSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-5xl font-bold text-[#3ba8df] font-['Jockey_One'] mb-4">
          What Parents Are Saying
        </h2>
        
        <p className="text-md sm:text-md md:text-md leading-relaxed max-w-lg justify-center mx-auto mb-12">
          Real stories from parents who trust KonnYoeung for their children's health
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <TestimonialCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentSaidSection;