import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const categoryIcons: Record<string, string> = {
  nutrition: "/assets/nutrition.svg",
  fitness: "/assets/fitness.svg",
  meals: "/assets/meals.svg",
  lifestyle: "/assets/products.svg",
  culture: "/assets/products.svg",
  default: "/assets/products.svg",
};

interface InsightCardProps {
  title: string;
  category: string;
  brief_outline: string;
  estimated_reading_time: string;
  target_audience: string;
  className?: string;
}

export const InsightCard = ({
  title,
  category,
  brief_outline,
  estimated_reading_time,
  target_audience,
  className = "",
}: InsightCardProps) => {
  const iconSrc =
    categoryIcons[category.toLowerCase()] || categoryIcons.default;

  const href = `/insights/${encodeURIComponent(title)}?category=${encodeURIComponent(category)}&reading_time=${encodeURIComponent(estimated_reading_time)}&target_audience=${encodeURIComponent(target_audience)}`;

  return (
    <Link href={href} className={`block h-full ${className}`}>
      <Card className="bg-[#2C2C2C] h-full border-[0.5px] border-[#404040] rounded-[20px] hover:border-[#F9E8CD] transition-colors duration-200 group">
        <CardContent className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-[#404040] text-xs font-medium rounded-full text-gray-300">
              {category}
            </span>
            <div className="w-8 h-8 relative">
              <Image
                src={iconSrc}
                alt={category}
                width={32}
                height={32}
                className="opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-2 line-clamp-3 group-hover:text-[#F9E8CD] transition-colors">
            {title}
          </h3>

          <p className="text-sm text-gray-400 mb-4 line-clamp-3">
            {brief_outline}
          </p>

          <div className="mt-auto pt-4 border-t border-[#404040] flex items-center justify-between text-sm">
            <span className="text-gray-500">{estimated_reading_time}</span>
            <span className="text-[#F9E8CD] flex items-center gap-1 group-hover:underline">
              Read <ChevronRight size={14} />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default InsightCard;
