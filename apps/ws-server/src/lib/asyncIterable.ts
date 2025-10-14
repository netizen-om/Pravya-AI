// Normalize different stream types (Web ReadableStream, Node Readable, AsyncIterable)
export async function* toAsyncIterable(stream: unknown): AsyncIterable<Uint8Array> {
  // Already async iterable
  if (stream && typeof (stream as any)[Symbol.asyncIterator] === "function") {
    for await (const chunk of stream as AsyncIterable<Uint8Array>) {
      yield chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk as any);
    }
    return;
  }
  // Web ReadableStream
  if (stream && typeof (stream as any).getReader === "function") {
    const reader = (stream as ReadableStream<Uint8Array>).getReader();
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) yield value;
      }
    } finally {
      reader.releaseLock();
    }
    return;
  }
  // Node Readable
  const nodeStream = stream as any;
  if (nodeStream && typeof nodeStream.on === "function") {
    yield* await new Promise<AsyncIterable<Uint8Array>>((resolve) => {
      const chunks: Uint8Array[] = [];
      nodeStream.on("data", (c: Buffer | Uint8Array) => {
        chunks.push(c instanceof Uint8Array ? c : new Uint8Array(c));
      });
      nodeStream.on("end", () => {
        resolve((async function* () {
          for (const c of chunks) yield c;
        })());
      });
    });
    return;
  }
  throw new Error("Unsupported stream type for toAsyncIterable");
}
