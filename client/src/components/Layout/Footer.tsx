import { Mail, Phone, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#79c6e6] to-[#5eb3d6] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-20 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link to="/">
              <div className="w-12 h-12 flex items-center justify-center bg-white rounded-lg">
                <img src='/images/logo1.png' alt='KonnYoeung Logo' className="h-10 w-auto" />
              </div>
              </Link>
              <span className="text-2xl font-bold tracking-tight">KonnYoeung</span>
            </div>
            <p className="text-white/90 text-sm leading-relaxed">
              Supporting Cambodian parents with reliable, bilingual resources to care for their children's health.
            </p>
          </div>

          <div className="space-y-4 justify-center items-center">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="/" className="text-white/90 hover:text-white transition-colors text-sm">Home</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Feature</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">About Us</a>
              <a href="#" className="text-white/90 hover:text-white transition-colors text-sm">Contact Us</a>
            </nav>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <a href="mailto:info@konnyoeung.com" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <span className="text-sm">info@konnyoeung.com</span>
              </a>
              
              <a href="tel:+855XXXXXXXX" className="flex items-center gap-3 text-white/90 hover:text-white transition-colors group">
                <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <span className="text-sm">+855 XX XXX XXXX</span>
              </a>

              <div className="flex gap-3 pt-2">
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/80">
            <p>© 2025 KonnyYoeung. All Rights Reserved</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;