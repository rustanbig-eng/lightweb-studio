/**
 * Скрипт лендинга салона красоты «Аурелия» (г. Москва)
 * Чистый Vanilla JS без сборщиков и сторонних фреймворков.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Инициализация иконок Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // =========================================================
  // 2. МОБИЛЬНОЕ МЕНЮ (Бургер-меню)
  // =========================================================
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconOpen = document.getElementById('menu-icon-open');
  const menuIconClose = document.getElementById('menu-icon-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(forceClose = false) {
    if (!mobileMenu || !mobileMenuBtn) return;

    const isCurrentlyOpen = !mobileMenu.classList.contains('hidden');
    const shouldOpen = forceClose ? false : !isCurrentlyOpen;

    mobileMenu.classList.toggle('hidden', !shouldOpen);
    mobileMenuBtn.setAttribute('aria-expanded', String(shouldOpen));

    if (menuIconOpen && menuIconClose) {
      menuIconOpen.classList.toggle('hidden', shouldOpen);
      menuIconClose.classList.toggle('hidden', !shouldOpen);
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }

  // Закрываем мобильное меню при клике на любой пункт навигации
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // =========================================================
  // 3. ИНТЕРАКТИВНЫЕ ВКЛАДКИ ПРАЙС-ЛИСТА (Tabs)
  // =========================================================
  const tabButtons = document.querySelectorAll('[data-tab-btn]');
  const tabPanels = document.querySelectorAll('[data-tab-panel]');

  const ACTIVE_TAB_CLASSES = ['bg-bronze', 'text-white', 'shadow-sm'];
  const INACTIVE_TAB_CLASSES = ['bg-white', 'text-graphite/80', 'border', 'border-graphite/10', 'hover:border-bronze/50'];

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab-btn');

      // Обновляем состояние кнопок вкладок
      tabButtons.forEach((btn) => {
        const isSelected = btn === button;
        btn.setAttribute('aria-selected', String(isSelected));

        if (isSelected) {
          btn.classList.remove(...INACTIVE_TAB_CLASSES);
          btn.classList.add(...ACTIVE_TAB_CLASSES);
        } else {
          btn.classList.remove(...ACTIVE_TAB_CLASSES);
          btn.classList.add(...INACTIVE_TAB_CLASSES);
        }
      });

      // Показываем выбранную панель с плавной анимацией
      tabPanels.forEach((panel) => {
        const isMatch = panel.getAttribute('data-tab-panel') === targetTab;
        if (isMatch) {
          panel.classList.remove('hidden');
          // Перезапуск CSS-анимации при каждом переключении
          panel.classList.remove('tab-panel-active');
          void panel.offsetWidth;
          panel.classList.add('tab-panel-active');
        } else {
          panel.classList.add('hidden');
          panel.classList.remove('tab-panel-active');
        }
      });
    });
  });

  // =========================================================
  // 4. МОДАЛЬНОЕ ОКНО ОНЛАЙН-ЗАПИСИ
  // =========================================================
  const modal = document.getElementById('booking-modal');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const resetModalBtn = document.getElementById('reset-modal-btn');

  const bookingFormView = document.getElementById('booking-form-view');
  const bookingSuccessView = document.getElementById('booking-success-view');
  const bookingForm = document.getElementById('booking-form');

  const clientNameInput = document.getElementById('client-name');
  const clientPhoneInput = document.getElementById('client-phone');
  const clientServiceSelect = document.getElementById('client-service');
  const clientDatetimeInput = document.getElementById('client-datetime');

  const successClientName = document.getElementById('success-client-name');
  const successServiceName = document.getElementById('success-service-name');
  const whatsappDuplicateLink = document.getElementById('whatsapp-duplicate-link');

  // Номер салона для WhatsApp (без + и пробелов)
  const SALON_WHATSAPP_NUMBER = '79990000000';

  /**
   * Открывает модальное окно и при необходимости подставляет выбранную услугу
   * @param {string} [preselectedService]
   */
  function openBookingModal(preselectedService = '') {
    if (!modal) return;

    // Сбрасываем вид окна на форму
    bookingFormView.classList.remove('hidden');
    bookingSuccessView.classList.add('hidden');

    // Если нажали «Записаться» рядом с конкретной услугой — выбираем её в списке
    if (preselectedService && clientServiceSelect) {
      const matchingOption = Array.from(clientServiceSelect.options).find(
        (opt) => opt.value === preselectedService
      );
      if (matchingOption) {
        clientServiceSelect.value = preselectedService;
      }
    }

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.classList.add('overflow-hidden');

    // Ставим фокус на поле имени для удобства
    if (clientNameInput) {
      setTimeout(() => clientNameInput.focus(), 50);
    }
  }

  /** Закрывает модальное окно */
  function closeBookingModal() {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.classList.remove('overflow-hidden');
  }

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service') || '';
      openBookingModal(serviceName);
    });
  });

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeBookingModal);
  }

  if (resetModalBtn) {
    resetModalBtn.addEventListener('click', closeBookingModal);
  }

  // Закрытие по клику на затемнённый фон вокруг окна
  if (modal) {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeBookingModal();
      }
    });
  }

  // Закрытие по клавише Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
      closeBookingModal();
    }
  });

  // =========================================================
  // 5. ПРОСТАЯ МАСКА ВВОДА ТЕЛЕФОНА (+7)
  // =========================================================
  function formatPhoneValue(rawValue) {
    // Оставляем только цифры
    let digits = rawValue.replace(/\D/g, '');

    // Если пользователь начал с 8 или 7 — нормализуем к формату 7XXXXXXXXXX
    if (digits.startsWith('8')) {
      digits = '7' + digits.slice(1);
    } else if (digits.length > 0 && !digits.startsWith('7')) {
      digits = '7' + digits;
    }

    // Ограничиваем 11 цифрами (7 + 10 цифр номера)
    digits = digits.slice(0, 11);

    if (digits.length === 0) return '';
    if (digits.length === 1) return '+7';

    const part1 = digits.slice(1, 4);
    const part2 = digits.slice(4, 7);
    const part3 = digits.slice(7, 9);
    const part4 = digits.slice(9, 11);

    let formatted = '+7 (' + part1;
    if (digits.length >= 4) formatted += ') ';
    if (part2) formatted += part2;
    if (part3) formatted += '-' + part3;
    if (part4) formatted += '-' + part4;

    return formatted;
  }

  if (clientPhoneInput) {
    clientPhoneInput.addEventListener('focus', () => {
      if (!clientPhoneInput.value) {
        clientPhoneInput.value = '+7 (';
      }
    });

    clientPhoneInput.addEventListener('input', (event) => {
      event.target.value = formatPhoneValue(event.target.value);
    });

    clientPhoneInput.addEventListener('blur', () => {
      // Если пользователь не ввёл номер дальше префикса, очищаем поле
      if (clientPhoneInput.value === '+7 (' || clientPhoneInput.value === '+7') {
        clientPhoneInput.value = '';
      }
    });
  }

  // =========================================================
  // 6. ОТПРАВКА ФОРМЫ И ФОРМИРОВАНИЕ ССЫЛКИ WHATSAPP
  // =========================================================
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const name = clientNameInput ? clientNameInput.value.trim() : '';
      const phone = clientPhoneInput ? clientPhoneInput.value.trim() : '';
      const service = clientServiceSelect ? clientServiceSelect.value : '';
      const datetime = clientDatetimeInput ? clientDatetimeInput.value.trim() : '';

      // Заполняем данные в окне успешной отправки
      if (successClientName) successClientName.textContent = name || 'гость';
      if (successServiceName) successServiceName.textContent = service || 'выбранная услуга';

      // Формируем текст сообщения для кнопки «Продублировать запись в WhatsApp»
      let message = `Здравствуйте! Меня зовут ${name}. Хочу записаться в салон красоты «Аурелия» на услугу: ${service}.`;
      if (datetime) {
        message += ` Желаемое время: ${datetime}.`;
      }
      if (phone) {
        message += ` Мой телефон: ${phone}.`;
      }

      if (whatsappDuplicateLink) {
        whatsappDuplicateLink.href = `https://wa.me/${SALON_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      }

      // Переключаем экран модального окна на сообщение об успехе
      bookingFormView.classList.add('hidden');
      bookingSuccessView.classList.remove('hidden');

      // Сбрасываем поля формы для следующей заявки
      bookingForm.reset();
    });
  }
});
