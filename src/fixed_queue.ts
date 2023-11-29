export class FixedSizeQueue<T> {
  private queue: T[];
  private readonly maxSize: number;

  constructor(maxSize: number = 3) {
    this.maxSize = maxSize;
    this.queue = [];
  }

  enqueue(item: T): void {
    this.queue.push(item);
    // Remove the oldest item if the queue size exceeds the maximum size
    if (this.queue.length > this.maxSize) {
      this.queue.shift();
    }
  }

  dequeue(): T | undefined {
    return this.queue.shift();
  }

  size(): number {
    return this.queue.length;
  }

  peek(): T | undefined {
    return this.queue[0];
  }

  clear(): void {
    this.queue = [];
  }

  toArray(): T[] {
    return [...this.queue];
  }
}
