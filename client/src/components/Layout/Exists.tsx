import StatsGrid from "./Sections/StatsGrid";

const ExistsSection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 lg:px-20 w-full">
                <h2 className="text-4xl font-bold text-[#3ba8df] font-['Jockey_One'] mb-16">
                    Why KonnYoeung Exists
                </h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start w-full">
                    
                    <div className="space-y-8 text-slate-700 lg:sticky lg:top-10">
                        <p className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                            Every parent wants to keep their child safe and healthy, but it's not always easy to know what symptoms mean.
                        </p>
                        <div className="space-y-4 text-lg">
                            <p className="leading-relaxed">
                                In Cambodia, many parents face uncertainty and delayed care when their children fall ill. 
                                <span className="font-semibold text-[#3ba8df]"> KonnYoeung was created to change that</span>.
                            </p>
                            <p className="leading-relaxed italic text-slate-500 border-l-4 border-blue-100 pl-4">
                                We believe every parent deserves access to trusted health information instantly, in their language, and completely free.
                            </p>
                        </div>
                    </div>

                    {/* Right Side: The Grid Component */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <StatsGrid 
                            title="Community for Change"
                            description="Built by youth who believe that small actions today can shape a healthier Cambodia tomorrow."
                            iconName="education"
                        />
                        <StatsGrid 
                            title="Available 24/7"
                            description="Access health guidance anytime, anywhere—even in the middle of the night."
                            iconName="alarm"
                            iconBgColor="bg-purple-50"
                            iconColor="text-purple-400"
                        />
                        <StatsGrid 
                            title="Free Access for All"
                            description="No cost, no barriers – just simple health information when you need it most."
                            iconName="world"
                            iconBgColor="bg-green-50"
                            iconColor="text-green-400"
                        />
                        <StatsGrid 
                            title="Empowering Parents"
                            description="Helping parents make informed decisions about their children's health."
                            iconName="heart"
                            iconBgColor="bg-red-50"
                            iconColor="text-red-400"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ExistsSection;