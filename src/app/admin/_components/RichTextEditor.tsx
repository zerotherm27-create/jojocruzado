"use client";

import { useEffect, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  TextBIcon,
  TextItalicIcon,
  TextHOneIcon,
  TextHTwoIcon,
  ListBulletsIcon,
  ListNumbersIcon,
  QuotesIcon,
  LinkSimpleIcon,
} from "@phosphor-icons/react/dist/ssr";
import styles from "./RichTextEditor.module.css";

type ToolButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolButton({ label, active, onClick, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      className={`${styles.toolButton} ${active ? styles.toolButtonActive : ""}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  return (
    <div className={styles.toolbar} role="toolbar" aria-label="Text formatting">
      <ToolButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <TextBIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <TextItalicIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <TextHOneIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <TextHTwoIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <ListBulletsIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListNumbersIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <QuotesIcon size={18} weight="bold" />
      </ToolButton>
      <ToolButton
        label="Link"
        active={editor.isActive("link")}
        onClick={() => {
          if (editor.isActive("link")) {
            editor.chain().focus().unsetLink().run();
            return;
          }
          const url = window.prompt("Link URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <LinkSimpleIcon size={18} weight="bold" />
      </ToolButton>
    </div>
  );
}

type Props = {
  name: string;
  label: string;
  defaultValue?: string;
};

// Tiptap has no native form input, so the editor's HTML is mirrored into a
// hidden input on every change, which rides along in the surrounding
// <form action={...}>'s FormData exactly like every other field here.
export default function RichTextEditor({ name, label, defaultValue = "" }: Props) {
  const [html, setHtml] = useState(defaultValue);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        underline: false,
        strike: false,
        code: false,
        codeBlock: false,
        horizontalRule: false,
      }),
    ],
    content: defaultValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: styles.editorArea,
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const update = () => setHtml(editor.getHTML());
    editor.on("update", update);
    return () => {
      editor.off("update", update);
    };
  }, [editor]);

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>
      {editor && <Toolbar editor={editor} />}
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
