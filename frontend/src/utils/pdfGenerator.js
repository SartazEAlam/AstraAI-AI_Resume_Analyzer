import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

/**
 * Multi-Template ATS PDF Generator with Typographic Auto-Fitter
 *
 * Guarantees 100% extractable text by writing real PDF strings.
 * Maps the 3 master PDF archetypes:
 *   1. Centered (Classic)
 *   2. Left-Aligned (Minimal)
 *   3. Sidebar (Modern)
 *
 * Employs a Typographic Auto-Fitter loop to dynamically scale
 * font sizes, line heights, and gaps until content perfectly fits one A4 page,
 * keeping margins strictly fixed for optimal aesthetics.
 */

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

// ── Fixed Page Margins (Never scale these) ──
const MARGIN_X = 45;
const MARGIN_TOP = 48;
const MARGIN_BOTTOM = 55;
const CONTENT_W = PAGE_WIDTH - MARGIN_X * 2;

// ── Color helpers ──
function hexToRgb(hex) {
  const h = (hex || "#4f46e5").replace("#", "");
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return rgb(r, g, b);
}

function hexToComponents(hex) {
  const h = (hex || "#4f46e5").replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

// ── Sanitization (Strip hidden control chars, keep ATS safe) ──
function sanitize(text) {
  if (!text) return "";
  return text
    .replace(/[\u2018\u2019\u0060\u00B4]/g, "'") // Smart single quotes
    .replace(/[\u201C\u201D]/g, '"')             // Smart double quotes
    .replace(/\u2013/g, "-")                     // En dash
    .replace(/\u2014/g, "--")                    // Em dash
    .replace(/\u2026/g, "...")                   // Ellipsis
    .replace(/\u2022/g, "-")                     // Bullet -> Dash
    .replace(/[\u00A0\t\r\n]/g, " ")             // Replace tabs, newlines, NBSP with space
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, "")       // Strip all other control characters (fixes WinAnsi 0x0009 error)
    .replace(/\s+/g, " ")                        // Collapse multiple spaces
    .trim();
}

