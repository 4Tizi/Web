const dishes = [
    {
        keyword: "gaspacho",
        name: "Гаспачо",
        price: 195,
        category: "soup",
        count: "350 г",
        image: "images/gaspacho.jpg",
        kind: "veg"
    },
    {
        keyword: "gribnoy",
        name: "Грибной суп-пюре",
        price: 185,
        category: "soup",
        count: "330 г",
        image: "images/gribnoy.jpg",
        kind: "veg"
    },
    {
        keyword: "norveg",
        name: "Норвежский суп",
        price: 270,
        category: "soup",
        count: "330 г",
        image: "images/norveg.jpg",
        kind: "fish"
    },
    {
        keyword: "ramen",
        name: "Рамен",
        price: 375,
        category: "soup",
        count: "425 г",
        image: "images/Ramen.jpg",
        kind: "meat"
    },
    {
        keyword: "tom_yan",
        name: "Том ям с креветками",
        price: 650,
        category: "soup",
        count: "500 г",
        image: "images/tom_yan.JPG",
        kind: "fish"
    },
    {
        keyword: "chicken",
        name: "Куриный суп",
        price: 330,
        category: "soup",
        count: "350 г",
        image: "images/Chicken.jpg",
        kind: "meat"
    },
    {
        keyword: "potato",
        name: "Жареная картошка с грибами",
        price: 150,
        category: "main",
        count: "250 г",
        image: "images/potato.jpg",
        kind: "veg"
    },
    {
        keyword: "lazanya",
        name: "Лазанья",
        price: 385,
        category: "main",
        count: "310 г",
        image: "images/lazanya.jpg",
        kind: "meat"

    },
    {
        keyword: "kotlets",
        name: "Котлеты из курицы с картофельным пюре",
        price: 225,
        category: "main",
        count: "280 г",
        image: "images/kotlets.jpg",
        kind: "meat"
    },
    {
        keyword: "margarita",
        name: "Пицца маргарита",
        price: 700,
        category: "main",
        count: "500 г",
        image: "images/margarita.jpg",
        kind: "veg"
    },
    {
        keyword: "pasta",
        name: "Паста с креветками",
        price: 340,
        category: "main",
        count: "280 г",
        image: "images/Pasta.jpg",
        kind: "fish"
    },
    {
        keyword: "fish_cutlets",
        name: "Рыбная котлета с рисом и спаржей",
        price: 320,
        category: "main",
        count: "270 г",
        image: "images/fish_cutles.jpg",
        kind: "fish"
    },
    {
        keyword: "korean",
        name: "Корейский салат с овощами и яйцом",
        price: 330,
        category: "salad",
        count: "250 г",
        image: "images/korean.jpg",
        kind: "veg"
    },
    {
        keyword: "caesar",
        name: "Цезарь с цыпленком",
        price: 370,
        category: "salad",
        count: "220 г",
        image: "images/caesar.jpg",
        kind: "meat"
    },
    {
        keyword: "caprese",
        name: "Капрезе с моцареллой",
        price: 350,
        category: "salad",
        count: "235 г",
        image: "images/caprese.jpg",
        kind: "veg"
    },
    {
        keyword: "tune",
        name: "Салат с тунцом",
        price: 480,
        category: "salad",
        count: "250 г",
        image: "images/tune.jpg",
        kind: "fish"
    },
    {
        keyword: "french_fri_caesar",
        name: "Картофель фри с соусом Цезарь",
        price: 280,
        category: "salad",
        count: "235 мл",
        image: "images/french_fri_caesar.jpg",
        kind: "veg"
    },
    {
        keyword: "french_fri_ketchup",
        name: "Картофель фри с соусом кетчупом",
        price: 260,
        category: "salad",
        count: "235 мл",
        image: "images/french_fri_ketchup.jpg",
        kind: "veg"
    },
    {
        keyword: "orange",
        name: "Апельсиновый сок",
        price: 120,
        category: "drink",
        count: "300 мл",
        image: "images/orange.jpg",
        kind: "cold"
    },
    {
        keyword: "apple",
        name: "Яблочный сок",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "images/apple.jpg",
        kind: "cold"
    },
    {
        keyword: "carrot",
        name: "Морковный сок",
        price: 110,
        category: "drink",
        count: "300 мл",
        image: "images/carrot.jpg",
        kind: "cold"
    },
    {
        keyword: "cappuccino",
        name: "Капучино",
        price: 180,
        category: "drink",
        count: "300 мл",
        image: "images/cappuccino.jpg",
        kind: "hot"
    },
    {
        keyword: "green",
        name: "Зеленый чай",
        price: 100,
        category: "drink",
        count: "300 мл",
        image: "images/green_tea.jpg",
        kind: "hot"
    },
    {
        keyword: "black",
        name: "Черный чай",
        price: 90,
        category: "drink",
        count: "300 мл",
        image: "images/black_tea.jpg",
        kind: "hot"
    },
    {
        keyword: "baklava",
        name: "Пахлава",
        price: 220,
        category: "dessert",
        count: "300 гр",
        image: "images/baklava.jpg",
        kind: "small"
    },
    {
        keyword: "cheesecake",
        name: "Чизкейк",
        price: 240,
        category: "dessert",
        count: "125 гр",
        image: "images/cheesecake.jpg",
        kind: "small"
    },
    {
        keyword: "chocolate_cheesecake",
        name: "Шоколадный чизкейк",
        price: 260,
        category: "dessert",
        count: "125 гр",
        image: "images/chocolate_cheesecake.jpg",
        kind: "small"
    },
    {
        keyword: "chocolate_cake",
        name: "Шоколадный торт",
        price: 270,
        category: "dessert",
        count: "140 гр",
        image: "images/chocolate_cake.jpg",
        kind: "medium"
    },
    {
        keyword: "donuts_3",
        name: "Пончики (3 штуки)",
        price: 410,
        category: "dessert",
        count: "350 гр",
        image: "images/donuts_3.jpg",
        kind: "medium"
    },
    {
        keyword: "donuts_6",
        name: "Пончики (6 штук)",
        price: 650,
        category: "dessert",
        count: "700 мл",
        image: "images/donuts.jpg",
        kind: "big"
    }
];