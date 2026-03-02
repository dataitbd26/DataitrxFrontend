import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ChevronRight, Calendar, Clock, ArrowRight } from 'lucide-react';

const Blog = () => {
  const posts = [
    {
      title: 'A Guide to Managing Irritable Bowel Syndrome (IBS) Effectively',
      category: 'Digestive Health',
      date: 'Oct 12, 2024',
      readTime: '8 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-NmYGRzGKg23cbqJTddMDX_0b_4Eods9Ng2uBu_VbKXr8354SlgrJeFr8eokDFz3k_J2k7uwvnZhP3POBu9qZYhUqaVFkbEXxuS7xS7dxRiD_l_aZ4nXh4-pSltT2283XJ9vNmXmx5gMSYvl8k_F0R-b0YcVr0jawPF76CkS5ysrblES5h3ige6GgfZ4v8G7aFASr8fqCEmRKn3xvJyMi08-lvm4pg9uIwb7qcmxTIFZN6-4cmPXreS_UgZBzooJsyOzLyo1txt0'
    },
    {
      title: 'Effective Ways to Prevent Fatty Liver Disease',
      category: 'Liver Care',
      date: 'Oct 20, 2024',
      readTime: '6 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDc1vkBFrE7Ody3avkKpWZ04kCr3fm6MEt8jU4ARLgPM4sE44KEgTW3U_L_Ud8Iz5huF41pkiz0KvlEl3uZFlHIS4zXZjpNt_4iH0QNJw3Ss08Fpg54l_wQfY-5SHGg8W8EoRlHWsXLPsmO9xILOx-7xdZuAKq1JJuYNUZPsOwjsD3l8SsgqgMRBZdq_PzJ-6tsCNn5NCx7ZHKqFs2NHg7UYpqTShQqS3hsSwMoTbSr1fjxKmTKAkD6TvAUwe0ZfP4v3yTS4cQE4W4'
    },
    {
      title: 'The Role of Probiotics in Gut Immunity',
      category: 'Nutrition',
      date: 'Oct 15, 2024',
      readTime: '4 min read',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrF4zDrmZ2RcfnOS2PPfiOAQoH5zH2U0avqJx8kWAQtcc68Wz-_rgcjIw0WMS1sV9QrLpIbEWnRh35WguW2oRRjWlTmnyrxsajENBp2PYZWxLEXyINP3sy9ldN_esxkwmp-9ea_4yvMgJwGBWlMax-DzOlnVGOx0KYdO19ilTgXorKVx5Ggz0cfC6c9NHtYsZoFWjGxfKPpMq4C3tiZatlfgqFuLlpfmz2ND9GgJS1LrUczK-jKqdR0tZ99p7cPyUg70_7CC5k3dg'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="text-teal-600" />
            <span className="text-teal-600 font-bold uppercase tracking-widest text-sm">Personal Health Blog</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4">
            Expert Advice for a <span className="text-teal-600">Healthy Life</span>
          </h1>
          <p className="text-slate-500 max-w-2xl text-lg">
            Stay updated with the latest medical insights, digestive health tips, and wellness strategies curated by Dr. Masum.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-xl font-bold text-slate-900 mb-6 border-l-4 border-teal-600 pl-3">Categories</h3>
              <ul className="space-y-2">
                {['Digestive Health', 'Liver Care', 'Diet & Nutrition', 'Wellness'].map((cat, i) => (
                  <li key={i}>
                    <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-teal-50 text-slate-600 hover:text-teal-700 transition-all text-sm font-medium">
                      {cat} <ChevronRight size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-teal-600 rounded-2xl p-7 text-white shadow-xl shadow-teal-600/20">
              <h3 className="text-xl font-bold mb-3">Daily Updates</h3>
              <p className="text-teal-50 text-sm mb-6 opacity-90">Get medical updates and health tips delivered to your inbox.</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full bg-white/20 border-none placeholder-teal-100 text-white rounded-xl py-3 px-4 text-sm focus:ring-1 focus:ring-white/50"
                />
                <button className="w-full bg-white text-teal-600 font-bold py-3 rounded-xl hover:bg-teal-50 transition-all">
                  Subscribe Now
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post, i) => (
                <article key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col border border-slate-100">
                  <div className="relative h-60 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-4 left-4 bg-teal-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-7 flex flex-col flex-grow">
                    <div className="flex items-center text-slate-400 text-xs mb-4 space-x-4">
                      <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                      <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h2>
                    <button className="inline-flex items-center text-teal-600 font-bold text-sm hover:gap-2 transition-all mt-auto">
                      READ MORE <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Blog;
