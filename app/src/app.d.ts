/// <reference types="@sveltejs/kit" />
declare global { namespace App { interface Locals { session: { id: string } | null } } }
export {};
