import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generates a professional PDF catalog for the medical equipment.
 * @param {Array} products - List of products from the database
 * @param {Object} options - Branding and contact info
 */
export const generateProfessionalCatalog = async (products, options = {}) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  // Colors
  const primaryColor = [25, 118, 210]; // Medical Blue
  const secondaryColor = [0, 172, 193]; // Cyan
  const textColor = [33, 33, 33];
  const lightGray = [245, 245, 245];

  // 1. ADD HEADER
  // Draw top bar
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Text in header
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('AAZ INTERNATIONAL', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Premium Medical Equipment & Surgical Instruments', 20, 27);
  
  // Right side header info
  doc.setFontSize(9);
  doc.text('Date: ' + new Date().toLocaleDateString(), pageWidth - 60, 15);
  doc.text('Ref: AAZ/CAT/' + new Date().getFullYear(), pageWidth - 60, 20);
  doc.text('Contact: +92 345 3450644', pageWidth - 60, 25);
  doc.text('Email: aazint808@gmail.com', pageWidth - 60, 30);

  // 2. TITLE BAR
  doc.setFillColor(...lightGray);
  doc.rect(0, 40, pageWidth, 15, 'F');
  doc.setTextColor(...primaryColor);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL PRODUCT PORTFOLIO - INSTITUTIONAL GRADE', pageWidth / 2, 50, { align: 'center' });

  // 3. PRODUCT TABLE
  const tableRows = products.map((p, index) => [
    index + 1,
    p.name || 'N/A',
    p.category?.name || 'Medical Supply',
    p.sku || 'N/A',
    (p.description ? p.description.substring(0, 120) + '...' : 'Professional grade equipment for clinical use.')
  ]);

  autoTable(doc, {
    startY: 65,
    head: [['#', 'Product Name', 'Department', 'SKU / Model', 'Technical Specifications']],
    body: tableRows,
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: textColor,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50, fontStyle: 'bold' },
      2: { cellWidth: 35 },
      3: { cellWidth: 30 },
      4: { cellWidth: 'auto' }
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    margin: { top: 60, left: 15, right: 15, bottom: 25 },
    didDrawPage: (data) => {
      // 4. FOOTER
      const str = 'Page ' + doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      
      // Line at bottom
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, pageHeight - 15, pageWidth - 15, pageHeight - 15);
      
      doc.setTextColor(100);
      doc.text('AAZ International Enterprises - Clinical Technology Solutions', 15, pageHeight - 10);
      doc.text(str, pageWidth - 25, pageHeight - 10);
    }
  });

  // 5. SAVE
  doc.save(`AAZ_Medical_Catalog_${new Date().getFullYear()}.pdf`);
};
