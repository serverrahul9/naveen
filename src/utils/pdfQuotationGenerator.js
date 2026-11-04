import { jsPDF } from 'jspdf';
import { formatINRForPDF } from './mediaStorage';

/**
 * Generates and downloads a crisp, vector-rendered PDF Quotation.
 * Default layout ('mobile') uses a mobile-responsive single-column portrait viewport
 * with dynamic height and large readable typography so it looks sharp on any smartphone
 * screen (WhatsApp preview, iOS/Android viewer) as well as desktop.
 */
export function downloadQuotationPDF({
  quotationNumber,
  dateStr,
  validUntilStr,
  siteData,
  quotationConfig,
  clientName,
  clientBrand,
  clientPhone,
  clientEmail,
  clientNotes,
  category,
  selectedCustomizations,
  videoCount,
  basePricePerVideo,
  _customizationsPerVideoTotal,
  singleVideoPrice,
  subtotalAllVideos,
  discountPercent,
  discountAmount,
  grandTotal,
  layoutMode = 'mobile', // 'mobile' | 'a4'
}) {
  const isMobileLayout = layoutMode === 'mobile';
  const pageWidth = isMobileLayout ? 115 : 210;
  // Calculate dynamic height for mobile so all customizations fit on one seamless scrollable sheet
  const estimatedHeight = isMobileLayout
    ? Math.max(215, 165 + (selectedCustomizations.length || 1) * 11 + (clientNotes ? 18 : 0))
    : 297;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: isMobileLayout ? [pageWidth, estimatedHeight] : 'a4',
  });

  const margin = isMobileLayout ? 7 : 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // 1. Top Dark Cinema Header Banner
  const headerHeight = isMobileLayout ? 36 : 42;
  doc.setFillColor(13, 14, 18);
  doc.rect(0, 0, pageWidth, headerHeight, 'F');

  // Gold Accent Top Strip
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, pageWidth, 2.2, 'F');

  // Brand Name & Badge
  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 8 : 9);
  doc.text(
    (siteData.brandName || 'NAVEEN STUDIO').toUpperCase() + '  |  OFFICIAL QUOTATION',
    margin,
    isMobileLayout ? 10 : 13
  );

  // Quotation Name (Managed by Naveen)
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 12.5 : 16);
  const titleLines = doc.splitTextToSize(
    quotationConfig?.quotationName || 'VIDEO EDITING QUOTATION',
    contentWidth
  );
  doc.text(titleLines.slice(0, 2), margin, isMobileLayout ? 17 : 21);

  // Quote Meta in Header
  doc.setTextColor(180, 185, 200);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobileLayout ? 7.5 : 8.5);
  doc.text(
    `Quote ID: ${quotationNumber}   •   Date: ${dateStr}   •   Valid Until: ${validUntilStr}`,
    margin,
    headerHeight - 5
  );

  y = headerHeight + 6;

  // 2. Client & Creator Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, isMobileLayout ? 24 : 26, 2.5, 2.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 7.5 : 8.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PREPARED FOR CLIENT:', margin + 3.5, y + 6);
  doc.text('EDITOR / STUDIO:', margin + contentWidth * 0.52, y + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(isMobileLayout ? 9 : 10);
  doc.text(
    (clientName || 'Valued Client').slice(0, 26),
    margin + 3.5,
    y + 11.5
  );
  doc.text(
    (siteData.name || 'Naveen').slice(0, 26),
    margin + contentWidth * 0.52,
    y + 11.5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobileLayout ? 7.5 : 8.5);
  doc.setTextColor(71, 85, 105);
  const clientSub = [clientBrand, clientPhone, clientEmail].filter(Boolean).join(' • ') || 'Direct Website Estimate';
  doc.text(clientSub.slice(0, 32), margin + 3.5, y + 16.5);
  doc.text(
    `${siteData.whatsappDisplay || ''} • ${siteData.email || ''}`.slice(0, 35),
    margin + contentWidth * 0.52,
    y + 16.5
  );

  doc.setTextColor(217, 119, 6);
  doc.setFont('helvetica', 'bold');
  doc.text(
    `Category: ${category?.name || 'Custom Video Edit'}`,
    margin + 3.5,
    y + 21.5
  );
  doc.text(
    `Currency: INR (Indian Rupees)`,
    margin + contentWidth * 0.52,
    y + 21.5
  );

  y += (isMobileLayout ? 24 : 26) + 6;

  // 3. Per-Video Price Breakdown Header
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, contentWidth, 8, 1.5, 1.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 8 : 9);
  doc.text('ITEMIZED BREAKDOWN (PRICE PER 1 VIDEO)', margin + 3, y + 5.3);
  doc.text('RATE / VIDEO', margin + contentWidth - 3, y + 5.3, { align: 'right' });

  y += 10;

  // Base Category Row
  doc.setFillColor(255, 251, 235);
  doc.setDrawColor(253, 230, 138);
  doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 8.5 : 9.5);
  doc.text(
    `Base Format: ${category?.name || 'Standard Video Edit'}`,
    margin + 3,
    y + 6.2
  );
  doc.setTextColor(180, 83, 9);
  doc.text(formatINRForPDF(basePricePerVideo), margin + contentWidth - 3, y + 6.2, {
    align: 'right',
  });

  y += 12;

  // Selected Customizations List
  if (selectedCustomizations.length === 0) {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'FD');
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(isMobileLayout ? 8 : 9);
    doc.text('No extra per-video customizations selected (Base edit included)', margin + 3, y + 5.8);
    doc.text('Rs. 0', margin + contentWidth - 3, y + 5.8, { align: 'right' });
    y += 11;
  } else {
    selectedCustomizations.forEach((cust, idx) => {
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(margin, y, contentWidth, 9.5, 1.5, 1.5, 'FD');

      doc.setTextColor(30, 41, 59);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(isMobileLayout ? 8 : 9);
      const custTitle = `+ ${cust.name}`.slice(0, isMobileLayout ? 40 : 65);
      doc.text(custTitle, margin + 3, y + 6);

      doc.setTextColor(5, 150, 105);
      doc.text(
        `+ ${formatINRForPDF(cust.pricePerVideo)}`,
        margin + contentWidth - 3,
        y + 6,
        { align: 'right' }
      );
      y += 10.5;
    });
  }

  y += 2;

  // 4. Single Video Rate & Quantity Multiplier Calculation Box
  const calcBoxHeight = discountAmount > 0 ? 34 : 26;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, calcBoxHeight, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobileLayout ? 8.5 : 9.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Customized Price Per 1 Video (Base + ${selectedCustomizations.length} Add-ons):`,
    margin + 3.5,
    y + 7
  );
  doc.setFont('helvetica', 'bold');
  doc.text(formatINRForPDF(singleVideoPrice), margin + contentWidth - 3.5, y + 7, {
    align: 'right',
  });

  doc.setFont('helvetica', 'normal');
  doc.text(
    `Number of Videos Multiplier:`,
    margin + 3.5,
    y + 14
  );
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `x ${videoCount} ${videoCount === 1 ? 'Video' : 'Videos'}`,
    margin + contentWidth - 3.5,
    y + 14,
    { align: 'right' }
  );

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    `Subtotal (${formatINRForPDF(singleVideoPrice)} x ${videoCount}):`,
    margin + 3.5,
    y + 21
  );
  doc.setFont('helvetica', 'bold');
  doc.text(formatINRForPDF(subtotalAllVideos), margin + contentWidth - 3.5, y + 21, {
    align: 'right',
  });

  if (discountAmount > 0) {
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.text(
      `Volume Discount (${discountPercent}% OFF for ${videoCount} videos):`,
      margin + 3.5,
      y + 28
    );
    doc.text(
      `- ${formatINRForPDF(discountAmount)}`,
      margin + contentWidth - 3.5,
      y + 28,
      { align: 'right' }
    );
  }

  y += calcBoxHeight + 5;

  // 5. Grand Total Banner (Dark + Gold Highlight)
  doc.setFillColor(13, 14, 18);
  doc.roundedRect(margin, y, contentWidth, 16, 2.5, 2.5, 'F');

  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 8.5 : 10);
  doc.text('TOTAL ESTIMATED INVESTMENT (INR)', margin + 4, y + 7);

  doc.setTextColor(180, 185, 200);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobileLayout ? 7 : 8);
  doc.text(
    `${videoCount} ${category?.name || 'Video'}(s) with ${selectedCustomizations.length} customization(s)`,
    margin + 4,
    y + 12.5
  );

  doc.setTextColor(245, 158, 11);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 13 : 16);
  doc.text(formatINRForPDF(grandTotal), margin + contentWidth - 4, y + 10.5, {
    align: 'right',
  });

  y += 21;

  // Optional Client Notes
  if (clientNotes && clientNotes.trim()) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(isMobileLayout ? 7.5 : 8.5);
    doc.setTextColor(51, 65, 85);
    doc.text('CLIENT PROJECT NOTES:', margin, y);
    y += 4;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const noteLines = doc.splitTextToSize(clientNotes.trim(), contentWidth);
    doc.text(noteLines.slice(0, 3), margin, y);
    y += noteLines.slice(0, 3).length * 4 + 3;
  }

  // Terms & Direct Contact Footer
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + contentWidth, y);
  y += 4.5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(isMobileLayout ? 7 : 8);
  doc.setTextColor(71, 85, 105);
  doc.text('TERMS & DIRECT BOOKING:', margin, y);
  y += 3.8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(isMobileLayout ? 6.8 : 7.8);
  doc.setTextColor(100, 116, 139);
  const termsText =
    quotationConfig?.termsAndNotes ||
    '50% advance to start project. Includes 2 free revision rounds per video.';
  const termLines = doc.splitTextToSize(termsText, contentWidth);
  doc.text(termLines.slice(0, 4), margin, y);
  y += termLines.slice(0, 4).length * 3.5 + 3;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(
    `Confirm Booking on WhatsApp: ${siteData.whatsappDisplay}  |  Email: ${siteData.email}`,
    margin,
    y
  );

  const safeName = (clientName || 'Client').replace(/[^a-zA-Z0-9_-]/g, '_');
  doc.save(`Naveen-Quotation-${quotationNumber}-${safeName}.pdf`);
}
