import { ipcRenderer as ipc } from "electron-better-ipc";
import { mat2d, glMatrix, vec2 } from "gl-matrix";
import NekoActor from "./custom/NekoActor";
import Actor from "./entities/Actor";
import Time from "./game/Time";
import Input from "./game/Input";

let nekoContainer = document.querySelector(".neko-container") as HTMLElement;
let world = new Actor();
let lastTime = Date.now();

(async () => {
  const config: Config = await ipc.callMain("get-config", null);
  console.log(config);

  ipc.on("spawn-neko", (event, nekoConfig: NekoConfig) => {
    spawnNeko(nekoConfig);
  });

  document.addEventListener("mousemove", event => {
    Input.MouseX = event.screenX;
    Input.MouseY = event.screenY;
  });

  window.requestAnimationFrame(update);
})();

function spawnNeko(nekoConfig: NekoConfig) {
  let neko = new NekoActor(nekoConfig.directory, nekoContainer);
  world.addChild(neko);
}

function update() {
  Time.DeltaTime = Date.now() - lastTime;
  lastTime = Date.now();
  Time.GameTime += Time.DeltaTime;
  vec2.set(world.size, window.innerWidth, window.innerHeight);
  world.update();
  window.requestAnimationFrame(update);
}
