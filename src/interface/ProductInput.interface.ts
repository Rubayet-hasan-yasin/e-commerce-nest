import { SizeInput } from './SizeInput.interface';

export interface ProductInput {
  images: File[];
  category: string;
  name: string;
  localName: string;
  description: string;
  keyword: string;
  youtubeLink: string;
  sizes: SizeInput[];
}
