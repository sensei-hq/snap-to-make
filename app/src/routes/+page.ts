import { redirect } from '@sveltejs/kit';
// The app opens on the gate (invite + attestations); the gate leads into the workshop.
export function load() { redirect(307, '/snap/welcome'); }
