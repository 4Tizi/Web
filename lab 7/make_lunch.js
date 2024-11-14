document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
});

// Асинхронная функция для загрузки данных о блюдах
async function loadDishes() {
    try {
        const response = await fetch("http://lab7-api.std-900.ist.mospolytech.ru/api/dishes");
        // Отправляем запрос к API для получения списка блюд
        if (!response.ok) {
            throw new Error(`Ошибка загрузки: ${response.status}`);
        }
        // Если запрос завершился с ошибкой, выбрасываем её
        const data = await response.json();
        // Преобразуем ответ в JSON формат

        const sortedFood = data.sort((a, b) => {
            return a['name'].localeCompare(b['name'], 'ru');
        });
        // Сортируем блюда по алфавиту (по имени) с учетом русской локали
        
        const SectionSoups = document.querySelectorAll('.grid')[0];
        const SectionMain = document.querySelectorAll('.grid')[1];
        const SectionSalad = document.querySelectorAll('.grid')[2];
        const SectionJuice = document.querySelectorAll('.grid')[3];
        const SectionDessert = document.querySelectorAll('.grid')[4];
        // Получаем ссылки на HTML-секции для разных категорий блюд
        // Функция для создания карточки блюда
        function TicketsMake(dish) {
            const ticket = document.createElement('div');
            ticket.classList.add('flex');// Добавляем класс для оформления
            ticket.dataset.kind = dish['kind'];// Устанавливаем тип блюда
            // Добавляем картинку блюда
            const img = document.createElement('img');
            img.src = dish['image'];
            img.alt = dish['name'];
            // Добавляем цену блюда
            const price = document.createElement('p');
            price.classList.add('price');
            price.textContent = dish['price'] + '₽';
            // Добавляем название блюда
            const food = document.createElement('p');
            food.classList.add('food');
            food.textContent = dish['name'];
            // Добавляем вес блюда
            const weight = document.createElement('p');
            weight.classList.add('count');
            weight.textContent = dish['count'];
            // Добавляем кнопку "Добавить"
            const button = document.createElement('button');
            button.textContent = "Добавить";
             // Добавляем элементы в карточку блюда
            ticket.appendChild(img);
            ticket.appendChild(price);
            ticket.appendChild(food);
            ticket.appendChild(weight);
            ticket.appendChild(button);
            // Обработчик нажатия на кнопку для добавления блюда в заказ
            button.addEventListener('click', () => {
                GetOrder(dish);
            });

            return ticket;
        }
        // Функция для добавления карточек блюд в соответствующую секцию
        function GoTickets(ElemSection, category) {
            sortedFood.forEach(dish => {
                if (dish['category'] === category) {
                    const ticket = TicketsMake(dish);
                    ElemSection.appendChild(ticket);
                }
            });
        }
        // Разделяем блюда по категориям и добавляем их на страницу
        GoTickets(SectionSoups, 'soup');
        GoTickets(SectionMain, 'main-course');
        GoTickets(SectionSalad, 'salad');
        GoTickets(SectionJuice, 'drink');
        GoTickets(SectionDessert, 'dessert');
        // Инициализация переменных для управления выбором блюд и общей ценой
        let FoodPrice = 0;
        const FoodPriceElements = document.getElementById('food_price');
        const PriceCount = document.getElementById('price');
        // Объект для хранения выбранных блюд
        let ChosenFood = {
            'soup': null,
            'main-course': null,
            'salad': null,
            'drink': null,
            'dessert': null,
        };
        // Получаем элементы, которые отображают выбранные блюда
        const SoupLabel = document.getElementById('soup-select');
        const ChosenSoup = document.getElementById('soup-selected');
        const MainLabel = document.getElementById('main-select');
        const ChosenSalad = document.getElementById('salad-selected');
        const SaladLabel = document.getElementById('salad-select');
        const ChosenMain = document.getElementById('main-selected');
        const JuiceLabel = document.getElementById('juice-select');
        const ChosenJuice = document.getElementById('juice-selected');
        const DessertLabel = document.getElementById('dessert-select');
        const ChosenDessert = document.getElementById('dessert-selected');

        const EmptyMessage = document.getElementById('empty_space');
        // Скрываем элементы выбора и цены по умолчанию
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
        PriceCount.style.display = 'none';


        // Функция для обработки выбора блюда
        function GetOrder(dish) {
            let GetUpdate = false;
             // Проверяем категорию блюда и обновляем выбранный элемент
            if (dish['category'] === 'soup') {
                UpdateGridElem('soup', dish, ChosenSoup, SoupLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'main-course') {
                UpdateGridElem('main-course', dish, ChosenMain, MainLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'salad') {
                UpdateGridElem('salad', dish, ChosenSalad, SaladLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'drink') {
                UpdateGridElem('drink', dish, ChosenJuice, JuiceLabel);
                GetUpdate = true;
            } else if (dish['category'] === 'dessert') {
                UpdateGridElem('dessert', dish, ChosenDessert, DessertLabel);
                GetUpdate = true;
            }

            if (GetUpdate === true) {
                EmptyMessage.style.display = 'none';
            }

            FoodPriceElements.textContent = 'Стоимость заказа';
            FoodPriceElements.style.display = 'block';
            PriceCount.textContent = `${FoodPrice}₽`;
            PriceCount.style.display = 'block';

            EmptyElements();

        }
         // Функция для обновления информации о выбранном блюде
        function UpdateGridElem(category, dish, CurrentElem, LabelElem) {
            if (ChosenFood[category] !== null) {
                FoodPrice -= ChosenFood[category]['price'];
            }

            ChosenFood[category] = dish;
            CurrentElem.textContent = `${dish['name']} ${dish['price']}₽`;
            CurrentElem.style.display = 'block';
            LabelElem.style.display = 'block';

            FoodPrice += dish['price'];
            // Обработчик для сброса выбора
            document.querySelector('form').addEventListener('reset', function () {
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
                PriceCount.style.display = 'none';
                FoodPriceElements.style.display = 'none';

                EmptyMessage.style.display = '';

                ChosenFood = {
                    'суп': null,
                    'главное блюдо': null,
                    'салат': null,
                    'напиток': null,
                    'десерт': null
                };

                FoodPrice = 0;
            })

        }
         // Устанавливает сообщение "Блюдо не выбрано" для пустых категорий
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
                ChosenJuice.textContent = 'drink не выбран';
                JuiceLabel.style.display = 'block';
                ChosenJuice.style.display = 'block';
            }
            if (ChosenFood['dessert'] === null) {
                ChosenDessert.textContent = 'dessert не выбран';
                DessertLabel.style.display = 'block';
                ChosenDessert.style.display = 'block';
            }
        }

        function setupFilters(category) {
            // Получаем все фильтры для указанной категории
            const filters = document.querySelectorAll(`.${category}-filter`);
             // Назначаем обработчик клика для каждого фильтра
            filters.forEach(filter => {
                filter.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Предотвращаем стандартное действие ссылки

                    const section = document.querySelector(`#${category} .grid`);
                     // Секция для конкретной категории блюд
                    const dishes = section.querySelectorAll('.flex');
                    // Все блюда в секции
                    const isActive = filter.classList.contains('active');
                    // Проверяем, активен ли фильтр
                    const filterKind = filter.dataset.kind;
                    // Получаем тип фильтра из data-kind атрибута

                    // Убираем активный класс у всех фильтров этой категории
                    filters.forEach(f => f.classList.remove('active'));
                     // Если фильтр не был активен, активируем его и скрываем блюда, не соответствующие фильтру
                    if (!isActive) {
                        filter.classList.add('active');
                        dishes.forEach(dish => {
                            dish.classList.toggle('hidden', dish.dataset.kind !== filterKind);
                            // Скрываем блюда, не соответствующие типу фильтра
                        });
                    } else {
                        dishes.forEach(dish => dish.classList.remove('hidden'));
                         // Если фильтр был активен, показываем все блюда
                    }
                });
            });
        }
        // Список категорий для фильтров
        const categories = ['soup', 'main', 'juice', 'salad', 'dessert'];
        categories.forEach(category => setupFilters(category));
        // Устанавливаем фильтры для каждой категории

        // Получаем элементы для уведомлений и кнопок
        const submitButton = document.getElementById('submit'); //кнопка отправки формы
        const notification = document.getElementById('notification'); //уведомление
        const notificationText = document.getElementById('notification-text');//текст уведомления
        const notificationButton = document.getElementById('notification-button');//кнопка уведомления
        // Варианты допустимых комбинаций комбо-блюд
        const comboOptions = [
            ['soup', 'main-course', 'salad', 'drink'],
            ['soup', 'main-course', 'drink'],
            ['soup', 'salad', 'drink'],
            ['main-course', 'salad', 'drink'],
            ['main-course', 'drink']
        ];

        function checkOrder() {
            // Находим выбранные категории из ChosenFood
            const chosenCategories = Object.keys(ChosenFood).filter(category => ChosenFood[category]);//фильтрует категории, чтобы найти выбранные
             // Проверяем, выбрано ли что-нибудь; если нет, показываем уведомление
            if (chosenCategories.length === 0) {
                showNotification("Ничего не выбрано. Выберите блюда для заказа");
                return false;
            } //если нет выбранных категорий
            // Проверяем, подходит ли выбранная комбинация под один из допустимых вариантов
            let validCombo = comboOptions.some(option =>
                option.every(item => chosenCategories.includes(item))
            ); //проверка комбинаций комбо

            if (!validCombo) {
                // Показ уведомлений при недопустимой комбинации
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
        // Функция для отображения уведомления с сообщением
        function showNotification(message) {
            notificationText.textContent = message;
            notification.classList.remove('hidden');
        } //убираем скрытие
        // Закрытие уведомления при нажатии на кнопку
        notificationButton.addEventListener('click', () => {
            notification.classList.add('hidden');
        });
        // Проверка заказа при отправке формы
        submitButton.addEventListener('click', (event) => {
            if (!checkOrder()) {
                event.preventDefault(); // Не отправляем форму, если заказ некорректен
            }
        });
    } catch (error) {
        console.error("Ошибка при загрузке блюд:", error);
    }
}




