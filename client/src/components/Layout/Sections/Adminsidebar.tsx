import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, BookOpen, MapPin, Settings } from 'lucide-react';

const Adminsidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
        { name: 'Manage Diseases', icon: <Stethoscope size={20} />, path: '/admin/diseases' },
        { name: 'Manage Articles', icon: <BookOpen size={20} />, path: '/admin/articles' },
        { name: 'Manage Hospitals', icon: <MapPin size={20} />, path: '/admin/hospitals' },
        { name: 'Manage Users', icon: <Settings size={20} />, path: '/admin/all-users' },
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
                    return (
                        <Link key={item.name}
                            to={item.path}
                            className={`flex items-center gap-3 py-3 pl-6 rounded-l-full transition-all ${isActive ? 'bg-white text-[#34AADC] font-semibold' : 'text-white hover:bg-white/10'}`}>
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    );
};
export default Adminsidebar;