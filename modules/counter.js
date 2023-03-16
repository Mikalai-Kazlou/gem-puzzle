export default class Counter {
  constructor(element) {
    this.element = element;
    this.reset();
  }

  get() {
    return this.count;
  }

  refresh() {
    this.element.textContent = this.count;
  }

  add() {
    this.count++;
    this.refresh();
  }

  reset() {
    this.count = 0;
    this.refresh();
  }
}