// app/lib/data.ts

export const communities = [
  { 
    id: "ieee", 
    name: "IEEE SB CEV", 
    description: "Advancing Technology for Humanity. The world's largest technical professional organization.",
    color: "from-blue-600 to-cyan-400",
    initials: "IE"
  },
  { 
    id: "iedc", 
    name: "IEDC CEV", 
    description: "Innovation and Entrepreneurship Development Centre. Fostering startup culture.",
    color: "from-green-500 to-emerald-300",
    initials: "ID"
  },
  { 
    id: "tinkerhub", 
    name: "TinkerHub CEV", 
    description: "Learning culture and tech enthusiasm. No barriers to learning.",
    color: "from-yellow-400 to-orange-500",
    initials: "TH"
  },
  { 
    id: "foss", 
    name: "Foss Club CEV", 
    description: "Free and Open Source Software community. Promoting open code.",
    color: "from-green-600 to-lime-400",
    initials: "FC"
  },
  { 
    id: "mulearn", 
    name: "Mulearn CEV", 
    description: "Peer-to-peer learning platform. Breaking conventional education methods.",
    color: "from-purple-600 to-pink-500",
    initials: "μL"
  }
];

export const events = [
  {
    id: "1",
    title: "IEEE Xtreme 18.0",
    category: "community",
    community: "IEEE SB CEV", // Matches the name in communities array
    date: "2026-02-15",
    description: "24-hour global coding competition.",
    ai_context: `Event: IEEE Xtreme. Organizer: IEEE SB CEV. Time: 24 Hours. Rules: Teams of 3.`
  },
  {
    id: "2",
    title: "Startup Pitch Day",
    category: "community",
    community: "IEDC CEV",
    date: "2026-03-01",
    description: "Pitch your idea to investors.",
    ai_context: `Event: Startup Pitch. Organizer: IEDC CEV. Prize: Funding support.`
  },
  {
    id: "3",
    title: "Open Source 101",
    category: "community",
    community: "Foss Club CEV",
    date: "2026-03-10",
    description: "Introduction to Linux and Git.",
    ai_context: `Event: OS 101. Organizer: Foss Club.`
  }
];

export const events = [
  {
    id: "1",
    title: "Tech Kerala 2026",
    category: "community",
    date: "2026-02-15",
    community: "A",
    description: "The biggest tech meetup in Kochi for developers.",
    ai_context: `
      Event: Tech Kerala 2026
      Location: Lulu Cyber Tower, Kochi
      Time: 10:00 AM to 5:00 PM
      Parking: Available at B1 level, free for attendees.
      Food: Biryani provided for lunch. Veg options available.
      WiFi: SSID 'TechKerala', Password 'code123'.
      Contact: admin@techkerala.com
    `
  },
  {
    id: "2",
    title: "Neon Music Night",
    category: "entertainment",
    date: "2026-03-01",
    community: "B",
    description: "Electronic music festival under the stars.",
    ai_context: `
      Event: Neon Music Night
      Location: Fort Kochi Beach
      Time: 6:00 PM - 12:00 AM
      Allowed: Pets are allowed. No outside alcohol.
      Tickets: ₹500 entry. Available at the gate.
      Lineup: DJ Shibili, The Bass Droppers.
    `
  }
];