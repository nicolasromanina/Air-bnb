import React, { useEffect, useRef, useState } from 'react';

type Props = {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
};

const ContentEditor: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [tiptapLoaded, setTiptapLoaded] = useState(false);
  const [Tiptap, setTiptap] = useState<any>(null);
  const [Starter, setStarter] = useState<any>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const mod = await import('@tiptap/react');
        const sk = await import('@tiptap/starter-kit');
        if (!mounted) return;
        // Normalize possible ESM/CJS shapes
        const useEditor = (mod && (mod.useEditor || mod.default?.useEditor)) || null;
        const EditorContent = (mod && (mod.EditorContent || mod.default?.EditorContent)) || null;
        setTiptap({ useEditor, EditorContent });
        const starter = sk && (sk.default || sk.StarterKit || sk);
        setStarter(starter);
        setTiptapLoaded(true);
      } catch (e) {
        // not installed
        setTiptapLoaded(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Component that uses the Tiptap hook correctly (at top-level of a component)
  const TiptapEditor: React.FC<{Tiptap: any; Starter: any; value: string; onChange: (v:string)=>void}> = ({Tiptap, Starter, value, onChange}) => {
    const { useEditor, EditorContent } = Tiptap;
    const editor = useEditor({
      extensions: [Starter],
      content: value || '<p></p>',
      onUpdate: ({ editor }: any) => onChange(editor.getHTML()),
    });
    if (!editor) return null;
    return <EditorContent editor={editor} />;
  };

  useEffect(() => {
    if (!tiptapLoaded && ref.current && ref.current.innerHTML !== value) ref.current.innerHTML = value || '';
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiptapLoaded, value]);

  if (tiptapLoaded && Tiptap?.useEditor && Starter) {
    return <TiptapEditor Tiptap={Tiptap} Starter={Starter} value={value} onChange={onChange} />;
  }

  // fallback
  return (
    <div>
      <div style={{marginBottom: 8}}>
        <button onClick={() => document.execCommand('bold')}>B</button>
        <button onClick={() => document.execCommand('italic')}>I</button>
        <button onClick={() => document.execCommand('underline')}>U</button>
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        style={{minHeight: 120, border: '1px solid #e5e7eb', padding: 8}}
        data-placeholder={placeholder}
      />
    </div>
  );
};

export default ContentEditor;
