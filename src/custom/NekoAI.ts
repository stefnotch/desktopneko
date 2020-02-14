import Actor from "../entities/Actor";
import { NekoAnimation } from "./NekoActor";

interface NekoAIState {
  updateBackground: (nekoAI: NekoAI) => {};
  updateActive: (nekoAI: NekoAI) => {};
  getStatePriority: (nekoAI: NekoAI) => number;
  getAnimation: () => NekoAnimation;
}

export default class NekoAI {
  actor: Actor;
  states: NekoAIState[];
  activeState: NekoAIState | null;
  threshhold = 0.4;
  constructor(actor: Actor) {
    this.actor = actor;
    this.states = [];
    this.activeState = null;
  }

  goToIdle() {
    this.activeState = null;
  }

  update(): NekoAnimation {
    this.states.forEach(s => s.updateBackground(this));
    if (this.activeState) {
      this.activeState.updateActive(this);
    }

    if (!this.activeState) {
      let maxStatePriority = -Infinity;
      let maxStatesCount = 0;
      this.states.forEach(s => {
        let priority = s.getStatePriority(this);
        if (priority < this.threshhold || priority < maxStatePriority) return;
        if (priority > maxStatePriority) {
          maxStatePriority = priority;
          maxStatesCount = 1;
        } else {
          maxStatesCount++;
        }
      });

      let nextActiveStateIndex = maxStatesCount
        ? Math.floor(Math.random() * maxStatesCount)
        : 0;

      this.activeState = this.states[nextActiveStateIndex];
    }

    return this.activeState ? this.activeState.getAnimation() : "still";
  }
}
