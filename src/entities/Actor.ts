import { vec2 } from "gl-matrix";

export default class Actor {
  private _parent: Actor | null;
  private _children: Actor[];

  position: vec2;
  size: vec2;

  constructor() {
    this._parent = null;
    this._children = [];

    this.position = vec2.create();
    this.size = vec2.create();
  }

  get parent() {
    return this._parent;
  }

  get children(): ReadonlyArray<Actor> {
    return this._children;
  }

  add(actor: Actor) {
    if (actor.parent != null) {
      actor.parent.remove(actor);
    }

    this._children.push(actor);
    actor._parent = this;
  }

  remove(actor: Actor) {
    if (actor.parent == this) {
      const index = this._children.indexOf(actor);
      if (index > -1) {
        this._children.splice(index, 1);
      }
      actor._parent = null;
    }
  }

  update() {
    this._children.forEach(c => c.update());
  }
}
