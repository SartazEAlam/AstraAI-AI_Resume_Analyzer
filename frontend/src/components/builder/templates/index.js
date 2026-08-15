import ClassicTemplate from "./ClassicTemplate";
import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeTemplate from "./CreativeTemplate";
import ExecutiveTemplate from "./ExecutiveTemplate";
import TechTemplate from "./TechTemplate";

const TEMPLATES = [
  {
    id: "classic",
    name: "Classic",
    description: "Clean, ATS-friendly single-column layout trusted across MNCs and campus placements.",
    component: ClassicTemplate,
    tags: ["ATS-Safe", "Professional"],
  },
  {
    id: "tech",
    name: "Tech",
    description: "A sleek, modern template tailored for developers with monospace skills tags and highly scannable sections.",
    component: TechTemplate,
    tags: ["Developer", "Modern"],
  },
  {
    id: "executive",
    name: "Executive",
    description: "A distinguished, highly structured layout for senior professionals featuring elegant serif typography.",
    component: ExecutiveTemplate,
    tags: ["Senior", "Elegant"],
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
  {
    id: "creative",
    name: "Creative",
    description: "Bold header with visual flair — skills bars, timeline experience, and personality.",
    component: CreativeTemplate,
    tags: ["Visual", "Bold"],
  },
];

export default TEMPLATES;
