export interface SizeInput {
  id: number;
  weight: string;
  price: string;
  discountPrice?: string | null;
  barCode?: string;
  discountParsent?: string | null;
}
