import Actor from "./Actor";

export default class ImageActor extends Actor {
  element: HTMLImageElement;

  constructor(container: HTMLElement) {
    super();
    this.element = document.createElement("img");
    this.element.style.position = "fixed";
    container.appendChild(this.element);
  }

  update() {
    this.element.style.top = this.position[0] + "px";
    this.element.style.left = this.position[1] + "px";

    super.update();
  }
}
