"use client"

import Image from "next/image";

export default function RiskAssessment() {
  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white font-sans flex flex-col items-center  selection:bg-orange-500/30">
      
    <Image src='/assets/logo.png' alt='' width={103} height={90} className='mx-auto mb-[55px]' />
      

      <h1 className="text-[28px] md:text-[32px] font-semibold mb-12 tracking-wide">
        Personalized Risk Assessment
      </h1>

      <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-14">
        
        <div className="bg-[#424242] rounded-[32px] overflow-hidden flex flex-col shadow-lg">
          
          <div className="h-[280px] w-full relative">
            <Image 
            width={500}
            height={500}
              src="/assets/food.png" 
              alt="Jollof Rice with Steak" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-8 md:p-10 flex-1 flex flex-col">
            <h2 className="text-[26px] leading-tight font-bold mb-6 text-white">
              Jollof Rice with Steak beef and Tomato
            </h2>
            
            <div className="text-[#D1D1D1] text-[15px] leading-[1.6] space-y-4">
              <p>
                This is a richly spiced jollof rice prepared with rice cooked in a pepper and tomato base.
              </p>
              <p>
                It includes crayfish for a deep, savory flavor and aroma.<br />
                Groundnut oil is used to give the dish a rich taste and appealing texture.
              </p>
              <p>
                A generous blend of seasonings enhances the bold, smoky flavor profile.
              </p>
              <p>
                Overall, it is a flavorful and well-seasoned meal with a spicy and aromatic finish.
              </p>
            </div>
          </div>
        </div>

        <div className="relative pt-2 md:pl-10">
          <div className="hidden md:block absolute left-0 top-0 bottom-12 w-[1px] bg-[#666666]"></div>

          <div className="mb-10">
            <h3 className="text-[#E89E28] text-xl font-semibold mb-5">Risks</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
                <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                  You may trigger <span className="text-[#E89E28]">stomach pain</span> and burning because pepper and heavy spices can irritate your stomach lining.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
                <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                  You may worsen <span className="text-[#E89E28]">acidity</span> and discomfort since tomatoes can increase stomach acid levels.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
                <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                  You may experience acid reflux or <span className="text-[#E89E28]">heartburn</span> due to the high oil content slowing digestion.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
                <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                  You may irritate your stomach further from strong seasonings and crayfish that can stimulate acid production.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0"></span>
                <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                  You may delay ulcer healing because spicy, oily, and acidic foods can aggravate the ulcer surface.
                </p>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#19C481] text-xl font-semibold mb-2">Alternative</h3>
            <h4 className="text-white text-[16px] font-medium mb-1">Ulcer-friendly Jollof Rice</h4>
            <p className="text-[#B3B3B3] text-[14px] mb-3">Ingredients</p>
            
            <ul className="space-y-2">
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">parboiled rice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">mild red bell pepper (tatashe) instead of hot pepper</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">small amount of tomato paste or none at all</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">onions (well cooked)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">carrot or green beans (optional for nutrition)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">low-fat oil in small quantity</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">salt (minimal)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">mild herbs like thyme or bay leaf</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-1 h-1 rounded-full bg-white mt-2 shrink-0"></span>
                <span className="text-[#D1D1D1] text-[14px]">water or light chicken/fish broth</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      <div className="fixed bottom-6 right-6 text-[#888888] hover:text-white transition-colors cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
      
    </div>
  );
}