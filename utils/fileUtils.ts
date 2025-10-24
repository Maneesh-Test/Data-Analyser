

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove the "data:mime/type;base64," prefix
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};

export const formatFileSize = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Creates a text file from a string and triggers a download in the browser.
 * @param content The text content to be included in the file.
 * @param filename The desired name for the downloaded file.
 */
export const downloadTextFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  
  document.body.appendChild(anchor);
  anchor.click();
  
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

/**
 * Converts an SVG file to a PNG file using the browser's canvas API.
 * This is used to support SVG uploads for analysis by Gemini, which requires raster image formats.
 * @param svgFile The SVG file to convert.
 * @returns A promise that resolves with the converted PNG file.
 */
export const convertSvgToPng = (svgFile: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const padding = 10;
        canvas.width = img.width + padding * 2;
        canvas.height = img.height + padding * 2;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error('Could not get canvas rendering context.'));
        }
        
        // Fill background with white since PNG supports transparency and SVGs may not have a background.
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, padding, padding);

        canvas.toBlob((blob) => {
          if (!blob) {
            return reject(new Error('Failed to convert canvas to Blob.'));
          }
          const pngFileName = svgFile.name.replace(/\.svg$/i, '.png');
          const pngFile = new File([blob], pngFileName, { type: 'image/png' });
          resolve(pngFile);
        }, 'image/png');
      };

      img.onerror = () => {
        reject(new Error('The SVG file could not be loaded. It might be invalid or contain unsupported features.'));
      };
      
      if (e.target?.result) {
        img.src = e.target.result as string;
      } else {
        reject(new Error('Failed to read SVG file content.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the SVG file.'));
    };

    reader.readAsDataURL(svgFile);
  });
};