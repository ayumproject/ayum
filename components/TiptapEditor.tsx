'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEffect, useRef, useState } from 'react'
import { uploadToCloudinary } from '@/lib/cloudinary'

interface TiptapEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarButton({ onClick, active, title, children }: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-bold transition-all ${
        active ? 'bg-[#2B59FF] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function TiptapEditor({ value, onChange, placeholder }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imageUploading, setImageUploading] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: placeholder || 'Haber içeriğini yazın...' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => { onChange(editor.getHTML()) },
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none min-h-[400px] focus:outline-none p-4' },
    },
  })

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !editor) return
    setImageUploading(true)
    try {
      const url = await uploadToCloudinary(file)
      editor.chain().focus().setImage({ src: url }).run()
    } catch (err) {
      alert('Resim yüklenemedi: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setImageUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  if (!editor) return null

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Kalın (Ctrl+B)">
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="İtalik (Ctrl+I)">
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Altı çizili">
          <span style={{ textDecoration: 'underline' }}>U</span>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Üstü çizili">
          <span style={{ textDecoration: 'line-through' }}>S</span>
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Başlık 2">H2</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Başlık 3">H3</ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Madde listesi">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numaralı liste">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l3 3-3 3m5-3h5M9 17h10M9 11h10" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Alıntı">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Sola hizala">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8M4 18h12" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Ortala">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M6 18h12" /></svg>
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        <ToolbarButton onClick={() => fileInputRef.current?.click()} title={imageUploading ? 'Yükleniyor...' : 'Resim ekle'}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => { const url = window.prompt('Link URL:'); if (url) editor.chain().focus().setLink({ href: url }).run() }} active={editor.isActive('link')} title="Link ekle">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </ToolbarButton>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Geri al">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="İleri al">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" /></svg>
        </ToolbarButton>
      </div>

      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>

      <style jsx global>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror { outline: none; }
        .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 8px 0; }
        .ProseMirror blockquote { border-left: 4px solid #2B59FF; padding-left: 16px; margin: 16px 0; color: #555; font-style: italic; }
        .ProseMirror h2 { font-size: 1.4rem; font-weight: 800; margin: 20px 0 8px; }
        .ProseMirror h3 { font-size: 1.15rem; font-weight: 700; margin: 16px 0 6px; }
        .ProseMirror ul { list-style: disc; padding-left: 20px; }
        .ProseMirror ol { list-style: decimal; padding-left: 20px; }
        .ProseMirror a { color: #2B59FF; text-decoration: underline; }
        .ProseMirror p { margin: 6px 0; }
      `}</style>
    </div>
  )
}