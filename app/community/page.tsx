"use client";
import Link from "next/link";

const communities = [
  { 
    id: "ieee", 
    name: "IEEE SB CEV", 
    description: "Advancing Technology for Humanity.",
    color: "from-blue-600 to-cyan-400",
    initials: "IE"
  },
  { 
    id: "iedc", 
    name: "IEDC CEV", 
    description: "Innovation and Entrepreneurship Development Centre.",
    color: "from-green-500 to-emerald-300",
    initials: "ID"
  },
  { 
    id: "tinkerhub", 
    name: "TinkerHub CEV", 
    description: "Learning culture and tech enthusiasm.",
    color: "from-yellow-400 to-orange-500",
    initials: "TH"
  },
  { 
    id: "foss", 
    name: "Foss Club CEV", 
    description: "Free and Open Source Software community.",
    color: "from-green-600 to-lime-400",
    initials: "FC"
  },
  { 
    id: "mulearn", 
    name: "Mulearn CEV", 
    description: "Peer-to-peer learning platform.",
    color: "from-purple-600 to-pink-500",
    initials: "μL"
  }
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500 selection:text-white">
      
      <div className="max-w-7xl mx-auto px-6 py-20">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Communities</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Join the vibrant student organizations at CEV. Connect, learn, and grow with like-minded peers.
          </p>
        </div>

        {/* Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communities.map((comm) => (
            <Link key={comm.id} href={`/community/${comm.id}`} className="group">
              <div className="relative h-full bg-[#0A0A0A] border border-gray-800 rounded-3xl p-8 hover:border-gray-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-1">
                
                {/* Logo Placeholder (Gradient Circle) */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${comm.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-xl tracking-wider">{comm.initials}</span>
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {comm.name}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  {comm.description}
                </p>

                {/* Footer Arrow */}
                <div className="flex items-center text-sm font-semibold text-gray-500 group-hover:text-white transition-colors">
                  Visit Page <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>

                {/* Decorative Background Glow */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${comm.color} opacity-0 group-hover:opacity-5 rounded-bl-[100px] transition-opacity`} />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}