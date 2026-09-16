import React, { useRef, useState } from 'react';
import { X, Download, Upload, FileText, RefreshCw, CheckCircle2, AlertCircle, Github } from 'lucide-react';
import { storageService } from '../services/storageService';
import { githubSyncService } from '../services/githubSyncService';
import { INITIAL_BOOKS } from '../data/initialBooks';

export default function ImportExportModal({
  isOpen,
  onClose,
  books,
  onUpdateLibrary,
  githubConfig,
  syncStatus,
  onSaveGithubConfig,
  onSyncStatusChange
}) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState({ type: '', message: '' });
  const [isResetConfirm, setIsResetConfirm] = useState(false);
  const [githubForm, setGithubForm] = useState(githubConfig);

  React.useEffect(() => {
    setGithubForm(githubConfig);
  }, [githubConfig]);

  if (!isOpen) return null;

  const handleExportJSON = () => {
    storageService.exportToJSON(books);
  };

  const handleExportCSV = () => {
    storageService.exportToCSV(books);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedBooks = await storageService.importFromJSON(file);
      onUpdateLibrary(importedBooks);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${importedBooks.length} books into your shelf!`
      });
    } catch (err) {
      setImportStatus({
        type: 'error',
        message: err.message || 'Failed to import JSON file. Please verify format.'
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleResetToSamples = () => {
    onUpdateLibrary(INITIAL_BOOKS);
    setIsResetConfirm(false);
    setImportStatus({
      type: 'success',
      message: 'Library reset to sample starter books.'
    });
  };

  const handleLoadFromGithub = async () => {
    onSyncStatusChange({ type: '', message: '' });
    try {
      const booksFromGithub = await githubSyncService.loadBooks(githubForm);
      if (!booksFromGithub) {
        throw new Error('No GitHub data file exists yet. Save this library first.');
      }
      onUpdateLibrary(booksFromGithub);
      onSaveGithubConfig(githubForm);
      onSyncStatusChange({ type: 'success', message: `Loaded ${booksFromGithub.length} books from GitHub.` });
    } catch (error) {
      onSyncStatusChange({ type: 'error', message: error.message });
    }
  };

  const handleSaveToGithub = async () => {
    onSyncStatusChange({ type: '', message: '' });
    try {
      onSaveGithubConfig(githubForm);
      await githubSyncService.saveBooks(books, githubForm);
      onSyncStatusChange({ type: 'success', message: 'Library saved to GitHub.' });
    } catch (error) {
      onSyncStatusChange({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#FAF8F5]">
          <h2 className="font-serif font-bold text-lg text-slate-900">
            Library Data & Backup
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Notification */}
        {importStatus.message && (
          <div className={`p-4 text-xs font-medium flex items-center gap-2 ${
            importStatus.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
              : 'bg-rose-50 text-rose-800 border-b border-rose-100'
          }`}>
            {importStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        {syncStatus?.message && (
          <div className={`p-4 text-xs font-medium flex items-center gap-2 ${
            syncStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-100'
              : 'bg-rose-50 text-rose-800 border-b border-rose-100'
          }`}>
            {syncStatus.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            <span>{syncStatus.message}</span>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Export / Backup Your Collection
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Download your books anytime so you never lose your library.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleExportJSON}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-3"
              >
                <div className="p-2 bg-amber-100 text-amber-900 rounded-lg">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Export JSON</div>
                  <div className="text-[10px] text-slate-400">Full backup</div>
                </div>
              </button>

              <button
                onClick={handleExportCSV}
                className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-left transition-colors flex items-center gap-3"
              >
                <div className="p-2 bg-emerald-100 text-emerald-900 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Export CSV</div>
                  <div className="text-[10px] text-slate-400">Excel spreadsheet</div>
                </div>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Restore / Import Backup
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Upload a previously exported JSON backup to restore your library.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 bg-white border border-dashed border-slate-300 hover:border-amber-700 rounded-xl text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 hover:bg-amber-50/40 transition-colors"
            >
              <Upload className="w-4 h-4 text-amber-800" />
              <span>Select JSON Backup File to Import</span>
            </button>
          </div>

          {/* GitHub Sync Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <Github className="w-4 h-4 text-slate-700" />
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Sync Across Browsers with GitHub
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Your library is stored in a JSON file in your GitHub repository. Public repositories can be read anywhere; saving requires a fine-grained token with Contents read/write access.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                ['owner', 'GitHub owner'],
                ['repo', 'Repository'],
                ['branch', 'Branch'],
                ['path', 'File path']
              ].map(([field, label]) => (
                <label key={field} className="text-[10px] font-semibold text-slate-500">
                  {label}
                  <input
                    value={githubForm[field]}
                    onChange={(event) => setGithubForm(prev => ({ ...prev, [field]: event.target.value }))}
                    className="mt-1 w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </label>
              ))}
            </div>
            <label className="block mt-2 text-[10px] font-semibold text-slate-500">
              Fine-grained GitHub token
              <input
                type="password"
                value={githubForm.token}
                onChange={(event) => setGithubForm(prev => ({ ...prev, token: event.target.value }))}
                placeholder="Required for saving"
                className="mt-1 w-full px-2.5 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
              />
            </label>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleLoadFromGithub}
                className="flex-1 py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Load from GitHub
              </button>
              <button
                onClick={handleSaveToGithub}
                className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 rounded-lg text-xs font-semibold text-white flex items-center justify-center gap-2"
              >
                <Github className="w-3.5 h-3.5" /> Save to GitHub
              </button>
            </div>
          </div>

          {/* Reset Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-700">Sample Books</h4>
                <p className="text-[11px] text-slate-400">Reset library to initial curated collection</p>
              </div>
              {!isResetConfirm ? (
                <button
                  onClick={() => setIsResetConfirm(true)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 rounded-lg font-medium transition-colors"
                >
                  Reset
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleResetToSamples}
                    className="px-2.5 py-1 text-xs bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setIsResetConfirm(false)}
                    className="px-2.5 py-1 text-xs text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 bg-[#FAF8F5] border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
