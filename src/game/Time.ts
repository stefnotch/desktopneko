export default {
  DeltaTime: 0,
  GameTime: 0,
  StartTime: Date.now(),
  seconds(ticks: number) {
    return ticks * 1000;
  }
};
