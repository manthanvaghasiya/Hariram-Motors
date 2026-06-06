"use client";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary-container dark:bg-surface-container-lowest text-on-primary-container dark:text-on-surface w-full mt-auto border-t border-outline-variant flat no shadows">
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">

<div className="md:col-span-1 mb-8 md:mb-0">
<a className="text-headline-md font-headline-md font-bold text-on-primary-container dark:text-on-surface mb-4 flex items-center gap-2" href="#">
<span className="material-symbols-outlined icon-fill text-[28px]">directions_car</span>
                    Hariram Motors
                </a>
<p className="font-body-md text-body-md mb-4 text-on-primary-container dark:text-on-surface-variant opacity-80">
                    Surat&apos;s trusted destination for premium, certified pre-owned vehicles. Quality assured.
                </p>
<div className="flex gap-4">
<a className="text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 transition-colors duration-200" href="#">
<span className="material-symbols-outlined">share</span>
</a>
<a className="text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 transition-colors duration-200" href="#">
<span className="material-symbols-outlined">mail</span>
</a>
</div>
</div>

<div className="md:col-span-1">
<h4 className="font-headline-md text-sm font-bold text-on-primary-fixed mb-4 uppercase tracking-wider">Inventory</h4>
<ul className="flex flex-col gap-3">
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">SUVs</a></li>
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">Sedans</a></li>
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">Hatchbacks</a></li>
<li><a className="font-body-md text-body-md text-on-primary-fixed font-bold hover:underline transition-colors duration-200" href="#">Certified Pre-Owned</a></li>
</ul>
</div>

<div className="md:col-span-1">
<h4 className="font-headline-md text-sm font-bold text-on-primary-fixed mb-4 uppercase tracking-wider">Support</h4>
<ul className="flex flex-col gap-3">
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">Privacy Policy</a></li>
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">Terms of Service</a></li>
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">Dealer Warranty</a></li>
<li><a className="font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 hover:opacity-100 hover:underline transition-colors duration-200" href="#">Location</a></li>
</ul>
</div>

<div className="md:col-span-1">
<h4 className="font-headline-md text-sm font-bold text-on-primary-fixed mb-4 uppercase tracking-wider">Visit Us</h4>
<address className="not-italic font-body-md text-body-md text-on-primary-container dark:text-on-surface-variant opacity-80 flex flex-col gap-2">
<span className="flex items-start gap-2">
<span className="material-symbols-outlined text-[20px] mt-0.5">location_on</span>
                        123 Ring Road, Surat, Gujarat 395002
                    </span>
<span className="flex items-center gap-2 mt-2">
<span className="material-symbols-outlined text-[20px]">phone</span>
                        +91 98765 43210
                    </span>
<span className="flex items-center gap-2 mt-2">
<span className="material-symbols-outlined text-[20px]">schedule</span>
                        Mon-Sun: 10:00 AM - 8:00 PM
                    </span>
</address>
</div>
</div>
<div className="border-t border-outline-variant/30 py-6 text-center">
<p className="font-body-md text-sm text-on-primary-container dark:text-on-surface-variant opacity-70">
                © 2024 Hariram Motors Surat. All rights reserved.
            </p>
</div>
</footer>
  );
}
