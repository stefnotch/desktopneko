import { vec2, glMatrix } from "gl-matrix";
import Actor from "../entities/Actor";
import ImageActor from "../entities/ImageActor";
import * as path from "path";
import Time from "../game/Time";
import NekoAI from "./NekoAI";

interface NekoAnimationImage {
  direction?: "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
  image: string;
}

export type NekoAnimation =
  | "still"
  | "alert"
  | "yawn"
  | "sleep"
  | "itch"
  | "lickPaw"
  | "scratch"
  | "run";

let nekoAnimations: { [key in NekoAnimation]: NekoAnimationImage[] } = {
  still: [{ image: "still.gif" }],
  alert: [{ image: "alert.gif" }],
  yawn: [{ image: "yawn.gif" }],
  sleep: [{ image: "sleep1.gif" }, { image: "sleep2.gif" }],
  itch: [{ image: "itch1.gif" }, { image: "itch2.gif" }],
  lickPaw: [{ image: "lickpaw.gif" }],
  scratch: [
    { direction: "n", image: "nscratch1.gif" },
    { direction: "n", image: "nscratch2.gif" },
    { direction: "e", image: "escratch1.gif" },
    { direction: "e", image: "escratch2.gif" },
    { direction: "s", image: "sscratch1.gif" },
    { direction: "s", image: "sscratch2.gif" },
    { direction: "w", image: "wscratch1.gif" },
    { direction: "w", image: "wscratch2.gif" }
  ],
  run: [
    { direction: "n", image: "nrun1.gif" },
    { direction: "n", image: "nrun2.gif" },
    { direction: "ne", image: "nerun1.gif" },
    { direction: "ne", image: "nerun2.gif" },
    { direction: "e", image: "erun1.gif" },
    { direction: "e", image: "erun2.gif" },
    { direction: "se", image: "serun1.gif" },
    { direction: "se", image: "serun2.gif" },
    { direction: "s", image: "srun1.gif" },
    { direction: "s", image: "srun2.gif" },
    { direction: "sw", image: "swrun1.gif" },
    { direction: "sw", image: "swrun2.gif" },
    { direction: "w", image: "wrun1.gif" },
    { direction: "w", image: "wrun2.gif" },
    { direction: "nw", image: "nwrun1.gif" },
    { direction: "nw", image: "nwrun2.gif" }
  ]
};

const animationDuration = 1000 / 4;

export default class NekoActor extends Actor {
  imageActor: ImageActor;
  directory: string;
  ai: NekoAI;
  animationTime: number;
  animationIndex: number;

  constructor(directory: string, container: HTMLElement) {
    super();
    this.directory = directory;
    this.imageActor = new ImageActor(container);
    this.addChild(this.imageActor);
    this.ai = new NekoAI(this);
    this.animationTime = 0;
    this.animationIndex = 0;
  }

  getNamedDirection(): NekoAnimationImage["direction"] {
    let angle = this.wrappedAngle + Math.PI / 8;
    const Pi = Math.PI;
    const PiOverTwo = Math.PI / 2;
    const PiOverFour = Math.PI / 4;

    if (angle < PiOverFour || angle > Pi * 2) {
      return "e";
    } else if (angle < PiOverTwo) {
      return "ne";
    } else if (angle < PiOverTwo + PiOverFour) {
      return "n";
    } else if (angle < Pi) {
      return "nw";
    } else if (angle < Pi + PiOverFour) {
      return "w";
    } else if (angle < Pi + PiOverTwo) {
      return "sw";
    } else if (angle < Pi + PiOverTwo + PiOverFour) {
      return "s";
    } else {
      return "se";
    }
  }

  update() {
    this.animationTime += Time.DeltaTime;
    if (this.animationTime > animationDuration) {
      this.animationTime %= animationDuration;
      this.animationIndex++;
    }

    this.ai.update();

    let animation = this.ai.update();

    let direction = this.getNamedDirection();
    // Draw the correct image based on the state and the angle
    let actions = nekoAnimations[animation].filter(
      s => !s.direction || s.direction == direction
    );

    this.animationIndex %= actions.length;

    this.imageActor.element.src = path.join(
      this.directory,
      actions[this.animationIndex].image
    );

    super.update();
  }
}
