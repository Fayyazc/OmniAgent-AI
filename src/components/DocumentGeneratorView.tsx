import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { queryGroqAPI } from '../services/groqApi';
import { DocumentItem } from '../types';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { 
  FileText, Download, Sparkles, Printer, Share2, 
  Eye, FileSpreadsheet, FileCode, CheckCircle2, RefreshCw
} from 'lucide-react';

export const DocumentGeneratorView: React.FC = () => {
  const { selectedAgent, documents, addDocument } = useApp();

  const [docType, setDocType] = useState<DocumentItem['type']>('pdf');
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState('Operations');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'vault'>('create');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle || !prompt || generating) return;

    setGenerating(true);

    const systemPrompt = `You are ${selectedAgent.name}, an expert AI employee specialized in generating formatted corporate documents, contracts, spreadsheets, reports, and SOPs. Output clear markdown with proper headings, tables, bullet points, and legal/business structure.`;

    const result = await queryGroqAPI(
      [{ role: 'user', content: `Generate a detailed ${docType.toUpperCase()} document titled "${docTitle}" in category "${category}". Instructions: ${prompt}` }],
      systemPrompt,
      selectedAgent.model
    );

    setPreviewContent(result.text);

    const newDoc: DocumentItem = {
      id: `doc_${Date.now()}`,
      title: docTitle,
      type: docType,
      category,
      content: result.text,
      author: `${selectedAgent.name} (AI)`,
      createdAt: new Date().toISOString().split('T')[0],
      size: `${(result.text.length / 1024).toFixed(1)} KB`
    };

    addDocument(newDoc);
    setGenerating(false);
  };

  const downloadPDF = (title: string, content: string) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(title, 14, 20);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(content, 180);
    doc.text(splitText, 14, 30);

    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
  };

  const downloadExcel = (title: string, content: string) => {
    const lines = content.split('\n').map(line => line.split(','));
    const ws = XLSX.utils.aoa_to_sheet(lines);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${title.replace(/\s+/g, '_')}.xlsx`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Top Toggle Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" /> AI Document & Contract Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate Word (.docx), Excel (.xlsx), PDF, Contracts, Invoices & SOPs instantly powered by Groq.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'create' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Generator Studio
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'vault' ? 'bg-brand-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Document Vault ({documents.length})
          </button>
        </div>
      </div>

      {activeTab === 'create' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generator Form */}
          <form onSubmit={handleGenerate} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Document Specs</span>
              <span className="text-[10px] text-brand-400 font-mono">Agent: {selectedAgent.name}</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Master Software Service Agreement 2026"
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Format Type</label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500 capitalize"
                >
                  <option value="pdf">PDF Document (.pdf)</option>
                  <option value="docx">Word Document (.docx)</option>
                  <option value="xlsx">Excel Spreadsheet (.xlsx)</option>
                  <option value="contract">Legal Contract Draft</option>
                  <option value="invoice">Business Invoice</option>
                  <option value="sop">Standard Operating Procedure</option>
                  <option value="markdown">Markdown (.md)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
                >
                  <option value="Legal">Legal & Compliance</option>
                  <option value="Finance">Finance & Billing</option>
                  <option value="Operations">Operations & SOPs</option>
                  <option value="Sales">Sales & Quotations</option>
                  <option value="Marketing">Marketing Plans</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Content Prompt</label>
              <textarea
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe key clauses, payment terms, table metrics, objectives, or items to include..."
                required
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-purple-600 text-white font-bold text-xs hover:shadow-xl hover:shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Groq AI Generating Document...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Document Now</span>
                </>
              )}
            </button>
          </form>

          {/* Live Preview Panel */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-400" /> Live Document Preview
              </h3>
              {previewContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPDF(docTitle || 'Generated_Document', previewContent)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5 text-brand-400" /> PDF
                  </button>
                  <button
                    onClick={() => downloadExcel(docTitle || 'Generated_Sheet', previewContent)}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 border border-slate-700"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-y-auto max-h-96 whitespace-pre-wrap">
              {previewContent ? (
                previewContent
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12">
                  <FileText className="w-10 h-10 stroke-1 mb-2" />
                  <span>Enter details and click Generate to see live document output</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Document Vault Table */
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-100">{doc.title}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="uppercase font-semibold text-brand-400">{doc.type}</span> • {doc.category} • Created by {doc.author} • {doc.size}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => downloadPDF(doc.title, doc.content)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>
                  <button
                    onClick={() => downloadExcel(doc.title, doc.content)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 flex items-center gap-1.5"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" /> Excel
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