// ── Text wrapping (Respects exact width boundaries) ──
function wrapText(text, maxWidth, font, fontSize) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (testWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function normalizeSkills(skills) {
  if (Array.isArray(skills)) {
    return skills.filter((s) => typeof s === "string" && s.trim());
  }
  if (typeof skills === "string") {
    return skills
      .split(/[,;\n\u2022\u00B7|]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export async function generateResumePDF(data, customization = {}) {
  console.log("=== PDF Generator Running - Version 2.1.0 ===", { template: customization?.templateId, accentColor: customization?.accentColor });
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  let fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  let fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  const templateId = customization?.templateId || customization?.template || "classic";
  const accentHex = customization?.accentColor || "#4f46e5";
  
  // Base font multiplier from user settings
  const fontSizeSetting = customization?.fontSize || "default";
  const userBaseFMult = fontSizeSetting === "small" ? 0.9 : fontSizeSetting === "large" ? 1.1 : 1.0;

  // Premium Color Palette
  const accentColor = hexToRgb(accentHex);
  const darkCharcoal = rgb(0.12, 0.16, 0.22);
  const mediumColor = rgb(0.3, 0.35, 0.4);
  const grayColor = rgb(0.45, 0.5, 0.55);
  const lightGray = rgb(0.85, 0.88, 0.9);
  const whiteColor = rgb(1, 1, 1);
  const translucentWhite = rgb(0.9, 0.9, 0.9);



  // ════════════════════════════════════════════
  // TYPOGRAPHIC AUTO-FITTER
  // ════════════════════════════════════════════
  
  let currentMultiplier = userBaseFMult;
  
  // Font Family Mapping
  const customFont = (customization?.fontFamily || "").toLowerCase();
  let baseReg = StandardFonts.Helvetica;
  let baseBld = StandardFonts.HelveticaBold;
  let baseItl = StandardFonts.HelveticaOblique;

  if (customFont.includes("roboto mono") || customFont.includes("monospace") || customFont.includes("consolas")) {
    baseReg = StandardFonts.Courier;
    baseBld = StandardFonts.CourierBold;
    baseItl = StandardFonts.CourierOblique;
  } else if (customFont.includes("georgia") || customFont.includes("times") || (customFont.includes("serif") && !customFont.includes("sans-serif"))) {
    baseReg = StandardFonts.TimesRoman;
    baseBld = StandardFonts.TimesRomanBold;
    baseItl = StandardFonts.TimesRomanItalic;
  } else {
    baseReg = StandardFonts.Helvetica;
    baseBld = StandardFonts.HelveticaBold;
    baseItl = StandardFonts.HelveticaOblique;
  }
  
  const FONT_MAP = {
    inter: {
      regular: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZhrj72A.ttf",
      bold: "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZhrj72A.ttf",
      italic: "https://fonts.gstatic.com/s/inter/v20/UcCM3FwrK3iLTcvneQg7Ca725JhhKnNqk4j1ebLhAm8SrXTc2dthjZ-Ck-8.ttf"
    },
    outfit: {
      regular: "https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-FCAp.ttf",
      bold: "https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4deyC4G-FCAp.ttf",
      italic: "https://fonts.gstatic.com/s/outfit/v15/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC1C4G-FCAp.ttf"
    }
  };

  const fontId = customFont.includes("outfit") ? "outfit" : customFont.includes("inter") ? "inter" : null;
  let customReg = null, customBld = null, customItl = null;

  if (fontId && FONT_MAP[fontId]) {
    try {
      const [regBytes, bldBytes, itlBytes] = await Promise.all([
        fetch(FONT_MAP[fontId].regular).then(r => { if(!r.ok) throw new Error(); return r.arrayBuffer(); }),
        fetch(FONT_MAP[fontId].bold).then(r => { if(!r.ok) throw new Error(); return r.arrayBuffer(); }),
        fetch(FONT_MAP[fontId].italic).then(r => { if(!r.ok) throw new Error(); return r.arrayBuffer(); })
      ]);
      customReg = regBytes;
      customBld = bldBytes;
      customItl = itlBytes;
    } catch (err) {
      console.warn(`[PDF Generator] Failed to load custom Google Font "${fontId}", falling back to standard Helvetica:`, err);
    }
  }

  if (customReg && customBld && customItl) {
    fontRegular = await pdfDoc.embedFont(customReg);
    fontBold = await pdfDoc.embedFont(customBld);
    fontItalic = await pdfDoc.embedFont(customItl);
  } else {
    fontRegular = await pdfDoc.embedFont(baseReg);
    fontBold = await pdfDoc.embedFont(baseBld);
    fontItalic = await pdfDoc.embedFont(baseItl);
  }

  // Layout Engine
  const buildLayout = (page, fMult) => {
    const s = (val) => val * fMult;
    
    let isModern = templateId === "modern";
    let isClassic = templateId === "classic";
    let isMinimal = templateId === "minimal";
    if (!isModern && !isClassic && !isMinimal) isClassic = true;

    let y = PAGE_HEIGHT - MARGIN_TOP;

    // Fixed widths
    const sideW = isModern ? 220 : 0; // Sidebar width
    const mainX = isModern ? sideW + 20 : MARGIN_X;
    const mainW = isModern ? PAGE_WIDTH - mainX - 30 : CONTENT_W;

    // ── Core Drawing Helpers ──
    const drawT = (text, { x, yPos, size, font, color, maxW, align = "left", skipSanitize = false }) => {
      if (!text || !page) return;
      const safe = skipSanitize ? text : sanitize(text);
      if (!safe) return;
      
      let display = safe;
      let actualW = font.widthOfTextAtSize(display, size);
      
      if (maxW && actualW > maxW) {
        while (font.widthOfTextAtSize(display, size) > maxW && display.length > 1) {
          display = display.slice(0, -1);
        }
        actualW = font.widthOfTextAtSize(display, size);
      }

      let drawX = x;
      if (align === "center") drawX = x - actualW / 2;
      else if (align === "right") drawX = x - actualW;

      page.drawText(display, { x: drawX, y: yPos, size, font, color });
      return actualW;
    };

    const drawLine = (x1, y1, x2, thickness, color) => {
      if (!page) return;
      page.drawLine({ start: { x: x1, y: y1 }, end: { x: x2, y: y1 }, thickness, color });
    };

    const drawRect = (x, rY, w, h, color) => {
      if (!page) return;
      page.drawRectangle({ x, y: rY, width: w, height: h, color });
    };

    const drawWrapped = (text, { x, yPos, w, font: f, size: sz, color: c, lineHeight = 1.45 }) => {
      const lines = wrapText(sanitize(text), w, f, sz);
      let cy = yPos;
      for (const line of lines) {
        drawT(line, { x, yPos: cy, size: sz, font: f, color: c });
        cy -= sz * lineHeight;
      }
      return lines.length * (sz * lineHeight);
    };

    const pi = data?.personalInfo || {};
    const summary = data?.summary?.trim();
    const experiences = (data?.experience || []).filter((e) => e.title || e.company);
    const educations = (data?.education || []).filter((e) => e.degree || e.institution);
    const projects = (data?.projects || []).filter((p) => p.name);
    const skills = normalizeSkills(data?.skills);
    const certs = (data?.certifications || []).filter((c) => c.name);
    const langs = (data?.languages || []).filter((l) => l.language);

    if (isModern && page) {
      drawRect(0, 0, sideW, PAGE_HEIGHT, accentColor);
    }

    var sidebarY = PAGE_HEIGHT - MARGIN_TOP;

    if (isModern) {
      // Avatar (fully scales)
      const rad = s(36);
      if (page && pi.fullName) {
        const parts = pi.fullName.split(" ");
        let initials = (parts[0]?.[0] || "U").toUpperCase();
        if (parts.length > 1) initials += (parts[parts.length - 1]?.[0] || "").toUpperCase();
        
        const cx = sideW / 2;
        const cy = y - rad; // Center of circle is one radius below y
        console.log("AVATAR GEOMETRY:", { rad, cx, cy, y, fMult });
        page.drawCircle({ x: cx, y: cy, size: rad, color: translucentWhite });
        drawT(initials, { x: cx, yPos: cy - rad * 0.28, size: s(28), font: fontBold, color: accentColor, align: "center" });
      }
      y -= rad * 2 + s(35); 

      // Name
      if (pi.fullName) {
        drawT(pi.fullName, { x: sideW/2, yPos: y, size: s(18), font: fontBold, color: whiteColor, align: "center", maxW: sideW - 30 });
        y -= s(24);
      }
      
      drawLine(20, y, sideW - 20, 1.5, translucentWhite);
      y -= s(24);

      sidebarY = y;
      
      // Contact Section (No labels, just text, spaced nicely)
      drawT("CONTACT", { x: 20, yPos: sidebarY, size: s(10), font: fontBold, color: whiteColor });
      sidebarY -= s(14);

      const contactArr = [
        pi.email,
        pi.phone,
        pi.location,
        pi.linkedin,
        pi.portfolio
      ].filter(Boolean);

      for (const val of contactArr) {
        drawT(val, { x: 20, yPos: sidebarY, size: s(9.5), font: fontRegular, color: whiteColor, maxW: sideW - 40 });
        sidebarY -= s(18);
      }
      sidebarY -= s(10);
      
      y = PAGE_HEIGHT - MARGIN_TOP - s(20);
    } 
    else if (isClassic) {
      if (pi.fullName) {
        drawT(pi.fullName, { x: PAGE_WIDTH / 2, yPos: y, size: s(24), font: fontBold, color: darkCharcoal, align: "center" });
        y -= s(24) + s(12);
      }
      
      const contactLine = [pi.email, pi.phone, pi.location].filter(Boolean).join("   •   ");
      if (contactLine) {
        drawT(contactLine, { x: PAGE_WIDTH / 2, yPos: y, size: s(10), font: fontRegular, color: mediumColor, align: "center" });
        y -= s(10) + s(8);
      }

      const linkLine = [pi.linkedin, pi.portfolio].filter(Boolean).join("   •   ");
      if (linkLine) {
        drawT(linkLine, { x: PAGE_WIDTH / 2, yPos: y, size: s(9.5), font: fontRegular, color: accentColor, align: "center" });
        y -= s(9.5) + s(8);
      }

      drawLine(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, 1.5, accentColor);
      y -= s(24);
    } 
    else if (isMinimal) {
      if (pi.fullName) {
        drawT(pi.fullName, { x: MARGIN_X, yPos: y, size: s(24), font: fontBold, color: darkCharcoal });
        y -= s(24) + s(12);
      }
      
      const contactLine = [pi.email, pi.phone, pi.location].filter(Boolean).join("   •   ");
      if (contactLine) {
        drawT(contactLine, { x: MARGIN_X, yPos: y, size: s(10), font: fontRegular, color: grayColor });
        y -= s(10) + s(8);
      }

      const linkLine = [pi.linkedin, pi.portfolio].filter(Boolean).join("   •   ");
      if (linkLine) {
        drawT(linkLine, { x: MARGIN_X, yPos: y, size: s(9.5), font: fontRegular, color: accentColor });
        y -= s(9.5) + s(8);
      }

      drawLine(MARGIN_X, y, PAGE_WIDTH - MARGIN_X, 1.5, lightGray);
      y -= s(24);
    }

    // ── Helper to draw elegant section headers ──
    const drawSectionTitle = (title, cursorY, xPos, width, inSidebar = false) => {
      let currentY = cursorY;
      
      if (isModern) {
        if (inSidebar) {
          drawT(title.toUpperCase(), { x: xPos, yPos: currentY, size: s(11), font: fontBold, color: whiteColor });
          currentY -= s(10);
          drawLine(xPos, currentY, xPos + width - 20, 1.5, translucentWhite);
        } else {
          const spaced = title.toUpperCase().split(' ').map(w => w.split('').join(' ')).join('     '); // 5 spaces between words
          drawT(spaced, { x: xPos, yPos: currentY, size: s(10), font: fontBold, color: accentColor, skipSanitize: true });
          currentY -= s(10);
          drawLine(xPos, currentY, xPos + width, 1.5, accentColor);
        }
      } 
      else if (isClassic) {
        drawT(title.toUpperCase(), { x: xPos, yPos: currentY, size: s(13), font: fontBold, color: accentColor });
        currentY -= s(10);
        drawLine(xPos, currentY, xPos + width, 2, accentColor);
      } 
      else if (isMinimal) {
        drawT(title.toUpperCase(), { x: xPos, yPos: currentY, size: s(13), font: fontBold, color: darkCharcoal });
        currentY -= s(10);
        drawLine(xPos, currentY, xPos + width, 0.5, lightGray);
      }
      
      return currentY - s(14);
    };

    // ════════════════════════════════════════════
    // MAIN CONTENT SECTIONS
    // ════════════════════════════════════════════

    // 1. SUMMARY
    if (summary) {
      y = drawSectionTitle("Professional Summary", y, mainX, mainW);
      const consumed = drawWrapped(summary, {
        x: mainX, yPos: y, w: mainW, font: fontRegular, size: s(10.5), color: darkCharcoal, lineHeight: 1.55
      });
      y -= consumed + s(18);
    }

    // 2. EXPERIENCE
    if (experiences.length > 0) {
      y = drawSectionTitle("Work Experience", y, mainX, mainW);
      
      for (let i = 0; i < experiences.length; i++) {
        const exp = experiences[i];
        
        const role = exp.title || "Role";
        const dates = [exp.startDate, exp.endDate].filter(Boolean).join(" - ");
        const datesW = dates ? fontRegular.widthOfTextAtSize(sanitize(dates), s(10)) : 0;
        
        if (datesW > 0) {
            drawT(dates, { x: mainX + mainW, yPos: y, size: s(10), font: fontRegular, color: grayColor, align: "right" });
        }
        
        const roleW = mainW - datesW - 10;
        const consumedRole = drawWrapped(role, { x: mainX, yPos: y, w: roleW, font: fontBold, size: s(11.5), color: darkCharcoal, lineHeight: 1.3 });
        y -= consumedRole + s(2);

        const compLoc = [exp.company, exp.location].filter(Boolean).join("  •  ");
        if (compLoc) {
          const consumedComp = drawWrapped(compLoc, { x: mainX, yPos: y, w: mainW, font: fontItalic, size: s(10.5), color: isClassic ? grayColor : accentColor, lineHeight: 1.3 });
          y -= consumedComp + s(4);
        } else {
          y -= s(4);
        }

        const bullets = (exp.bullets || []).filter((b) => b && typeof b === "string" && b.trim());
        for (const bullet of bullets) {
          if (page) page.drawCircle({ x: mainX + 4, y: y + 3, size: 5, color: grayColor });
          const consumed = drawWrapped(bullet.trim(), {
            x: mainX + 16, yPos: y, w: mainW - 18, font: fontRegular, size: s(10.5), color: darkCharcoal, lineHeight: 1.55
          });
          y -= consumed + s(4);
        }
        
        y -= s(12);
      }
      y -= s(6);
    }

    // 3. EDUCATION
    if (educations.length > 0) {
      y = drawSectionTitle("Education", y, mainX, mainW);
      for (const edu of educations) {
        const deg = edu.degree || "Degree";
        const dates = edu.year || "";
        const datesW = dates ? fontRegular.widthOfTextAtSize(sanitize(dates), s(10)) : 0;
        
        if (datesW > 0) {
            drawT(dates, { x: mainX + mainW, yPos: y, size: s(10), font: fontRegular, color: grayColor, align: "right" });
        }
        
        const degW = mainW - datesW - 10;
        const consumedDeg = drawWrapped(deg, { x: mainX, yPos: y, w: degW, font: fontBold, size: s(11.5), color: darkCharcoal, lineHeight: 1.3 });
        y -= consumedDeg + s(2);

        const instLine = [edu.institution, edu.gpa ? `GPA: ${edu.gpa}` : ""].filter(Boolean).join("  •  ");
        if (instLine) {
          const consumedInst = drawWrapped(instLine, { x: mainX, yPos: y, w: mainW, font: fontItalic, size: s(10.5), color: darkCharcoal, lineHeight: 1.3 });
          y -= consumedInst + s(4);
        } else {
          y -= s(4);
        }
        
        y -= s(6);
      }
      y -= s(6);
    }

    // 4. PROJECTS
    if (projects.length > 0) {
      y = drawSectionTitle("Projects", y, mainX, mainW);
      for (const proj of projects) {
        const pName = proj.name;
        const pTech = proj.techStack ? `(${proj.techStack})` : "";
        
        const consumedName = drawWrapped(pName, { x: mainX, yPos: y, w: mainW, font: fontBold, size: s(11.5), color: darkCharcoal, lineHeight: 1.3 });
        y -= consumedName + s(2);
        
        if (pTech) {
          const consumedTech = drawWrapped(pTech, { x: mainX, yPos: y, w: mainW, font: fontBold, size: s(9.5), color: accentColor, lineHeight: 1.3 });
          y -= consumedTech + s(4);
        } else {
          y -= s(4);
        }

        if (proj.description) {
          const consumedDesc = drawWrapped(proj.description.trim(), {
            x: mainX, yPos: y, w: mainW, font: fontRegular, size: s(10.5), color: darkCharcoal, lineHeight: 1.55
          });
          y -= consumedDesc + s(4);
        }

        if (proj.link) {
          drawT(proj.link.trim(), { x: mainX, yPos: y, size: s(9.5), font: fontRegular, color: accentColor });
          y -= s(12);
        }
        y -= s(8);
      }
      y -= s(6);
    }

    let sY = isModern ? sidebarY : y;
    let sX = isModern ? 20 : mainX;
    const sW = isModern ? sideW - 40 : mainW;

    if (skills.length > 0) {
      if (isModern) {
        sY = drawSectionTitle("Skills", sY, sX, sW, true);
        
        // Render pill tags in modern sidebar
        const tagFontSize = s(9.5);
        const tagPadX = 8;
        const tagPadY = s(4);
        const tagGapX = 6;
        const tagGapY = s(8);
        const tagH = tagFontSize + tagPadY * 2;
        let tagX = sX;
        let tagRowY = sY;

        for (const skill of skills) {
          const textW = fontBold.widthOfTextAtSize(sanitize(skill), tagFontSize);
          const totalW = textW + tagPadX * 2;
          
          if (tagX + totalW > sX + sW - 10) {
            tagX = sX;
            tagRowY -= tagH + tagGapY;
          }

          drawRect(tagX, tagRowY - tagH, totalW, tagH, rgb(1,1,1)); // White background
          drawT(skill, { x: tagX + tagPadX, yPos: tagRowY - tagFontSize - tagPadY + s(3), size: tagFontSize, font: fontBold, color: accentColor });
          
          tagX += totalW + tagGapX;
        }
        sY = tagRowY - tagH - s(16);

      } else {
        y = drawSectionTitle("Technical Skills", y, sX, sW);
        const skillText = skills.join("   •   ");
        const consumed = drawWrapped(skillText, { x: sX, yPos: y, w: sW, font: fontRegular, size: s(10.5), color: darkCharcoal, lineHeight: 1.6 });
        y -= consumed + s(16);
      }
    }

    if (certs.length > 0) {
      if (isModern) {
        sY = drawSectionTitle("Certifications", sY, sX, sW, true);
        for (const cert of certs) {
          drawT(cert.name, { x: sX, yPos: sY, size: s(10), font: fontBold, color: whiteColor, maxW: sW - 10 });
          sY -= s(12);
          if (cert.issuer) {
            drawT(cert.issuer, { x: sX, yPos: sY, size: s(9), font: fontRegular, color: translucentWhite, maxW: sW - 10 });
            sY -= s(12);
          }
          if (cert.year) {
            drawT(cert.year, { x: sX, yPos: sY, size: s(9), font: fontRegular, color: translucentWhite });
            sY -= s(12);
          }
          sY -= s(4);
        }
        sY -= s(10);
      } else {
        y = drawSectionTitle("Certifications", y, sX, sW);
        for (const cert of certs) {
          const txt = `•   ${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ""}${cert.year ? ` (${cert.year})` : ""}`;
          const consumed = drawWrapped(txt, { x: sX + 4, yPos: y, w: sW - 8, font: fontRegular, size: s(10.5), color: darkCharcoal, lineHeight: 1.5 });
          y -= consumed + s(6);
        }
        y -= s(10);
      }
    }

    if (langs.length > 0) {
      if (isModern) {
        sY = drawSectionTitle("Languages", sY, sX, sW, true);
        for (const lang of langs) {
          drawT(lang.language, { x: sX, yPos: sY, size: s(10), font: fontBold, color: whiteColor });
          sY -= s(12);
          if (lang.proficiency) {
            drawT(lang.proficiency, { x: sX, yPos: sY, size: s(9), font: fontRegular, color: translucentWhite });
            sY -= s(12);
          }
          sY -= s(4);
        }
      } else {
        y = drawSectionTitle("Languages", y, sX, sW);
        const langText = langs.map(l => `${l.language}${l.proficiency ? ` (${l.proficiency})` : ""}`).join("   •   ");
        const consumed = drawWrapped(langText, { x: sX, yPos: y, w: sW, font: fontRegular, size: s(10.5), color: darkCharcoal });
        y -= consumed + s(16);
      }
    }

    const lowestY = isModern ? Math.min(y, sY) : y;
    return PAGE_HEIGHT - lowestY + MARGIN_BOTTOM;
  };
  
  // Pass 1: Baseline measurement
  let height = buildLayout(null, currentMultiplier);


  // Shrink Loop: If content overflows page, shrink fonts incrementally
  while (height > PAGE_HEIGHT && currentMultiplier > 0.7) {
    currentMultiplier -= 0.025;
    height = buildLayout(null, currentMultiplier);
  }

  // Grow Loop: If content is too short (leaves too much whitespace), grow fonts incrementally
  // (We target 92% of the page to leave a healthy bottom margin)
  if (height < PAGE_HEIGHT * 0.85) {
    while (height < PAGE_HEIGHT * 0.92 && currentMultiplier < 1.25) {
      currentMultiplier += 0.025;
      height = buildLayout(null, currentMultiplier);
    }
  }

  // Final Render Pass
  const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  buildLayout(page, currentMultiplier);

  return await pdfDoc.save();
}
