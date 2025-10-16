declare module "socket.io-client" {
  export interface Socket {
    connected: boolean;
    on(event: string, cb: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): this;
    removeAllListeners(): this;
    disconnect(): this;
  }

  export function io(uri: string, opts?: any): Socket;
}


