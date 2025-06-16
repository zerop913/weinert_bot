export type OrderStatus = "новый" | "в работе" | "выполнен" | "отменен";

export interface ArtOrder {
  id?: string;
  orderNumber?: string;
  status?: OrderStatus;
  adminComment?: string;
  name: string;
  charactersCount: number;
  references: string;
  idea: string;
  additionalWishes?: string;
  deadline: string;
  desiredPrice: string;
  contactInfo?: string;
  telegramUserId?: string;
  telegramUsername?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  id?: string;
  author: string;
  platform: string;
  content: string;
  rating: number;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FAQ {
  id?: string;
  question: string;
  answer: string;
  order: number;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Service {
  id?: string;
  title: string;
  price: string;
  description?: string;
  category: "main" | "additional";
  order: number;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SocialLink {
  id?: string;
  name: string;
  url: string;
  icon: string;
  order: number;
  isVisible: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Setting {
  id?: string;
  key: string;
  value: string;
  description?: string;
  updatedAt?: Date;
}
