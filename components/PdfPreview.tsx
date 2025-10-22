import React, { useRef, useEffect, useState, useCallback } from 'react';
import { LoaderIcon, XCircleIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

// Declare the global pdfjsLib object provided by the script tag in index.html
declare const pdfjsLib: any;

interface PdfPreviewProps {
  fileUrl: string;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({ fileUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfDoc = useRef<any>(null); // To store the loaded PDF document instance
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isNavigable, setIsNavigable] = useState(false);

  // Memoized function to render a specific page
  const renderPage = useCallback(async (pageNum: number) => {
    if (!pdfDoc.current) return;

    try {
      setLoading(true);
      const page = await pdfDoc.current.getPage(pageNum);
      
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;
      
      const container = canvas.parentElement;
      if (!container) return;

      // Render at a high resolution and let CSS scale it down for crispness.
      const viewport = page.getViewport({ scale: 2 });
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

    } catch (e) {
      console.error('Error rendering page:', e);
      setError('Could not display PDF page.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Effect for initially loading the PDF document
  useEffect(() => {
    let isMounted = true;
    
    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      setCurrentPage(1); // Reset to first page on new file

      try {
        const loadingTask = pdfjsLib.getDocument(fileUrl);
        const pdf = await loadingTask.promise;
        pdfDoc.current = pdf;
        
        if (!isMounted) return;
        
        const totalPages = pdf.numPages;
        setNumPages(totalPages);

        // Enable navigation only for documents with 50 pages or less
        if (totalPages > 0 && totalPages <= 50) {
          setIsNavigable(true);
        } else {
          setIsNavigable(false);
        }

      } catch (e) {
        console.error('Error loading PDF:', e);
        if (isMounted) setError('Could not load PDF document.');
      } finally {
         if (isMounted) setLoading(false);
      }
    };
    
    if (fileUrl && typeof pdfjsLib !== 'undefined') {
      loadPdf();
    } else if (typeof pdfjsLib === 'undefined') {
      setError('PDF viewer library is not loaded.');
      setLoading(false);
    }

    return () => {
      isMounted = false;
      pdfDoc.current = null; // Clean up the stored PDF instance
    };
  }, [fileUrl]);

  // Effect for rendering the correct page when currentPage or navigability changes
  useEffect(() => {
    if (pdfDoc.current) {
      // Render the current page if navigable, otherwise always render page 1
      const pageToRender = isNavigable ? currentPage : 1;
      renderPage(pageToRender);
    }
  }, [currentPage, isNavigable, renderPage]);


  const goToPrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages));

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800">
      {loading && (
        <div className="text-center text-slate-500 dark:text-slate-400">
          <LoaderIcon className="h-12 w-12 mx-auto animate-spin" />
          <p className="mt-2 text-sm">Loading Preview...</p>
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 dark:text-red-400 p-4">
            <XCircleIcon className="h-12 w-12 mx-auto" />
            <p className="mt-2 text-sm font-medium">{error}</p>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: loading || error ? 'none' : 'block', width: '100%', height: '100%', objectFit: 'contain' }} />
      
      {!loading && !error && numPages > 0 && (
        <>
          {isNavigable ? (
            <div className="absolute bottom-2 inset-x-2 flex justify-between items-center bg-black/40 text-white text-sm px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <button 
                onClick={goToPrevPage} 
                disabled={currentPage <= 1} 
                className="disabled:opacity-40 disabled:cursor-not-allowed p-1"
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="font-medium">Page {currentPage} of {numPages}</span>
              <button 
                onClick={goToNextPage} 
                disabled={currentPage >= numPages} 
                className="disabled:opacity-40 disabled:cursor-not-allowed p-1"
                aria-label="Next page"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
              Preview: Page 1 of {numPages}
            </div>
          )}
        </>
      )}
    </div>
  );
};