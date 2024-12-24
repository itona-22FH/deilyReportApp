/* eslint-disable react-hooks/exhaustive-deps */
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import db from "@/lib/firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { useEffect, useState } from "react";

export function CustomTemplateSelector({
  setDailyReport,
}: CustomTemplateSelectorProps) {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);

  //すべてのテンプレートを取得
  const fetchAllTemplate = async () => {
    try {
      setLoading(true);
      console.log(loading);
      const querySnapshot = await getDocs(collection(db, "templates"));
      const templates = querySnapshot.docs.map((doc) => {
        return {
          templateId: doc.id,
          content: doc.data().content,
          name: doc.data().name,
        };
      });
      setTemplates(templates);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // データ取得完了時にロード状態を解除
    }
  };

  useEffect(() => {
    fetchAllTemplate();
  }, []);

  const handleSelectTemplate = (templateName: string) => {
    const selectedTemplate = templates.find(
      (temp) => temp.name === templateName
    );
    if (selectedTemplate) {
      setDailyReport(selectedTemplate.content);
    }
  };

  return (
    <div className="mb-6">
      <label
        htmlFor="template-select"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        テンプレートを選択
      </label>
      <Select onValueChange={handleSelectTemplate}>
        <SelectTrigger className="w-full" id="template-select">
          <SelectValue placeholder="テンプレートを選択" />
        </SelectTrigger>
        <SelectContent>
          {templates.map((template) => (
            <SelectItem key={template.templateId} value={template.name}>
              {template.name}チーム用テンプレート
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
