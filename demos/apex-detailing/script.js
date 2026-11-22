(() => {
  const burgerBtn = document.getElementById("burgerBtn");
  const nav = document.getElementById("nav");
  const pillButtons = document.querySelectorAll(".pill");
  const serviceChecks = document.querySelectorAll('.checks-grid input[type="checkbox"]');
  const summaryBox = document.getElementById("summaryBox");
  const leadForm = document.getElementById("leadForm");
  const formFeedback = document.getElementById("formFeedback");

  let selectedCar = "Седан / хэтчбек";

  function updateSummary() {
    const selectedServices = Array.from(serviceChecks)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const servicesText =
      selectedServices.length > 0 ? selectedServices.join(", ") : "Консультация по подбору";

    summaryBox.textContent = "";
    const carLabel = document.createTextNode("Класс: ");
    const carStrong = document.createElement("strong");
    carStrong.textContent = selectedCar;
    const br = document.createElement("br");
    const servicesNode = document.createTextNode(`Услуги: ${servicesText}`);
    summaryBox.append(carLabel, carStrong, br, servicesNode);
  }

  if (burgerBtn && nav) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      burgerBtn.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  pillButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      pillButtons.forEach((item) => item.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedCar = btn.dataset.car || "Седан / хэтчбек";
      updateSummary();
    });
  });

  serviceChecks.forEach((cb) => {
    cb.addEventListener("change", updateSummary);
  });

  if (leadForm) {
    leadForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const nameInput = document.getElementById("clientName");
      const phoneInput = document.getElementById("clientPhone");
      const consentInput = document.getElementById("consentCheck");

      const name = nameInput.value.trim();
      const phone = phoneInput.value.trim();

      formFeedback.className = "form-feedback";

      if (!name || phone.length < 7) {
        formFeedback.textContent = "Укажите имя и корректный номер телефона.";
        formFeedback.classList.add("form-feedback--err");
        return;
      }

      if (!consentInput.checked) {
        formFeedback.textContent = "Подтвердите согласие на обработку данных.";
        formFeedback.classList.add("form-feedback--err");
        return;
      }

      formFeedback.textContent = `Спасибо, ${name}! Демо-заявка сформирована (${selectedCar}). На боевом сайте она уйдёт сразу в Telegram или CRM.`;
      formFeedback.classList.add("form-feedback--ok");
      leadForm.reset();
      updateSummary();
    });
  }

  updateSummary();
})();
