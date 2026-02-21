"use client";

import Image from "next/image";
import { useScanStore } from "@/store/scan.store";
import { useProductsStore } from "@/store/products.store";
import { type MealDetails } from "@/services/products.service";
import { useRouter, useParams } from "next/navigation";
import { Loader, ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const severityColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "high":
      return "text-red-400";
    case "medium":
      return "text-[#E89E28]";
    case "low":
      return "text-yellow-300";
    default:
      return "text-[#E89E28]";
  }
};

export default function RiskAssessment() {
  const { scanResult, scannedImageUrl, isScanning } = useScanStore();
  const { currentMeal, fetchMealDetails, isLoading } = useProductsStore();
  const router = useRouter();
  const params = useParams();
  const mealId = params.id as string;

  // If we have a meal name in the URL (not "scan"), fetch analysis from API
  const isScanMode = mealId === "scan";

  useEffect(() => {
    if (!isScanMode && mealId) {
      const mealName = decodeURIComponent(mealId);
      fetchMealDetails(mealName);
    }
  }, [mealId, isScanMode, fetchMealDetails]);

  const scanData = scanResult?.response;

  // Show loading state
  if (isScanning || (!isScanMode && isLoading)) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 animate-spin text-[#E89E28]" />
        <p className="text-lg font-medium">
          {isScanMode ? "Analyzing your meal..." : "Fetching meal analysis..."}
        </p>
      </div>
    );
  }

  // Scan mode — show scan results
  if (isScanMode) {
    if (!scanData) {
      return (
        <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col items-center justify-center gap-4">
          <Image src="/assets/logo.png" alt="" width={103} height={90} />
          <p className="text-lg text-[#D1D1D1]">No scan data available.</p>
          <button
            onClick={() => router.push("/chats")}
            className="mt-4 px-6 py-2 bg-[#E89E28] text-black rounded-lg font-medium hover:bg-[#d48d1f] transition-colors"
          >
            Go scan a meal
          </button>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white font-sans flex flex-col items-center selection:bg-orange-500/30 pb-20">
        <div className="w-full max-w-[1000px] px-6 mt-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={18} /> Back
          </button>
        </div>

        <h1 className="text-[28px] md:text-[32px] font-semibold mb-12 tracking-wide">
          Personalized Risk Assessment
        </h1>

        <ScanResultContent data={scanData} scannedImageUrl={scannedImageUrl} />
      </div>
    );
  }

  // Analysis mode — show meal analysis from API
  if (!currentMeal) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col items-center justify-center gap-4">
        <Image src="/assets/logo.png" alt="" width={103} height={90} />
        <p className="text-lg text-[#D1D1D1]">Could not load meal analysis.</p>
        <button
          onClick={() => router.push("/explore")}
          className="mt-4 px-6 py-2 bg-[#E89E28] text-black rounded-lg font-medium hover:bg-[#d48d1f] transition-colors"
        >
          Back to Explore
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white font-sans flex flex-col items-center selection:bg-orange-500/30 pb-20">
      <div className="w-full max-w-[1000px] px-6 mt-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#A3A3A3] hover:text-white transition-colors mb-4"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <h1 className="text-[28px] md:text-[32px] font-semibold mb-12 tracking-wide">
        Meal Analysis
      </h1>

      <MealAnalysisContent meal={currentMeal} />
    </div>
  );
}

