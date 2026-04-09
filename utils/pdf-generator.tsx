import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";

export const generatePDF = async (filename: string) => {
  const element = document.getElementById("invoice-document");
  
  if (!element) {
    console.error("Invoice document element not found for PDF generation.");
    return;
  }

  // 1. Create a wrapper to hold our clone off-screen
  const container = document.createElement("div");
  container.style.position = "fixed"; // Prevents affecting scroll size
  container.style.left = "-9999px"; // Safely out of sight
  container.style.top = "0";
  
  // 2. Clone the element and enforce desktop layout proportions
  const clone = element.cloneNode(true) as HTMLElement;
  const targetWidth = 794; // Standard A4 desktop render width

  clone.style.width = `${targetWidth}px`;
  clone.style.maxWidth = "none";
  clone.style.height = "auto";
  clone.style.margin = "0"; // Strip mx-auto
  
  container.appendChild(clone);
  document.body.appendChild(container);

  try {
    // Retrieve correct height after forcing layout width
    const targetHeight = clone.offsetHeight;

    // 3. Generate a screenshot *directly* from the desktop clone instead of the responsive element
    const imgData = await toPng(clone, {
      pixelRatio: 2, 
      backgroundColor: "#ffffff",
      width: targetWidth, 
      height: targetHeight,
      style: {
        width: `${targetWidth}px`,
        maxWidth: "none",
        margin: "0",
      }
    });

    // 4. Transform image into PDF proportions
    const img = new Image();
    img.src = imgData;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (img.height * pdfWidth) / img.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    // Save the downloaded file
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  } finally {
    // Always clean up the phantom DOM element
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
};
