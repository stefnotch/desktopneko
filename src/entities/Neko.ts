import { vec2 } from "gl-matrix";
import Actor from "./Actor";

interface NekoAction {
  direction?: "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
  image: string;
}

const nekoActions: { [key: string]: NekoAction[] } = {
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

export default class Neko extends Actor {
  element: HTMLImageElement;
  directory: string;

  constructor(directory: string, container: HTMLElement) {
    super();
    this.directory = directory;
    this.element = document.createElement("img");
    this.element.classList.add("neko");
    this.element.src = directory + "/still.gif";
    container.appendChild(this.element);
  }

  update() {
    this.element.style.top = this.position[0] + "px";
    this.element.style.left = this.position[1] + "px";

    super.update();
  }
}
