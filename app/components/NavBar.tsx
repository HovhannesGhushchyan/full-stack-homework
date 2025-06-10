'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavBar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white font-bold text-xl">Full Stack Assessment</div>
        <div className="flex space-x-4">
          <Link 
            href="/"
            className={`text-white hover:text-gray-300 ${pathname === '/' ? 'font-bold' : ''}`}
          >
            Home
          </Link>
          <Link 
            href="/numbers"
            className={`text-white hover:text-gray-300 ${pathname === '/numbers' ? 'font-bold' : ''}`}
          >
            Numbers
          </Link>
          <Link 
            href="/grades"
            className={`text-white hover:text-gray-300 ${pathname === '/grades' ? 'font-bold' : ''}`}
          >
            Grades
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;