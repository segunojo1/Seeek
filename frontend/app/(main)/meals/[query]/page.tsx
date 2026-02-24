"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader, ArrowLeft, Search } from "lucide-react";
import Image from "next/image";
import { productService } from "@/services/products.service";
import { toast } from "sonner";

interface SearchResult {
  meal_name: string;
  origin: string;
  description: string;
  health_score: number;
  key_benefits: string[];
  why_it_fits: string;
}

export default function SearchMeals() {
  const router = useRouter();
  const params = useParams();
  const query = params.query as string;

  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) return;

      setIsLoading(true);
      setError(null);

      try {
        const decodedQuery = decodeURIComponent(query);
        // Call the backend to search for meals
        const recommendations = await productService.getRecommendedMeals();

        // Filter results based on the search query (case-insensitive)
        const filtered = recommendations.filter(
          (meal) =>
            meal.meal_name.toLowerCase().includes(decodedQuery.toLowerCase()) ||
            meal.description
              .toLowerCase()
              .includes(decodedQuery.toLowerCase()) ||
            meal.key_benefits.some((benefit) =>
              benefit.toLowerCase().includes(decodedQuery.toLowerCase()),
            ),
        );

        if (filtered.length === 0) {
          setError(`No meals found for "${decodedQuery}"`);
          setResults([]);
        } else {
          setResults(filtered);
        }
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to search meals. Please try again.");
        setResults([]);
        toast.error("Failed to search meals");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleMealClick = (mealName: string) => {
    router.push(`/meal/${encodeURIComponent(mealName)}`);
  };

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white font-sans">
      {/* Header */}
      <div className="w-full max-w-[1200px] mx-auto px-6 pt-6 pb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex items-center gap-3 mb-2">
          <Search size={28} className="text-[#E89E28]" />
          <h1 className="text-[28px] md:text-[36px] font-semibold tracking-wide">
            Search Results
          </h1>
        </div>
        <p className="text-[#A3A3A3] text-sm">
          Showing results for:{" "}
          <span className="text-[#E89E28] font-medium">
            {decodeURIComponent(query)}
          </span>
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center justify-center py-20">
          <Loader className="w-10 h-10 animate-spin text-[#E89E28] mb-4" />
          <p className="text-[#D1D1D1]">Searching for meals...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="w-full max-w-[1200px] mx-auto px-6 flex flex-col items-center justify-center py-20">
          <Image src="/assets/logo.png" alt="" width={103} height={90} />
          <p className="text-lg text-[#D1D1D1] mt-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-6 px-6 py-2 bg-[#E89E28] text-black rounded-lg font-medium hover:bg-[#d48d1f] transition-colors"
          >
            Try Another Search
          </button>
        </div>
      )}

      {/* Results Grid */}
      {!isLoading && results.length > 0 && (
        <div className="w-full max-w-[1200px] mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((meal, index) => (
              <div
                key={index}
                onClick={() => handleMealClick(meal.meal_name)}
                className="bg-[#424242] rounded-[24px] overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 transform"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="bg-[#E89E28]/20 text-[#E89E28] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                        {meal.origin}
                      </span>
                      <span className="text-[#19C481] font-bold text-lg">
                        {meal.health_score}/100
                      </span>
                    </div>
                    <h3 className="text-[20px] font-bold text-white leading-tight">
                      {meal.meal_name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-[#D1D1D1] text-[14px] leading-relaxed mb-4 flex-1">
                    {meal.description}
                  </p>

                  {/* Why It Fits */}
                  <div className="mb-4">
                    <p className="text-[#A3A3A3] text-xs uppercase tracking-wide font-semibold mb-2">
                      Why It Fits You
                    </p>
                    <p className="text-[#B4F1CF] text-[13px]">
                      {meal.why_it_fits}
                    </p>
                  </div>

                  {/* Key Benefits */}
                  {meal.key_benefits?.length > 0 && (
                    <div>
                      <p className="text-[#A3A3A3] text-xs uppercase tracking-wide font-semibold mb-2">
                        Key Benefits
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {meal.key_benefits.map((benefit, i) => (
                          <span
                            key={i}
                            className="bg-[#333333] text-[#D1D1D1] text-xs px-2.5 py-1 rounded-full"
                          >
                            {benefit}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover CTA */}
                <div className="px-6 py-3 bg-[#333333] text-center">
                  <p className="text-[#E89E28] font-medium text-sm">
                    View Full Analysis →
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
