document.addEventListener('DOMContentLoaded', () => {
    // Находим секции для блюд (супов, основных блюд и напитков), чтобы затем добавлять блюда в соответствующую категорию.
    const soupsSection = document.querySelector('.dishes.soups .dish-grid');
    const mainsSection = document.querySelector('.dishes.mains .dish-grid');
    const drinksSection = document.querySelector('.dishes.drinks .dish-grid');
    const saladsSection = document.querySelector('.dishes.salads .dish-grid');
    const dessertsSection = document.querySelector('.dishes.desserts .dish-grid');

    // Функция для отображения блюд по категориям
    function displayDishes() {
        const sortedDishes = dishes.sort((a, b) => a.name.localeCompare(b.name));
        // sortedDishes — это список dishes, отсортированный по алфавиту на основе названий.
        sortedDishes.forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.classList.add('dish');
            dishElement.setAttribute('data-dish', dish.keyword);
            dishElement.setAttribute('data-kind', dish.kind);
            // Создаем элемент "div" и атрибуты для фильтрации и индентификации.
            dishElement.innerHTML = `
                <img src="${dish.image}" alt="${dish.name}">
                <p class="price">${dish.price} &#8381;</p>
                <p class="name">${dish.name}</p>
                <p class="weight">${dish.count}</p>
                <button>Добавить</button>
            `;
            // Внутреняя разметка блюда
            // В зависимости от категории блюда, добавляем его в нужную секцию
            if (dish.category === 'soup') {
                soupsSection.appendChild(dishElement);
            } else if (dish.category === 'main') {
                mainsSection.appendChild(dishElement);
            } else if (dish.category === 'drink') {
                drinksSection.appendChild(dishElement);
            } else if (dish.category === 'salad') {
                saladsSection.appendChild(dishElement);
            } else if (dish.category === 'dessert') {
                dessertsSection.appendChild(dishElement);
            }
        });
    }

    displayDishes();
    // Вызов функции для отображения всех блюд на странице

    // Логика добавления блюда в форму заказа
    const orderForm = {
        soup: null,
        main: null,
        drink: null,
        salad: null,
        dessert: null
    };
    // Создаем объект, чтобы хранить выбранные блюда
    const soupElement = document.getElementById('order-soup');
    const mainElement = document.getElementById('order-main');
    const drinkElement = document.getElementById('order-drink');
    const saladElement = document.getElementById('order-salad');
    const dessertElement = document.getElementById('order-dessert');
    const totalPriceElement = document.getElementById('total-price');
    const emptyElement = document.getElementById('empty');
    const orderElement = document.getElementById('or');
    // прописываем элементы формы
    function updateOrder() {
        if (orderForm.soup || orderForm.main || orderForm.drink || orderForm.salad || orderForm.dessert) {
            emptyElement.hidden = true;
            orderElement.hidden = false;
        } else {
            emptyElement.hidden = false;
            orderElement.hidden = true;
        }
        // Если хотя бы одно блюдо выбрано, скрываем «Ничего не выбрано» (emptyElement) и показываем блок заказа (orderElement). Иначе делаем наоборот.
        soupElement.innerHTML = `<strong>Суп:</strong><br>${orderForm.soup ? orderForm.soup.name + ' ' + orderForm.soup.price + '₽' : 'Блюдо не выбрано'}`;
        mainElement.innerHTML = `<strong>Главное блюдо:</strong><br>${orderForm.main ? orderForm.main.name + ' ' + orderForm.main.price + '₽' : 'Блюдо не выбрано'}`;
        drinkElement.innerHTML = `<strong>Напиток:</strong><br>${orderForm.drink ? orderForm.drink.name + ' ' + orderForm.drink.price + '₽' : 'Напиток не выбран'}`;
        saladElement.innerHTML = `<strong>Салат:</strong><br>${orderForm.salad ? orderForm.salad.name + ' ' + orderForm.salad.price + '₽' : 'Салат не выбран'}`;
        dessertElement.innerHTML = `<strong>Десерт:</strong><br>${orderForm.dessert ? orderForm.dessert.name + ' ' + orderForm.dessert.price + '₽' : 'Десерт не выбран'}`;
        // Обновляем текст каждого элемента, чтобы показать выбранное блюдо или сообщение «Блюдо не выбрано».
        const totalPrice = (orderForm.soup ? orderForm.soup.price : 0) +
                           (orderForm.main ? orderForm.main.price : 0) +
                           (orderForm.drink ? orderForm.drink.price : 0) +
                           (orderForm.salad ? orderForm.salad.price : 0) +
                           (orderForm.dessert ? orderForm.dessert.price : 0);

        totalPriceElement.textContent = `Стоимость заказа: ${totalPrice} ₽`;
    }
    // Вычисляем общую стоимость заказа, складывая цену выбранных блюд, и отображаем ее в totalPriceElement.

    // Обработчик кликов по карточкам
    document.body.addEventListener('click', (event) => {
        if (event.target.tagName === 'BUTTON' && event.target.closest('.dish')) {
            const dishElement = event.target.closest('.dish');
            const keyword = dishElement.getAttribute('data-dish');
            const selectedDish = dishes.find(dish => dish.keyword === keyword);
             // Когда пользователь нажимает кнопку «Добавить» в карточке блюда, находим соответствующее блюдо в массиве dishes по keyword.
            if (selectedDish.category === 'soup') {
                orderForm.soup = selectedDish;
            } else if (selectedDish.category === 'main') {
                orderForm.main = selectedDish;
            } else if (selectedDish.category === 'drink') {
                orderForm.drink = selectedDish;
            } else if (selectedDish.category === 'salad') {
                orderForm.salad = selectedDish;
            } else if (selectedDish.category === 'dessert') {
                orderForm.dessert = selectedDish;
            }

            updateOrder();
        }
    });
    // Добавляем выбранное блюдо в orderForm и вызываем updateOrder() для обновления информации о заказе.
        //обработчик событий для кнопок фильтрации 
        document.querySelectorAll(".filter-button").forEach(filter => {
            filter.addEventListener("click", (event) => {
                const section = event.target.closest("section");
                const previouslyActive = section.querySelector(".filters button.active");
                if (previouslyActive === event.target) {
                    event.target.classList.remove("active");
                    filterDishes(section, "all");
                } else {
                    section.querySelectorAll(".filters button").forEach(btn => btn.classList.remove("active"));
                    event.target.classList.add("active");
                    const kind = event.target.getAttribute("data-kind");
                    filterDishes(section, kind);
                }
            });
        });
    
        //фильтрация блюд
        const filterDishes = (section, kind) => {
            const sectionDishes = section.querySelectorAll(".dish");
            sectionDishes.forEach(dishElement => {
                const dishKeyword = dishElement.getAttribute("data-dish");
                const dish = dishes.find(d => d.keyword === dishKeyword);
                if (kind === "all" || dish.kind.includes(kind)) {
                    dishElement.style.display = "block";
                } else {
                    dishElement.style.display = "none";
                }
            });
        };


    // Обработчик кнопки сброса формы
    const resetButton = document.querySelector('button[type="reset"]');
    resetButton.addEventListener('click', () => {
        // Сбрасываем заказ
        orderForm.soup = null;
        orderForm.main = null;
        orderForm.drink = null;
        orderForm.salad = null;
        orderForm.dessert = null;

        // Скрываем блок заказа и показываем только "Ничего не выбрано"
        emptyElement.hidden = false;
        orderElement.hidden = true;

        // Обновляем отображение заказа
        updateOrder();
    });
});
