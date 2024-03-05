export interface IFile {
  id?: string;
  fieldname?: string;
  originalname?: string;
  name?: string;
  encoding?: string;
  mimetype?: string;
  type?: string;
  buffer: Buffer;
  size: string;
}
