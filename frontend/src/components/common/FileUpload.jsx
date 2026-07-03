import React, { useRef, useState } from 'react';
import { HiOutlineCloudUpload, HiOutlineDocumentText, HiOutlineX } from 'react-icons/hi';

export const FileUpload = ({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5, // 5MB
  multiple = false,
  preview = true
}) => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files) => {
    const validFiles = [];
    const sizeLimit = maxSize * 1024 * 1024;

    for (let file of files) {
      if (file.size > sizeLimit) {
        alert(`File ${file.name} exceeds ${maxSize}MB limit`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      const updated = multiple ? [...selectedFiles, ...validFiles] : [validFiles[0]];
      setSelectedFiles(updated);
      onFileSelect(multiple ? updated : updated[0]);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (idx) => {
    const updated = selectedFiles.filter((_, i) => i !== idx);
    setSelectedFiles(updated);
    onFileSelect(multiple ? updated : updated[0] || null);
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-950/10'
            : 'border-surface-300 dark:border-surface-700 hover:border-primary-500 dark:hover:border-primary-500 bg-white dark:bg-surface-800'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <HiOutlineCloudUpload className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          Click to upload or drag & drop
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Supported file types: {accept} (Max {maxSize}MB)
        </p>
      </div>

      {preview && selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {selectedFiles.map((file, idx) => {
            const isImage = file.type.startsWith('image/');
            const previewUrl = isImage ? URL.createObjectURL(file) : null;

            return (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 p-2">
                {isImage && previewUrl ? (
                  <img src={previewUrl} alt="preview" className="h-24 w-full object-cover rounded-md" />
                ) : (
                  <div className="h-24 w-full flex flex-col items-center justify-center text-gray-500">
                    <HiOutlineDocumentText className="h-8 w-8" />
                    <p className="text-[10px] text-center mt-1 truncate w-full px-1">{file.name}</p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(idx);
                  }}
                  className="absolute top-1.5 right-1.5 p-1 bg-rose-600 hover:bg-rose-700 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                >
                  <HiOutlineX className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};