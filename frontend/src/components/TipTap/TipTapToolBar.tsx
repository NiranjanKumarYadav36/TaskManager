import React, { useState } from "react";
import { Editor } from "@tiptap/react";
import { Button } from "../../components/ui/button";
import {
  Bold, Italic, Strikethrough,
  List, ListOrdered, Undo, Redo,
  Underline, Link, Highlighter, Youtube, ChevronDown, SeparatorHorizontalIcon,
  AlignCenter, AlignLeft, AlignRight, Image as ImageIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "../../components/ui/dropdown-menu";

const ICON_SIZE = 16;

// Predefined highlight colors
const highlightColors = [
  { name: "Yellow", color: "#ffff00" },
  { name: "Green", color: "#00ff00" },
  { name: "Blue", color: "#00ccff" },
  { name: "Pink", color: "#ff66cc" },
  { name: "Orange", color: "#ff9900" },
  { name: "None", color: "transparent" },
];

type ToolbarProps = {
  editor: Editor | null;
};

const TipTapToolbar: React.FC<ToolbarProps> = ({ editor }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = React.useState("");

  if (!editor) return null;

  // Insert image with alignment metadata
  const insertImage = (alignment: "left" | "center" | "right") => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      editor.chain().focus().setTextAlign(alignment).run();
      setImageUrl(null);
    }
  };

  // Common class for active tools
  const activeClass = "bg-blue-500 text-white";
  const headingLevel = editor.isActive("heading") ? `H${editor.getAttributes("heading").level}` : "Normal";

  return (
    <div className="flex flex-wrap items-center justify-evenly border-b bg-gray-200 px-4 py-2 shadow-md rounded-t-lg">
      {/* Undo/Redo */}
      <Button variant="ghost" onClick={() => editor.chain().focus().undo().run()}>
        <Undo size={ICON_SIZE} />
      </Button>
      <Button variant="ghost" onClick={() => editor.chain().focus().redo().run()}>
        <Redo size={ICON_SIZE} />
      </Button>

      {/* Headings Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost">{headingLevel}<ChevronDown size={ICON_SIZE} /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => editor.chain().focus().clearNodes().run()}>Normal</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>Heading 1</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>Heading 2</DropdownMenuItem>
          <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>Heading 3</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>


      {/* Formatting */}
      <Button variant="ghost" className={editor.isActive("bold") ? activeClass : ""} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold size={ICON_SIZE} />
      </Button>

      {/* Highlight Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className={editor.isActive("highlight") ? activeClass : ""}>
            <Highlighter size={ICON_SIZE} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-36 space-y-1">
          {highlightColors.map((color) => (
            <button
              key={color.name}
              className="w-full px-2 py-1 rounded text-sm text-left hover:bg-gray-200 flex items-center"
              onClick={() => {
                editor.chain().focus().toggleHighlight({ color: color.color }).run();
              }}
            >
              <span
                className="w-5 h-5 rounded-full inline-block mr-2 border"
                style={{ backgroundColor: color.color }}
              ></span>
              {color.name}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      <input
        type="color"
        onInput={(event) => {
          const target = event.target as HTMLInputElement;
          editor.chain().focus().setColor(target.value).run()
        }}
        value={editor.getAttributes('textStyle').color}
        data-testid="setColor"
      />

      <Button variant="ghost" className={editor.isActive("italic") ? activeClass : ""} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic size={ICON_SIZE} />
      </Button>
      <Button variant="ghost" className={editor.isActive("strike") ? activeClass : ""} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough size={ICON_SIZE} />
      </Button>
      <Button variant="ghost" className={editor.isActive("underline") ? activeClass : ""} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <Underline size={ICON_SIZE} />
      </Button>

      {/* Link Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" className={editor.isActive("link") ? activeClass : ""}>
            <Link size={ICON_SIZE} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3"> {/* Increased width and adjusted padding */}
          <div className="space-y-3">
            <Input
              type="text"
              placeholder="Attach a link to the selected text"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full text-sm"
            />
            <div className="flex gap-2 w-full"> {/* Ensure full width */}
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  if (linkUrl) {
                    editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
                  }
                }}
              >
                Apply
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="flex-1"
                onClick={() => editor.chain().focus().unsetLink().run()}
              >
                Remove
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Lists & Quotes */}
      <Button variant="ghost" className={editor.isActive("bulletList") ? activeClass : ""} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List size={ICON_SIZE} />
      </Button>
      <Button variant="ghost" className={editor.isActive("orderedList") ? activeClass : ""} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered size={ICON_SIZE} />
      </Button>


      {/* SeparatorHorizontal */}
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="Insert Horizontal Line"
      >
        <SeparatorHorizontalIcon size={ICON_SIZE} />
      </Button>



      {/* Alignment Dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            <AlignLeft size={ICON_SIZE} />
            <ChevronDown size={ICON_SIZE} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-36 space-y-1">
          <button
            className="w-full px-2 py-1 rounded text-sm text-left hover:bg-gray-200 flex items-center"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <AlignLeft size={ICON_SIZE} className="mr-2" /> Left Align
          </button>
          <button
            className="w-full px-2 py-1 rounded text-sm text-left hover:bg-gray-200 flex items-center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <AlignCenter size={ICON_SIZE} className="mr-2" /> Center Align
          </button>
          <button
            className="w-full px-2 py-1 rounded text-sm text-left hover:bg-gray-200 flex items-center"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <AlignRight size={ICON_SIZE} className="mr-2" /> Right Align
          </button>
        </PopoverContent>
      </Popover>

      {/* Image Upload with Preview */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost">
            <ImageIcon size={ICON_SIZE} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 w-64" side="bottom" align="start">
          <div className="space-y-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (reader.result) {
                      setImageUrl(reader.result.toString());
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="cursor-pointer text-xs"
            />

            {/* Image Preview */}
            {imageUrl && (
              <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="object-contain w-full h-full"
                  onLoad={() => URL.revokeObjectURL(imageUrl)}
                />
              </div>
            )}

            {/* Insert Image with Alignment Options */}
            <div className="flex justify-between gap-2">
              <Button variant="ghost" onClick={() => insertImage("left")}>
                <AlignLeft size={ICON_SIZE} />
              </Button>
              <Button variant="ghost" onClick={() => insertImage("center")}>
                <AlignCenter size={ICON_SIZE} />
              </Button>
              <Button variant="ghost" onClick={() => insertImage("right")}>
                <AlignRight size={ICON_SIZE} />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* YouTube Embed Button */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className={editor.isActive("youtube") ? "bg-gray-200" : ""}
          >
            <Youtube size={ICON_SIZE} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3 space-y-3">
          <Input
            type="text"
            placeholder="Paste YouTube URL (e.g., https://youtube.com/watch?v=...)"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                if (youtubeUrl) {
                  editor
                    .chain()
                    .focus()
                    .setYoutubeVideo({
                      src: youtubeUrl,
                      width: 640,
                      height: 360,
                    })
                    .run();
                  editor.chain().focus().setTextAlign("center").run();
                  setYoutubeUrl(""); // Reset input after embedding
                }
              }}
            >
              Embed
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => setYoutubeUrl("")}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TipTapToolbar;