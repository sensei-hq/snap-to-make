import { laserAdapter } from './laser';
import { cricutAdapter } from './cricut';
import { printer3dAdapter } from './printer3d';
import { simulatorAdapter } from './simulator';
import { shrinkAdapter } from './shrink';
import type { DeviceAdapter } from './types';
export { Phase2Error } from './types';
export const ADAPTERS: Record<string, DeviceAdapter> = { laser: laserAdapter, cricut: cricutAdapter, shrink: shrinkAdapter, printer3d: printer3dAdapter, simulator: simulatorAdapter };
export function getAdapter(id: string): DeviceAdapter { const a = ADAPTERS[id]; if (!a) throw new Error(`Unknown adapter ${id}`); return a; }
