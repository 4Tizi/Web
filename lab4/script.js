document.addEventListener('DOMContentLoaded', () => {
    // Находим секции для блюд (супов, основных блюд и напитков), чтобы затем добавлять блюда в соответствующую категорию.
    const soupsSection = document.querySelector('.dishes.soups .dish-grid');
    const mainsSection = document.querySelector('.dishes.mains .dish-grid');
    const drinksSection = document.querySelector('.dishes.drinks .dish-grid');

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
            }
        });
    }

    displayDishes();
    // Вызов функции для отображения всех блюд на странице

    // Логика добавления блюда в форму заказа
    const orderForm = {
        soup: null,
        main: null,
        drink: null
    };
    // Создаем объект, чтобы хранить выбранные блюда

    const soupElement = document.getElementById('order-soup');
    const mainElement = document.getElementById('order-main');
    const drinkElement = document.getElementById('order-drink');
    const totalPriceElement = document.getElementById('total-price');
    const emptyElement = document.getElementById('empty');
    const orderElement = document.getElementById('or');
    // прописываем элементы формы
    function updateOrder() {
        if (orderForm.soup || orderForm.main || orderForm.drink) {
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
        // Обновляем текст каждого элемента, чтобы показать выбранное блюдо или сообщение «Блюдо не выбрано».
        const totalPrice = (orderForm.soup ? orderForm.soup.price : 0) +
                           (orderForm.main ? orderForm.main.price : 0) +
                           (orderForm.drink ? orderForm.drink.price : 0);

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
            }

            updateOrder();
        }
    });
    // Добавляем выбранное блюдо в orderForm и вызываем updateOrder() для обновления информации о заказе.

    // Логика фильтрации
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const kind = button.getAttribute('data-kind');
            const dishes = document.querySelectorAll('.dish');
            // Фильтрация блюд по категориям при клике на соответсвующую кнопку.
            dishes.forEach(dish => {
                if (kind === 'all' || dish.getAttribute('data-kind') === kind) {
                    dish.style.display = '';
                } else {
                    dish.style.display = 'none';
                }
            });
            // Показываем только те блюда, которые соответствуют data-kind кнопки, все остальные скрываем.

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    // Обновляем класс active для кнопки, чтобы показать, что выбран фильтр.

    // Обработчик кнопки сброса формы
    const resetButton = document.querySelector('button[type="reset"]');
    resetButton.addEventListener('click', () => {
        // Сбрасываем заказ
        orderForm.soup = null;
        orderForm.main = null;
        orderForm.drink = null;

        // Скрываем блок заказа и показываем только "Ничего не выбрано"
        emptyElement.hidden = false;
        orderElement.hidden = true;

        // Обновляем отображение заказа
        updateOrder();
    });
});
