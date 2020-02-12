import { RendererProcessIpc } from "electron-better-ipc";
// @ts-ignore
let ipc: RendererProcessIpc = window["ipc"];

(async () => {
  const config: Config = await ipc.callMain("get-config", null);
  console.log(config);
})();
