/// <reference types="@sveltejs/kit" />
declare global { namespace App { interface Locals { session: { id: string; inviteCode: string } | null } } }
export {};
