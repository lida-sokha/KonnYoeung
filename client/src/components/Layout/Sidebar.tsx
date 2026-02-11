import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, BookOpen, MapPin, Settings } from 'lucide-react';

const Sidebar=() => {
    const location = useLocation();

    const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/Dashboard' },
    { name: 'Check symptom', icon: <Stethoscope size={20} />, path: '/symptoms' },
    { name: 'Articles', icon: <BookOpen size={20} />, path: '/articles' },
    { name: 'Hospitals Finder', icon: <MapPin size={20} />, path: '/hospitals' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];
    return (
        //if want to change the x-padding between the sidebar and the content (p-4)
        <div className='flex min-h-full w-64 flex-col bg-[#34AADC] p-4 text-white sticky top-0'>
            <Link to="/">
            <div className="mb-10 flex items-center gap-2 ">
                <img src="/images/white_logo.PNG" alt="Logo" className="h-20 w-20" />
                <span className="text-xl font-bold">KonnYoeung</span>
            </div>  
            </Link>
            <nav className='flex-1 space-y-5'>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return(
                        <Link key={item.name} 
                            to={item.path} 
                            className={`flex items-center gap-3 py-3 pl-6 rounded-l-full transition-all ${isActive ? 'bg-white text-[#34AADC] font-semibold' : 'text-white hover:bg-white/10'}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="mt-auto flex items-center gap-3 px-2 mb-20 pt-10 pl-6">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-white/20">
                    <img src="/admin-avatar.png" alt="Profile" />
                </div>
            </div>
        </div>
    );
};
export default Sidebar;