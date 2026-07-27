"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export function ContinueLearning({ lesson, module }: { lesson: any; module: any }) {
  if (!lesson || !module) return null;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-3xl bg-[#0a0b10] border border-white/[0.08] overflow-hidden group cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative w-full md:w-64 h-36 rounded-2xl overflow-hidden bg-white/[0.05] flex-shrink-0">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 z-10" />
        {lesson.thumbnailUrl && (
          <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
            <Play className="w-5 h-5 text-white ml-1" />
          </div>
        </div>
      </div>

      <div className="flex-1 z-20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-4">
          <span className="text-xs font-medium text-white/70">Continue Watching</span>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">{lesson.title}</h3>
        <p className="text-sm text-white/50">{module.title}</p>
      </div>

      <div className="z-20 mt-4 md:mt-0">
        <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors">
          Resume
        </button>
      </div>
    </motion.div>
  );
}
