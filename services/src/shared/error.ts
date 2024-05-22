export class SampleTracking extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly cause?: Error;

  constructor(e: any, { cause, name }: any = {}) {
    super(e);
    this.name = name || "SampleTrackingError";
    this.message = e.message || e;
    this.cause = cause;
    Error.captureStackTrace(this, this.constructor);
    console.error(`${this.name} - ${this.cause} : ${this.message}`);
  }
}

export class PayloadMismatch extends SampleTracking {
  constructor(err: any, extra: any) {
    super(err, { ...extra, name: "Payload Mismatch" });
  }
}
