import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'

interface EmailEditorProps {
  layout: string
  config: {
    title: string
    content: string
    imageUrl: string
  }
  onConfigChange: (key: string, value: string) => void
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function EmailEditor({ layout, config, onConfigChange, onImageUpload }: EmailEditorProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="mb-4">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => onConfigChange('title', e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={config.content}
            onChange={(e) => onConfigChange('content', e.target.value)}
            rows={5}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            onChange={onImageUpload}
            accept="image/*"
          />
        </div>
        {config.imageUrl && (
          <img src={config.imageUrl || "/placeholder.svg"} alt="Uploaded" className="max-w-full h-auto" />
        )}
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Preview</h2>
        <div
          className="border p-4"
          dangerouslySetInnerHTML={{
            __html: layout
              .replace('{{title}}', config.title)
              .replace('{{content}}', config.content)
              .replace('{{imageUrl}}', config.imageUrl)
          }}
        />
      </div>
    </div>
  )
}

