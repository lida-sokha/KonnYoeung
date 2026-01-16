
interface StatsGridProps {
  title: string;
  description: string;
  content: string;
  className?: string;
}

const TrustedGrid = ({ title, description, content, className }: StatsGridProps) => {
    return (
        <div className={`bg-white rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)] p-10 h-72 flex flex-col text-center transition-transform hover:scale-105 ${className}`}>
            <h1 className="text-5xl font-bold text-[#3ba8df] font-['Jockey_One'] mb-5">{title}</h1>
            <h2 className="text-xl font-bold text-slate-900 mb-2">{description}</h2>
            <p className="text-slate-600 font-medium leading-tight ">{content}</p>
        </div>
    );
}
export default TrustedGrid;