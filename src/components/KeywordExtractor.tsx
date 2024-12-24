import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

export function KeywordExtractor() {
  const [keywords, setKeywords] = useState<string[]>([]);

  useEffect(() => {
    // Simulating keyword extraction
    const extractedKeywords = [
      "React",
      "TypeScript",
      "UI/UX",
      "パフォーマンス改善",
    ];
    setKeywords(extractedKeywords);
  }, []);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">抽出されたキーワード:</h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="text-sm py-1 px-2 bg-gray-200"
          >
            {keyword}
          </Badge>
        ))}
      </div>
    </div>
  );
}
