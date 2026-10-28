// Material presets for the Longer Ray 5 (10 W diode). Starting points to test on scrap, not certified settings.
export interface MaterialPreset { id: string; name: string; thicknessMm: number; cut: string; engrave: string; kerfMm: number }
export const materialPresets: MaterialPreset[] = [
  { id: 'birch-3', name: 'Birch plywood', thicknessMm: 3, cut: '100% · 4 mm/s · 2 passes', engrave: '35% · 40 mm/s', kerfMm: 0.1 },
  { id: 'basswood-3', name: 'Basswood', thicknessMm: 3, cut: '90% · 6 mm/s · 1 pass', engrave: '30% · 50 mm/s', kerfMm: 0.1 },
  { id: 'cardstock', name: 'Cardstock', thicknessMm: 0.3, cut: '20% · 40 mm/s · 1 pass', engrave: '8% · 80 mm/s', kerfMm: 0.05 },
  { id: 'acrylic-3', name: 'Acrylic (dark)', thicknessMm: 3, cut: '100% · 2 mm/s · 4 passes', engrave: '40% · 30 mm/s', kerfMm: 0.15 },
  { id: 'leather-2', name: 'Veg-tan leather', thicknessMm: 2, cut: '90% · 5 mm/s · 2 passes', engrave: '25% · 60 mm/s', kerfMm: 0.1 }
];
