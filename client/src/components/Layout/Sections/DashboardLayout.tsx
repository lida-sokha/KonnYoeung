import { useState, type ReactNode } from 'react';
import Sidebar from '../Sidebar';
import { Menu, X } from 'lucide-react';

const DashboardLayout = ({ children }: { children: ReactNode }) => {
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
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar />
      </div>

      {/* 3. Overlay for mobile (clicks to close sidebar) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 4. The Main Area: Adjust margins for mobile */}
      <main className="flex-1 bg-white my-2 mx-2 md:my-4 md:mr-4 md:ml-0 rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-lg h-fit min-h-[calc(100vh-16px)] md:min-h-[calc(100vh-32px)]">
        {children}
      </main>
      
    </div>
  );
};

export default DashboardLayout;