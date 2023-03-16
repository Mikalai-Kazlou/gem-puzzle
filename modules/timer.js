export default class Timer {
  constructor(element) {
    this.element = element;
    this.reset();
  }

  format(sec) {
    function num(val) {
      val = Math.floor(val);
      return val < 10 ? '0' + val : val;
    }

    const hours = sec / 3600 % 24;
    const minutes = sec / 60 % 60;
    const seconds = sec % 60;

    return num(hours) + ":" + num(minutes) + ":" + num(seconds);
  }

  get() {
    return this.format(this.time);
  }

  refresh() {
    this.element.textContent = this.format(this.time);
  }

  start() {
    this.marker = setInterval(() => {
      this.time++;
      this.refresh()
    }, 1000);
  }

  pause() {
    clearInterval(this.marker);
  }

  stop() {
    clearInterval(this.marker);
    this.reset();
  }

  reset() {
    this.time = 0;
    this.refresh();
  }
}