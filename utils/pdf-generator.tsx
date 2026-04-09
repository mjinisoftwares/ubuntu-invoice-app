import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

export const generatePDF = async (filename: string) => {
  const element = document.getElementById("invoice-document");

  if (!element) {
    console.error("Invoice document element not found for PDF generation.");
    return;
  }

  try {
    // 1. Capture element exactly as rendered (no resizing)
    const imgData = await toPng(element, {
      pixelRatio: 2,
      backgroundColor: "#ffffff",
      cacheBust: true,
    });

    // 2. Load image
    const img = new Image();
    img.src = imgData;

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    // 3. Create PDF (still A4 page, but content adapts)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();

    // Maintain aspect ratio of captured image
    const pdfHeight = (img.height * pdfWidth) / img.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};