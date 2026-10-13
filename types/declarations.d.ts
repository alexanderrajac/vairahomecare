declare module 'qrcode' {
  export function toDataURL(
    text: string | any[],
    options?: {
      type?: string;
      rendererOpts?: any;
      errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
      margin?: number;
      scale?: number;
      width?: number;
      color?: {
        dark?: string;
        light?: string;
      };
    }
  ): Promise<string>;
}
