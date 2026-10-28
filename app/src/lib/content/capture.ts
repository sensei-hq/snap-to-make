// Camera source modes (mock SourceModes). Copy only. 6 views and Reference fork into the layers flow.
export interface SourceMode { id: 'photo' | 'upload' | 'views' | 'reference'; label: string; icon: string; href?: string }

export const sourceModes: SourceMode[] = [
  { id: 'photo', label: 'Photo', icon: 'i-solar:camera-linear' },
  { id: 'upload', label: 'Upload', icon: 'i-solar:upload-linear', href: '/snap/convert' },
  { id: 'views', label: '6 views', icon: 'i-solar:box-linear', href: '/snap/layers/views' },
  { id: 'reference', label: 'Reference', icon: 'i-solar:gallery-linear', href: '/snap/layers/reference' }
];