/* ─── Scan Result View ─── */
function ScanResultContent({
  data,
  scannedImageUrl,
}: {
  data: NonNullable<
    ReturnType<typeof useScanStore.getState>["scanResult"]
  >["response"];
  scannedImageUrl: string | null;
}) {
  return (
    <div className="max-w-[1000px] w-full grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-8 md:gap-14 px-6">
      {/* Left column — dish info */}
      <div className="bg-[#424242] rounded-[32px] overflow-hidden flex flex-col shadow-lg">
        {scannedImageUrl && (
          <div className="h-[280px] w-full relative">
            <Image
              fill
              src={scannedImageUrl}
              alt={data.identified_dish}
              className="object-cover"
            />
          </div>
        )}

        <div className="p-8 md:p-10 flex-1 flex flex-col">
          <h2 className="text-[26px] leading-tight font-bold mb-4 text-white">
            {data.identified_dish}
          </h2>

          <div className="text-[#D1D1D1] text-[15px] leading-[1.6] space-y-4 mb-6">
            <p>{data.detailed_information_about_the_dish}</p>
          </div>

          {/* Identified ingredients */}
          <div>
            <h3 className="text-[#B3B3B3] text-sm font-semibold mb-2 uppercase tracking-wide">
              Identified Ingredients
            </h3>
            <ul className="flex flex-wrap gap-2">
              {data.identified_ingredients.map((ingredient, i) => (
                <li
                  key={i}
                  className="bg-[#2C2C2C] text-[#D1D1D1] text-xs px-3 py-1.5 rounded-full"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right column — risks & alternatives */}
      <div className="relative pt-2 md:pl-10">
        <div className="hidden md:block absolute left-0 top-0 bottom-12 w-[1px] bg-[#666666]" />

        {/* Risk Assessment */}
        <div className="mb-10">
          <h3 className="text-[#E89E28] text-xl font-semibold mb-5">
            Risk Assessment
          </h3>
          <ul className="space-y-4">
            {data.risk_assessment.map((risk, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-white mt-2 shrink-0" />
                <div>
                  <p className="text-white text-[14px] font-medium leading-snug">
                    {risk.ailment}
                  </p>
                  <p className="text-[#B3B3B3] text-[13px] mt-0.5">
                    Trigger:{" "}
                    <span className={severityColor(risk.severity_level)}>
                      {risk.trigger_ingredient}
                    </span>
                  </p>
                  <span
                    className={`inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      risk.severity_level.toLowerCase() === "high"
                        ? "bg-red-900/40 text-red-400"
                        : risk.severity_level.toLowerCase() === "medium"
                          ? "bg-orange-900/40 text-[#E89E28]"
                          : "bg-yellow-900/30 text-yellow-300"
                    }`}
                  >
                    {risk.severity_level}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Alternatives */}
        {data.personalized_alternatives.length > 0 && (
          <div className="mb-10">
            <h3 className="text-[#19C481] text-xl font-semibold mb-4">
              Personalized Alternatives
            </h3>
            {data.personalized_alternatives.map((alt, i) => (
              <div
                key={i}
                className="bg-[#333333] rounded-2xl p-5 mb-4 space-y-3"
              >
                <p className="text-[#B3B3B3] text-xs uppercase tracking-wide">
                  Instead of
                </p>
                <p className="text-white text-[14px] font-medium">
                  {alt.original_component}
                </p>
                <p className="text-[#19C481] text-[14px]">→ {alt.suggestion}</p>
                <p className="text-[#D1D1D1] text-[13px] leading-relaxed">
                  {alt.goal_benefit}
                </p>
                {alt.cultural_relevance && (
                  <p className="text-[#B3B3B3] text-[12px] italic">
                    {alt.cultural_relevance}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Educational Questions */}
        {data.educational_questions.length > 0 && (
          <div>
            <h3 className="text-[#A78BFA] text-xl font-semibold mb-4">
              Think About This
            </h3>
            <ul className="space-y-3">
              {data.educational_questions.map((question, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-[#A78BFA] font-bold mt-0.5 shrink-0">
                    {i + 1}.
                  </span>
                  <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                    {question}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Meal Analysis View (from /api/v1/getAnalysis) ─── */
function MealAnalysisContent({ meal }: { meal: MealDetails }) {
  const tags = meal.tags?.$values || [];
  const recipeSteps = meal.recipeSteps?.$values || [];
  const alternatives = meal.alternatives?.$values || [];

  return (
    <div className="max-w-[1000px] w-full px-6 space-y-10">
      {/* Header */}
      <div className="bg-[#424242] rounded-[32px] p-8 md:p-10 shadow-lg">
        <h2 className="text-[26px] leading-tight font-bold mb-3 text-white">
          {meal.mealName}
        </h2>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag, i) => (
              <span
                key={i}
                className="bg-[#2C2C2C] text-[#D1D1D1] text-xs px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-[#D1D1D1] text-[15px] leading-[1.6] mb-6">
          {meal.description}
        </p>

        {/* Health Scores */}
        <div className="flex gap-6">
          <div className="bg-[#2C2C2C] rounded-2xl p-5 flex-1 text-center">
            <p className="text-[#A3A3A3] text-xs uppercase tracking-wide mb-2">
              General Health Score
            </p>
            <p className="text-[#B4F1CF] text-3xl font-bold">
              {meal.generalHealthScore}
              <span className="text-[#A3A3A3] text-lg font-normal">/100</span>
            </p>
          </div>
          <div className="bg-[#2C2C2C] rounded-2xl p-5 flex-1 text-center">
            <p className="text-[#A3A3A3] text-xs uppercase tracking-wide mb-2">
              Personalized Score
            </p>
            <p className="text-[#E89E28] text-3xl font-bold">
              {meal.personalizedHealthScore}
              <span className="text-[#A3A3A3] text-lg font-normal">/100</span>
            </p>
          </div>
        </div>
      </div>

      {/* Nutrition */}
      {meal.nutrition && (
        <div>
          <h3 className="text-[#E89E28] text-xl font-semibold mb-5">
            Nutrition Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(meal.nutrition).map(([key, value]) => (
              <div
                key={key}
                className="bg-[#333333] rounded-2xl p-4 text-center"
              >
                <p className="text-[#A3A3A3] text-xs uppercase tracking-wide mb-1">
                  {key}
                </p>
                <p className="text-white text-lg font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage */}
      {meal.usage && (
        <div>
          <h3 className="text-[#19C481] text-xl font-semibold mb-3">Usage</h3>
          <p className="text-[#D1D1D1] text-[15px] leading-relaxed bg-[#333333] rounded-2xl p-5">
            {meal.usage}
          </p>
        </div>
      )}

      {/* Recipe Steps */}
      {recipeSteps.length > 0 && (
        <div>
          <h3 className="text-[#A78BFA] text-xl font-semibold mb-4">
            Recipe Steps
          </h3>
          <ol className="space-y-3">
            {recipeSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-[#A78BFA] font-bold mt-0.5 shrink-0">
                  {i + 1}.
                </span>
                <p className="text-[#D1D1D1] text-[14px] leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Alternatives */}
      {alternatives.length > 0 && (
        <div>
          <h3 className="text-[#19C481] text-xl font-semibold mb-4">
            Alternatives
          </h3>
          <div className="flex flex-wrap gap-3">
            {alternatives.map((alt, i) => (
              <span
                key={i}
                className="bg-[#333333] text-[#D1D1D1] text-sm px-4 py-2 rounded-full"
              >
                {alt}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
