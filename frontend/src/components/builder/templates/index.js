import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean, ATS-friendly single-column layout trusted across MNCs and campus placements.",
    component: ClassicTemplate,
    tags: ["ATS-Safe", "Professional"],
  },
  {
    id: "modern",
    name: "Modern",
    description: "Two-column sidebar design — stands out while staying fully recruiter-approved.",
    component: ModernTemplate,
    tags: ["Two-Column", "Standout"],
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Whitespace-first layout with sharp typographic hierarchy. Ideal for design and finance.",
    component: MinimalTemplate,
    tags: ["Clean", "Elegant"],
  },
];

export default TEMPLATES;
