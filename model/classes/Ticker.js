// Ticker emits a tick event every six seconds on worldEmitter
import worldEmitter from "./WorldEmitter.js";
class Ticker {
    intervalId = null;
    tickInterval = 6000; // 6 seconds
    constructor() {
        this.start();
    }
    start() {
        if (this.intervalId)
            return; // Prevent multiple intervals
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
        console.log('Tick event emitted' + new Date().toLocaleTimeString());
    }
}
export default Ticker;
