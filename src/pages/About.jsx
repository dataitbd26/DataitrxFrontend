import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Award, Clock, ShieldCheck, Heart, Globe, Activity } from 'lucide-react';

const About = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4">
            <span>Home</span>
            <ChevronRight size={14} />
            <span className="text-teal-600 font-medium">About</span>
          </nav>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">About Dr. Masum</h1>
          <div className="h-1.5 w-24 bg-teal-600 rounded-full"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-5/12">
            <div className="sticky top-32">
              <div className="bg-white p-3 rounded-2xl shadow-xl overflow-hidden aspect-[4/5] mb-8">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsfhDX2mP3TJb1xjXPD2VbwMHMv5vNI5I5i_eQOP1B1yEb65jJ_C4pVp2eJbxPE6yH7PZ0v-4aQeYn8_9aUeEaaAb6oYVpXJ5a2CV64KuUVQ-S-H8S9ZpsOsq0hTf-EIF0Tw43KKTqEM6QugKIBCOPqArqDN_qnhFiuE7utR9d8AIC0iACaTtsvebkAUaTfS2uSKY7goj0D7Q39eGDmtGEIiyxiEMU9UKb2iMgQOEu3IikJBqP38Yfr6CPVjeFuocXjRGVzgAt3KA" 
                  alt="Dr. Masum" 
                  className="w-full h-full object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="bg-white rounded-2xl p-8 border border-teal-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Award className="text-teal-600" /> Primary Credentials
                </h3>
                <div className="flex flex-wrap gap-3">
                  {['MBBS', 'FCPS', 'MD'].map(cred => (
                    <span key={cred} className="px-4 py-2 bg-teal-50 rounded-lg text-teal-700 font-bold text-sm">{cred}</span>
                  ))}
                </div>
                <p className="mt-8 text-sm text-slate-500 italic border-t border-teal-50 pt-6">
                  "Providing compassionate care through advanced medical expertise and 27+ years of experience."
                </p>
              </div>
            </div>
          </div>

          <div className="lg:w-7/12 space-y-12">
            <section>
              <h2 className="text-2xl font-bold text-teal-600 mb-6 flex items-center gap-2">
                <Clock size={24} /> Professional Background
              </h2>
              <div className="text-slate-600 text-lg leading-relaxed space-y-6">
                <p>
                  Dr. Quazi Abdullah Al Masum is a distinguished Senior Consultant in Gastroenterology & Hepatology, currently serving at the forefront of digestive healthcare. With a career spanning over 27 years, he has established himself as a leader in diagnosing and treating complex conditions of the stomach, intestines, liver, and gallbladder.
                </p>
                <p>
                  His extensive clinical journey includes tenures at several premier medical institutions where he has honed his expertise in both therapeutic and diagnostic procedures. He is widely recognized for his precision in endoscopy, colonoscopy, and ERCP, combined with a deep clinical understanding of hepatology.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-teal-600 mb-6 flex items-center gap-2">
                <ShieldCheck size={24} /> Clinical Excellence
              </h2>
              <div className="text-slate-600 text-lg leading-relaxed">
                <p>
                  Known for his meticulous approach, Dr. Masum emphasizes evidence-based medicine. He has successfully managed thousands of cases involving inflammatory bowel disease (IBD), chronic hepatitis B & C, liver cirrhosis, and pancreatic disorders. His commitment to clinical excellence is demonstrated by his continuous involvement in medical research and keeping pace with the latest global advancements in gastroenterology.
                </p>
              </div>
            </section>

            <div className="bg-teal-50 rounded-2xl p-8 border border-teal-100 relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-teal-600 mb-4 flex items-center gap-2">
                  <Heart size={24} /> Commitment to Care
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Dr. Masum believes that effective treatment starts with listening. His patient-centric philosophy ensures that every individual receives a personalized care plan tailored to their unique needs. He is dedicated to not only treating illness but also educating patients on preventive measures for long-term digestive health and wellness.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Globe size={24} className="text-teal-600" /> Memberships
              </h2>
              <div className="flex items-start gap-4 p-5 bg-teal-50/50 rounded-xl border border-teal-100">
                <div className="p-3 bg-teal-600 rounded-lg text-white">
                  <Activity size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">Bangladesh Gastroenterology Society</h4>
                  <p className="text-slate-500">Active Permanent Member</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
