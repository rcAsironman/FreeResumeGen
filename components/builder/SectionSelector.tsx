"use client";

import { useEffect, useRef } from "react";

export type HighlightSection =
  | "professionalSummary"
  | "technicalSkills"
  | "experience"
  | "environment";

interface SectionSelectorProps {
  selectedSections: HighlightSection[];
  onChange: (sections: HighlightSection[]) => void;
}

const sections: Array<{
  id: HighlightSection;
  label: string;
  description: string;
}> = [
  {
    id: "professionalSummary",
    label: "Professional Summary",
    description: "Bold matching JD skills in professional-summary bullets.",
  },
  {
    id: "technicalSkills",
    label: "Technical Skills",
    description: "Bold matching technologies in technical-skill categories.",
  },
  {
    id: "experience",
    label: "Professional Experience",
    description: "Bold matching skills inside experience responsibilities.",
  },
  {
    id: "environment",
    label: "Environment",
    description: "Bold matching skills in each client environment.",
  },
];

export function SectionSelector({
  selectedSections,
  onChange,
}: SectionSelectorProps) {
  const selectAllRef = useRef<HTMLInputElement>(null);

  const allSelected = selectedSections.length === sections.length;

  const partiallySelected =
    selectedSections.length > 0 && selectedSections.length < sections.length;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = partiallySelected;
    }
  }, [partiallySelected]);

  function handleSelectAll() {
    if (allSelected) {
      onChange([]);
      return;
    }

    onChange(sections.map((section) => section.id));
  }

  function handleSectionChange(sectionId: HighlightSection) {
    if (selectedSections.includes(sectionId)) {
      onChange(selectedSections.filter((id) => id !== sectionId));
      return;
    }

    onChange([...selectedSections, sectionId]);
  }

  return (
    <section className="mt-4 rounded-2xl border border-violet-200 bg-white/90 p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-violet-600">
          Skill Emphasis
        </p>

        <h3 className="mt-1 text-lg font-bold text-stone-900">
          Select sections for bolding skills
        </h3>

        <p className="mt-1 text-sm text-stone-600">
          Matching skills extracted from the job description will be bolded
          only in the selected sections.
        </p>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-violet-200 bg-violet-50/80 p-3 transition hover:border-violet-400 hover:bg-violet-100/80">
        <input
          ref={selectAllRef}
          type="checkbox"
          checked={allSelected}
          onChange={handleSelectAll}
          className="h-5 w-5 cursor-pointer rounded border-violet-300 accent-violet-600"
        />

        <div>
          <div className="font-semibold text-violet-900">Select All</div>

          <div className="text-xs text-violet-700">
            Apply bold skill formatting to every supported section.
          </div>
        </div>
      </label>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {sections.map((section) => {
          const checked = selectedSections.includes(section.id);

          return (
            <label
              key={section.id}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                checked
                  ? "border-violet-400 bg-violet-50 shadow-sm"
                  : "border-stone-200 bg-[#fffdf8] hover:border-violet-300"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => handleSectionChange(section.id)}
                className="mt-0.5 h-5 w-5 cursor-pointer rounded border-violet-300 accent-violet-600"
              />

              <div>
                <div className="font-semibold text-stone-900">
                  {section.label}
                </div>

                <div className="mt-1 text-xs leading-5 text-stone-600">
                  {section.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="mt-4 rounded-xl border border-violet-100 bg-[#fffaf0] px-4 py-3 text-sm text-stone-600">
        {selectedSections.length === 0
          ? "No sections selected."
          : `${selectedSections.length} of ${sections.length} sections selected.`}
      </div>
    </section>
  );
}