import type { ObjectSpec } from '../domain/object';
import type { ImplPlan, Target } from '../devices/types';
import { getAdapter } from '../devices/registry';
// Owns Object -> selected Target -> ImplPlan. Re-plan is code-only ($0): no model calls here.
export class DesignState {
  object = $state<ObjectSpec | null>(null);
  target = $state<Target | null>(null);
  impl = $state<ImplPlan | null>(null);
  setObject(obj: ObjectSpec, target?: Target) {
    this.object = obj;
    this.target = target ?? getAdapter('laser').defaultTarget;
    this.replan();
  }
  selectTarget(target: Target) { this.target = target; this.replan(); }
  replan() { if (this.object && this.target) this.impl = getAdapter(this.target.adapterId).plan(this.object, this.target); }
}
