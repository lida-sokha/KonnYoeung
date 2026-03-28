import { useState, type ReactNode } from 'react';
import Adminsidebar from './Adminsidebar';
import { Menu, X } from 'lucide-react';

const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
return (
    <div className="flex min-h-screen w-full bg-[#34AADC] relative">
      
      {/* 1. Mobile Toggle Button (Visible only on small screens) */}
      <button 
        className="md:hidden fixed top-6 left-6 z-50 p-2 bg-white rounded-lg shadow-md text-[#34AADC]"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 2. Sidebar with Responsive Logic */}
      <div className={`
        fixed inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:h-screen md:sticky md:top-0
        w-64 shrink-0 /* ADD THESE: Fixed width and prevent shrinking */
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Adminsidebar />
      </div>

      {/* 3. Overlay for mobile (clicks to close sidebar) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 4. The Main Area: Adjust margins for mobile */}
      <main className="flex-1 min-w-0 bg-white my-2 mx-2 rounded-[30px] md:rounded-[40px] ..."> 
        {children}
      </main>
      
    </div>
  );
};

export default AdminDashboardLayout;
