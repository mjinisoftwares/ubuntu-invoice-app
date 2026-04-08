import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

export const generatePDF = async (filename: string) => {
  const element = document.getElementById("invoice-document");
  
  if (!element) {
    console.error("Invoice document element not found for PDF generation.");
    return;
  }

  try {
    // Generate a screenshot using html-to-image which properly supports modern CSS (like lab colors)
    const imgData = await toPng(element, {
      pixelRatio: 2, // Higher pixel ratio for better resolution
      backgroundColor: "#ffffff", // Ensure solid white background 
    });

    // A4 dimensions in mm
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    // Calculate the height proportionally to maintain aspect ratio
    const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;

    // Add the generated image to the PDF
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    // Save the downloaded file
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
