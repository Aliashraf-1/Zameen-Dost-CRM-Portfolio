"use client";

import { useState } from "react";
import { FileText, Plus, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { documentTemplates } from "@/data/documentTemplates";

export default function DocumentTemplates({ 
  onSelectTemplate, 
  onViewExisting,
  existingDocuments = [],
  disabled = false 
}) {
  const [expanded, setExpanded] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSelect = (template) => {
    setSelectedTemplate(template);
    onSelectTemplate(template);
    setExpanded(false);
  };

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-indigo-400" />
          <span className="text-sm font-medium text-slate-300">Document Templates</span>
          {existingDocuments.length > 0 && (
            <span className="ml-2 rounded-full bg-indigo-500/20 px-2 py-0.5 text-xs text-indigo-400">
              {existingDocuments.length}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          disabled={disabled}
          className="flex items-center gap-1 rounded-lg border border-slate-800 px-3 py-1.5 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
        >
          {expanded ? (
            <>
              <ChevronUp size={16} />
              Hide Templates
            </>
          ) : (
            <>
              <ChevronDown size={16} />
              {selectedTemplate ? "Change Template" : "Select Template"}
            </>
          )}
        </button>
      </div>

      {/* Selected Template Preview */}
      {selectedTemplate && !expanded && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-200">{selectedTemplate.name}</p>
              <p className="text-xs text-slate-500">{selectedTemplate.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onViewExisting?.(selectedTemplate)}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white"
              title="View existing documents"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Templates List */}
      {expanded && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-2 space-y-2">
          {documentTemplates.map((template) => {
            const isSelected = selectedTemplate?.id === template.id;
            const hasExisting = existingDocuments.some(doc => doc.templateId === template.id);

            return (
              <button
                key={template.id}
                type="button"
                onClick={() => handleSelect(template)}
                className={`flex w-full items-center justify-between rounded-lg p-3 text-left transition ${
                  isSelected
                    ? "bg-indigo-500/20 border border-indigo-500/30"
                    : "hover:bg-slate-800"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-slate-200">{template.name}</p>
                  <p className="text-xs text-slate-500">{template.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {hasExisting && (
                    <span className="text-xs text-emerald-400">Saved</span>
                  )}
                  {isSelected && (
                    <span className="text-xs text-indigo-400">Selected</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}