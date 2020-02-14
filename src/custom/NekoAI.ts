import Actor from "../entities/Actor";
import { NekoAnimation } from "./NekoActor";
import Time from "./../game/Time";
import { vec2 } from "gl-matrix";
import Input from "../game/Input";

export default class NekoAI {
  actor: Actor;
  energy: number;
  timeout: number;
  target: vec2;
  state:
    | "sleep"
    | "idle"
    | "itch"
    | "lickPaw"
    | "alert"
    | "alertmouse"
    | "chase"
    | "chasemouse"
    | "scratch";

  constructor(actor: Actor) {
    this.actor = actor;
    this.energy = 0;
    this.timeout = 0;
    this.target = vec2.create();
    this.state = "sleep";
  }

  update(): NekoAnimation {
    this.energy -= 1 * Time.DeltaTime;

    let distanceFromMouse = Math.hypot(
      this.actor.position[0] + 16 - Input.MouseX,
      this.actor.position[1] + 16 - Input.MouseY
    );

    // Sleep state
    if (this.state == "sleep") {
      this.energy += 2 * Time.DeltaTime;
      if (this.energy > Time.seconds(20)) {
        this.energy = Time.seconds(100 + Math.random() * 40);
        this.state = "idle";
      }
      return "sleep";
    }

    // Yawning
    if (this.energy < 0) {
      this.state = "sleep";
    } else if (this.energy < Time.seconds(5)) {
      return "yawn";
    }

    if (distanceFromMouse < 80 && Math.random() * Time.DeltaTime < 0.09) {
      this.state = "alertmouse";
      this.timeout = Time.seconds(1);
    }

    // Idle, cat is board
    if (this.state == "idle") {
      let doSomething = Math.random() * Time.DeltaTime;
      if (doSomething < 0.03) {
        let randomState = Math.random();
        if (randomState < 0.3) {
          this.state = "itch";
          this.timeout = Time.seconds(5);
        } else if (randomState < 0.6) {
          this.state = "lickPaw";
          this.timeout = Time.seconds(7);
        } else {
          this.state = "alert";
          this.timeout = Time.seconds(1);
        }
      }

      return "still";
    } else if (this.state == "itch") {
      this.timeout -= Time.DeltaTime;
      if (this.timeout < 0) {
        this.state = "idle";
      }
      return "itch";
    } else if (this.state == "lickPaw") {
      this.timeout -= Time.DeltaTime;
      if (this.timeout < 0) {
        this.state = "idle";
      }
      return "lickPaw";
    } else if (this.state == "alert") {
      this.timeout -= Time.DeltaTime;
      if (this.timeout < 0) {
        this.state = "chase";

        let x =
          Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.25;
        let y =
          Math.random() * window.innerHeight * 1.5 - window.innerHeight * 0.25;
        vec2.set(this.target, x, y);
      }
      return "alert";
    } else if (this.state == "alertmouse") {
      this.timeout -= Time.DeltaTime;
      if (this.timeout < 0 && distanceFromMouse >= 80) {
        this.state = "chasemouse";
      }
      return "alert";
    } else if (this.state == "chase" || this.state == "chasemouse") {
      if (this.state == "chasemouse") {
        vec2.set(this.target, Input.MouseX, Input.MouseY);
      }
      let direction = vec2.create();
      vec2.subtract(direction, this.target, this.actor.position);
      if (vec2.length(direction) < 40) {
        this.state = "idle";
      }
      vec2.normalize(direction, direction);
      this.actor.angle = Math.atan2(-direction[1], direction[0]);
      vec2.add(this.actor.localPosition, this.actor.localPosition, direction);

      if (
        (this.target[0] < 0 ||
          this.target[1] < 0 ||
          this.target[0] > window.innerWidth ||
          this.target[1] > window.innerHeight) &&
        (this.actor.localPosition[0] <= 0 ||
          this.actor.localPosition[1] <= 0 ||
          this.actor.localPosition[0] >= window.innerWidth - 32 ||
          this.actor.localPosition[1] >= window.innerHeight - 32)
      ) {
        this.timeout = Time.seconds(5);
        this.state = "scratch";
        if (this.actor.localPosition[0] <= 0) {
          this.actor.angle = Math.PI;
        } else if (this.actor.localPosition[1] <= 0) {
          this.actor.angle = Math.PI / 2;
        } else if (this.actor.localPosition[0] >= window.innerWidth - 32) {
          this.actor.angle = 0;
        } else {
          this.actor.angle = Math.PI + Math.PI / 2;
        }
      }
      return "run";
    } else if (this.state == "scratch") {
      this.timeout -= Time.DeltaTime;
      if (this.timeout < 0) {
        this.state = "idle";
      }
      return "scratch";
    } else if (this.state == "sleep") {
      return "sleep";
    } else {
      return "still";
    }
  }
}
