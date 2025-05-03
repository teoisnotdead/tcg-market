// mock data

export interface LoginResponse {
  code: number;
  message: string;
  data: {
    token: string;
    email: string;
  };
}

export interface RegisterResponse {
  code: number;
  message: string;
  data: {
    token: string;
    email: string;
  };
}

export interface CartResponse {
  code: number;
  message: string;
  data: {
    cart: any[];
    total: number;
  };
}

export interface CheckoutResponse {
  code: number;
  message: string;
  data: {
    cart: any[];
  };
}

export interface ProductMock {
  id: string;
  image: string;
  title: string;
  set: string;
  price: string;
}

export const loginResponse: LoginResponse = {
  code: 200,
  message: 'OK',
  data: {
    token: 'token',
    email: 'emailMock@email.com',
  },
};

export const registerResponse: RegisterResponse = {
  code: 200,
  message: 'OK',
  data: {
    token: 'token',
    email: 'emailMock@email.com',
  },
};

export const cartResponse: CartResponse = {
  code: 200,
  message: 'OK',
  data: {
    cart: [],
    total: 0,
  },
};

export const checkoutResponse: CheckoutResponse = {
  code: 200,
  message: 'OK',
  data: {
    cart: [],
  },
};

export const products: ProductMock[] = [
  {
    id: "lucario-vstar",
    image: "/lucario.jpg",
    title: "Lucario VSTAR - SWSH291",
    set: "SWSH: Sword & Shield Promo Cards",
    price: "$10.000",
  },
  {
    id: "charizard-vmax",
    image: "/charizard-vmax.jpg",
    title: "Charizard VMAX - SWSH261",
    set: "SWSH: Sword & Shield Promo Cards",
    price: "$25.000",
  },
  {
    id: "pikachu-vmax",
    image: "/pikachu-vmax.jpg",
    title: "Pikachu VMAX - SWSH001",
    set: "SWSH: Sword & Shield Promo Cards",
    price: "$15.000",
  },
  {
    id: "rayquaza-vmax",
    image: "/rayquaza-vmax.jpg",
    title: "Rayquaza VMAX - Evolving Skies",
    set: "SWSH: Evolving Skies",
    price: "$30.000",
  },
  {
    id: "mewtwo-vstar",
    image: "/mewtwo-vstar.jpg",
    title: "Mewtwo VSTAR - Pokémon GO",
    set: "Pokémon GO Expansion",
    price: "$12.000",
  },
];

