import React, { useState } from 'react';
import { PackageMaterial } from '../../../types/admin';
import {
  X,
  UploadCloud,
  FileCheck,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

interface ReplaceFileModalProps {
  material: PackageMaterial | null;
  onClose: () => void;
  onConfirmReplace: (
    materialId: string,
    fileData: {
      file_url: string;
      file_name: string;
      file_size: string;
      file_type: string;
    }
  ) => void;
}

export const ReplaceFileModal: React.FC<ReplaceFileModalProps> = ({
  material,
  onClose,
  onConfirmReplace,
}) => {
  if (!material) return null;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileType, setFileType] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const processSelectedFile = (file: File) => {
    setSelectedFile(file);
    setFileName(file.name);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(2);
    setFileSize(`${sizeInMb} MB`);
    const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
    setFileType(ext);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Simulate upload progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const fakeUrl = URL.createObjectURL(selectedFile);
            onConfirmReplace(material.id, {
              file_url: fakeUrl,
              file_name: fileName,
              file_size: fileSize,
              file_type: fileType,
            });
            onClose();
          }, 300);
          return 100;
        }
        return prev + 30;
      });
    }, 120);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Replace Material File
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update the document file while preserving academic tags and permissions
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-6 space-y-5">
          {/* Current File Banner */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <FileText className="w-5 h-5 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {material.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Current: {material.file_name} ({material.file_size})
                </div>
              </div>
            </div>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 shrink-0 capitalize">
              {material.package_type}
            </span>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              Select Replacement File
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20'
                  : 'border-slate-300 dark:border-slate-700 hover:border-blue-400 bg-slate-50/40 dark:bg-slate-800/20'
              }`}
            >
              <input
                type="file"
                id="replace-file-upload-input"
                className="hidden"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
                onChange={handleFileChange}
              />
              <label htmlFor="replace-file-upload-input" className="cursor-pointer block">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse or drag and drop new file here
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Supported: PDF, DOCX, PPTX, XLSX, JPG, PNG, ZIP (Max 50MB)
                </p>
              </label>
            </div>
          </div>

          {/* Selected File Details */}
          {selectedFile && (
            <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {fileName}
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
                  {fileSize}
                </span>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="h-1.5 w-full bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-right text-blue-700 dark:text-blue-300">
                    {uploadProgress}% Uploaded
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || uploadProgress !== null}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-lg shadow-sm transition"
            >
              <span>{uploadProgress !== null ? 'Uploading...' : 'Replace File'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
