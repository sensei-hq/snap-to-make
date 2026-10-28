// The app's sections, in flow order. Copy only: the phone icon nav and the studio rail both render this list.
export type SectionId = 'workshop' | 'capture' | 'layers' | 'canvas' | 'watch' | 'batch';
export interface Section { id: SectionId; href: string; label: string; icon: string; /** path prefix that belongs to this section (defaults to href) */ match?: string }

export const sections: Section[] = [
  { id: 'workshop', href: '/workshop', label: 'Workshop', icon: 'i-solar:microphone-3-linear' },
  { id: 'capture', href: '/capture', label: 'Snap', icon: 'i-solar:camera-linear' },
  { id: 'layers', href: '/make/import', label: 'Image to layers', icon: 'i-solar:layers-linear', match: '/make' },
  { id: 'canvas', href: '/canvas', label: 'Canvas', icon: 'i-solar:ruler-linear' },
  { id: 'watch', href: '/watch', label: 'Burn Watch', icon: 'i-solar:eye-linear' },
  { id: 'batch', href: '/batch', label: 'Batch', icon: 'i-solar:widget-4-linear' }
];

/** Studio-only tools, shown in the rail below the divider (not in the phone icon nav). */
export interface Tool { id: 'materials' | 'annotations' | 'settings'; href: string; label: string; icon: string }
export const tools: Tool[] = [
  { id: 'materials', href: '/materials', label: 'Materials', icon: 'i-solar:palette-linear' },
  { id: 'annotations', href: '/annotations', label: 'Annotations', icon: 'i-solar:notes-linear' },
  { id: 'settings', href: '/settings', label: 'Settings', icon: 'i-solar:settings-linear' }
];

/** The section a path belongs to: the longest matching prefix wins; everything else is the workshop flow. */
export function sectionFor(pathname: string): SectionId {
  const prefix = (s: Section) => s.match ?? s.href;
  const hit = [...sections].sort((a, b) => prefix(b).length - prefix(a).length)
    .find((s) => pathname === prefix(s) || pathname.startsWith(`${prefix(s)}/`));
  return hit?.id ?? 'workshop';
}
