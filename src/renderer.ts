import { ipcRenderer as ipc } from "electron-better-ipc";
import { mat2d, glMatrix, vec2 } from "gl-matrix";
import Neko from "./entities/Neko";
import Actor from "./entities/Actor";

let nekoContainer = document.querySelector(".neko-container") as HTMLElement;
let world = new Actor();

(async () => {
  const config: Config = await ipc.callMain("get-config", null);
  console.log(config);

  ipc.on("spawn-neko", (event, nekoConfig: NekoConfig) => {
    spawnNeko(nekoConfig);
  });

  window.requestAnimationFrame(update);
})();

function spawnNeko(nekoConfig: NekoConfig) {
  let neko = new Neko(nekoConfig.directory, nekoContainer);
  world.add(neko);
}

function update() {
  vec2.set(world.size, window.innerWidth, window.innerHeight);
  window.requestAnimationFrame(update);
}
