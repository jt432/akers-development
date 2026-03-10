'use client';

import { useCallback, useState } from 'react';
import { upload } from '@vercel/blob/client';

export interface UploadedBlobFile {
  name: string;
  size: number;
  url: string;
}

interface FileUploaderProps {
  onFilesChange: (files: UploadedBlobFile[]) => void;
}

export default function FileUploader({ onFilesChange }: FileUploaderProps) {
  const [files, setFiles] = useState<(UploadedBlobFile & { uploading?: boolean; error?: string })[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const acceptedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  const acceptedExtensions = '.pdf,.jpg,.jpeg,.png,.docx';
  const maxFileSize = 25 * 1024 * 1024; // 25MB per file
  const maxFiles = 10;

  const uploadFile = async (file: File): Promise<UploadedBlobFile | null> => {
    try {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const pathname = `uploads/${timestamp}-${safeName}`;

      const blob = await upload(pathname, file, {
        access: 'public',
        handleUploadUrl: '/api/upload-token',
      });

      return {
        name: file.name,
        size: file.size,
        url: blob.url,
      };
    } catch (err) {
      console.error(`Failed to upload ${file.name}:`, err);
      return null;
    }
  };

  const handleFiles = useCallback(
    async (newFiles: FileList | null) => {
      if (!newFiles) return;

      const currentCount = files.filter(f => !f.error).length;
      const toProcess: File[] = [];

      Array.from(newFiles).forEach((file) => {
        if (currentCount + toProcess.length >= maxFiles) return;
        if (file.size > maxFileSize) {
          alert(`${file.name} exceeds the 25MB file size limit.`);
          return;
        }
        const ext = file.name.split('.').pop()?.toLowerCase();
        const validExt = ['pdf', 'jpg', 'jpeg', 'png', 'docx'].includes(ext || '');
        if (!acceptedTypes.includes(file.type) && !validExt) {
          alert(`${file.name} is not an accepted file type. Please upload PDF, JPG, PNG, or DOCX files.`);
          return;
        }
        toProcess.push(file);
      });

      if (toProcess.length === 0) return;

      // Add files in "uploading" state
      const placeholders = toProcess.map(f => ({
        name: f.name,
        size: f.size,
        url: '',
        uploading: true,
      }));
      const updated = [...files, ...placeholders];
      setFiles(updated);

      // Upload each file directly to Vercel Blob
      const results = await Promise.all(toProcess.map(f => uploadFile(f)));

      setFiles(prev => {
        const completed = [...prev];
        let placeholderIdx = prev.length - toProcess.length;

        results.forEach((result, i) => {
          if (result) {
            completed[placeholderIdx + i] = { ...result, uploading: false };
          } else {
            completed[placeholderIdx + i] = {
              ...completed[placeholderIdx + i],
              uploading: false,
              error: 'Upload failed',
            };
          }
        });

        // Filter out failed uploads and notify parent
        const successful = completed.filter(f => f.url && !f.error);
        onFilesChange(successful.map(({ name, size, url }) => ({ name, size, url })));

        return completed.filter(f => !f.error);
      });
    },
    [files, onFilesChange]
  );

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      const successful = updated.filter(f => f.url && !f.error && !f.uploading);
      onFilesChange(successful.map(({ name, size, url }) => ({ name, size, url })));
      return updated;
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div>
      {/* Drop zone */}
      <div
        className={`border-2 border-dashed p-8 text-center transition-colors cursor-pointer
          ${dragActive ? 'border-brand-charcoal bg-brand-cream' : 'border-gray-300 hover:border-brand-stone'}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 text-brand-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-brand-slate">
            <span className="font-semibold text-brand-charcoal">Click to upload</span> or drag
            and drop
          </p>
          <p className="text-sm text-gray-400">
            PDF, JPG, PNG, or DOCX — up to 25MB per file — max {maxFiles} files
          </p>
        </div>
        <input
          id="file-input"
          type="file"
          accept={acceptedExtensions}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between bg-brand-cream px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                {file.uploading ? (
                  <svg className="w-5 h-5 text-brand-stone shrink-0 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-brand-stone shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                )}
                <span className="text-sm text-brand-charcoal truncate">{file.name}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {file.uploading ? 'Uploading...' : formatSize(file.size)}
                </span>
              </div>
              {!file.uploading && (
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-3"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
