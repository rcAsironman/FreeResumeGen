declare module "html-to-docx" {
  interface Options {
    pageSize?: { width: number; height: number };
    margins?: { top?: number; right?: number; bottom?: number; left?: number; header?: number; footer?: number; gutter?: number };
  }

  export default function HTMLtoDOCX(
    documentHtml: string,
    headerHtml?: string,
    options?: Options,
    footerHtml?: string,
  ): Promise<ArrayBuffer>;
}
