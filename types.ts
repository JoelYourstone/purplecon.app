export type CafeItem = {
  id: number;
  name: string;
  price: number;
};

export type CartItem = {
  item: CafeItem;
  quantity: number;
};

export type MenuSection = {
  title: string;
  data: CafeItem[];
};

export type Session = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  games: Game[];
};

export type Game = {
  id: string;
  name: string;
  mechanics: string;
  short_description: string;
  description: string;
  image: string | null;
  links: { title: string; url: string;}[];
};
