import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-center gap-6 p-6 border-b border-gray-800 bg-gray-950/50 backdrop-blur-md sticky top-0 z-50">
      <Link 
        href="/" 
        className="text-gray-400 hover:text-white transition-colors font-medium"
      >
        Home
      </Link>
      
      <Link 
        href="/event" 
        className="text-gray-400 hover:text-white transition-colors font-medium"
      >
        Event
      </Link>
      
      <Link 
        href="/community" 
        className="text-gray-400 hover:text-white transition-colors font-medium"
      >
        Community
      </Link>
    </nav>
  );
}