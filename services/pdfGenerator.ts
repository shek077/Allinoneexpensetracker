// Use global variables from CDNs
declare const html2canvas: any;
declare const jspdf: any;

// Declare the full Android streaming interface
declare const Android: {
    openFileStream(mimeType: string, fileName: string): void;
    appendToFile(base64Chunk: string): void;
    closeFileStream(): void;
};

export const generatePdf = (element: HTMLElement, fileName: string): void => {
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

    // --- THE DEFINITIVE FIX ---
    if (typeof Android !== 'undefined' && Android.openFileStream) {
        // App environment: Use the streaming interface
        const finalFileName = `${fileName}.pdf`;
        // Get the entire PDF as a Base64 string, but without the data URI prefix
        const pureBase64 = pdf.output('datauristring').substring(pdf.output('datauristring').indexOf(',') + 1);
        const chunkSize = 1024 * 64; // 64KB chunks

        // 1. Tell Android to open the file for writing
        Android.openFileStream('application/pdf', finalFileName);

        // 2. Send the file in small chunks
        for (let i = 0; i < pureBase64.length; i += chunkSize) {
            const chunk = pureBase64.substring(i, i + chunkSize);
            Android.appendToFile(chunk);
        }

        // 3. Tell Android to close the file
        Android.closeFileStream();

    } else {
        // Browser environment: Fall back to the default download
        pdf.save(`${fileName}.pdf`);
    }

  }).catch((error: Error) => {
      console.error("Error generating PDF:", error);
  });
};
