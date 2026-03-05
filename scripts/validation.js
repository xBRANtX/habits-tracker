// validation.js
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    if (!form) {
        console.error('Форма с id="feedbackForm" не найдена!');
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Сбрасываем предыдущие ошибки
        document.querySelectorAll('.border-red-500').forEach(el => {
            el.classList.remove('border-red-500');
        });
        document.querySelectorAll('.text-red-500.text-sm').forEach(el => el.remove());

        let isValid = true;

        // 1. Проверка имени
        const nameInput = document.querySelector('input[placeholder="Ваше имя"]');
        const nameValue = nameInput.value.trim();
        
        if (nameValue === '') {
            showError(nameInput, 'Введите ваше имя');
            isValid = false;
        } else {
            const words = nameValue.split(' ').filter(word => word.length > 0);
            if (words.length < 2) {
                showError(nameInput, 'Введите имя и фамилию');
                isValid = false;
            }
        }

        // 2. Проверка email
        const emailInput = document.querySelector('input[type="email"]');
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailValue === '') {
            showError(emailInput, 'Введите email');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            showError(emailInput, 'Введите корректный email (пример: name@domain.com)');
            isValid = false;
        }

        // 3. Проверка темы
        const select = document.querySelector('select');
        if (!select.value || select.selectedIndex === 0) {
            showError(select, 'Выберите тему сообщения');
            isValid = false;
        }

        // 4. Проверка сообщения
        const messageInput = document.querySelector('textarea');
        const messageValue = messageInput.value.trim();

        if (messageValue === '') {
            showError(messageInput, 'Введите сообщение');
            isValid = false;
        } else if (messageValue.length < 10) {
            showError(messageInput, 'Сообщение должно быть не менее 10 символов');
            isValid = false;
        }

        // 5. Проверка согласия
        const consentCheckbox = document.getElementById('consent');
        if (!consentCheckbox.checked) {
            const parent = consentCheckbox.closest('.flex');
            const error = document.createElement('p');
            error.classList.add('text-red-500', 'text-sm', 'mt-1', 'ml-6');
            error.textContent = 'Необходимо согласие на обработку данных';
            parent.appendChild(error);
            isValid = false;
        }

        // Если всё корректно - отправляем событие
        if (isValid) {
            const formData = {
                fullname: nameValue,
                email: emailValue,
                topic: select.value,
                message: messageValue,
                consent: consentCheckbox.checked,
                timestamp: new Date().toLocaleString()
            };

            const event = new CustomEvent('formValid', { detail: formData });
            document.dispatchEvent(event);
            
            alert('Форма успешно отправлена! Данные в консоли.');
        }
    });

    // Функция показа ошибки
    function showError(input, message) {
        input.classList.add('border-red-500');
        
        // Создаем элемент с ошибкой
        const error = document.createElement('p');
        error.classList.add('text-red-500', 'text-sm', 'mt-1');
        error.textContent = message;
        
        // Вставляем после родительского div
        input.parentNode.appendChild(error);
    }

    // Сброс ошибок при вводе
    document.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('border-red-500');
            
            // Удаляем сообщение об ошибке
            const parent = this.parentNode;
            const errors = parent.querySelectorAll('.text-red-500.text-sm');
            errors.forEach(el => el.remove());
        });
    });

    // Отдельно для checkbox
    const consentCheckbox = document.getElementById('consent');
    if (consentCheckbox) {
        consentCheckbox.addEventListener('change', function() {
            const parent = this.closest('.flex');
            const errors = parent.querySelectorAll('.text-red-500.text-sm');
            errors.forEach(el => el.remove());
        });
    }
});