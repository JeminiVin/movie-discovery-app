"use client";

import React from "react";
import { X } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | null;
  title: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  videoKey,
  title,
}: TrailerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-4xl bg-[#0f172a] border border-[#334155] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#334155] bg-[#1e293b]">
          <h3 className="text-sm sm:text-base font-serif font-bold text-white truncate">
            {title} — Official Trailer
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-700 text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive Player Embed */}
        <div className="relative aspect-video w-full bg-black">
          {videoKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
              title={`${title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-sm text-[#94a3b8] font-mono">
              Official Trailer Video Not Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}