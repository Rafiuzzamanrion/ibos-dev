"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="h-[120px] animate-pulse rounded-lg border bg-muted" />
  ),
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  showUndoRedo?: boolean;
}

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
];

import { useId, useRef, useEffect, useMemo } from "react";
import { Undo2, Redo2 } from "lucide-react";

// We need a custom history module handler if we are strictly using ReactQuill without a full ref setup,
// but Quill natively binds .ql-undo and .ql-redo if the history module is active!

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Enter text...",
  className = "",
  minHeight = "120px",
  showUndoRedo = true,
}: RichTextEditorProps) {
  const editorId = useId().replace(/:/g, "");
  const toolbarId = `toolbar-${editorId}`;

  const modules = useMemo(() => ({
    toolbar: {
      container: `#${toolbarId}`,
      handlers: {
        undo: function () {
          // @ts-ignore
          this.quill.history.undo();
        },
        redo: function () {
          // @ts-ignore
          this.quill.history.redo();
        },
      },
    },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
  }), [toolbarId]);

  return (
    <div className={`rich-text-editor-wrapper relative rounded-xl border border-input bg-card transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 hover:border-gray-300 overflow-hidden ${className}`}>
      <style jsx global>{`
        .rich-text-editor-wrapper .quill {
          display: flex;
          flex-direction: column;
        }
        .custom-quill-toolbar {
          border: none !important;
          border-bottom: 1px solid hsl(var(--border)) !important;
          background-color: #F9FAFB !important;
          padding: 8px 12px !important;
          display: flex !important;
          align-items: center;
          flex-wrap: wrap;
          gap: 4px;
        }
        .rich-text-editor-wrapper .ql-container.ql-snow {
          border: none;
          background: transparent;
          font-size: 14px;
          min-height: ${minHeight};
        }
        /* Custom Toolbar Buttons overrides */
        .custom-quill-toolbar button {
          height: 30px !important;
          width: 30px !important;
          border-radius: 6px !important;
          transition: all 0.2s;
          color: #6B7280;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .custom-quill-toolbar button:hover {
          background-color: #F3F4F6 !important;
          color: #111827;
        }
        .custom-quill-toolbar button.ql-active {
          background-color: #EDE8FF !important;
          color: #6633FF !important;
        }
        .custom-quill-toolbar button.ql-active .ql-stroke {
          stroke: #6633FF !important;
        }
        .custom-quill-toolbar button.ql-active .ql-fill {
          fill: #6633FF !important;
        }
        
        /* Dropdowns */
        .custom-quill-toolbar .ql-picker {
          height: 30px;
          border-radius: 6px;
          transition: all 0.2s;
        }
        .custom-quill-toolbar .ql-picker-label {
          padding-left: 8px;
          padding-right: 8px;
          border: none;
          display: flex;
          align-items: center;
        }
        .custom-quill-toolbar .ql-picker-label:hover {
          background-color: #F3F4F6;
          color: #111827;
        }
        
        /* Editor body padding */
        .rich-text-editor-wrapper .ql-editor {
          min-height: ${minHeight};
          padding: 16px;
          font-family: inherit;
        }
        .rich-text-editor-wrapper .ql-editor.ql-blank::before {
          color: #9CA3AF;
          font-style: normal;
          left: 16px;
          right: 16px;
        }
        /* Hide faint lines we don't want */
        .custom-quill-toolbar .ql-formats {
          margin-right: 12px !important;
          display: flex;
          align-items: center;
        }
      `}</style>
      
      {/* Custom Toolbar */}
      <div id={toolbarId} className="custom-quill-toolbar ql-toolbar ql-snow">
        {showUndoRedo && (
          <span className="ql-formats lg-block">
            <button className="ql-undo flex items-center justify-center text-gray-500" title="Undo">
              <Undo2 className="h-4 w-4" strokeWidth={2} />
            </button>
            <button className="ql-redo flex items-center justify-center text-gray-500" title="Redo">
              <Redo2 className="h-4 w-4" strokeWidth={2} />
            </button>
          </span>
        )}
        <span className="ql-formats">
          <select className="ql-header" defaultValue="" title="Normal text">
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="">Normal text</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="bullet" title="Bullet List" />
          <button className="ql-list" value="ordered" title="Numbered List" />
        </span>
        <span className="ql-formats">
          <button className="ql-bold" title="Bold" />
          <button className="ql-italic" title="Italic" />
        </span>
      </div>

      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
      />
    </div>
  );
}
