// The app's sections, in flow order. Copy only: the phone tabs and the studio rail both render this list.
export type SectionId = 'workshop' | 'capture' | 'convert' | 'canvas' | 'watch' | 'batch';
export interface Section { id: SectionId; href: string; label: string; icon: string }

export const sections: Section[] = [
  { id: 'workshop', href: '/snap', label: 'Workshop', icon: 'i-solar:microphone-3-linear' },
  { id: 'capture', href: '/snap/capture', label: 'Snap', icon: 'i-solar:camera-linear' },
  { id: 'convert', href: '/snap/convert', label: 'Convert a photo', icon: 'i-solar:gallery-linear' },
  { id: 'canvas', href: '/snap/canvas', label: 'Canvas', icon: 'i-solar:ruler-linear' },
  { id: 'watch', href: '/snap/watch', label: 'Burn Watch', icon: 'i-solar:eye-linear' },
  { id: 'batch', href: '/snap/batch', label: 'Batch', icon: 'i-solar:layers-linear' }
];
