import PDFDocument from 'pdfkit';

type SignatureStatus = 'signed' | 'unsigned'

type PdfGenerationOptions = {
  signatureStatus?: SignatureStatus
}

// Brand palette tuned for fast printing: large areas stay white, while the
// gold identity is kept in borders, headers, and small accents.
const COLORS = {
  primary: '#87752B',       // dark gold — headers, borders
  secondary: '#B19938',     // medium gold — subheaders
  accent: '#CCB761',        // light gold — lines, highlights
  lightBg: '#FFFFFF',       // printable white — box backgrounds
  border: '#87752B',        // = primary
  textPrimary: '#1A1A1A',   // near-black — main text
  textSecondary: '#5C5030', // warm brown — labels
  red: '#B91C1C',           // unsigned stamp (status color, unchanged)
  green: '#166534',         // signed stamp (status color, unchanged)
  lightGray: '#D8D0A8',     // warm gray — dividers
  white: '#FFFFFF',
} as const;

export async function generatePDFDocument(
  body: any,
  prescriber: any,
  patient: any,
  options: PdfGenerationOptions = {},
): Promise<Buffer> {
  const buildAddress = (address: {
    street?: string | null
    number?: string | null
    complement?: string | null
    city?: string | null
    state?: string | null
    zipcode?: string | null
  }) => {
    const streetLine = [address.street, address.number, address.complement]
      .map((part) => `${part ?? ''}`.trim())
      .filter(Boolean)
      .join(' ');

    const cityState = [address.city, address.state]
      .map((part) => `${part ?? ''}`.trim())
      .filter(Boolean)
      .join('-');

    return [streetLine, cityState, `${address.zipcode ?? ''}`.trim()]
      .filter(Boolean)
      .join(', ');
  };

  const prescriberTitle = typeof prescriber.title === 'string' ? prescriber.title.trim() : '';
  const prescriberDisplayName = prescriber.full_name;
  const signatureStatus: SignatureStatus = options.signatureStatus === 'signed' ? 'signed' : 'unsigned';
  const signatureFontSource = signatureStatus === 'signed' ? await useStorage('assets:server').getItemRaw('Thesignature.ttf') : null;
  const signatureStamp = signatureStatus === 'signed' ? `${prescriberDisplayName}` : 'DOCUMENTO NÃO ASSINADO';
  const signatureStampColor = signatureStatus === 'signed' ? COLORS.green : COLORS.red;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Page dimensions
    const pageWidth = doc.page.width;   // 595.28
    const pageHeight = doc.page.height; // 841.89
    const margin = 40;
    const contentWidth = pageWidth - 2 * margin;
    const innerMargin = 30;
    const innerWidth = contentWidth - 2 * innerMargin;

    // ============================================================
    // HELPER: draws the full page border/decoration (used on every
    // page, including continuation pages)
    // ============================================================
    function drawPageBorder() {
      // Outer border
      doc.lineWidth(2)
         .strokeColor(COLORS.border)
         .roundedRect(margin, margin, contentWidth, pageHeight - 2 * margin, 8)
         .stroke();
    }

    // ============================================================
    // HELPER: colored section header bar
    // ============================================================
    function drawSectionHeader(x: number, y: number, width: number, title: string) {
      doc.fillColor(COLORS.white)
         .roundedRect(x, y, width, 24, 3)
         .fill();
      doc.lineWidth(0.8)
         .strokeColor(COLORS.accent)
         .roundedRect(x, y, width, 24, 3)
         .stroke();

      doc.fillColor(COLORS.primary)
         .font('Helvetica-Bold')
         .fontSize(11)
         .text(title, x, y + 6, { width, align: 'center' });
    }

    function addContentPage(title?: string) {
      doc.addPage();
      y = margin + 30;
      drawPageBorder();

      if (title) {
        drawSectionHeader(contentX, y, innerWidth, title);
        y += 32;
      }
    }

    function wrapTextLines(text: string, width: number, font: string, fontSize: number) {
      doc.font(font).fontSize(fontSize);

      return `${text}`.replace(/\r\n/g, '\n').split('\n').flatMap((paragraph) => {
        if (!paragraph.trim()) return [''];

        const lines: string[] = [];
        let line = '';

        paragraph.split(/\s+/).forEach((word) => {
          const candidate = line ? `${line} ${word}` : word;
          if (doc.widthOfString(candidate) <= width) {
            line = candidate;
            return;
          }

          if (line) {
            lines.push(line);
            line = '';
          }

          if (doc.widthOfString(word) <= width) {
            line = word;
            return;
          }

          let fragment = '';
          for (const char of word) {
            const fragmentCandidate = fragment + char;
            if (doc.widthOfString(fragmentCandidate) <= width) {
              fragment = fragmentCandidate;
            } else {
              if (fragment) lines.push(fragment);
              fragment = char;
            }
          }
          line = fragment;
        });

        if (line) lines.push(line);
        return lines;
      });
    }

    // ============================================================
    // HELPER: single label+value row
    //
    // FIX: previously `drawField` placed the value at `x + 80`
    // relative to the field origin, but then text() was called with
    // `x + 80` as the starting x — meaning label and value both tried
    // to start from nearly the same x, causing overlap and clipping.
    // Now the label has a fixed pixel width (labelWidth) and the value
    // gets the remaining space, with no continued-text tricks that
    // depend on PDFKit's internal cursor.
    // ============================================================
    function drawField(
      x: number,
      y: number,
      label: string,
      value: string,
      maxWidth: number = 220,
      fontSize: number = 10,
      bold: boolean = false,
    ) {
      const labelWidth = 72;
      const valueWidth = maxWidth - labelWidth;

      doc.fillColor(COLORS.textSecondary)
         .font('Helvetica-Bold')
         .fontSize(fontSize)
         .text(label, x, y, { width: labelWidth, lineBreak: false });

      doc.fillColor(COLORS.textPrimary)
         .font(bold ? 'Helvetica-Bold' : 'Helvetica')
         .fontSize(fontSize)
         .text(value, x + labelWidth, y, { width: valueWidth });
    }

    // ============================================================
    // Draw first page border
    // ============================================================
    drawPageBorder();

    let y = margin + 30;
    const contentX = margin + innerMargin; // left edge of inner content

    // ============================================================
    // HEADER
    // ============================================================
    const headerHeight = 35;
    doc.lineWidth(1).strokeColor(COLORS.accent)
       .roundedRect(contentX, y, innerWidth, headerHeight, 4)
       .stroke();

    doc.fillColor(COLORS.primary)
       .font('Helvetica-Bold')
       .fontSize(20)
       .text('RECEITUÁRIO', contentX, y + 8, { width: innerWidth, align: 'center' });

    y += headerHeight + 10;

    // ============================================================
    // INFO BAR  (date / via)
    // ============================================================
    // const infoBarHeight = 30;
    // doc.fillColor(COLORS.primary)
    //    .roundedRect(contentX, y, innerWidth, infoBarHeight, 3)
    //    .fill();

    // doc.fillColor(COLORS.white)
    //    .font('Helvetica-Bold')
    //    .fontSize(11)
    //    .text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, contentX, y + 9, { width: innerWidth - 15, align: 'right' });

    // y += infoBarHeight + 14;

    // ============================================================
    // PATIENT SECTION
    // ============================================================
    drawSectionHeader(contentX, y, innerWidth, 'DADOS');
    y += 32;

    const patientAddress = buildAddress({
      street: patient.street,
      number: patient.house_number || patient.address_number,
      complement: patient.additional_info || patient.complement,
      city: patient.city,
      state: patient.state,
      zipcode: patient.zipcode,
    });

    const cidText = body?.cid_name || body?.cid_id || '';

// Column geometry
    const colGap = 12;
    const leftColWidth = Math.floor(innerWidth * 0.44);
    const leftColX = contentX + 14;
    
    const rightColInnerPad = 14;
    const rightColWidth = innerWidth - leftColWidth - colGap - rightColInnerPad;
    const rightColX = contentX + leftColWidth + colGap + rightColInnerPad;

    const labelWidth = 72; // must match drawField's labelWidth constant
    
    // FIX 1: The address is in the left column, so use leftColWidth!
    const addrValueWidth = leftColWidth - labelWidth; 
    const cidValueWidth  = rightColWidth - labelWidth;

    const addrText = patientAddress || 'Não informado';
    const cidValueText = cidText || '';

    doc.font('Helvetica').fontSize(10);
    const addrH = doc.heightOfString(addrText, { width: addrValueWidth });
    const cidH  = cidText ? doc.heightOfString(cidValueText, { width: cidValueWidth }) : 0;

    const rowLineH = 14; // single line height for label rows

    // FIX 2: Account for the actual dynamic height of the address (addrH)
    // 3 static rows (Nome, CPF, Telefone) * 22px spacing = 66
    const leftRowsSpacing = 3 * 22; 
    const leftContentHeight = 12 + leftRowsSpacing + Math.max(rowLineH, addrH) + 14;

    const rightContentHeight = 12
      + (cidH > 0 ? 10 + rowLineH + cidH : 0) // CID block (if present)
      + rowLineH // Data label row
      + 14;      // bottom padding

    const patientBoxHeight = Math.max(leftContentHeight, rightContentHeight, 90);
    doc.fillColor(COLORS.white)
       .roundedRect(contentX, y, innerWidth, patientBoxHeight, 4)
       .fill();
    doc.lineWidth(0.5).strokeColor(COLORS.lightGray)
       .roundedRect(contentX, y, innerWidth, patientBoxHeight, 4)
       .stroke();

    // Vertical divider between columns
    const dividerX = contentX + leftColWidth + Math.floor(colGap / 2);
    doc.lineWidth(0.5)
       .strokeColor(COLORS.lightGray)
       .moveTo(dividerX, y + 10)
       .lineTo(dividerX, y + patientBoxHeight - 10)
       .stroke();

    // --- Left column ---
let fieldY = y + 12;
    drawField(leftColX, fieldY, 'Nome:', patient.name || 'Não informado', leftColWidth - 14, 11, true);
    fieldY += 22;
    drawField(leftColX, fieldY, 'CPF:', patient.cpf || 'Não informado', leftColWidth - 14, 10);
    fieldY += 22;
    drawField(leftColX, fieldY, 'Telefone:', patient.phone || 'Não informado', leftColWidth - 14, 10);
    fieldY += 22;
    drawField(leftColX, fieldY, 'Endereço:', addrText, leftColWidth - 14, 10);
    
    // --- Right column ---
    let rightY = y + 12;
    if (cidText) {
      rightY += 10; // gap between address block and CID block
      drawField(rightColX, rightY, 'CID:', cidValueText, rightColWidth, 10);
    }
    // FIX 3: was `14 + (addressLines - 1) * addressLineHeight` which skipped
    // the first line's height. Now we advance by the actual rendered height
    // of the label row (rowLineH) plus the wrapped value height (addrH).
    rightY += rowLineH + cidH; // gap after CID block
    drawField(rightColX, rightY, 'Data: ', new Date().toLocaleDateString('pt-BR'), rightColWidth, 10);


    y += patientBoxHeight + 14;

    // ============================================================
    // PRESCRIPTION SECTION
    // ============================================================
    drawSectionHeader(contentX, y, innerWidth, 'PRESCRIÇÃO');
    y += 32;

    if (!Array.isArray(body?.formulas)) {
      reject(new Error('Formato inválido: formulas deve ser um array.'));
      return;
    }

    const formulas: any[] = body.formulas;

    const formulaTextX = contentX + 44;
    const formulaTextWidth = innerWidth - 58;
    const formulaBottomLimit = pageHeight - margin - 36;
    const formulaPadX = 12;
    const formulaPadTop = 12;
    const formulaPadBottom = 12;
    const formulaNameFontSize = 12;
    const formulaDescFontSize = 10;
    const formulaNameLineHeight = 15;
    const formulaDescLineHeight = 13;
    const formulaTextGap = 6;

    function drawFormulaSegmentBox(segmentY: number, segmentHeight: number) {
      doc.fillColor(COLORS.white)
         .roundedRect(contentX, segmentY, innerWidth, segmentHeight, 4)
         .fill();
      doc.lineWidth(0.5).strokeColor(COLORS.lightGray)
         .roundedRect(contentX, segmentY, innerWidth, segmentHeight, 4)
         .stroke();
    }

    function drawFormulaNumber(index: number, circleY: number) {
      const circleR = 11;
      doc.fillColor(COLORS.primary)
         .circle(contentX + 20, circleY, circleR)
         .fill();
      doc.fillColor(COLORS.white)
         .font('Helvetica-Bold')
         .fontSize(11)
         .text(`${index + 1}`, contentX + 9, circleY - 7, { width: circleR * 2, align: 'center', lineBreak: false });
    }

    formulas.forEach((f, index) => {
      const formulaName = f.formula_name || 'Fórmula';
      const description = f.description || '';
      const nameLines = wrapTextLines(formulaName, formulaTextWidth, 'Helvetica-Bold', formulaNameFontSize);
      const descriptionLines = description
        ? wrapTextLines(description, formulaTextWidth, 'Helvetica', formulaDescFontSize)
        : [];

      let remainingNameLines = [...nameLines];
      let remainingDescriptionLines = [...descriptionLines];
      let isFirstSegment = true;

      while (remainingNameLines.length || remainingDescriptionLines.length || isFirstSegment) {
        const minSegmentHeight = formulaPadTop + formulaNameLineHeight + formulaPadBottom;
        if (y + minSegmentHeight > formulaBottomLimit) {
          addContentPage('PRESCRIÇÃO (continuação)');
        }

        const segmentY = y;
        let cursorY = segmentY + formulaPadTop;
        const availableHeight = formulaBottomLimit - segmentY - formulaPadTop - formulaPadBottom;
        let usedHeight = 0;
        const segmentNameLines: string[] = [];
        const segmentDescriptionLines: string[] = [];

        while (remainingNameLines.length && usedHeight + formulaNameLineHeight <= availableHeight) {
          segmentNameLines.push(remainingNameLines.shift() as string);
          usedHeight += formulaNameLineHeight;
        }

        const descriptionGap = segmentNameLines.length ? formulaTextGap : 0;
        if (!remainingNameLines.length && remainingDescriptionLines.length && usedHeight + descriptionGap + formulaDescLineHeight <= availableHeight) {
          usedHeight += descriptionGap;
          while (remainingDescriptionLines.length && usedHeight + formulaDescLineHeight <= availableHeight) {
            segmentDescriptionLines.push(remainingDescriptionLines.shift() as string);
            usedHeight += formulaDescLineHeight;
          }
        }

        const segmentHeight = Math.max(formulaPadTop + usedHeight + formulaPadBottom, minSegmentHeight);
        drawFormulaSegmentBox(segmentY, segmentHeight);

        if (isFirstSegment) {
          drawFormulaNumber(index, segmentY + formulaPadTop + 7);
        } else {
          doc.fillColor(COLORS.secondary)
             .font('Helvetica-Bold')
             .fontSize(8)
             .text('cont.', contentX + formulaPadX, cursorY + 2, { width: 24, align: 'center', lineBreak: false });
        }

        doc.fillColor(COLORS.textPrimary)
           .font('Helvetica-Bold')
           .fontSize(formulaNameFontSize);
        segmentNameLines.forEach((line) => {
          doc.text(line, formulaTextX, cursorY, { width: formulaTextWidth, lineBreak: false });
          cursorY += formulaNameLineHeight;
        });

        if (segmentDescriptionLines.length) {
          if (segmentNameLines.length) {
            cursorY += formulaTextGap;
          }
          doc.fillColor(COLORS.textSecondary)
             .font('Helvetica')
             .fontSize(formulaDescFontSize);
          segmentDescriptionLines.forEach((line) => {
            doc.text(line, formulaTextX, cursorY, { width: formulaTextWidth, lineBreak: false });
            cursorY += formulaDescLineHeight;
          });
        }

        y += segmentHeight + 6;
        isFirstSegment = false;
      }
    });

    y += 10;

    // ============================================================
    // PRESCRIBER / SIGNATURE FOOTER
    // ============================================================
    // FIX: the old code computed sigY as y + prescriberSectionHeight - 55
    // then drew the prescriber box around that, but the "DOCUMENTO NÃO
    // ASSINADO" text at sigY - 25 ended up far outside the box because
    // the signature area was sized relative to the *outer* section
    // height rather than being laid out top-to-bottom explicitly.
    //
    // We now lay out the footer content top-to-bottom with explicit
    // measurements, then size the surrounding box to fit exactly.

    const sigBoxPadX = 40;
    const sigBoxInnerWidth = innerWidth - sigBoxPadX * 2;

    // Heights of each piece inside the signature box
    const lineH = 16;   // generic text line height
    const sigTextH = signatureStatus === 'signed' ? 36 : 18;  // signature stamp height
    const sigLineGap = 6;                // gap above the horizontal line
    const sigLineY_offset = sigTextH + sigLineGap;  // where the horiz line sits
    const nameH = lineH;
    const councilH = prescriber.council ? lineH : 0;
    const builtAddress = buildAddress({
      street: prescriber.street,
      number: prescriber.address_number,
      complement: prescriber.complement,
      city: prescriber.city,
      state: prescriber.state,
      zipcode: prescriber.zipcode,
    });
    const addressH = builtAddress ? lineH : 0;
    const phoneH = prescriber.phone ? lineH : 0;

    const sigBoxContentH = 14                      // top padding
      + sigLineY_offset + 2                        // sig text + horizontal line
      + 8                                          // gap after line
      + nameH + councilH + addressH + phoneH       // prescriber details
      + 14;                                        // bottom padding

    const separatorAndBoxH = 2 + 12 + sigBoxContentH; // separator line + gap + box

    // Ensure footer fits on current page
    if (y + separatorAndBoxH > pageHeight - margin - 30) {
      addContentPage();
    }

    // Separator line
    doc.lineWidth(1).strokeColor(COLORS.accent)
       .moveTo(contentX, y)
       .lineTo(contentX + innerWidth, y)
       .stroke();
    y += 12;

    // Signature box background
    doc.fillColor(COLORS.white)
       .roundedRect(contentX, y, innerWidth, sigBoxContentH, 4)
       .fill();
    doc.lineWidth(0.5).strokeColor(COLORS.lightGray)
       .roundedRect(contentX, y, innerWidth, sigBoxContentH, 4)
       .stroke();

    let sigY = y + 14;

    // Signature stamp (text or cursive font)
    if (signatureStatus === 'signed' && signatureFontSource) {
      doc.registerFont('prescriber-signature', Buffer.from(signatureFontSource as Uint8Array));
      doc.font('prescriber-signature')
         .fontSize(28)
         .fillColor(signatureStampColor)
         .text(signatureStamp, contentX, sigY, { width: innerWidth, align: 'center' });
      doc.font('Helvetica');
    } else {
      doc.font('Helvetica-Bold')
         .fontSize(11)
         .fillColor(signatureStampColor)
         .text(signatureStamp, contentX, sigY + 2, { width: innerWidth, align: 'center' });
    }

    sigY += sigLineY_offset;

    // Horizontal signature line
    doc.lineWidth(1).strokeColor(COLORS.border)
       .moveTo(contentX + sigBoxPadX, sigY)
       .lineTo(contentX + innerWidth - sigBoxPadX, sigY)
       .stroke();

    sigY += 8;

    // Prescriber name
    doc.fillColor(COLORS.textPrimary)
       .font('Helvetica-Bold')
       .fontSize(11)
       .text(`${prescriberTitle} ${prescriberDisplayName}`.trim(), contentX, sigY, { width: innerWidth, align: 'center' });
    sigY += nameH;

    // Council
    if (prescriber.council) {
      const councilLine = prescriber.council_number && prescriber.council_state
        ? `${prescriber.council}: ${prescriber.council_number} / ${prescriber.council_state}`
        : `${prescriber.council}`;
      doc.fillColor(COLORS.textSecondary)
         .font('Helvetica')
         .fontSize(10)
         .text(councilLine, contentX, sigY, { width: innerWidth, align: 'center' });
      sigY += councilH;
    }

    // Address
    if (builtAddress) {
      doc.fillColor(COLORS.textSecondary)
         .font('Helvetica')
         .fontSize(9)
         .text(builtAddress, contentX, sigY, { width: innerWidth, align: 'center' });
      sigY += addressH;
    }

    // Phone
    if (prescriber.phone) {
      doc.fillColor(COLORS.textSecondary)
         .font('Helvetica')
         .fontSize(9)
         .text(`Tel: ${prescriber.phone}`, contentX, sigY, { width: innerWidth, align: 'center' });
    }

    // Footer watermark text
    doc.fillColor(COLORS.accent)
       .font('Helvetica-Oblique')
       .fontSize(7)
       .text(
         'Documento gerado eletronicamente - Válido conforme legislação vigente',
         contentX,
         pageHeight - margin - 20,
         { width: innerWidth, align: 'center' },
       );

    doc.end();
  });
}
