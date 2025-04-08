// Ticker emits a tick event every six seconds on worldEmitter

import worldEmitter from "./WorldEmitter.js";

class Ticker {
  private intervalId: NodeJS.Timeout | null = null;
  private tickInterval: number = 6000; // 6 seconds

  constructor() {
    this.start();
  }

  start() {
    if (this.intervalId) return; // Prevent multiple intervals
    this.intervalId = setInterval(() => {
      this.emitTick();
    }, this.tickInterval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  emitTick() {
    worldEmitter.emit('tick');
  }
}

export default Ticker;