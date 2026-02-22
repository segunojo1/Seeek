"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useProductsStore } from "@/store/products.store";
import { ArrowLeft, Clock, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InsightDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { currentBlog, fetchBlogDetail, isLoading, setCurrentBlog } =
    useProductsStore();

  const topic = decodeURIComponent(params.slug as string);
  const category = searchParams.get("category") || "";
  const reading_time = searchParams.get("reading_time") || "";
  const target_audience = searchParams.get("target_audience") || "";

  useEffect(() => {
    // Clear previous blog on mount
    setCurrentBlog(null);

    if (topic && category) {
      fetchBlogDetail({
        title: topic,
        category,
        brief_outline: "",
        estimated_reading_time: reading_time,
        target_audience,
      });
    }
  }, [
    topic,
    category,
    reading_time,
    target_audience,
    fetchBlogDetail,
    setCurrentBlog,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 animate-spin text-[#E89E28]" />
        <p className="text-lg font-medium">Loading insight...</p>
      </div>
    );
  }

  if (!currentBlog) {
    return (
      <div className="min-h-screen bg-[#1F1F1F] text-white flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-gray-400">Insight not found.</p>
        <Button variant="outline" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1F1F1F] text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Insights</span>
        </button>

        {/* Category & reading time */}
        <div className="flex items-center gap-3 mb-4">
          <span className="px-3 py-1 bg-[#404040] text-xs font-medium rounded-full text-gray-300">
            {category}
          </span>
          {reading_time && (
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              {reading_time}
            </span>
          )}
          {currentBlog.word_count > 0 && (
            <span className="text-xs text-gray-500">
              {currentBlog.word_count.toLocaleString()} words
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold mb-8 leading-tight">
          {currentBlog.title}
        </h1>

        {/* Content - rendered as markdown-like text */}
        <article className="prose prose-invert prose-lg max-w-none">
          {currentBlog.content.split("\n").map((line, index) => {
            // Heading 1
            if (line.startsWith("# ")) {
              return (
                <h1
                  key={index}
                  className="text-3xl font-bold mt-8 mb-4 text-white"
                >
                  {line.slice(2)}
                </h1>
              );
            }
            // Heading 2
            if (line.startsWith("## ")) {
              return (
                <h2
                  key={index}
                  className="text-2xl font-bold mt-6 mb-3 text-white"
                >
                  {line.slice(3)}
                </h2>
              );
            }
            // Heading 3
            if (line.startsWith("### ")) {
              return (
                <h3
                  key={index}
                  className="text-xl font-semibold mt-5 mb-2 text-white"
                >
                  {line.slice(4)}
                </h3>
              );
            }
            // Bold text line
            if (line.startsWith("**") && line.endsWith("**")) {
              return (
                <p key={index} className="font-bold text-white my-3 text-lg">
                  {line.slice(2, -2)}
                </p>
              );
            }
            // List items
            if (line.startsWith("- ") || line.startsWith("* ")) {
              return (
                <li key={index} className="text-gray-300 ml-4 my-1 list-disc">
                  {renderInlineMarkdown(line.slice(2))}
                </li>
              );
            }
            // Numbered list
            if (/^\d+\.\s/.test(line)) {
              return (
                <li
                  key={index}
                  className="text-gray-300 ml-4 my-1 list-decimal"
                >
                  {renderInlineMarkdown(line.replace(/^\d+\.\s/, ""))}
                </li>
              );
            }
            // Empty line = spacing
            if (line.trim() === "") {
              return <div key={index} className="h-4" />;
            }
            // Regular paragraph
            return (
              <p key={index} className="text-gray-300 leading-relaxed my-2">
                {renderInlineMarkdown(line)}
              </p>
            );
          })}
        </article>

        {/* SEO Keywords / Tags */}
        {currentBlog.seo_keywords && currentBlog.seo_keywords.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#404040]">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">
              Tags
            </p>
            <div className="flex flex-wrap gap-2">
              {currentBlog.seo_keywords.map((keyword, i) => (
                <span
                  key={i}
                  className="text-xs px-3 py-1.5 bg-[#333] text-gray-400 rounded-full border border-[#404040]"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple inline markdown renderer for bold text within a line.
 */
function renderInlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
