declare module "*!image" {
  const value: HTMLImageElement;
  export = value;
}

declare module "*!text" {
  const value: string;
  export = value;
}

declare module "*.fnt.json!json" {
  const fnt: {
    pages: Array<string>
    chars: Array<{
      id: number
      x: number
      y: number
      width: number
      height: number
      xoffset: number
      yoffset: number
      xadvance: number
      page: number
      chnl: number
    }>,
    kernings: Array<any>
    info: {
      face: string
      size: number
      bold: number
      italic: number
      charset: string
      unicode: number
      stretchH: number
      smooth: number
      aa: number
      padding: [number, number, number, number]
      spacing: [number, number]
    }
    common: {
      lineHeight: number
      base: number
      scaleW: number
      scaleH: number
      pages: number
      packed: number
    }
  }
  export = fnt
}