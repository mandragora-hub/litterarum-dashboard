export interface IHttpSuccessResponse<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}

export interface IHttpPostDataResponse {
  codigo: string;
  descripcion: string;
  fchCreacion: string;
}

export interface MetaPageResult {
  totalPages: number;
  currentPage: number;
  count: number;
}

export interface PageResult<T> {
  data: T[];
  meta: MetaPageResult;
}

export interface ITag {
  _id: string;
  tag: string;
}

export interface IAuthor {
  _id: string;
  name: string;
  alias: string;
  photoUrl: string;
}

export interface IBook {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  basename: string;
  coverUrl?: string;
  readTime?: number; // ?note: time in milliseconds
  wordCount?: number;
  pages?: number;
  downloaded: number;
  views: number;
  author: IAuthor | string;
  tags: ITag[] | string[];
  pdfFile?: string;
  ePubFile?: string;
  publicationDate?: string; // 431-213 BC, 1982
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFile {
  filename: string;
  basename: string;
  lastmod: string;
  size: number;
  type: string;
  etag: string;
  mime: string;
}
