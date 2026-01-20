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
    title: "Bitburst 2.0",
    category: "hackathon",
    community: "TinkerHub CEV",
    date: "2025-10-08",
    image: "/images/bit.jpg",
    description: "A 24-hour hackathon focused on solving real-world campus problems.",
    ai_context: `
      Event: Bitburst 2.0
      Organizer: TinkerHub CEV
      Date: October 8, 2025
      Time: Starts at 5:00 PM (24-Hour Duration)
      Venue: Main Auditorium & Computer Labs, CEV
      Theme: "Campus Solutions" - Build tech to solve issues inside the college.
      Prizes: ₹10,000 First Prize, ₹5,000 Runner up.
      Food: Dinner and midnight snacks/coffee provided for all participants.
      Rules: Teams of 2-4 members. Bring your own laptops. No pre-built code allowed.
      Mentors: Shibili (Alumni), Senior Devs from TinkerHub.
    `
  },
  {
    id: "2",
    title: "Code a Pookkalam",
    category: "competition",
    community: "TinkerHub CEV",
    date: "2025-09-24",
    image: "/images/pookkalam.jpg",
    description: "Celebrate Onam by coding a digital Pookkalam. Online competition.",
    ai_context: `
      Event: Code a Pookkalam
      Organizer: TinkerHub CEV
      Date: September 24, 2025
      Mode: Online
      Deadline: Submission closes at 11:00 PM same day.
      Challenge: Create a floral carpet design (Pookkalam) using ONLY code.
      Allowed Tools: Python (Turtle), HTML/CSS, JavaScript (Canvas/p5.js).
      Submission: Submit GitHub repo link via the Google Form shared in the group.
      Judging Criteria: Creativity, Color accuracy, and Code cleanliness.
      Prize: Exclusive TinkerHub Swag Kit.
    `
  },
  {
    id: "3",
    title: "Vibe Coding & Supabase",
    category: "workshop",
    community: "TinkerHub CEV",
    date: "2025-09-29",
    image: "/images/vibecoding.jpg",
    description: "Chill coding session learning backend basics with Supabase.",
    ai_context: `
      Event: Vibe Coding Session
      Organizer: TinkerHub CEV
      Date: September 29, 2025
      Mode: Online (Google Meet)
      Time: 7:00 PM - 9:00 PM
      Topic: "How to Vibe Code" + Supabase Basics (Database & Auth).
      Speaker: Adithya (Full Stack Dev).
      Prerequisites: Basic knowledge of JavaScript/React.
      Resources: Recording will be shared.
      Agenda: 
      1. Setting up a Lo-Fi coding environment.
      2. Connecting React to Supabase.
      3. Building a realtime Todo list.
    `
  },
  {
    id: "4",
    title: "Launchpad '25: Idea Pitch",
    category: "business",
    community: "IEDC CEV",
    date: "2025-11-10",
    image: "/images/launchpad.jpg",
    description: "Pitch your startup idea to investors and win seed grants.",
    ai_context: `
      Event: Launchpad '25
      Organizer: IEDC CEV
      Date: November 10, 2025
      Time: 9:00 AM - 4:00 PM
      Venue: Seminar Hall
      Format: 5-minute pitch + 3-minute Q&A.
      Jury: CEO of Kerala Startup Mission and Local Founders.
      Grant: Top 3 teams get entry to IEDC Pre-Incubation program.
      Registration Fee: Free for IEDC members, ₹100 for others.
    `
  },
  {
    id: "5",
    title: "Robo-War Workshop",
    category: "robotics",
    community: "IEEE SB CEV",
    date: "2025-10-15",
    image: "/images/robowar.jpg",
    description: "Hands-on workshop on building combat robots using Arduino.",
    ai_context: `
      Event: Robo-War Workshop
      Organizer: IEEE Student Branch CEV
      Date: October 15, 2025
      Time: 10:00 AM - 4:00 PM
      Venue: Electronics Lab
      Kit: Arduino Uno, Motor Drivers, Chassis (Provided).
      Cost: ₹300 per team (Hardware cost).
      Outcome: Build a bot that can push other bots out of the arena.
      Certificates: IEEE KTU Points provided.
    `
  },
  {
    id: "6",
    title: "UI/UX Design Sprint",
    category: "design",
    community: "IEDC CEV",
    date: "2025-10-20",
    image: "/images/uiux.jpg",
    description: "Master Figma in one day. Design a mobile app from scratch.",
    ai_context: `
      Event: UI/UX Design Sprint
      Organizer: IEDC CEV
      Date: October 20, 2025
      Time: 9:00 AM - 1:00 PM
      Venue: Computer Lab 2
      Tool: Figma (Browser-based).
      Mentor: Sarah (Product Designer at Zoho).
      Activity: Redesigning the College Website.
      Perks: Best design gets featured on the college newsletter.
    `
  },
  {
    id: "7",
    title: "Women in Tech Summit",
    category: "community",
    community: "IEEE SB CEV",
    date: "2025-11-05",
    image: "/images/womenintech.jpg",
    description: "Panel discussion with leading women engineers in Kerala.",
    ai_context: `
      Event: Women in Tech Summit (WIE)
      Organizer: IEEE SB CEV (WIE Affinity Group)
      Date: November 5, 2025
      Time: 2:00 PM - 5:00 PM
      Venue: Mini Auditorium
      Guests: Engineering Managers from Google and Microsoft.
      Topics: Overcoming Imposter Syndrome, Career Growth, and Networking.
      Open to: All students (Boys and Girls).
      Refreshments: High tea provided.
    `
  }
];