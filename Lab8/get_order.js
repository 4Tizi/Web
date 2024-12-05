document.addEventListener('DOMContentLoaded', () => {
     // Отправляем запрос на сервер для получения списка блюд
    fetch("https://edu.std-900.ist.mospolytech.ru/labs/api/dishes")
        .then(response => response.json())
        .then(data => {
             // Сортируем блюда по имени в алфавитном порядке
            const sortedFood = data.sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });
            // Находим элементы DOM, связанные с выбранными блюдами
            const chosenDishesSection = document.querySelectorAll('#chosen_food .dishes_order')[0];

            const nothingSelectedMessage = document.querySelector('.nothing_selected');
            const chosenDishes = document.querySelectorAll('#chosen_food .dishes_order');
            nothingSelectedMessage.style.display = '';


            // Проверяем, есть ли выбранные блюда
            if (chosenDishes.length > 0) {
                nothingSelectedMessage.style.display = 'none';
            }

             // Функция создания карточки блюда
            function TicketsMake(dish) {
                const ticket = document.createElement('div');
                ticket.classList.add('flex');
                ticket.dataset.kind = dish['kind'];
                // Добавляем изображение блюда
                const img = document.createElement('img');
                img.src = dish['image'];
                img.alt = dish['name'];
                // Добавляем цену
                const price = document.createElement('p');
                price.classList.add('price');
                price.textContent = dish['price'] + '₽';
                // Добавляем название
                const food = document.createElement('p');
                food.classList.add('food');
                food.textContent = dish['name'];
                // Добавляем количество
                const weight = document.createElement('p');
                weight.classList.add('count');
                weight.textContent = dish['count'];
                // Кнопка удаления блюда
                const button = document.createElement('button');
                button.textContent = "Удалить";
                 // Добавляем элементы в карточку
                ticket.appendChild(img);
                ticket.appendChild(price);
                ticket.appendChild(food);
                ticket.appendChild(weight);
                ticket.appendChild(button);
                 // Обработчик события для удаления блюда
                button.addEventListener('click', () => {
                    RemoveDish(dish, ticket);
                });

                return ticket;// Возвращаем готовую карточку
            }
            // Функция добавления карточек для выбранных блюд
            function GetTickets(CurrentElem) {
                const localStorageIds = [
                    window.localStorage.getItem('soup-selected'),
                    window.localStorage.getItem('main-course-selected'),
                    window.localStorage.getItem('salad-selected'),
                    window.localStorage.getItem('drink-selected'),
                    window.localStorage.getItem('dessert-selected'),
                ]
                // Проверяем, есть ли блюда из localStorage
                sortedFood.forEach(function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        const ticket = TicketsMake(dish);
                        CurrentElem.appendChild(ticket);

                    }
                });
            }
            // Вызов функции отображения блюд
            GetTickets(chosenDishesSection);
            // Инициализация переменных для стоимости заказа
            let FoodPrice = 0;
            const FoodTotalPriceElements = document.getElementById('total_price');
            const FoodPriceElements = document.getElementById('food_price');
             // Объект для отслеживания выбранных блюд
            let ChosenFood = {
                'soup': null,
                'main-course': null,
                'salad': null,
                'drink': null,
                'dessert': null,
            };

             // Скрытие элементов при старте
            const SoupLabel = document.getElementById('soup-select');
            const ChosenSoup = document.getElementById('soup-selected');
            const MainLabel = document.getElementById('main-course-select');
            const ChosenSalad = document.getElementById('salad-selected');
            const SaladLabel = document.getElementById('salad-select');
            const ChosenMain = document.getElementById('main-course-selected');
            const JuiceLabel = document.getElementById('drink-select');
            const ChosenJuice = document.getElementById('drink-selected');
            const DessertLabel = document.getElementById('dessert-select');
            const ChosenDessert = document.getElementById('dessert-selected');

            const EmptyMessage = document.getElementById('empty_space');
            // Скрытие всех блоков выбранных блюд, их меток, цены и отображение сообщения о пустом заказе
            ChosenSoup.style.display = 'none';
            ChosenMain.style.display = 'none';
            ChosenSalad.style.display = 'none';
            ChosenJuice.style.display = 'none';
            ChosenDessert.style.display = 'none';

            SoupLabel.style.display = 'none';
            MainLabel.style.display = 'none';
            SaladLabel.style.display = 'none';
            JuiceLabel.style.display = 'none';
            DessertLabel.style.display = 'none';
            FoodTotalPriceElements.style.display = 'none';
            FoodPriceElements.style.display = 'none';

            EmptyMessage.style.display = '';
            //Функция добавления блюда в заказ
            function GetOrder(dish) {
                let GetUpdate = false;
                // Определяем категорию блюда и обновляем соответствующий элемент в заказе
                if (dish['category'] === 'soup') {
                    UpdateGridElem('soup', dish, ChosenSoup, SoupLabel);
                    window.localStorage.setItem('soup-selected', dish['id']);
                    GetUpdate = true;
                } else if (dish['category'] === 'main-course') {
                    UpdateGridElem('main-course', dish, ChosenMain, MainLabel);
                    window.localStorage.setItem('main-course-selected', dish['id']);
                    GetUpdate = true;
                } else if (dish['category'] === 'salad') {
                    UpdateGridElem('salad', dish, ChosenSalad, SaladLabel);
                    window.localStorage.setItem('salad-selected', dish['id']);
                    GetUpdate = true;
                } else if (dish['category'] === 'drink') {
                    UpdateGridElem('drink', dish, ChosenJuice, JuiceLabel);
                    window.localStorage.setItem('drink-selected', dish['id']);
                    GetUpdate = true;
                } else if (dish['category'] === 'dessert') {
                    UpdateGridElem('dessert', dish, ChosenDessert, DessertLabel);
                    window.localStorage.setItem('dessert-selected', dish['id']);
                    GetUpdate = true;
                }
                // Если был добавлен элемент, скрываем сообщение о пустом заказе
                if (GetUpdate) {
                    EmptyMessage.style.display = 'none';
                }
                 // Обновляем отображение общей стоимости заказа
                FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;
                FoodPriceElements.style.display = 'block';

                EmptyElements();// Проверяем, какие категории остались пустыми

            }
            //Функция удаления блюда из заказа
            function RemoveDish(dish, ticket) {
                // Удаляем блюдо из выбранного заказа в зависимости от категории
                if (window.localStorage.getItem('soup-selected') === String(dish['id'])) {
                    console.log(FoodPrice);
                    window.localStorage.removeItem('soup-selected');
                    FoodPrice -= ChosenFood['soup']['price'];
                    console.log(FoodPrice);
                    ChosenFood['soup'] = null;
                    FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;
                } else if (window.localStorage.getItem('main-course-selected') === String(dish['id'])) {
                    window.localStorage.removeItem('main-course-selected');
                    FoodPrice -= ChosenFood['main-course']['price'];
                    ChosenFood['main-course'] = null;
                    FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;

                } else if (window.localStorage.getItem('salad-selected') === String(dish['id'])) {
                    window.localStorage.removeItem('salad-selected');
                    FoodPrice -= ChosenFood['salad']['price'];
                    ChosenFood['salad'] = null;
                    FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;

                } else if (window.localStorage.getItem('drink-selected') === String(dish['id'])) {
                    window.localStorage.removeItem('drink-selected');
                    FoodPrice -= ChosenFood['drink']['price'];
                    ChosenFood['drink'] = null;
                    FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;

                } else if (window.localStorage.getItem('dessert-selected') === String(dish['id'])) {
                    window.localStorage.removeItem('dessert-selected');
                    FoodPrice -= ChosenFood['dessert']['price'];
                    ChosenFood['dessert'] = null;
                    FoodPriceElements.textContent = `Стоимость заказа ${FoodPrice}₽`;
                }
                // Удаляем визуальный элемент блюда
                ticket.parentNode.removeChild(ticket);

                EmptyElements();
                // Проверяем, остались ли блюда в заказе, если нет — возвращаем интерфейс к пустому состоянию
                const tickets = document.querySelectorAll('.flex');


                if (tickets.length === 0) {
                    ChosenSoup.style.display = 'none';
                    ChosenMain.style.display = 'none';
                    ChosenSalad.style.display = 'none';
                    ChosenJuice.style.display = 'none';
                    ChosenDessert.style.display = 'none';

                    SoupLabel.style.display = 'none';
                    MainLabel.style.display = 'none';
                    SaladLabel.style.display = 'none';
                    JuiceLabel.style.display = 'none';
                    DessertLabel.style.display = 'none';

                    FoodPriceElements.style.display = 'none';
                    EmptyMessage.style.display = '';
                    nothingSelectedMessage.style.display = '';

                }
            }
            //Функция загрузки данных из LocalStorage
            function loadFromLocalStorage() {
                const localStorageIds = [
                    window.localStorage.getItem('soup-selected'),
                    window.localStorage.getItem('main-course-selected'),
                    window.localStorage.getItem('salad-selected'),
                    window.localStorage.getItem('drink-selected'),
                    window.localStorage.getItem('dessert-selected'),
                ]
                nothingSelectedMessage.style.display = '';
                // Загружаем блюда из LocalStorage, если они были сохранены
                sortedFood.forEach(function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        GetOrder(dish);
                    }
                });
                // Если блюда выбраны, скрываем сообщение о пустом заказе
                if (chosenDishes.length > 0) {
                    nothingSelectedMessage.style.display = 'none';
                }
            }
            // Загружаем данные из локального хранилища и обновляем интерфейс
            loadFromLocalStorage();
            nothingSelectedMessage.style.display = '';// Показать сообщение "ничего не выбрано"

            if (chosenDishes.length > 0) {
                nothingSelectedMessage.style.display = 'none';// Скрыть сообщение, если есть выбранные блюда
            }
            // Обновляет элемент интерфейса с информацией о выбранном блюде
            function UpdateGridElem(category, dish, CurrentElem, LabelElem) {
                if (ChosenFood[category] !== null) {
                    FoodPrice -= ChosenFood[category]['price'];
                }

                ChosenFood[category] = dish;
                CurrentElem.textContent = `${dish['name']} ${dish['price']}₽`;
                CurrentElem.style.display = 'block';
                LabelElem.style.display = 'block';

                FoodPrice += dish['price'];
            }
            // Сброс формы, очистка данных и интерфейса
            document.querySelector('form').addEventListener('reset', function () {
                 // Скрываем элементы выбранных блюд
                ChosenSoup.style.display = 'none';
                ChosenMain.style.display = 'none';
                ChosenSalad.style.display = 'none';
                ChosenJuice.style.display = 'none';
                ChosenDessert.style.display = 'none';
                 // Скрываем метки
                SoupLabel.style.display = 'none';
                MainLabel.style.display = 'none';
                SaladLabel.style.display = 'none';
                JuiceLabel.style.display = 'none';
                DessertLabel.style.display = 'none';
                FoodPriceElements.style.display = 'none';

                EmptyMessage.style.display = '';
                // Очищаем данные о выбранных блюдах
                ChosenFood = {
                    'суп': null,
                    'главное блюдо': null,
                    'салат': null,
                    'напиток': null,
                    'десерт': null
                };

                FoodPrice = 0;// Обнуляем цену
                // Удаляем данные из локального хранилища
                window.localStorage.removeItem('soup-selected');
                window.localStorage.removeItem('main-course-selected');
                window.localStorage.removeItem('salad-selected');
                window.localStorage.removeItem('drink-selected');
                window.localStorage.removeItem('dessert-selected');
                // Удаляем карточки с блюдами
                const cards = document.querySelectorAll('.flex');
                cards.forEach(function (card) {
                    card.parentNode.removeChild(card);
                });

                nothingSelectedMessage.style.display = '';


            });

            // Проверяет, выбраны ли все необходимые элементы и показывает их как пустые, если не выбраны
            function EmptyElements() {
                if (ChosenFood['soup'] === null) {
                    ChosenSoup.textContent = 'Блюдо не выбрано';
                    SoupLabel.style.display = 'block';
                    ChosenSoup.style.display = 'block';
                }
                if (ChosenFood['main-course'] === null) {
                    ChosenMain.textContent = 'Блюдо не выбрано';
                    MainLabel.style.display = 'block';
                    ChosenMain.style.display = 'block';
                }
                if (ChosenFood['salad'] === null) {
                    ChosenSalad.textContent = 'Блюдо не выбрано';
                    SaladLabel.style.display = 'block';
                    ChosenSalad.style.display = 'block';
                }
                if (ChosenFood['drink'] === null) {
                    ChosenJuice.textContent = 'Напиток не выбран';
                    JuiceLabel.style.display = 'block';
                    ChosenJuice.style.display = 'block';
                }
                if (ChosenFood['dessert'] === null) {
                    ChosenDessert.textContent = 'Десерт не выбран';
                    DessertLabel.style.display = 'block';
                    ChosenDessert.style.display = 'block';
                }
            }


            const submitButton = document.getElementById('submit'); //кнопка отправки формы
            const notification = document.getElementById('notification'); //уведомление
            const notificationText = document.getElementById('notification-text');//текст уведомления
            const notificationButton = document.getElementById('notification-button');//кнопка уведомления

            const comboOptions = [
                ['soup', 'main-course', 'salad', 'drink'],
                ['soup', 'main-course', 'drink'],
                ['soup', 'salad', 'drink'],
                ['main-course', 'salad', 'drink'],
                ['main-course', 'drink']
            ];
            // Проверка заказа на соответствие допустимым комбинациям
            function checkOrder() {
                const chosenCategories = Object.keys(ChosenFood).filter(category => ChosenFood[category]);//фильтрует категории, чтобы найти выбранные
                if (chosenCategories.length === 0) {
                    showNotification("Ничего не выбрано. Выберите блюда для заказа");
                    return false;
                } //если нет выбранных категорий

                let validCombo = comboOptions.some(option =>
                    option.every(item => chosenCategories.includes(item))
                ); //проверка комбинаций комбо

                if (!validCombo) {
                    if (!chosenCategories.includes('drink')) {
                        showNotification("Выберите напиток");
                    } else if ((!chosenCategories.includes('main-course') || !chosenCategories.includes('salad')) && chosenCategories.includes('soup')) {
                        showNotification("Выберите главное блюдо/салат/стартер");
                    } else if (!chosenCategories.includes('soup') && !chosenCategories.includes('main-course') && chosenCategories.includes('salad')) {
                        showNotification("Выберите суп или главное блюдо");
                    } else if ((chosenCategories.includes('dessert')) || (chosenCategories.includes('drink'))) {
                        showNotification("Выберите главное блюдо");
                    } else {
                        showNotification("Некорректный выбор. Проверьте ваш заказ.");
                    }
                    return false;
                } //для показа уведомлений

                return true; //Проверка успешная
            }

            function showNotification(message) {
                notificationText.textContent = message;
                notification.classList.remove('hidden');
            } //убираем скрытие

            notificationButton.addEventListener('click', () => {
                notification.classList.add('hidden');
                notificationText.textContent = '';
            });
            // Обработчик отправки формы
            submitButton.addEventListener('click', (event) => {
                if (!checkOrder()) {
                    event.preventDefault(); // Не отправляем форму, если заказ некорректен
                } else {
                    let delivery_type = 'by_time';
                    if (document.querySelectorAll('input[name="need_time"]:checked')[0].value === 'asap') {
                        delivery_type = 'now';
                    }

                    let subscribe = false;
                    if (document.getElementById('subscribe').value === 'on') {
                        subscribe = true;
                    }

                    const formData = new FormData();
                    formData.append('full_name', document.getElementById('name').value);
                    formData.append('email', document.getElementById('email').value);
                    formData.append('subscribe', subscribe);
                    formData.append('phone', document.getElementById('phone').value);
                    formData.append('delivery_address', document.getElementById('address').value);
                    formData.append('delivery_type', delivery_type);
                    formData.append('delivery_time', document.getElementById('time_choice').value);
                    formData.append('comment', document.getElementById('comment').value);
                    formData.append('soup_id', Number(window.localStorage.getItem('soup-selected')));
                    formData.append('main_course_id', Number(window.localStorage.getItem('main-course-selected')));
                    formData.append('salad_id', Number(window.localStorage.getItem('salad-selected')));
                    formData.append('drink_id', Number(window.localStorage.getItem('drink-selected')));
                    formData.append('dessert_id', Number(window.localStorage.getItem('dessert-selected')));

                    /*for (let pair of formData.entries()) {
                        console.log(pair[0] + ', ' + pair[1] + ', ' + typeof pair[1]);
                    }*/
                      // Отправляем запрос на сервер
                    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=e3435f73-86d3-4d73-9303-8b4487a720e2', {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data['error']) {
                                showNotification(data['error']);
                            } else {
                                console.log(data);
                                window.localStorage.removeItem('soup-selected');
                                window.localStorage.removeItem('main-course-selected');
                                window.localStorage.removeItem('salad-selected');
                                window.localStorage.removeItem('drink-selected');
                                window.localStorage.removeItem('dessert-selected');
                                showNotification('Спасибо за заказ!');
                            }
                        })
                        .catch((error) => {
                            showNotification(error);
                        })
                }
            });

        });
});