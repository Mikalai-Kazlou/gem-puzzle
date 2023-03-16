export default class Collection {
  constructor(length) {
    this.length = length;
    this.storage = [];
  }

  isSolvable(array) {
    const size = (array.length + 1) ** (1 / 2);

    let n = size;
    for (let i = 0; i < array.length; i++) {
      for (let j = i + 1; j < array.length; j++) {
        if (array[i] > array[j]) {
          n++;
        }
      }
    }

    return (n % 2) === (size % 2);
  }

  isOrdered(array) {
    for (let i = 0; i < array.length - 1; i++) {
      if (array[i] > array[i + 1]) {
        return false;
      }
    }
    return true;
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  generate() {
    for (let i = 1; i <= this.length; i++) {
      this.storage.push(i);
    }

    this.shuffle(this.storage);
    while (!this.isSolvable(this.storage) || this.isOrdered(this.storage)) {
      this.shuffle(this.storage);
    }

    return this.storage;
  }
}