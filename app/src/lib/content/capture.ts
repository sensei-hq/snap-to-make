// Camera source modes (mock SourceModes). Copy only. Modes without an href wait for the layers flow (roadmap Stage 14).
export interface SourceMode { id: 'photo' | 'upload' | 'views' | 'reference'; label: string; icon: string; href?: string }

export const sourceModes: SourceMode[] = [
  { id: 'photo', label: 'Photo', icon: 'i-solar:camera-linear' },
  { id: 'upload', label: 'Upload', icon: 'i-solar:upload-linear', href: '/snap/convert' },
  { id: 'views', label: '6 views', icon: 'i-solar:box-linear' },
  { id: 'reference', label: 'Reference', icon: 'i-solar:gallery-linear' }
];
