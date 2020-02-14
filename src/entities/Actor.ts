import { vec2 } from "gl-matrix";

export default class Actor {
  private _parent: Actor | null;
  private _children: Actor[];

  localPosition: vec2;
  position: vec2;
  size: vec2;
  angle: number;

  constructor() {
    this._parent = null;
    this._children = [];

    this.localPosition = vec2.create();
    this.position = vec2.create();
    this.size = vec2.create();
    this.angle = 0;
  }

  get wrappedAngle() {
    const twoPi = Math.PI * 2;
    return ((this.angle % twoPi) + twoPi) % twoPi;
  }

  get parent() {
    return this._parent;
  }

  get children(): ReadonlyArray<Actor> {
    return this._children;
  }

  addChild(actor: Actor) {
    if (actor.parent != null) {
      actor.parent.removeChild(actor);
    }

    this._children.push(actor);
    actor._parent = this;
  }

  removeChild(actor: Actor) {
    if (actor.parent == this) {
      const index = this._children.indexOf(actor);
      if (index > -1) {
        this._children.splice(index, 1);
      }
      actor._parent = null;
    }
  }

  update() {
    if (this.parent) {
      vec2.add(this.position, this.localPosition, this.parent.localPosition);
    } else {
      vec2.copy(this.position, this.localPosition);
    }
    this._children.forEach(c => c.update());
  }
}
