// Use global variables from CDNs
declare const html2canvas: any;
declare const jspdf: any;

// Declare the full Android streaming interface so TypeScript knows it exists
declare const Android: {
    openFileStream(mimeType: string, fileName: string): void;
    appendToFile(base64Chunk: string): void;
    closeFileStream(): void;
};

/**
 * Generates a PDF from an HTML element and either saves it via the native Android interface
 * or downloads it in the browser.
 * @param element The HTML element to capture.
 * @param fileName The desired name for the output file (without extension).
 * @returns A Promise that resolves when the process is complete or rejects on error.
 */
export const generatePdf = (element: HTMLElement, fileName: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    html2canvas(element, { 
        useCORS: true, 
        backgroundColor: window.getComputedStyle(document.body).backgroundColor 
    }).then((canvas: HTMLCanvasElement) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jspdf.jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4'
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Check if the native Android interface is available
      if (typeof Android !== 'undefined' && Android.openFileStream) {
          // --- NATIVE ANDROID APP LOGIC ---
          const finalFileName = `${fileName}.pdf`;
          // Get the entire PDF as a Base64 string, but without the data URI prefix
          const pureBase64 = pdf.output('datauristring').substring(pdf.output('datauristring').indexOf(',') + 1);
          const chunkSize = 1024 * 64; // 64KB chunks

          try {
              // 1. Tell Android to open the file for writing
              Android.openFileStream('application/pdf', finalFileName);

              // 2. Send the file in small chunks
              for (let i = 0; i < pureBase64.length; i += chunkSize) {
                  const chunk = pureBase64.substring(i, i + chunkSize);
                  Android.appendToFile(chunk);
              }

              // 3. Tell Android to close the file and finish the process
              Android.closeFileStream();
              resolve(); // Resolve the promise on success
          } catch (e) {
              console.error("Error communicating with native Android interface:", e);
              reject(e); // Reject the promise on error
          }

      } else {
          // --- BROWSER FALLBACK LOGIC ---
          pdf.save(`${fileName}.pdf`);
          resolve(); // Resolve the promise after the download is initiated
      }

    }).catch((error: Error) => {
        console.error("Error during html2canvas PDF generation:", error);
        reject(error); // Reject the promise if html2canvas fails
    });
  });
};
