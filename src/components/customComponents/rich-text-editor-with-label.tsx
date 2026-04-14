"use client";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { isZodFieldRequired } from "@/lib/isZodFieldRequired";
import { suggestionConfig } from "@/utils/tip-suggestions";
import Mention from "@tiptap/extension-mention";
import { TextAlign } from "@tiptap/extension-text-align";
import {
  FontFamily,
  FontSize,
  LineHeight,
  TextStyle,
} from "@tiptap/extension-text-style";
import { Placeholder } from "@tiptap/extensions";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Asterisk,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Underline,
} from "lucide-react"; // Or your preferred icon library
import { useFormContext } from "react-hook-form";
import z from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const START = 10;

const FONTS_FAMILIES = [
  "Arial",
  "Courier New",
  "Futura Bk BT",
  "Inter",
  "Poppins",
  "Roboto",
];
const FONT_SIZES = Array.from({ length: 23 }, (_, i) => START + i);
const LINE_HEIGHTS = Array.from({ length: 5 }, (_, i) => 1 + i);

type RichTextEditorWithLabelProps<T> = {
  name: keyof T & string;
  fieldTitle?: string;
  className?: string;
  schema?: z.ZodSchema<T>;
};

export const RichTextEditorWithLabel = <T,>({
  name,
  fieldTitle,
  className,
  schema,
}: RichTextEditorWithLabelProps<T>) => {
  const form = useFormContext();

  const isRequired = (() => {
    if (schema) {
      const fieldSchema =
        schema instanceof z.ZodObject ? schema.shape[name] : schema;
      return isZodFieldRequired(fieldSchema);
    }
    return false;
  })();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`flex flex-col gap-2 ${className}`}>
          {fieldTitle && (
            <FormLabel className="text-sm font-bold">
              {fieldTitle}
              {isRequired && (
                <Asterisk className="text-destructive size-3 -ml-1.5" />
              )}
            </FormLabel>
          )}
          <FormControl>
            <div className="rounded-md border bg-background">
              <TipTapEditor content={field.value} onChange={field.onChange} />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) return null;

  // Reusable toggle logic for cleaner JSX
  const ToggleButton = ({
    onClick,
    isActive,
    children,
    tooltip,
  }: {
    onClick: () => void;
    isActive: boolean;
    children: React.ReactNode;
    tooltip?: string;
  }) => (
    <Toggle
      size="sm"
      pressed={isActive}
      onPressedChange={onClick}
      className="h-8 w-8 px-0 data-[state=on]:bg-sky-100 data-[state=on]:text-sky-900 dark:data-[state=on]:bg-sky-900/30 dark:data-[state=on]:text-sky-200">
      {children}
    </Toggle>
  );

  return (
    <div className="sticky top-0 z-10 flex w-full flex-wrap items-center gap-1 border-b bg-background/95 p-1.5 backdrop-blur">
      {/* Typography Groups */}
      <div className="flex items-center gap-0.5 px-1">
        <ToggleButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}>
          <Bold className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}>
          <Italic className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}>
          <Underline className="h-4 w-4" />
        </ToggleButton>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Alignment Group */}
      <div className="flex items-center gap-0.5 px-1">
        <ToggleButton
          onClick={() => editor.commands.setTextAlign("left")}
          isActive={editor.isActive({ textAlign: "left" })}>
          <AlignLeft className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.commands.setTextAlign("center")}
          isActive={editor.isActive({ textAlign: "center" })}>
          <AlignCenter className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.commands.setTextAlign("right")}
          isActive={editor.isActive({ textAlign: "right" })}>
          <AlignRight className="h-4 w-4" />
        </ToggleButton>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Dropdown Selects for Classic Control */}
      <div className="flex items-center gap-2 px-1">
        <Select
          defaultValue="Inter"
          onValueChange={(val) =>
            editor.chain().focus().setFontFamily(val).run()
          }>
          <SelectTrigger className="h-8 w-32.5 border-none bg-transparent hover:bg-muted focus:ring-0">
            <SelectValue placeholder="Font" />
          </SelectTrigger>
          <SelectContent>
            {FONTS_FAMILIES.map((font) => (
              <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          defaultValue="12px"
          onValueChange={(val) =>
            editor.chain().focus().setFontSize(val).run()
          }>
          <SelectTrigger className="h-8 w-17.5 border-none bg-transparent hover:bg-muted focus:ring-0">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {FONT_SIZES.map((size) => (
              <SelectItem key={size} value={`${size}px`}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Formatting Tools */}
      <div className="flex items-center gap-0.5 px-1">
        <ToggleButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}>
          <List className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}>
          <ListOrdered className="h-4 w-4" />
        </ToggleButton>
        <ToggleButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}>
          <Quote className="h-4 w-4" />
        </ToggleButton>
      </div>
    </div>
  );
};

const TipTapEditor = ({
  content,
  onChange,
}: {
  content: string;
  onChange: (value: string) => void;
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Mention.configure({
        HTMLAttributes: { class: "mention" },
        suggestion: suggestionConfig,
      }),
      FontFamily,
      FontSize,
      TextStyle,
      TextAlign.configure({
        types: ["paragraph", "heading"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      LineHeight.configure({
        types: ["textStyle"],
      }),
      Placeholder.configure({
        emptyEditorClass: "is-editor-empty",
        placeholder: "Write the body of the document here",
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert focus:outline-none min-h-37.5 p-4 max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
  });

  return (
    <>
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};
