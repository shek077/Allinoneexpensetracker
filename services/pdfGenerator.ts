
// Use global variables from CDNs
declare const html2canvas: any;
declare const jspdf: any;

export const generatePdf = (element: HTMLElement, fileName: string): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  html2canvas(element, { 
      useCORS: true, 
      backgroundColor: window.getComputedStyle(document.body).backgroundColor 
  }).then((canvas: HTMLCanvasElement) => {
    const imgData = canvas.toDataURL('image/png');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    const pdf = new jspdf.jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    pdf.save(`${fileName}.pdf`);
  }).catch((error: Error) => {
      console.error("Error generating PDF:", error);
  });
};
