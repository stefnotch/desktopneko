interface Config {
  settingsDirectory: string;
  nekosDirectory: string;
  nekos: NekoConfig[];
}

interface NekoConfig {
  directory: string;
  name: string;
}
