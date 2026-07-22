import { ParsedAssessment } from "./types";

/**
 * Parses the Gemini Markdown text into structured medical recommendation sections.
 * Searches for the required headers robustly (supporting stars, hashes, and slight variations).
 */
export function parseAssessment(text: string): ParsedAssessment {
  const result: ParsedAssessment = {
    intro: "",
    possibleCauses: "",
    actionsNow: "",
    urgentHelpIf: "",
    whenToSeeDoctor: "",
    questions: "",
    disclaimer: ""
  };

  if (!text) return result;

  // Header regex/strings
  const headers = [
    { key: "possibleCauses", pattern: /(?:\*\*|###|##)?\s*What this may be\s*(?:\*\*|:)?/i },
    { key: "actionsNow", pattern: /(?:\*\*|###|##)?\s*What you can do now\s*(?:\*\*|:)?/i },
    { key: "urgentHelpIf", pattern: /(?:\*\*|###|##)?\s*Get urgent help now if\s*(?:\*\*|:)?/i },
    { key: "whenToSeeDoctor", pattern: /(?:\*\*|###|##)?\s*When to see a doctor\s*(?:\*\*|:)?/i },
    { key: "questions", pattern: /(?:\*\*|###|##)?\s*To help narrow this down\s*(?:\*\*|:)?/i }
  ];

  // Find occurrences
  const matches = headers.map(h => {
    const match = text.match(h.pattern);
    return {
      key: h.key,
      index: match && match.index !== undefined ? match.index : -1,
      length: match ? match[0].length : 0
    };
  }).filter(m => m.index !== -1)
    .sort((a, b) => a.index - b.index);

  // If no sections found, treat everything as intro
  if (matches.length === 0) {
    result.intro = text;
    return result;
  }

  // Extract intro (everything before first match)
  result.intro = text.substring(0, matches[0].index).trim();

  // Extract each section
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    
    const startIdx = current.index + current.length;
    const endIdx = next ? next.index : text.length;
    
    let content = text.substring(startIdx, endIdx).trim();
    
    // Clean leading symbols like double newlines or bullets or colons
    if (content.startsWith(":")) {
      content = content.substring(1).trim();
    }
    
    (result as any)[current.key] = content;
  }

  // Extract disclaimer note if any
  const disclaimerKeyword = "Online guidance cannot confirm";
  const disclaimerIndex = text.indexOf(disclaimerKeyword);
  if (disclaimerIndex !== -1) {
    result.disclaimer = text.substring(disclaimerIndex).trim();
    
    // Clean up from the parsed sections where it might have been included
    for (const key of Object.keys(result)) {
      if (key !== "disclaimer" && (result as any)[key]) {
        const idx = (result as any)[key].indexOf(disclaimerKeyword);
        if (idx !== -1) {
          (result as any)[key] = (result as any)[key].substring(0, idx).trim();
        }
      }
    }
  } else {
    result.disclaimer = "Online guidance cannot confirm a diagnosis. If symptoms are severe, sudden, worsening, or you are worried, please seek care from a qualified doctor or emergency service.";
  }

  return result;
}

/**
 * Format raw markdown list items or paragraphs into clean readable sentences
 */
export function cleanTextSection(text: string): string[] {
  if (!text) return [];
  return text
    .split(/\n+/)
    .map(line => {
      // Remove markdown bullet characters (*, -, 1., etc.)
      return line.replace(/^\s*[-*•+]\s*/, "").replace(/^\s*\d+\.\s*/, "").trim();
    })
    .filter(line => line.length > 0);
}
