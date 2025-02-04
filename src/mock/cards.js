
// mock data

export const loginResponse = {
  code: 200,
  message: 'OK',
  data: {
    token: 'token',
    email: 'emailMock@email.com',
  },
}

export const registerResponse = {
  code: 200,
  message: 'OK',
  data: {
    token: 'token',
    email: 'emailMock@email.com',
  },
}

export const cartResponse = {
  code: 200,
  message: 'OK',
  data: {
    cart: [],
    total: 0,
  },
}

export const checkoutResponse = {
  code: 200,
  message: 'OK',
  data: {
    cart: [],
  },
}

export const products = [
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

