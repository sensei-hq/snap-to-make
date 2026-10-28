import type { PageServerLoad } from './$types';

/** The landing is public; signed in, it offers the way back into the workshop instead of the gate form. */
export const load: PageServerLoad = ({ locals }) => ({ signedIn: Boolean(locals.session) });
