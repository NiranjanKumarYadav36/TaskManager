import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TipTapToolbar from "./TipTapToolBar";
import { Input } from "../ui/input";
import TextAlign from "@tiptap/extension-text-align";
import { Image } from "@tiptap/extension-image";
import Highlight from '@tiptap/extension-highlight';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Youtube from '@tiptap/extension-youtube';
import Code from '@tiptap/extension-code'
import Link from '@tiptap/extension-link';
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import CustomImage from "./CustomImage";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Toaster } from "react-hot-toast";
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import FloatingBubbleMenu from "./FloatingBubbleMenu";
import WordCounter from "./WordCounter";
import { Label } from "../ui/label";
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from "react-datepicker";


interface TipTapEditorProps {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  content: string;
  setEditorContent: React.Dispatch<React.SetStateAction<string>>;
  priority: string;
  setPriority: React.Dispatch<React.SetStateAction<string>>;
  dueDate?: Date;
  setDueDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const TipTapEditor: React.FC<TipTapEditorProps> = ({
  title,
  setTitle,
  setEditorContent,
  content,
  priority,
  setPriority,
  dueDate,
  setDueDate,
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
        defaultAlignment: 'left',
      }),
      Image,
      Highlight.configure({
        multicolor: true,
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
      TextStyle,
      Color,
      Youtube.configure({
        controls: false,
        nocookie: true,
        modestBranding: true,
        autoplay: false,
      }),
      Code.configure({
        HTMLAttributes: {
          class: 'my-custom-class',
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
          class: "text-blue-500 underline hover:text-blue-700",
        },
      }),
      HorizontalRule,
      CustomImage,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "my-table"
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "start typing",
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      setEditorContent((prevContent) => (prevContent !== newContent ? newContent : prevContent));
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === " ") {
      setEditorContent(editor?.getHTML() ?? "");
    }
  };

  const toggleEditing = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    const { checked } = e.target;
    editor.setEditable(!checked, true);
    editor.view.dispatch(editor.view.state.tr.scrollIntoView());
  }, [editor]);

  return (
    <div className="flex justify-center min-h-screen p-4 md:p-6 bg-gray-50">
      <Toaster position="top-center" />
      <div className="w-full max-w-6xl bg-white border border-gray-200 rounded-lg shadow-md p-4 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Create New Task</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to create your task</p>
        </div>

        {/* Title Input */}
        <div className="mb-6">
          <Label className="block text-gray-700 text-sm font-medium mb-2">Title</Label>
          <Input
            type="text"
            value={title}
            placeholder="Enter your title..."
            className="w-full text-1xl font-semibold border-b-2 border-gray-200 mb-1 p-3 focus:outline-none focus:border-blue-500 focus:ring-0 transition-colors"
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-xs text-gray-400 mt-1"></p>
        </div>

        {/* Priority Selection */}
        <div className="mb-6">
          <Label className="block text-gray-700 text-sm font-medium mb-2">Priority</Label>
          <Select
            onValueChange={(value) => setPriority(value)}
            value={priority}
          >
            <SelectTrigger className="w-full p-3 border border-gray-300 rounded-lg mb-1 bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <SelectValue placeholder="Select priority level" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              {priorityOptions.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-400 mt-1">Set the priority level for this task</p>
        </div>

        {/* Due Date Picker (Date Only) */}
        <div className="mb-6">
          <Label className="block text-gray-700 text-sm font-medium mb-2">Due Date</Label>
          <DatePicker
            selected={dueDate}
            onChange={(date: Date | null) => {
              if (date) {
                // Create a new date that represents the same local date but at noon UTC
                // This prevents timezone conversion from changing the date
                const localDate = new Date(
                  date.getFullYear(),
                  date.getMonth(),
                  date.getDate(),
                  12,  // Noon time to avoid timezone issues
                  0,
                  0
                );
                setDueDate(localDate);
              } else {
                setDueDate(undefined);
              }
            }}
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
            placeholderText="Select due date"
            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 hover:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
          <p className="text-xs text-gray-400 mt-1">Set the deadline date for this task</p>
        </div>

        {/* Editor Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-gray-700 text-sm font-medium">Content</label>
            <div className="flex items-center space-x-2">
              <label className="inline-flex items-center text-sm text-gray-600">
                <input
                  type="checkbox"
                  checked={!editor?.isEditable}
                  onChange={toggleEditing}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                />
                Read-only mode
              </label>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border border-gray-200 rounded-t-lg bg-gray-50 p-2">
            <TipTapToolbar editor={editor} />
          </div>

          {/* Editor Content */}
          <div className="h-[600px] p-4 border border-t-0 border-gray-200 rounded-b-lg bg-white shadow-inner overflow-y-auto">
            <WordCounter editor={editor} />
            <EditorContent
              editor={editor}
              onKeyDown={handleKeyDown}
              className="prose max-w-none w-full h-full focus:outline-none leading-relaxed"
            />
            <FloatingBubbleMenu editor={editor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipTapEditor;