"use client";
import Link from 'next/link';

export default function CatalogPage() {
  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 flex flex-col md:flex-row gap-gutter">
{/*  Sidebar Filters  */}
<aside className="w-full md:w-64 flex-shrink-0 space-y-8">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-4">Filters</h3>
{/*  Search within filters  */}
<div className="relative mb-6">
<span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-outline">search</span>
<input className="w-full pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline rounded-DEFAULT text-body-md font-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Search models..." type="text"/>
</div>
</div>
{/*  Filter Category: Brand  */}
<div className="border-t border-outline-variant pt-6">
<h4 className="font-bold text-on-surface mb-3">Brand</h4>
<div className="space-y-2">
<label className="flex items-center space-x-3 cursor-pointer">
<input className="form-checkbox h-4 w-4 text-primary border-outline rounded-sm" type="checkbox"/>
<span className="text-secondary">Audi</span>
</label>
<label className="flex items-center space-x-3 cursor-pointer">
<input className="form-checkbox h-4 w-4 text-primary border-outline rounded-sm" type="checkbox"/>
<span className="text-secondary">BMW</span>
</label>
<label className="flex items-center space-x-3 cursor-pointer">
<input className="form-checkbox h-4 w-4 text-primary border-outline rounded-sm" type="checkbox"/>
<span className="text-secondary">Mercedes-Benz</span>
</label>
<label className="flex items-center space-x-3 cursor-pointer">
<input className="form-checkbox h-4 w-4 text-primary border-outline rounded-sm" type="checkbox"/>
<span className="text-secondary">Porsche</span>
</label>
</div>
</div>
{/*  Filter Category: Fuel Type (Chips)  */}
<div className="border-t border-outline-variant pt-6">
<h4 className="font-bold text-on-surface mb-3">Fuel Type</h4>
<div className="flex flex-wrap gap-2">
<button className="px-4 py-1.5 bg-surface-container border border-outline-variant rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-variant transition-colors">Petrol</button>
<button className="px-4 py-1.5 bg-primary text-on-primary rounded-full font-label-sm text-label-sm transition-colors">Diesel</button>
<button className="px-4 py-1.5 bg-surface-container border border-outline-variant rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-variant transition-colors">CNG</button>
<button className="px-4 py-1.5 bg-surface-container border border-outline-variant rounded-full font-label-sm text-label-sm text-on-surface hover:bg-surface-variant transition-colors">Electric</button>
</div>
</div>
{/*  Filter Category: Price  */}
<div className="border-t border-outline-variant pt-6">
<h4 className="font-bold text-on-surface mb-3">Price Range</h4>
<div className="flex gap-2 items-center">
<input className="w-full px-3 py-2 bg-surface-container-lowest border border-outline rounded-DEFAULT text-body-md font-body-md" placeholder="Min" type="number"/>
<span className="text-outline-variant">-</span>
<input className="w-full px-3 py-2 bg-surface-container-lowest border border-outline rounded-DEFAULT text-body-md font-body-md" placeholder="Max" type="number"/>
</div>
</div>
</aside>
{/*  Catalog Grid Area  */}
<div className="flex-grow flex flex-col space-y-6">
{/*  Results Header  */}
<div className="flex justify-between items-end mb-4">
<div>
<h1 className="font-display-lg text-display-lg text-on-background hidden md:block">Premium Inventory</h1>
<h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background md:hidden">Premium Inventory</h1>
<p className="text-secondary mt-2">Showing 42 available vehicles</p>
</div>
<div className="hidden md:flex items-center space-x-2">
<span className="text-secondary font-label-sm text-label-sm">Sort by:</span>
<select className="bg-surface-container-lowest border border-outline rounded-DEFAULT px-3 py-1 text-body-md font-body-md focus:outline-none focus:border-primary">
<option>Recently Added</option>
<option>Price: Low to High</option>
<option>Price: High to Low</option>
</select>
</div>
</div>
{/*  Grid  */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
{/*  Card 1  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-outline-variant overflow-hidden flex flex-col group cursor-pointer">
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img alt="Car Image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A pristine white luxury SUV parked on an empty, sleek concrete surface in an industrial setting. The lighting is bright and cool, highlighting the vehicle&apos;s sharp aerodynamic lines and modern alloy wheels. The background is a minimalist grey concrete wall, ensuring the focus remains entirely on the high-end car. The overall mood is sophisticated, reflecting a premium dealership environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBx1eat1-SgehdN1QT2iTARbk_med5GqdAEr0nKCFJXG7Fk-MstBvdaPrPi_oZfuCGrAL5-t2Gi4RvW0s9TzMn1LjZKlS8w2uuHebYrMl78nAXc0OxXZJ4xZTJmp8CyUwxqIkJ7hx3NoM-7zteiDFD3gOznHvERRtsG4f3VdF9VQSlFTMN5_Gkp4Kv3yRLzubMdSHsbgU5S4RFa2N0JJDs21CWVFx_3Wpm1_FryuP3d32hXZqt5nRrqAoIQvBNrSej9NZNcDBuryC0"/>
<div className="absolute top-3 left-3 bg-primary text-on-primary px-2 py-1 rounded-sm font-label-sm text-label-sm font-bold tracking-wider">
                            CERTIFIED
                        </div>
</div>
<div className="p-5 flex flex-col flex-grow">
<div className="font-label-sm text-label-sm text-secondary flex justify-between mb-2">
<span>2022</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_gas_station</span> Petrol</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">speed</span> 15,000 km</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">Mercedes-Benz GLE</h3>
<p className="text-secondary font-body-md text-body-md mb-4 flex-grow">300d 4MATIC LWB</p>
<div className="border-t border-outline-variant pt-4 flex justify-between items-end">
<div className="font-headline-lg text-headline-lg text-primary">₹82.50 L</div>
<button className="text-primary font-bold hover:underline font-body-md text-body-md flex items-center">
                                Details <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
{/*  Card 2  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-outline-variant overflow-hidden flex flex-col group cursor-pointer">
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img alt="Car Image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A sleek black sports sedan captured in dramatic, moody lighting against a dark studio background. Subtle highlights trace the elegant curves of the hood and side panels, giving the vehicle a tactile, aggressive stance. The deep navy and black tones emphasize luxury and power. The composition is tight, focusing on the front three-quarter angle to showcase the signature grille." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhQ-i5SynqYqiY7z_3RfngQbFUoteSGwG_83KrFYjL9bsEnYaY4kZ33nRty0S_hhuZxttYnvrJq9rpYaCDmt-tqjR9ZAZJL_sfMuCWO-PDr9NNlyFx7FKToF2_jR137_Tnvl7HlF9_8JlXQGlZrdMEs0mwiYG1LZjca40i-lyRcPkPtIaZl8FngDS_LDPjlBi1xBud5dkODqvymoIxCoO1b_hyRJONO4Dyz9UpiArL2fp0RwqOb3pzYBaT3ONvzmVPOHZ-IQJ8B0c"/>
</div>
<div className="p-5 flex flex-col flex-grow">
<div className="font-label-sm text-label-sm text-secondary flex justify-between mb-2">
<span>2021</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_gas_station</span> Diesel</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">speed</span> 28,400 km</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">BMW 5 Series</h3>
<p className="text-secondary font-body-md text-body-md mb-4 flex-grow">520d Luxury Line</p>
<div className="border-t border-outline-variant pt-4 flex justify-between items-end">
<div className="font-headline-lg text-headline-lg text-primary">₹65.00 L</div>
<button className="text-primary font-bold hover:underline font-body-md text-body-md flex items-center">
                                Details <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
{/*  Card 3  */}
<div className="bg-surface-container-lowest rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] border border-outline-variant overflow-hidden flex flex-col group cursor-pointer">
<div className="relative h-48 w-full overflow-hidden bg-surface-container">
<img alt="Car Image" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" data-alt="A vibrant red sports car parked on an asphalt road with a blurred background, suggesting speed and performance. The bright daytime lighting creates high contrast, making the metallic paint pop against the neutral surroundings. The angle highlights the low profile and aerodynamic styling of the front bumper and headlights. The image evokes a sense of excitement and premium automotive engineering." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWHNnChhC1F1XxASwwimsRUr4ceN5pyBhcvaRaLnPgl6C3ZXoVyb9IAKPGUVmVmp7eaqShPdPdCFzJKHwsTZze_GJYyU80nA6U_3ymP-Sj8igUGgPd8X9KgLaN0uRFUwbwphVV5cGbQy_57WJ-aLjPHbjJZJLezwm61TnXFjaExaEaS6SKn8sRbN6pdfv8Fus4nbbrfhYZnv0XHuDzGgOeQdu2Pmi4G8Uli15Mqw_Ompq1eT6DHwjAqi0wMOR90MDtfzdEBkRF6-o"/>
</div>
<div className="p-5 flex flex-col flex-grow">
<div className="font-label-sm text-label-sm text-secondary flex justify-between mb-2">
<span>2023</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">bolt</span> Electric</span>
<span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">speed</span> 8,000 km</span>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface mb-1">Audi e-tron</h3>
<p className="text-secondary font-body-md text-body-md mb-4 flex-grow">Sportback 55 quattro</p>
<div className="border-t border-outline-variant pt-4 flex justify-between items-end">
<div className="font-headline-lg text-headline-lg text-primary">₹1.15 Cr</div>
<button className="text-primary font-bold hover:underline font-body-md text-body-md flex items-center">
                                Details <span className="material-symbols-outlined ml-1 text-sm">arrow_forward</span>
</button>
</div>
</div>
</div>
</div>
{/*  Load More  */}
<div className="w-full flex justify-center pt-8">
<button className="bg-surface-container-lowest border-2 border-primary text-primary px-8 py-3 rounded-full font-body-md text-body-md hover:bg-primary hover:text-on-primary transition-colors duration-300 font-bold tracking-wide">
                    Load More Vehicles
                </button>
</div>
</div>
</main>
  );
}
