"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Catalog', path: '/catalog' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Sell Your Car', path: '/sell-your-car' }
  ];

  return (
    <nav className="bg-surface dark:bg-inverse-surface w-full top-0 sticky z-50 shadow-sm dark:bg-surface-container-high">
<div className="flex justify-between items-center max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop h-20">

<Link className="font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary hover:opacity-90 transition-opacity flex items-center gap-2" href="/">
<span className="material-symbols-outlined icon-fill text-[32px]">directions_car</span>
                Hariram Motors
            </Link>

<div className="hidden md:flex items-center gap-8 h-full">
  {navLinks.map((link) => {
    const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
    return (
      <Link 
        key={link.path} 
        href={link.path}
        className={`font-body-md text-body-md h-full flex items-center transition-all duration-300 ${
          isActive 
            ? "text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary font-bold" 
            : "text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-inverse-primary hover:opacity-90"
        }`}
      >
        {link.name}
      </Link>
    );
  })}
</div>

<div className="flex items-center gap-4">
<button className="hidden lg:flex items-center gap-2 bg-surface-container text-on-surface px-4 py-2 rounded-lg font-body-md text-body-md font-medium hover:bg-surface-container-high hover:opacity-90 transition-all duration-300 scale-102 hover:shadow-md border border-outline-variant">
<span className="material-symbols-outlined">search</span>
</button>
<a className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded-lg font-body-md text-body-md font-medium hover:opacity-90 transition-all duration-300 scale-102 hover:shadow-md" href="#">
<span className="material-symbols-outlined">chat</span>
                    WhatsApp Us
                </a>

<button className="md:hidden text-primary dark:text-inverse-primary p-2">
<span className="material-symbols-outlined text-2xl">menu</span>
</button>
</div>
</div>
</nav>
  );
}
