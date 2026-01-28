import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual');

  const insertTag = (tag: string, content = 'Texte') => {
    const textarea = document.getElementById('editor') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end) || content;
      const newValue = 
        value.substring(0, start) + 
        `<${tag}>${selectedText}</${tag}>` + 
        value.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = start + tag.length + 2;
      }, 0);
    }
  };

  const applyFormat = (format: string) => {
    switch (format) {
      case 'bold':
        insertTag('strong', 'Texte gras');
        break;
      case 'italic':
        insertTag('em', 'Texte italique');
        break;
      case 'h1':
        insertTag('h1', 'Titre principal');
        break;
      case 'h2':
        insertTag('h2', 'Sous-titre');
        break;
      case 'h3':
        insertTag('h3', 'Titre 3');
        break;
      case 'p':
        insertTag('p', 'Paragraphe');
        break;
      case 'ul':
        const ulContent = '<li>Élément 1</li>\n<li>Élément 2</li>';
        insertTag('ul', ulContent);
        break;
      case 'ol':
        const olContent = '<li>Élément 1</li>\n<li>Élément 2</li>';
        insertTag('ol', olContent);
        break;
      case 'blockquote':
        insertTag('blockquote', 'Citation');
        break;
      case 'hr':
        const textarea = document.getElementById('editor') as HTMLTextAreaElement;
        if (textarea) {
          const start = textarea.selectionStart;
          const newValue = value.substring(0, start) + '<hr />' + value.substring(start);
          onChange(newValue);
        }
        break;
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex gap-1 bg-gray-100 p-2 border-b border-gray-300 flex-wrap">
        <button
          type="button"
          onClick={() => setMode(mode === 'visual' ? 'html' : 'visual')}
          className="px-3 py-1 bg-gray-300 hover:bg-gray-400 rounded text-sm font-medium"
        >
          {mode === 'visual' ? 'Mode HTML' : 'Mode Visuel'}
        </button>
        <div className="w-full border-b border-gray-300 my-1"></div>
        <button
          type="button"
          onClick={() => applyFormat('h1')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm font-bold"
          title="Titre 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => applyFormat('h2')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm font-bold"
          title="Titre 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => applyFormat('h3')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm font-bold"
          title="Titre 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm font-bold"
          title="Gras"
        >
          <strong>G</strong>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('italic')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm italic"
          title="Italique"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => applyFormat('ul')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
          title="Liste à puces"
        >
          • Liste
        </button>
        <button
          type="button"
          onClick={() => applyFormat('ol')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
          title="Liste numérotée"
        >
          1. Liste
        </button>
        <button
          type="button"
          onClick={() => applyFormat('blockquote')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
          title="Citation"
        >
          "
        </button>
        <button
          type="button"
          onClick={() => applyFormat('hr')}
          className="px-3 py-1 bg-white hover:bg-gray-200 border border-gray-300 rounded text-sm"
          title="Ligne horizontale"
        >
          ―
        </button>
      </div>

      {mode === 'visual' ? (
        <div>
          <textarea
            id="editor"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-96 p-4 font-mono text-sm border-0 focus:outline-none resize-none"
            placeholder="Entrez votre contenu HTML ici..."
          />
        </div>
      ) : (
        <div className="p-4 h-96 overflow-auto bg-white">
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  );
}
