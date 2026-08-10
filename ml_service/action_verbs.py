# List of strong action verbs for resume enhancement
ACTION_VERBS = {
    "leadership": ["Directed", "Guided", "Influenced", "Inspire", "Managed", "Mentored", "Motivated", "Spearheaded", "Supervised", "Trained", "Piloted", "Chaired", "Fostered"],
    "execution": ["Achieved", "Completed", "Delivered", "Executed", "Implemented", "Produced", "Resolved", "Succeeded", "Finalized", "Accomplished", "Forged", "Navigated"],
    "innovation": ["Created", "Designed", "Developed", "Engineered", "Established", "Formulated", "Initiated", "Invented", "Launched", "Pioneered", "Architected", "Conceived", "Devised"],
    "analysis": ["Analyzed", "Assessed", "Evaluated", "Identified", "Investigated", "Measured", "Quantified", "Tested", "Audited", "Calculated", "Diagnosed", "Examined", "Forecasted"],
    "growth": ["Accelerated", "Advanced", "Boosted", "Expanded", "Generated", "Improved", "Increased", "Maximized", "Optimized", "Scaled", "Amplified", "Elevated", "Propelled"],
    "communication": ["Authored", "Briefed", "Campagined", "Clarified", "Co-authored", "Communicated", "Composed", "Convinced", "Documented", "Drafted", "Edited", "Facilitated", "Persuaded", "Presented", "Promoted", "Publicized"],
    "organization": ["Arranged", "Assembled", "Categorized", "Classified", "Compiled", "Consolidated", "Coordinated", "Maintained", "Organized", "Planned", "Standardized", "Systematized", "Updated"]
}

WEAK_VERBS = [
    "helped", "assisted", "worked on", "did", "made", "was responsible for", "handled", 
    "participated in", "contributed to", "involved in", "looked at", "dealt with", "took care of"
]

def get_suggestion_for_weak_verb(text: str) -> str:
    """Returns a suggestion category if a weak verb is found, otherwise None."""
    text_lower = text.lower()
    for weak_verb in WEAK_VERBS:
        if text_lower.startswith(weak_verb) or f" {weak_verb} " in text_lower:
            return "Consider starting with a strong action verb (e.g., 'Directed', 'Engineered', 'Optimized') instead of '" + weak_verb + "'."
    return None
