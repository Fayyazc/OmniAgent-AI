import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileItem } from '../types';
import { 
  FolderKanban, Upload, Search, FileText, 
  Trash2, Share2, ScanText, CheckCircle2, Copy
} from 'lucide-react';

export const FileManagerView: React.FC = () => {
  const { files, addFile } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('All');
  const [ocrModalFile, setOcrModalFile] = useState<FileItem | null>(null);

  const folders = ['All', 'HR & Policies', 'Product', 'Finance', 'Legal'];

  const filteredFiles = files.filter(f => {
    const matchesFolder = selectedFolder === 'All' || f.folder === selectedFolder;
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesFolder && matchesSearch;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const uploaded = e.target.files[0];

    const newFileItem: FileItem = {
      id: `file_${Date.now()}`,
      name: uploaded.name,
      size: `${(uploaded.size / (1024 * 1024)).toFixed(2)} MB`,
      type: uploaded.type || 'application/octet-stream',
      uploadedAt: new Date().toISOString().split('T')[0],
      folder: 'Finance',
      tags: ['Uploaded', 'Vault'],
      ocrStatus: 'processed',
      indexed: true
    };

    addFile(newFileItem);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <FolderKanban className="w-6 h-6 text-brand-400" /> Secure File Vault & OCR Scanner
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Store, search, convert, and run AI OCR document extraction with automatic version history.
          </p>
        </div>

        <label className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-purple-600 text-white font-semibold text-xs cursor-pointer hover:shadow-lg transition-all flex items-center gap-2 w-fit">
          <Upload className="w-4 h-4" /> Upload Document
          <input type="file" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* Search & Folder Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="AI Search files by name, tags, or OCR content..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedFolder === folder ? 'bg-brand-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>
      </div>

      {/* File Table */}
      <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
        <div className="grid grid-cols-12 text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 pb-2 border-b border-slate-800">
          <div className="col-span-5">File Name & Tags</div>
          <div className="col-span-2 hidden sm:block">Folder</div>
          <div className="col-span-2 hidden md:block">Size / Date</div>
          <div className="col-span-3 text-right">AI Actions</div>
        </div>

        {filteredFiles.map((file) => (
          <div
            key={file.id}
            className="grid grid-cols-12 items-center px-3 py-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
          >
            <div className="col-span-5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-500/10 text-brand-400">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-semibold text-slate-100">{file.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  {file.tags.map((tag, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] text-slate-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-2 hidden sm:block text-slate-300 font-medium">
              {file.folder}
            </div>

            <div className="col-span-2 hidden md:block text-slate-400 text-[11px]">
              <div>{file.size}</div>
              <div className="text-[10px] text-slate-500">{file.uploadedAt}</div>
            </div>

            <div className="col-span-7 sm:col-span-5 md:col-span-3 flex items-center justify-end gap-2">
              <button
                onClick={() => setOcrModalFile(file)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1 border border-slate-700"
                title="Run AI OCR Text Extraction"
              >
                <ScanText className="w-3.5 h-3.5 text-brand-400" /> OCR
              </button>
              <button
                onClick={() => alert(`Secure Sharing URL copied for ${file.name}`)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
                title="Share Secure Link"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* OCR Preview Modal */}
      {ocrModalFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <ScanText className="w-4 h-4 text-brand-400" /> AI OCR Text Extraction ({ocrModalFile.name})
              </h3>
              <button onClick={() => setOcrModalFile(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl text-xs font-mono text-slate-300 space-y-2 border border-slate-800">
              <div className="text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> OCR Processing Complete (Confidence 99.4%)
              </div>
              <p className="leading-relaxed">
                Extracted Document Body: "CONFIDENTIAL OMNIAGENT AGREEMENT - Section 4.2: All data streams routed through Groq inference API shall be encrypted at rest with AES-256 and subject to tenant security policies."
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOcrModalFile(null)}
                className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
