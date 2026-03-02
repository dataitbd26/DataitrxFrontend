import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Stethoscope, Heart } from 'lucide-react';

const Home = ({ setActiveSection }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pt-20"
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center rounded-full bg-teal-50 px-4 py-1.5 text-xs font-bold text-teal-600 uppercase tracking-widest mb-6"
            >
              Senior Consultant
            </motion.div>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6"
            >
              Dr. Quazi <br />
              <span className="text-teal-600">Abdullah Al Masum</span>
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-slate-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Specializing in Gastroenterology & Hepatology. Providing expert medical care for digestive and liver health for over 27 years.
            </motion.p>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 rounded-full font-bold shadow-xl shadow-teal-600/20 transition-transform hover:-translate-y-1">
                Book Appointment
              </button>
              <button 
                onClick={() => setActiveSection('about')}
                className="border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-full font-bold hover:bg-slate-50 transition-all"
              >
                Learn More
              </button>
            </motion.div>
          </div>
          <div className="flex-1 relative">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="relative z-10 bg-white p-3 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[4/5] max-w-md mx-auto"
            >
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfhDX2mP3TJb1xjXPD2VbwMHMv5vNI5I5i_eQOP1B1yEb65jJ_C4pVp2eJbxPE6yH7PZ0v-4aQeYn8_9aUeEaaAb6oYVpXJ5a2CV64KuUVQ-S-H8S9ZpsOsq0hTf-EIF0Tw43KKTqEM6QugKIBCOPqArqDN_qnhFiuE7utR9d8AIC0iACaTtsvebkAUaTfS2uSKY7goj0D7Q39eGDmtGEIiyxiEMU9UKb2iMgQOEu3IikJBqP38Yfr6CPVjeFuocXjRGVzgAt3KA" 
                alt="Dr. Masum" 
                className="w-full h-full object-cover rounded-[2rem]"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-teal-100 rounded-full blur-3xl opacity-50 -z-0"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-50 -z-0"></div>
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="bg-slate-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: '27+ Years Experience', desc: 'Extensive clinical background in leading medical institutions.' },
              { icon: Stethoscope, title: 'Expert Consultant', desc: 'Recognized Senior Consultant specializing in GI & Hepatology.' },
              { icon: Heart, title: 'Specialized Care', desc: 'A patient-centric approach utilizing the latest medical advancements.' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              >
                <div className="bg-teal-50 w-14 h-14 rounded-xl flex items-center justify-center text-teal-600 mb-6">
                  <stat.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{stat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-teal-600 rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden shadow-2xl shadow-teal-600/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">Need expert medical advice?</h2>
            <p className="text-teal-50 text-lg mb-10 max-w-2xl mx-auto opacity-90">
              Schedule a consultation today for personalized digestive and liver health care.
            </p>
            <button className="bg-white text-teal-600 px-10 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-teal-50 transition-all transform hover:-translate-y-1">
              Book Appointment Now
            </button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Home;
