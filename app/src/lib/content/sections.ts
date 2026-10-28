// The app's sections, in flow order. Copy only: the phone icon nav and the studio rail both render this list.
export type SectionId = 'workshop' | 'capture' | 'convert' | 'layers' | 'canvas' | 'watch' | 'batch';
export interface Section { id: SectionId; href: string; label: string; icon: string; /** path prefix that belongs to this section (defaults to href) */ match?: string }

export const sections: Section[] = [
  { id: 'workshop', href: '/snap', label: 'Workshop', icon: 'i-solar:microphone-3-linear' },
  { id: 'capture', href: '/snap/capture', label: 'Snap', icon: 'i-solar:camera-linear' },
  { id: 'convert', href: '/snap/convert', label: 'Convert a photo', icon: 'i-solar:gallery-linear' },
  { id: 'layers', href: '/snap/layers/source', label: 'Image to layers', icon: 'i-solar:layers-linear', match: '/snap/layers' },
  { id: 'canvas', href: '/snap/canvas', label: 'Canvas', icon: 'i-solar:ruler-linear' },
  { id: 'watch', href: '/snap/watch', label: 'Burn Watch', icon: 'i-solar:eye-linear' },
  { id: 'batch', href: '/snap/batch', label: 'Batch', icon: 'i-solar:widget-4-linear' }
];

/** Studio-only tools, shown in the rail below the divider (not in the phone icon nav). */
export interface Tool { id: 'materials' | 'annotations' | 'settings'; href: string; label: string; icon: string }
export const tools: Tool[] = [
  { id: 'materials', href: '/snap/materials', label: 'Materials', icon: 'i-solar:palette-linear' },
  { id: 'annotations', href: '/snap/annotations', label: 'Annotations', icon: 'i-solar:notes-linear' },
  { id: 'settings', href: '/snap/settings', label: 'Settings', icon: 'i-solar:settings-linear' }
];

/** The section a path belongs to: the longest matching prefix wins; everything else under /snap is the workshop flow. */
export function sectionFor(pathname: string): SectionId {
  const prefix = (s: Section) => s.match ?? s.href;
  const hit = [...sections].sort((a, b) => prefix(b).length - prefix(a).length)
    .find((s) => pathname === prefix(s) || pathname.startsWith(`${prefix(s)}/`));
  return hit?.id ?? 'workshop';
}
