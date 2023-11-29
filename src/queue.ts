export class AsyncQueue {
  private tasks: (() => Promise<void>)[];
  private readonly concurrency: number;
  private running: number;
  private active: boolean;

  constructor(concurrency: number = 1) {
    this.tasks = [];
    this.concurrency = concurrency;
    this.running = 0;
    this.active = true;
  }

  private async run(): Promise<void> {
    if (
      !this.active ||
      this.running >= this.concurrency ||
      this.tasks.length === 0
    ) {
      return; // Queue is busy or empty
    }

    this.running++;
    const task = this.tasks.shift();

    if (task) {
      try {
        await task();
      } catch (err) {
        console.error(err);
      } finally {
        this.running--;
        if (this.active) {
          this.run();
        }
      }
    }
  }

  terminate(): void {
    this.active = false;
    this.tasks = [];
    console.log("Queue has been terminated");
  }

  enqueue(task: () => Promise<void>): void {
    if (this.running >= this.concurrency) {
      return; // Discard task if queue is busy
    }
    this.tasks.push(task);
    this.run();
  }
}
