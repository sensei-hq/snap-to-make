// Object layer (device-agnostic). Impl geometry lives in devices/, never here.
export type AbstractOp = 'cut-through' | 'engrave-surface' | 'score-crease' | 'draw-line' | 'extrude-solid';
export interface ObjectPart { id: string; name: string; template: string; qtyIndex: number; profile: { shape: string; wMm: number; hMm: number; diameterMm?: number }; thicknessMm: number; intent: Record<string, number | string>; joineryIntent?: string }
export interface SurfaceArt { artId: string; partName: string; op: AbstractOp; sizeMm: number; anchor: string }
export interface ObjectSpec { project: string; materialId: string; thicknessMm: number; sheetMm: { wMm: number; hMm: number }; parts: ObjectPart[]; surfaceArt: SurfaceArt[]; assembly: { step: number; text: string }[]; assumptions: string[]; implVariants: string[] }
