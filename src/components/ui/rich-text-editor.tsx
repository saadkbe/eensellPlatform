"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { Node, mergeAttributes } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Link2,
  Image as ImageIcon,
  Video as YoutubeIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Undo,
  Redo,
  Minus,
  Unlink,
  Mic,
  Loader2,
} from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { toast } from "sonner";

export const AudioNode = Node.create({
  name: 'audio',
  group: 'block',
  selectable: true,
  draggable: true,
  addAttributes() {
    return {
      src: { default: null },
    }
  },
  parseHTML() {
    return [{ tag: 'audio' }]
  },
  renderHTML({ HTMLAttributes }) {
    return ['audio', mergeAttributes(HTMLAttributes, { controls: 'true', class: 'w-full my-4 rounded-md outline-none border border-border bg-muted/30 p-2' })];
  },
});
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RichTextEditorProps {
  content?: string;
  onChange?: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
}

function ToolbarButton({
  onClick,
  isActive,
  children,
  tooltip,
  disabled,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  tooltip: string;
  disabled?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center w-8 h-8 rounded-md text-sm transition-all duration-150 border-none outline-none cursor-pointer",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted",
          disabled && "opacity-40 pointer-events-none"
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarDivider() {
  return <div className="w-px h-6 bg-border mx-1" />;
}

export function RichTextEditor({
  content = "",
  onChange,
  placeholder = "Start writing something amazing...",
  editable = true,
  className,
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const { startUpload: startImageUpload } = useUploadThing("postAttachment", {
    onUploadBegin: () => setIsUploadingImage(true),
    onClientUploadComplete: (res) => {
      setIsUploadingImage(false);
      if (res && res.length > 0) {
        editor?.chain().focus().setImage({ src: res[0].url }).run();
      }
    },
    onUploadError: (error) => {
      setIsUploadingImage(false);
      toast.error(error.message);
    }
  });

  const { startUpload: startAudioUpload } = useUploadThing("postAttachment", {
    onUploadBegin: () => setIsUploadingAudio(true),
    onClientUploadComplete: (res) => {
      setIsUploadingAudio(false);
      if (res && res.length > 0) {
        editor?.chain().focus().insertContent({ type: 'audio', attrs: { src: res[0].url } }).run();
      }
    },
    onUploadError: (error) => {
      setIsUploadingAudio(false);
      toast.error(error.message);
    }
  });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-4 shadow-md border border-border",
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "rounded-xl overflow-hidden my-4 shadow-md border border-border",
        },
        width: 640,
        height: 360,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
      AudioNode,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-5 py-4",
      },
    },
  });

  const setLink = useCallback(() => {
    if (!editor || !linkUrl) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
    setLinkUrl("");
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const addYoutube = useCallback(() => {
    if (!editor || !youtubeUrl) return;
    editor.chain().focus().setYoutubeVideo({ src: youtubeUrl }).run();
    setYoutubeUrl("");
    setShowYoutubeInput(false);
  }, [editor, youtubeUrl]);

  if (!editor) return null;

  return (
    <div className={cn("rounded-xl border border-border bg-card/50 overflow-hidden", className)}>
      {/* Toolbar */}
      {editable && (
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border bg-muted/30">
          {/* Undo/Redo */}
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            tooltip="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            tooltip="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive("heading", { level: 1 })}
            tooltip="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })}
            tooltip="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })}
            tooltip="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            tooltip="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            tooltip="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            tooltip="Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            tooltip="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            tooltip="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            tooltip="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Ordered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            tooltip="Divider"
          >
            <Minus className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Link */}
          <ToolbarButton
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkInput(!showLinkInput);
                setShowYoutubeInput(false);
              }
            }}
            isActive={editor.isActive("link")}
            tooltip={editor.isActive("link") ? "Remove Link" : "Add Link"}
          >
            {editor.isActive("link") ? (
              <Unlink className="w-4 h-4" />
            ) : (
              <Link2 className="w-4 h-4" />
            )}
          </ToolbarButton>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInputRef}
            onChange={(e) => {
              if (e.target.files) {
                startImageUpload(Array.from(e.target.files));
              }
            }}
          />
          <ToolbarButton
            onClick={() => {
              imageInputRef.current?.click();
              setShowLinkInput(false);
              setShowYoutubeInput(false);
            }}
            disabled={isUploadingImage}
            tooltip="Upload Image"
          >
            {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
          </ToolbarButton>

          {/* Audio Upload */}
          <input
            type="file"
            accept="audio/*"
            hidden
            ref={audioInputRef}
            onChange={(e) => {
              if (e.target.files) {
                startAudioUpload(Array.from(e.target.files));
              }
            }}
          />
          <ToolbarButton
            onClick={() => {
              audioInputRef.current?.click();
              setShowLinkInput(false);
              setShowYoutubeInput(false);
            }}
            disabled={isUploadingAudio}
            tooltip="Upload Voice Note"
          >
            {isUploadingAudio ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mic className="w-4 h-4" />}
          </ToolbarButton>

          {/* YouTube */}
          <ToolbarButton
            onClick={() => {
              setShowYoutubeInput(!showYoutubeInput);
              setShowLinkInput(false);
            }}
            tooltip="Embed YouTube"
          >
            <YoutubeIcon className="w-4 h-4" />
          </ToolbarButton>
        </div>
      )}

      {/* URL Input Bars */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/20">
          <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && setLink()}
            placeholder="https://example.com"
            className="flex-1 h-8 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <Button size="sm" onClick={setLink} className="h-7 px-3 text-xs">
            Insert
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowLinkInput(false)}
            className="h-7 px-2 text-xs"
          >
            Cancel
          </Button>
        </div>
      )}

      {showYoutubeInput && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/20">
          <YoutubeIcon className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addYoutube()}
            placeholder="Paste YouTube video URL..."
            className="flex-1 h-8 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoFocus
          />
          <Button size="sm" onClick={addYoutube} className="h-7 px-3 text-xs">
            Embed
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowYoutubeInput(false)}
            className="h-7 px-2 text-xs"
          >
            Cancel
          </Button>
        </div>
      )}

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}

/**
 * Read-only renderer for rich text content.
 * Use this on the user dashboard to display posts.
 */
export function RichTextRenderer({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer",
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "rounded-xl max-w-full h-auto my-4 shadow-md border border-border",
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "rounded-xl overflow-hidden my-4 shadow-md border border-border",
        },
        width: 640,
        height: 360,
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      AudioNode,
    ],
    content,
    editable: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose-base dark:prose-invert max-w-none",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className={cn("rich-text-content", className)}>
      <EditorContent editor={editor} />
    </div>
  );
}
