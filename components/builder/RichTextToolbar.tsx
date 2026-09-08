"use client";

import { useEffect, useRef, type RefObject } from "react";

interface Props { editorRef: RefObject<HTMLDivElement | null>; }

export function RichTextToolbar({ editorRef }: Props) {
  const savedRange = useRef<Range | null>(null);

  useEffect(() => {
    function rememberSelection() {
      const selection = window.getSelection();
      if (!selection?.rangeCount || !editorRef.current) return;
      const range = selection.getRangeAt(0);
      if (editorRef.current.contains(range.commonAncestorContainer)) savedRange.current = range.cloneRange();
    }
    document.addEventListener("selectionchange", rememberSelection);
    return () => document.removeEventListener("selectionchange", rememberSelection);
  }, [editorRef]);

  function run(command: string, value?: string) {
    editorRef.current?.focus();
    if (savedRange.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(savedRange.current);
    }
    document.execCommand(command, false, value);
  }

  const action = (command: string, label: string) => <button type="button" title={label} aria-label={label} onMouseDown={(event) => { event.preventDefault(); run(command); }} className="min-w-9 rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold hover:border-violet-400 hover:bg-violet-50">{label}</button>;

  return <div className="sticky top-0 z-20 flex flex-wrap items-center gap-1.5 rounded-xl border border-violet-200 bg-[#fffaf0]/95 p-2 shadow-md backdrop-blur">
    {action("undo", "Undo")}{action("redo", "Redo")}
    <span className="mx-1 h-7 border-l" />
    {action("bold", "B")}{action("italic", "I")}{action("underline", "U")}{action("strikeThrough", "S")}
    <select aria-label="Font family" defaultValue="" onChange={(event) => { if (event.target.value) run("fontName", event.target.value); event.target.value = ""; }} className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm"><option value="">Font</option><option>Times New Roman</option><option>Arial</option><option>Calibri</option><option>Cambria</option><option>Georgia</option></select>
    <select aria-label="Font size" defaultValue="" onChange={(event) => { if (event.target.value) run("fontSize", event.target.value); event.target.value = ""; }} className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm"><option value="">Size</option><option value="1">8</option><option value="2">10</option><option value="3">12</option><option value="4">14</option><option value="5">18</option><option value="6">24</option><option value="7">32</option></select>
    <label title="Text color" className="flex h-9 items-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-xs">A<input aria-label="Text color" type="color" defaultValue="#000000" onInput={(event) => run("foreColor", event.currentTarget.value)} className="h-5 w-5"/></label>
    <label title="Highlight color" className="flex h-9 items-center gap-1 rounded-lg border border-stone-300 bg-white px-2 text-xs">HL<input aria-label="Highlight color" type="color" defaultValue="#fff59d" onInput={(event) => run("hiliteColor", event.currentTarget.value)} className="h-5 w-5"/></label>
    <span className="mx-1 h-7 border-l" />
    {action("justifyLeft", "Left")}{action("justifyCenter", "Center")}{action("justifyRight", "Right")}{action("justifyFull", "Justify")}
    {action("insertUnorderedList", "Bullets")}{action("insertOrderedList", "Numbering")}{action("outdent", "Outdent")}{action("indent", "Indent")}
    <button type="button" onMouseDown={(event) => { event.preventDefault(); const url = window.prompt("Paste the link URL"); if (url) run("createLink", url); }} className="rounded-lg border border-stone-300 bg-white px-2 py-1.5 text-sm font-semibold">Link</button>
    {action("unlink", "Unlink")}{action("removeFormat", "Clear format")}
  </div>;
}
