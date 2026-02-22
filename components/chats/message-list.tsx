"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "../../frontend/node_modules/next/navigation";

// Import the FileAttachment type from types
import type { FileAttachment as FileAttachmentType } from "@/lib/types";

// Extend the File type to include our custom properties
type ExtendedFile = File & {
  url?: string;
};

// Helper function to check if an object is a File
const isFile = (obj: any): obj is File => {
  return (
    obj instanceof File ||
    (obj &&
      typeof obj === "object" &&
      "name" in obj &&
      "size" in obj &&
      "type" in obj)
  );
};

// Helper function to convert FileAttachment to File-like object
const toFile = (attachment: FileAttachmentType): File => {
  return new File([], attachment.name, {
    type: attachment.type,
    lastModified: Date.now(),
  });
};
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/lib/types";

const FileAttachmentPreview = ({
  file,
}: {
  file: FileAttachmentType | File;
}) => {
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [objectUrl, setObjectUrl] = useState<string>("");

  console.log(file);

  // Create and clean up object URL for the file
  const fileUrlRef = useRef<string>("");

  useEffect(() => {
    const createObjectUrl = async () => {
      // Clean up previous URL if it exists
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current);
        fileUrlRef.current = "";
      }

      if (!file) {
        setObjectUrl("");
        return;
      }

      try {
        let newUrl = "";

        // If it's a File object
        if (file instanceof File) {
          newUrl = URL.createObjectURL(file);
          fileUrlRef.current = newUrl;
        }
        // If it's a FileAttachment with a URL
        else if ("url" in file && file.url) {
          newUrl = file.url;
        }
        // If it's a FileAttachment with data
        else if ("type" in file) {
          const blob = new Blob([], { type: file.type });
          newUrl = URL.createObjectURL(blob);
          fileUrlRef.current = newUrl;
        }

        setObjectUrl(newUrl);
      } catch (error) {
        console.error("Error creating file URL:", error);
        setObjectUrl("");
      }
    };

    createObjectUrl();

    // Cleanup function to revoke the object URL
    return () => {
      if (fileUrlRef.current) {
        URL.revokeObjectURL(fileUrlRef.current);
        fileUrlRef.current = "";
      }
    };
  }, [file]);

  const handleOpenInNewTab = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (objectUrl) {
      window.open(objectUrl, "_blank");
    }
  };

  if (!file) return null;

  return (
    <>
      <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex items-center gap-2">
          <FileText className="text-[#FF3D00]" size={20} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {file.size ? `${(file.size / 1024).toFixed(1)} KB` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => {
                if (objectUrl) {
                  window.open(objectUrl, "_blank");
                } else if (isFile(file)) {
                  const url = URL.createObjectURL(file);
                  window.open(url, "_blank");
                  // The URL will be revoked when the window is closed
                } else if ("url" in file && file.url) {
                  window.open(file.url, "_blank");
                }
              }}
            >
              Open
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

function MealCard({
  meal,
}: {
  meal: ChatMessage["recommended_meals"] extends (infer T)[] | undefined
    ? T
    : never;
}) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/meal/${encodeURIComponent(meal.meal_name)}`)}
      className="min-w-[260px] max-w-[280px] flex-shrink-0 bg-white dark:bg-[#333] rounded-xl p-4 border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
          {meal.origin}
        </span>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            meal.health_score >= 80
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : meal.health_score >= 60
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {meal.health_score}/100
        </span>
      </div>
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
        {meal.meal_name}
      </h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
        {meal.description}
      </p>
      <div className="flex flex-wrap gap-1">
        {meal.key_benefits.slice(0, 2).map((b, i) => (
          <span
            key={i}
            className="text-[10px] bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full"
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

export function ChatMessageList({
  messages,
  isLoading,
  onSend,
}: {
  messages: ChatMessage[];
  isLoading: boolean;
  onSend?: (message: string) => void;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col space-y-4 p-4 overflow-y-auto h-full">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex flex-col ${
            message.role === "user" ? "items-end" : "items-start"
          } text-[15px] satoshi font-normal mb-4 w-full`}
        >
          <div
            className={`flex flex-col ${
              message.role === "user" ? "items-end" : "items-start"
            } max-w-[80%] gap-2`}
          >
            {/* File attachments */}
            {message.attachments?.map((file, fileIndex) => (
              <div
                key={fileIndex}
                className={`w-full rounded-2xl p-4 ${
                  message.role === "user"
                    ? "max-w-[227px]"
                    : "bg-gray-100 dark:bg-gray-800"
                }`}
              >
                <FileAttachmentPreview file={file} />
              </div>
            ))}

            {/* Message content */}
            {message.content && (
              <div
                className={`rounded-[24px] p-4 max-w-full ${
                  message.role === "user"
                    ? "bg-[#404040] text-[#D4D4D4] rounded-[69px]"
                    : "bg-transparent"
                }`}
              >
                <p className="break-words overflow-wrap-break-word max-w-full whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            )}

            {/* Recommended meals carousel */}
            {message.recommended_meals &&
              message.recommended_meals.length > 0 && (
                <div className="w-full mt-2">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Recommended Meals
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {message.recommended_meals.map((meal, i) => (
                      <MealCard key={i} meal={meal} />
                    ))}
                  </div>
                </div>
              )}

            {/* Follow-up suggestions */}
            {message.follow_up_suggestions &&
              message.follow_up_suggestions.length > 0 &&
              onSend && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {message.follow_up_suggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => onSend(suggestion)}
                      className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-[#333] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-[#FF3D00] hover:text-[#FF3D00] transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse delay-100"></div>
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse delay-200"></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
