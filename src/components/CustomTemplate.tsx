import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type TemplateField = {
  id: string;
  label: string;
  type: 'text' | 'textarea';
}

type Template = {
  id: string;
  name: string;
  fields: TemplateField[];
}

export function CustomTemplate() {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: '標準テンプレート',
      fields: [
        { id: '1', label: '本日の業務内容', type: 'textarea' },
        { id: '2', label: '明日の予定', type: 'textarea' },
        { id: '3', label: '課題・問題点', type: 'textarea' },
      ]
    }
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(templates[0]);
  const [newField, setNewField] = useState<TemplateField>({ id: '', label: '', type: 'text' });

  const addField = () => {
    if (newField.label) {
      setSelectedTemplate({
        ...selectedTemplate,
        fields: [...selectedTemplate.fields, { ...newField, id: Date.now().toString() }]
      });
      setNewField({ id: '', label: '', type: 'text' });
    }
  };

  const removeField = (id: string) => {
    setSelectedTemplate({
      ...selectedTemplate,
      fields: selectedTemplate.fields.filter(field => field.id !== id)
    });
  };

  const saveTemplate = () => {
    setTemplates(templates.map(t => t.id === selectedTemplate.id ? selectedTemplate : t));
    // Here you would typically save the template to your backend
    console.log('Saving template:', selectedTemplate);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-vivid-purple hover:bg-vivid-purple hover:text-white">
          テンプレート編集
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="text-vivid-purple">カスタムテンプレート</DialogTitle>
          <DialogDescription>
            日報のテンプレートをカスタマイズします。フィールドの追加や削除ができます。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="template-name" className="text-right">
              テンプレート名
            </Label>
            <Input
              id="template-name"
              value={selectedTemplate.name}
              onChange={(e) => setSelectedTemplate({ ...selectedTemplate, name: e.target.value })}
              className="col-span-3"
            />
          </div>
          {selectedTemplate.fields.map((field) => (
            <div key={field.id} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.id} className="text-right">
                {field.label}
              </Label>
              {field.type === 'textarea' ? (
                <Textarea id={field.id} placeholder={field.label} className="col-span-2" />
              ) : (
                <Input id={field.id} placeholder={field.label} className="col-span-2" />
              )}
              <Button onClick={() => removeField(field.id)} variant="destructive">
                削除
              </Button>
            </div>
          ))}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-field-label" className="text-right">
              新規フィールド
            </Label>
            <Input
              id="new-field-label"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
              placeholder="フィールド名"
              className="col-span-2"
            />
            <Button onClick={addField} className="bg-vivid-blue text-white hover:bg-blue-600">
              追加
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={saveTemplate} className="bg-vivid-green text-white hover:bg-green-600">
            テンプレートを保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

