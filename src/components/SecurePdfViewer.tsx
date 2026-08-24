'use client';
import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, X } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SecurePdfViewerProps {
  url: string;
  title: string;
  onClose: () => void;
}

export default function SecurePdfViewer({ url, title, onClose }: SecurePdfViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInput, setPageInput] = useState('1');
  const [scale, setScale] = useState(1.2);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPageNumber(1);
    setPageInput('1');
  }

  const changePage = (offset: number) => {
    setPageNumber(prevPageNumber => {
      const newPage = prevPageNumber + offset;
      if (numPages && (newPage < 1 || newPage > numPages)) {
        return prevPageNumber;
      }
      setPageInput(newPage.toString());
      return newPage;
    });
  };

  const handlePageInput = (e: React.FormEvent) => {
    e.preventDefault();
    const newPage = parseInt(pageInput);
    if (!isNaN(newPage) && numPages && newPage >= 1 && newPage <= numPages) {
      setPageNumber(newPage);
    } else {
      setPageInput(pageNumber.toString()); // Revert if invalid
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.6));

  return (
    <div 
      className="flex flex-col h-full bg-white dark:bg-slate-900 md:rounded-2xl overflow-hidden transition-colors" 
      onContextMenu={e => e.preventDefault()} // Prevent right click
    >
      {/* Unified Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-4 py-2 sm:py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 gap-3 sm:gap-0 shrink-0 transition-colors">
        
        {/* Title & Close Button (Mobile Top, Desktop Left) */}
        <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-4">
          <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-white truncate max-w-[200px] sm:max-w-[300px] transition-colors">{title}</h3>
          <button 
            onClick={onClose}
            className="sm:hidden p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 sm:gap-2 bg-slate-200/50 dark:bg-slate-900/50 rounded-lg p-1 transition-colors">
          <button 
            onClick={handleZoomOut}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
          <span className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-medium min-w-[36px] sm:min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={handleZoomIn}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 rounded transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Pagination & Close (Desktop) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-2 bg-slate-200/50 dark:bg-slate-900/50 rounded-lg p-1 transition-colors">
            <button 
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <form onSubmit={handlePageInput} className="flex items-center gap-1.5 text-[10px] sm:text-sm font-medium text-slate-700 dark:text-slate-200">
              <span className="hidden sm:inline">Page</span>
              <input
                type="text"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={handlePageInput}
                className="w-8 sm:w-10 text-center bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-red-500 transition-colors text-slate-900 dark:text-white"
              />
              <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">of {numPages || '--'}</span>
            </form>
            
            <button 
              onClick={() => changePage(1)}
              disabled={numPages === null || pageNumber >= numPages}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <button 
            onClick={onClose}
            className="hidden sm:block p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700 rounded-lg transition-colors cursor-pointer ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* PDF Container */}
      <div className="flex-1 overflow-auto bg-slate-100/50 dark:bg-slate-950 flex justify-center py-6 px-4 custom-scrollbar transition-colors">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-3 mt-20">
              <Loader2 className="w-8 h-8 animate-spin text-red-500" />
              <p className="text-sm font-bold animate-pulse text-slate-700 dark:text-slate-300">Ebook লোড হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
            </div>
          }
          error={
            <div className="text-red-500 dark:text-red-400 text-sm mt-20 font-medium text-center px-4">
              Ebook লোড করতে সমস্যা হয়েছে। দয়া করে একটু পর আবার চেষ্টা করুন।
            </div>
          }
          className="flex justify-center"
        >
          <Page 
            pageNumber={pageNumber} 
            scale={scale} 
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-2xl shadow-black/20 dark:shadow-black/50 transition-shadow"
          />
        </Document>
      </div>
    </div>
  );
}
