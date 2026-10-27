import type { PlaybackTimeline } from '../devices/types';
export class PlaybackState {
  positionSec = $state(0);
  playing = $state(false);
  speed = $state(1);
  constructor(private timeline: PlaybackTimeline) {}
  get currentOp() { return this.timeline.ops.find(o => this.positionSec >= o.startSec && this.positionSec < o.startSec + o.durationSec) ?? this.timeline.ops[this.timeline.ops.length - 1]; }
  get totalSec() { return this.timeline.totalSec; }
  play() { this.playing = true; }
  pause() { this.playing = false; }
  seek(sec: number) { this.positionSec = Math.max(0, Math.min(sec, this.timeline.totalSec)); }
  setSpeed(s: number) { this.speed = s; }
  tick(dtSec: number) { if (this.playing) this.seek(this.positionSec + dtSec * this.speed); if (this.positionSec >= this.timeline.totalSec) this.playing = false; }
}
