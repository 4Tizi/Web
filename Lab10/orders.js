document.addEventListener('DOMContentLoaded', function () {
    // При загрузке страницы вызывается функция fetchOrders для загрузки заказов
    fetchOrders();
});

let dishDictionary = {}; // Словарь для сопоставления ID блюда и его названия
let dishPrice = {};// Словарь для сопоставления ID блюда и его цены
function getDishArray() {
    // Получаем список блюд с сервера
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())// Преобразуем ответ в JSON
        .then(data => {
            data.forEach(dish => {
                dishDictionary[String(dish.id)] = dish.name;// Сохраняем название блюда по его ID
                dishPrice[String(dish.id)] = dish.price;// Сохраняем цену блюда по его ID
            })
        })
        .catch(error => {
            console.error('Ошибка при загрузке списка блюд:', error);// Обрабатываем ошибки
        });
}

getDishArray();// Загружаем данные о блюдах



function fetchOrders() {
     // Получаем заказы с сервера
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=e3435f73-86d3-4d73-9303-8b4487a720e2', {
        method: 'GET',
    })
        .then(response => response.json())  // Преобразуем ответ в формат JSON
        .then(data => {
            // Очистим таблицу перед добавлением новых данных
            const tbody = document.querySelector('table tbody');// Получаем тело таблицы
            tbody.innerHTML = '';// Очищаем таблицу перед добавлением новых данных

            // Счётчик для ID заказов
            let displayedId = 1;

            // Функция для подсчёта стоимости заказана на основе ID блюд
            function calculateOrderPrice(dishIds) {
                return dishIds
                    .filter(id => id) // Исключаем `null` или `undefined`
                    .reduce((total, id) => total + (dishPrice[String(id)] || 0), 0);// Суммируем стоимость
            }

            function getDishNameById(id) {
                 // Получаем название блюда по его ID
                return dishDictionary[String(id)];

            }
            // Перебираем полученные данные и создаем строки таблицы
            data.forEach(order => {
                const row = document.createElement('tr'); // Создаём строку таблицы


                // Добавляем данные в соответствующие ячейки
                row.dataset.id = order.id;
                row.dataset.fullName = order.full_name;
                row.dataset.date = order.created_at;
                row.dataset.email = order.email;
                row.dataset.phone = order.phone;
                row.dataset.address = order.delivery_address;;

                console.log(order);


                // Получаем названия блюд по их ID
                const dishIds = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id];// ID заказанных блюд
                const order_items = dishIds.map(id => id ? getDishNameById(id) : '');// Получаем названия блюд
                const orderPrice = calculateOrderPrice(dishIds);// Подсчитываем общую стоимость заказа

                
                const orderItemsString = order_items.filter(item => item !== '').join(', '); // Формируем строку заказанных блюд

                row.dataset.cost = `${orderPrice}₽`;// Стоимость заказа
                row.dataset.order = orderItemsString;// Названия заказанных блюд
                // Определяем текст доставки в зависимости от типа доставки
                let deliveryText = order.delivery_type === 'now'
                    ? 'Как можно скорее \n (с 07:00 до 23:00)' // Для доставки 'now' выводим "Как можно скорее"
                    : order.delivery_time;// Иначе отображаем время доставки
                // Определяем тип доставки для отображения в интерфейсе
                let deliveryType = order.delivery_type === 'now' ? 'Как можно скорее' : 'Ко времени';
                // Сохраняем тип доставки в dataset строки таблицы
                row.dataset.type = deliveryType;
                // Сохраняем текст времени доставки в dataset строки таблицы
                row.dataset.time = deliveryText;
                // Форматируем дату и время создания заказа
                let datetime = `${(order.created_at).slice(0, 10)} ${(order.created_at).slice(11, -3)}`;
                // Если комментарий заказа отсутствует, то его значение будет пустым
                let commentOrder = order.comment === null ? '' : order.comment;
                // Сохраняем комментарий в dataset строки таблицы
                row.dataset.comment = commentOrder;
                // Заполняем ячейки строки таблицы данными из заказа
                row.innerHTML = `
                <td>${displayedId++}</td>
                <td>${datetime}</td>
                <td>${orderItemsString}</td>
                <td>${orderPrice}₽</td>
                <td>${deliveryText}</td>
                <td>
                    <span class="action-btn" onclick="showDetails(this)" title="Подробнее"><img src="eye.svg" alt="Eye"></span>
                    <span class="action-btn" onclick="editOrder(this)" title="Редактировать"><img src="pencil.svg" alt="Pencil"></span>
                    <span class="action-btn" onclick="deleteOrder(this)" title="Удалить"><img src="trash3.svg" alt="Trash"></span>
                </td>
            `;

                // Добавляем строку в таблицу
                tbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Ошибка при загрузке заказов:', error);
            alert('Не удалось загрузить заказы.');
        });

}



// Открытие модального окна для просмотра/редактирования
function openModal(type) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(type + '-modal').style.display = 'block';
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => modal.style.display = 'none');
}

