"use client";

import Image from "next/image";
import { useScanStore } from "@/store/scan.store";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

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
  const router = useRouter();
  const data = scanResult?.response;

  if (isScanning) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 animate-spin text-[#E89E28]" />
        <p className="text-lg font-medium">Analyzing your meal...</p>
      </div>
    );
  }

  if (!data) {
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
      <Image
        src="/assets/logo.png"
        alt=""
        width={103}
        height={90}
        className="mx-auto mt-8 mb-10"
      />

      <h1 className="text-[28px] md:text-[32px] font-semibold mb-12 tracking-wide">
        Personalized Risk Assessment
      </h1>

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
                  <p className="text-[#19C481] text-[14px]">
                    → {alt.suggestion}
                  </p>
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
    </div>
  );
}
