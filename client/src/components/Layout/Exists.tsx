import StatsGrid from "./Sections/StatsGrid";

const ExistsSection = () => {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-6 md:px-12 lg:px-20 w-full">
                {/* Section Heading */}
                <h1 className="text-2xl lg:text-4xl font-bold text-[#3ba8df] font-['Jockey_One'] mb-12">
                    Why KonnYoeung Exists
                </h1>

                {/* Main Content Wrapper: 2 Columns on Desktop, 1 on Mobile */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                    
                    {/* Left Side: Text Content */}
                    <div className="space-y-6 text-slate-700">
                        <p className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
                            Every parent wants to keep their child safe and healthy, but it's not always easy to know what symptoms mean or where to go for help.
                        </p>
                        <p className="text-md leading-relaxed">
                            In Cambodia, many parents face uncertainty and delayed care when their children fall ill. 
                            <span className="font-semibold text-[#3ba8df]"> KonnYoeung was created to change that</span> by providing parents with simple, reliable, and bilingual health guidance for children of all ages.
                        </p>
                        <p className="text-md leading-relaxed italic">
                            We believe every parent deserves access to trusted health information instantly, in their language, and completely free.
                        </p>
                    </div>

                    {/* Right Side: The Grid Component */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatsGrid 
                        title="Community for Change"
                        description="Built by youth who believe that small actions today can shape a healthier Cambodia tomorrow."
                        iconName="users"
                        />
                        <StatsGrid 
                        title="Trusted by Families Across Cambodia"
                        description="Providing reliable health guidance to parents in both Khmer and English."
                        iconName="heart"
                        />
                        <StatsGrid 
                        title="Free Access for All"
                        description="No cost, no barriers – just simple health information when you need it most."
                        iconName="dollar-sign"
                        />
                        <StatsGrid 
                        title="Empowering Parents"
                        description="Helping parents make informed decisions about their children's health."
                        iconName="shield"
                        />
                    </div>
                    
                </div>
            </div>
        </section>
    );
}

export default ExistsSection;