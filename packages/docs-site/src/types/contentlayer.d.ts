declare module 'contentlayer/generated' {
  export interface ApiDoc {
    _id: string;
    _raw: {
      sourceFilePath: string;
      sourceFileName: string;
      sourceFileDir: string;
      contentType: string;
      flattenedPath: string;
    };
    type: 'ApiDoc';
    title: string;
    description?: string;
    category?: string;
    slug: string;
    url: string;
    body: {
      raw: string;
      html: string;
    };
  }

  export interface Doc {
    _id: string;
    _raw: {
      sourceFilePath: string;
      sourceFileName: string;
      sourceFileDir: string;
      contentType: string;
      flattenedPath: string;
    };
    type: 'Doc';
    title: string;
    description?: string;
    order?: number;
    slug: string;
    url: string;
    body: {
      raw: string;
      html: string;
    };
  }

  export const allApiDocs: ApiDoc[];
  export const allDocs: Doc[];
} 