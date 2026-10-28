// The app's sections (docs/design/07 G9): where you are, not which tool. Copy only: the phone icon nav and the
// studio rail both render this list. "Craft" resumes the open craft at its step; its routes are the whole journey.
export type SectionId = 'workshop' | 'crafts' | 'craft' | 'canvas' | 'watch' | 'batch';
export interface Section {
  id: SectionId; href: string; label: string; icon: string;
  /** path prefixes that belong to this section (defaults to href) */
  match?: string[];
  /** false: studio rail only (the phone nav keeps five items) */
  phone?: boolean;
}

export const sections: Section[] = [
  { id: 'workshop', href: '/workshop', label: 'Home', icon: 'i-solar:home-2-linear' },
  { id: 'crafts', href: '/crafts', label: 'Crafts', icon: 'i-solar:album-linear' },
  { id: 'craft', href: '/capture', label: 'Current craft', icon: 'i-solar:layers-linear', match: ['/capture', '/make'] },
  { id: 'canvas', href: '/canvas', label: 'Work area', icon: 'i-solar:pen-2-linear' },
  { id: 'watch', href: '/watch', label: 'Burn Watch', icon: 'i-solar:eye-linear' },
  { id: 'batch', href: '/batch', label: 'Batch', icon: 'i-solar:widget-4-linear', phone: false }
];

/** Studio-only tools, shown in the rail below the divider (not in the phone icon nav). */
export interface Tool { id: 'materials' | 'annotations' | 'settings'; href: string; label: string; icon: string }
export const tools: Tool[] = [
  { id: 'materials', href: '/materials', label: 'Materials', icon: 'i-solar:palette-linear' },
  { id: 'annotations', href: '/annotations', label: 'Annotations', icon: 'i-solar:notes-linear' },
  { id: 'settings', href: '/settings', label: 'Settings', icon: 'i-solar:settings-linear' }
];

/** The section a path belongs to: the longest matching prefix wins; everything else is Home. */
export function sectionFor(pathname: string): SectionId {
  let best: { id: SectionId; len: number } = { id: 'workshop', len: 0 };
  for (const s of sections) {
    for (const prefix of s.match ?? [s.href]) {
      if ((pathname === prefix || pathname.startsWith(`${prefix}/`)) && prefix.length > best.len) best = { id: s.id, len: prefix.length };
    }
  }
  return best.id;
}
