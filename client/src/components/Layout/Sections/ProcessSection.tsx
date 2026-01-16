import HowItWorks from '../HowItWorks';

const ProcessSection = () => {
  return (
    <section className="bg-white ">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 flex justify-center items-center flex-col space-y-4 text-center mb-10">
        <h2 className="text-4xl font-bold text-[#3ba8df]  md:mb-5 font-['Jockey_One']">
          How It Works
        </h2>
        <p className="text-md sm:text-md md:text-md leading-relaxed max-w-lg">
          Learn how our platform works step by step
        </p>
      </div>

      <HowItWorks />
    </section>
  );
};

export default ProcessSection;