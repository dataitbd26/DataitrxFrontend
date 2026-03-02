import React from 'react';
import { 
  Stethoscope, 
  ChevronRight, 
  Phone, 
  Mail, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Globe, 
  Send 
} from 'lucide-react';

const Footer = ({ setActiveSection }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-20 pb-10 border-t-4 border-teal-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white">
              <div className="bg-teal-600 p-2 rounded-lg text-white">
                <Stethoscope size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight">Dr. Quazi Abdullah Al Masum</span>
            </div>
            <p className="text-sm leading-relaxed">
              Dedicated to providing world-class medical services in Gastroenterology and Hepatology with over 27 years of clinical excellence.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Linkedin, Globe].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              {['Home', 'About', 'Expertise', 'Blog', 'Contact'].map((item) => (
                <li key={item}>
                  <button 
                    onClick={() => setActiveSection(item.toLowerCase())}
                    className="hover:text-teal-600 transition-colors flex items-center gap-2"
                  >
                    <ChevronRight size={14} /> {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Contact Info</h4>
            <ul className="space-y-6 text-sm">
              <li className="flex items-start gap-4">
                <MapPin className="text-teal-600 shrink-0" size={20} />
                <span>Asgar Ali Hospital, Gandaria,<br />Dhaka-1204, Bangladesh</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-teal-600 shrink-0" size={20} />
                <span className="font-bold text-lg text-white">10602 <span className="text-xs font-normal text-slate-500 ml-1">(Shortcode)</span></span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-teal-600 shrink-0" size={20} />
                <span>contact@drmasum.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Newsletter</h4>
            <p className="text-xs mb-4">Subscribe for the latest health tips and updates.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email" 
                className="bg-slate-900 border-none rounded-lg px-4 py-2 text-sm w-full focus:ring-1 focus:ring-teal-600"
              />
              <button className="bg-teal-600 text-white p-2 rounded-lg hover:bg-teal-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col md:row justify-between items-center gap-6 text-xs">
          <p>© 2024 Dr. Quazi Abdullah Al Masum. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
