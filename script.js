// --- ГЛАВНЫЙ СТАРТ: ЖДЕМ ПОЛНОЙ ЗАГРУЗКИ СТРАНИЦЫ ---
document.addEventListener('DOMContentLoaded', function() {
    // --- ПРЕСЕТЫ ГОТОВЫХ СБОРОК ---
const presets = {
    budget: {
        cpu: "1", gpu: "1", mobo: "1", ram: "1", cooler: "1", case: "3", psu: "2", ssd: "2"
    },
    optimal: {
        cpu: "4", gpu: "5", mobo: "4", ram: "4", cooler: "4", case: "5", psu: "4", ssd: "4"
    },
    premium: {
        cpu: "6", gpu: "7", mobo: "6", ram: "4", cooler: "5", case: "6", psu: "6", ssd: "8"
    }
    
};
    
    // --- 1. ЗАХВАТ ЭЛЕМЕНТОВ (Все переменные здесь!) ---
    const psuSelect = document.getElementById('psu-select');
    const cpuSelect = document.getElementById('cpu-select');
    const gpuSelect = document.getElementById('gpu-select');
    const moboSelect = document.getElementById('mobo-select');
    const ramSelect = document.getElementById('ram-select');
    const coolerSelect = document.getElementById('cooler-select');
    const caseSelect = document.getElementById('case-select');
    const ssdSelect = document.getElementById('ssd-select');

    const totalPriceSpan = document.getElementById('total-price');
    const orderBtn = document.getElementById('order-btn'); // <-- КНОПКА ЗДЕСЬ
    const hintText = document.getElementById('hint-text');

    // Модальное окно
    const modal = document.getElementById('order-modal');
    const closeBtn = document.querySelector('.close-btn');
    const orderForm = document.getElementById('order-form');
    const clientName = document.getElementById('client-name');
    const clientPhone = document.getElementById('client-phone');
    const modalTotalPrice = document.getElementById('modal-total-price'); 

    // Если критических элементов нет - останавливаемся
    if (!orderBtn || !hintText || !modal) {
        console.error("Не найдены элементы интерфейса!");
        return; 
    }

    // --- 2. ФУНКЦИЯ РАСЧЕТА ЦЕНЫ И КНОПКИ ---
    function calculateTotal() {
        const prices = [
            parseInt(cpuSelect.options[cpuSelect.selectedIndex].getAttribute('data-price')) || 0,
            parseInt(moboSelect.options[moboSelect.selectedIndex].getAttribute('data-price')) || 0,
            parseInt(ramSelect.options[ramSelect.selectedIndex].getAttribute('data-price')) || 0,
            parseInt(coolerSelect.options[coolerSelect.selectedIndex].getAttribute('data-price')) || 0,
            parseInt(caseSelect.options[caseSelect.selectedIndex].getAttribute('data-price')) || 0,
            parseInt(gpuSelect.options[gpuSelect.selectedIndex].getAttribute('data-price')) || 0,
           (psuSelect ? parseInt(psuSelect.options[psuSelect.selectedIndex].getAttribute('data-price')) : 0) || 0,
            parseInt(ssdSelect.options[ssdSelect.selectedIndex].getAttribute('data-price')) || 0
        ];
        
        const total = prices.reduce((sum, price) => sum + price, 0);
        if (totalPriceSpan) totalPriceSpan.textContent = total.toLocaleString('ru-RU') + ' ₽';

        // Проверка всех полей
        const fields = [cpuSelect.value, moboSelect.value, ramSelect.value, coolerSelect.value, caseSelect.value, gpuSelect.value, psuSelect.value, ssdSelect.value];
        let allGood = true;
        
        fields.forEach(select => {
            if (select.value === "0" || select.value === "") {
                allGood = false;
            }
        });

        if (allGood) {
            orderBtn.disabled = false;
            hintText.style.display = 'none'; 
        } else {
            orderBtn.disabled = true;
            hintText.style.display = 'block';
        }
    }
    // --- 3. ПОДПИСКА НА СОБЫТИЯ ДЛЯ КАЛЬКУЛЯТОРА ---
    [cpuSelect, gpuSelect, moboSelect, ramSelect, coolerSelect, caseSelect].forEach(el => {
        el.addEventListener('change', calculateTotal);
    });
    calculateTotal();


    // --- 4. ЛОГИКА МОДАЛЬНОГО ОКНА (Теперь все переменные видны) ---
    if (orderBtn) {
        orderBtn.addEventListener('click', () => {
            if (modalTotalPrice && totalPriceSpan) {
                modalTotalPrice.textContent = totalPriceSpan.textContent;
            }
            if (clientName) clientName.value = "";
            if (clientPhone) clientPhone.value = "";
            modal.style.display = 'block'; // Показываем окно
        });
    }

    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    if (orderForm) {
        orderForm.addEventListener('submit', (e) => {
            e.preventDefault(); 
            alert(`Заявка принята!\nИмя: ${clientName.value}\nТелефон: ${clientPhone.value}`);
            modal.style.display = 'none';
            orderForm.reset();
        });
    }
// --- ЛОГИКА КНОПОК "ВЫБРАТЬ" В КАТАЛОГЕ ---
const componentsSection = document.getElementById('components');

if (componentsSection) {
    // Вешаем ОДИН слушатель на всю секцию вместо десятков на каждую кнопку
    componentsSection.addEventListener('click', function(e) {
        const button = e.target.closest('.btn-add-to-build'); // Ищем ближайшую кнопку

        if (button) {
            const targetId = button.getAttribute('data-target');
            const targetValue = button.getAttribute('data-value');
            
            const selectElement = document.getElementById(targetId);
            
            if (selectElement) {
                // 1. Меняем значение в выпадающем списке вверху
                selectElement.value = targetValue;
                
                // 2. Принудительно запускаем пересчет цен
                calculateTotal(); 

                // 3. Визуальное оформление (делаем активную кнопку зеленой)
                // Сначала убираем класс active у всех кнопок этого типа
                buttonsGroup.forEach(btn => btn.classList.remove('active'));
                // Потом добавляем текущей
                button.classList.add('active');

                // Плавно прокручиваем пользователя к конфигуратору
                document.getElementById('build').scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
}
// --- ЛОГИКА КНОПОК ГОТОВЫХ СБОРОК ---
document.querySelectorAll('.load-preset-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const presetId = this.getAttribute('data-id');
        const config = presets[presetId];

        if (!config) return;

        // Автоматически выбираем значения во всех списках
        document.getElementById('cpu-select').value = config.cpu;
        document.getElementById('gpu-select').value = config.gpu;
        document.getElementById('mobo-select').value = config.mobo;
        document.getElementById('ram-select').value = config.ram;
        document.getElementById('cooler-select').value = config.cooler;
        document.getElementById('case-select').value = config.case;
        document.getElementById('psu-select').value = config.psu;
        document.getElementById('ssd-select').value = config.ssd;
        
        // Запускаем пересчет цены
        calculateTotal();

        // Плавно прокручиваем пользователя к результату
        document.getElementById('build').scrollIntoView({ behavior: 'smooth' });
    });
});
    // Важно: собираем все кнопки в группу для управления состоянием (active)
    const buttonsGroup = document.querySelectorAll('#components .btn-add-to-build');
});

// ИНИЦИАЛИЗАЦИЯ СЛАЙДЕРА ОТЗЫВОВ (находится за пределами DOMContentLoaded)
const slider = document.querySelector('.cards-slider');
if (!slider) return; // Выходим, если слайдера нет

let currentIndex = 0;
const cards = [...slider.children];
const slideWidth = cards[0]?.offsetWidth ?? 0;

function moveSlider(direction) {
    if ((direction === 'next' && currentIndex >= cards.length - 3) ||
       (direction === 'prev' && currentIndex <= 0)) return;

    const step = direction === 'next' ? -slideWidth : slideWidth;
    currentIndex += direction === 'next' ? 1 : -1;

    slider.style.transform = `translateX(${currentIndex * step}px)`;
}

document.querySelector('.prev')?.addEventListener('click', () => moveSlider('prev'));
document.querySelector('.next')?.addEventListener('click', () => moveSlider('next'));

// ОБРАТНАЯ СВЯЗЬ (тоже вынесено из основного блока)
document.getElementById('feedback-btn')?.addEventListener('click', () => {
    const feedbackModal = document.getElementById('feedback-modal');
    if (!feedbackModal) return console.error("Не найдено модальное окно!");
    
    feedbackModal.style.display = 'block';
});

// Демо-отправка сообщения через alert
document.getElementById('feedback-form')?.addEventListener('submit', e => {
    e.preventDefault(); 
    alert(`
Спасибо за ваш фидбэк!
Имя: ${document.getElementById('name').value}
Сообщение:
${document.getElementById('message').value}`);

    document.getElementById('feedback-modal').style.display = 'none';
});