// Функция для просмотра деталей заказа
function showDetails(button) {
    const row = button.closest('tr');// Получаем строку, в которой находится кнопка
    // Заполняем поля в модальном окне данными из строки таблицы
    document.getElementById('details-date').textContent = row.cells[1].textContent;
    document.getElementById('details-full-name').textContent = row.dataset.fullName;
    document.getElementById('details-address').textContent = row.dataset.address;
    document.getElementById('details-type').textContent = row.dataset.type;
    document.getElementById('details-time').textContent = row.dataset.time;
    document.getElementById('details-phone').textContent = row.dataset.phone;
    document.getElementById('details-email').textContent = row.dataset.email;
    document.getElementById('details-comment').textContent = row.dataset.comment || '';// Если комментарий пуст, показываем пустое значение
    document.getElementById('details-order').textContent = row.dataset.order;
    document.getElementById('details-cost').textContent = row.dataset.cost;
    // Открываем модальное окно для просмотра
    openModal('view');
}

// Функция для редактирования заказа
function editOrder(button) {
    const row = button.closest('tr');// Получаем строку заказа
    openModal('edit');// Открываем модальное окно для редактирования

    document.getElementById('edit-order-id').value = row.dataset.id;  // Заполняем ID заказа для редактирования
    document.getElementById('edit-date').value = row.cells[1].textContent;
    document.getElementById('edit-full-name').value = row.dataset.fullName;
    document.getElementById('edit-address').value = row.dataset.address;
    document.getElementById('edit-type-asap').checked = row.dataset.type === "Как можно скорее";
    document.getElementById('edit-type-time').checked = row.dataset.type === "Ко времени";
    document.getElementById('edit-time').value = row.dataset.time;
    document.getElementById('edit-phone').value = row.dataset.phone;
    document.getElementById('edit-email').value = row.dataset.email;
    document.getElementById('edit-comment').value = row.dataset.comment;
    document.getElementById('edit-order').value = row.dataset.order;
    document.getElementById('edit-cost').value = row.dataset.cost;

    
}


// Сохранение изменений в заказе
function saveOrder() {
    const orderId = document.getElementById('edit-order-id').value; // Получаем ID заказа
    if (!orderId) {
        console.error('ID заказа не найден.');
        return;
    }
    // Получаем остальные данные из формы редактирования
    const fullName = document.getElementById('edit-full-name').value;
    const address = document.getElementById('edit-address').value;
    let deliveryType = document.querySelector('input[name="delivery-type"]:checked').value;
    // Преобразуем текстовое значение типа доставки в соответствующее значение
    if (deliveryType === 'Как можно скорее') {
        deliveryType = 'now';
    } else {
        deliveryType = 'by_time';
    }

    const deliveryTime = document.getElementById('edit-time').value;
    const phone = document.getElementById('edit-phone').value;
    const email = document.getElementById('edit-email').value;
    const comment = document.getElementById('edit-comment').value;
    const order = document.getElementById('edit-order').value;
    const cost = document.getElementById('edit-cost').value;

    // Создаем объект FormData
    const formData = new FormData();

    // Добавляем данные в FormData
    formData.append('full_name', fullName);
    formData.append('delivery_address', address);
    formData.append('delivery_type', deliveryType);
    formData.append('delivery_time', deliveryTime);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('comment', comment);
    formData.append('order', order);
    formData.append('cost', parseFloat(cost));  // Стоимость должна быть числом

    // Отправляем данные на сервер для обновления заказа
    fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderId}?api_key=e3435f73-86d3-4d73-9303-8b4487a720e2`, {
        method: 'PUT',
        body: formData, // Передаем FormData в теле запроса
    })
        .then(response => {
            if (!response.ok) throw new Error('Не удалось обновить заказ');
            return response.json();
        })
        .then((data) => {
            console.log(data);
            if (data['error']) {
                alert(data['error']);
            } else {
                alert('Изменения сохранены!');
                closeModal(); // Закрыть модальное окно
                location.reload();// Перезагрузить страницу после успешного обновления
            }
        })
        .catch((error) => {
            console.error('Ошибка при обновлении заказа:', error);
            alert('Произошла ошибка при сохранении изменений.');
        })

}

// Удаление заказа
function deleteOrder(button) {
    const row = button.closest('tr');// Получаем строку заказа
    openModal('delete'); // Открыть окно "Удаление"

    const orderId = row.dataset.id; // Получаем ID заказа
    if (!orderId) {
        console.error('ID заказа не найден.');
        return;
    }

    // Сохраняем ID заказа для дальнейшего использования
    orderIdToDelete = orderId;
}
// Подтверждение удаления
function confirmDelete() {
    if (!orderIdToDelete) {
        console.error('ID заказа не найден.');
        return;
    }

    // Отправляем запрос на удаление
    fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${orderIdToDelete}?api_key=e3435f73-86d3-4d73-9303-8b4487a720e2`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then((data) => {
            if (data['error']) {
                alert(data['error']);
            } else {
                alert('Заказ удалён!');
                closeModal();
                location.reload(); // Перезагружаем страницу после успешного удаления
            }
        })
        .catch((error) => {
            alert('Ошибка при удалении заказа: ' + error);
        });
}