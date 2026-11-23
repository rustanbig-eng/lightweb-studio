(() => {
  // 1-config customization block for rapid cloning under any kitchen/furniture client
  const CONFIG = {
    brandName: "FORMA",
    brandCity: "Ателье кухонь · Москва и МО",
    phoneDisplay: "+7 (999) 000-00-00",
    address: "г. Москва (выезд на замер бесплатно)",
  };

  document.querySelectorAll("[data-cfg]").forEach((el) => {
    const key = el.dataset.cfg;
    if (CONFIG[key]) el.textContent = CONFIG[key];
  });

  const PROJECTS = [
    {
      id: "k-oak",
      category: "kitchen",
      catLabel: "Кухня с островом",
      dimensions: "4 200 × 2 650 мм",
      title: "Кашемир и дымчатый дуб",
      short: "Высокие пеналы до потолка, остров из травертина и скрытая подсветка рабочей зоны.",
      img: "./images/hero-kitchen.jpg",
      facades: "Fenix NTM Кашемир + шпон дуба",
      hardware: "Blum Legrabox + Blumotion",
      countertop: "Кварцевый агломерат под травертин",
      duration: "29 дней с монтажом",
    },
    {
      id: "k-graphite",
      category: "kitchen",
      catLabel: "Угловая кухня",
      dimensions: "3 800 × 2 100 мм",
      title: "Графитовый мат и тёплый орех",
      short: "Суперматовые фасады без ручек с интегрированным профилем Gola и открытой нишей из шпона.",
      img: "./images/project-graphite.jpg",
      facades: "Fenix NTM 0724 + шпон американского ореха",
      hardware: "Blum Antaro + Tip-On",
      countertop: "Тёмный кварц + стеновая панель",
      duration: "26 дней с монтажом",
    },
    {
      id: "w-glass",
      category: "wardrobe",
      catLabel: "Гардеробная система",
      dimensions: "3 400 × 2 850 мм",
      title: "Витрины из дымчатого стекла",
      short: "Встроенная гардеробная от пола до потолка с датчиками подсветки и выдвижными лотками.",
      img: "./images/project-wardrobe.jpg",
      facades: "Алюминиевый профиль + стекло Stopsol",
      hardware: "Hettich InnoTech Atira",
      countertop: "Внутренние ящики — шпон дуба",
      duration: "22 дня с монтажом",
    },
    {
      id: "k-light",
      category: "kitchen",
      catLabel: "П-образная кухня",
      dimensions: "4 600 × 1 900 мм",
      title: "Светлый алебастр и полуостров",
      short: "Обеденная зона на полуострове, интегрированная мойка под столешницу и встроенная техника.",
      img: "./images/project-light.jpg",
      facades: "Матовая эмаль + светлый дуб",
      hardware: "Blum Tandembox + Aventos HF",
      countertop: "Белый кварц с тонкой жилой",
      duration: "32 дня с монтажом",
    },
  ];

  const MATERIALS = {
    facades: [
      {
        title: "Fenix NTM / AGT (Италия, Турция)",
        desc: "Глубокий супермат с самовосстановлением микроцарапин: не оставляет следов от пальцев и не выцветает.",
        badge: "Хит кухонь",
      },
      {
        title: "Натуральный шпон дуба и ореха",
        desc: "Подбираем рисунок древесины цельным листом (рубашкой) с переходом волокон с фасада на фасад.",
        badge: "Матовое масло",
      },
      {
        title: "ЛДСП EGGER с кромкой PUR",
        desc: "Немецкая плита высокой плотности с влагостойким полиуретановым швом — не разбухает у мойки и посудомойки.",
        badge: "Стандарт 18 мм",
      },
    ],
    countertops: [
      {
        title: "Кварцевый агломерат (20 / 40 мм)",
        desc: "Не впитывает кофе и вино, не боится ножа и позволяет ставить мойку подстольного монтажа.",
        badge: "Стык без шва",
      },
      {
        title: "HPL Compact-плита (12 мм)",
        desc: "Тонкая монолитная столешница в современном европейском стиле: абсолютно водостойкая по всей толщине.",
        badge: "Ультратонкая",
      },
      {
        title: "Пластик EGGER / ARPA с еврозапилом",
        desc: "Надёжный практичный вариант для угловых кухонь со скрытым соединением без металлических планок.",
        badge: "Практичный",
      },
    ],
    hardware: [
      {
        title: "Направляющие и петли Blum (Австрия)",
        desc: "Плавное бесшумное закрывание при нагрузке до 40–70 кг на ящик, ресурсом свыше 100 000 циклов.",
        badge: "Гарантия 5 лет",
      },
      {
        title: "Системы Hettich (Германия)",
        desc: "Чёткая геометрия фасадов и удобные выдвижные колонны для хранения круп, посуды и бытовой химии.",
        badge: "Точная регулировка",
      },
      {
        title: "Профиль Gola + встроенный свет 3000K",
        desc: "Фрезерованный профиль без накладных ручек и сенсорная LED-лента в алюминиевом профиле.",
        badge: "Без проводов на виду",
      },
    ],
  };

  // Projects rendering & filtering
  const projectsGrid = document.getElementById("projectsGrid");
  const projectTabs = document.getElementById("projectTabs");
  let activeCat = "all";

  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.replaceChildren();
    const list = PROJECTS.filter((p) => activeCat === "all" || p.category === activeCat);
    list.forEach((p, idx) => {
      const card = document.createElement("article");
      card.className = "project-card";
      card.tabIndex = 0;

      const wrap = document.createElement("div");
      wrap.className = "project-card__img-wrap";
      const img = document.createElement("img");
      img.src = p.img;
      img.alt = p.title;
      img.loading = idx > 1 ? "lazy" : "eager";
      wrap.appendChild(img);

      const body = document.createElement("div");
      body.className = "project-card__body";

      const meta = document.createElement("div");
      meta.className = "project-card__meta";
      const cat = document.createElement("span");
      cat.textContent = p.catLabel;
      const dim = document.createElement("span");
      dim.textContent = p.dimensions;
      meta.append(cat, dim);

      const h3 = document.createElement("h3");
      h3.textContent = p.title;

      const short = document.createElement("p");
      short.textContent = p.short;

      const foot = document.createElement("div");
      foot.className = "project-card__foot";
      const dur = document.createElement("span");
      dur.textContent = p.duration;
      const action = document.createElement("span");
      action.textContent = "Спецификация →";
      foot.append(dur, action);

      body.append(meta, h3, short, foot);
      card.append(wrap, body);

      const openHandler = () => openModal(p);
      card.addEventListener("click", openHandler);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openHandler();
        }
      });
      projectsGrid.appendChild(card);
    });
  }

  if (projectTabs) {
    projectTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      projectTabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeCat = btn.dataset.cat || "all";
      renderProjects();
    });
  }

  // Materials tabs
  const matTabs = document.getElementById("matTabs");
  const matPanel = document.getElementById("matPanel");

  function renderMaterials(key) {
    if (!matPanel) return;
    matPanel.replaceChildren();
    const rows = MATERIALS[key] || MATERIALS.facades;
    rows.forEach((row) => {
      const item = document.createElement("div");
      item.className = "mat-item";

      const left = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = row.title;
      const span = document.createElement("span");
      span.textContent = row.desc;
      left.append(strong, span);

      const badge = document.createElement("span");
      badge.className = "mat-badge";
      badge.textContent = row.badge;

      item.append(left, badge);
      matPanel.appendChild(item);
    });
  }

  if (matTabs) {
    matTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".mat-tab");
      if (!btn) return;
      matTabs.querySelectorAll(".mat-tab").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      renderMaterials(btn.dataset.mat);
    });
    renderMaterials("facades");
  }

  // Modal
  const modal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalCta = document.getElementById("modalCta");

  function closeModal() {
    if (modal) modal.hidden = true;
  }

  function openModal(p) {
    if (!modal) return;
    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalImg").alt = p.title;
    document.getElementById("modalCat").textContent = `${p.catLabel} · ${p.dimensions}`;
    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalDesc").textContent = p.short;

    const specs = document.getElementById("modalSpecs");
    specs.replaceChildren();
    [
      ["Фасады", p.facades],
      ["Фурнитура", p.hardware],
      ["Столешница / наполнение", p.countertop],
      ["Срок производства", p.duration],
    ].forEach(([label, val]) => {
      const row = document.createElement("div");
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      dd.textContent = val;
      row.append(dt, dd);
      specs.appendChild(row);
    });

    modal.hidden = false;
  }

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target.dataset.close === "true") closeModal();
    });
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalCta) modalCta.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // Interactive Quiz Calculator
  const quizType = document.getElementById("quizType");
  const quizLength = document.getElementById("quizLength");
  const quizLengthVal = document.getElementById("quizLengthVal");
  const quizTier = document.getElementById("quizTier");
  const quizPrice = document.getElementById("quizPrice");
  const quizTerm = document.getElementById("quizTerm");
  const quizForm = document.getElementById("quizForm");
  const quizFeedback = document.getElementById("quizFeedback");

  let selectedType = "Прямая кухня";
  let selectedBase = 52000;
  let selectedTier = "EGGER + Hettich (Практичный)";
  let selectedMult = 1;

  function updateQuiz() {
    const len = Number(quizLength?.value || 3.6);
    if (quizLengthVal) quizLengthVal.textContent = `${len.toFixed(1)} м`;
    const min = Math.round((selectedBase * len * selectedMult) / 1000) * 1000;
    const max = Math.round((min * 1.16) / 1000) * 1000;
    if (quizPrice) {
      quizPrice.textContent = `${min.toLocaleString("ru-RU")} – ${max.toLocaleString("ru-RU")} ₽`;
    }
    if (quizTerm) {
      quizTerm.textContent = selectedMult > 1.3 ? "Срок: 30–35 дней" : "Срок: 25–30 дней";
    }
  }

  if (quizType) {
    quizType.addEventListener("click", (e) => {
      const btn = e.target.closest(".q-opt");
      if (!btn) return;
      quizType.querySelectorAll(".q-opt").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedType = btn.dataset.val;
      selectedBase = Number(btn.dataset.base) || 52000;
      updateQuiz();
    });
  }

  if (quizTier) {
    quizTier.addEventListener("click", (e) => {
      const btn = e.target.closest(".q-opt");
      if (!btn) return;
      quizTier.querySelectorAll(".q-opt").forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      selectedTier = btn.dataset.val;
      selectedMult = Number(btn.dataset.mult) || 1;
      updateQuiz();
    });
  }

  if (quizLength) quizLength.addEventListener("input", updateQuiz);

  if (quizForm) {
    quizForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const phone = document.getElementById("quizPhone").value.trim();
      if (!phone) return;
      if (quizFeedback) {
        quizFeedback.textContent =
          `Заявка зафиксирована (демо): ${selectedType}, ${quizLength.value} м, ${selectedTier}. На рабочем сайте отправляется напрямую к вам в Telegram/WhatsApp.`;
      }
      quizForm.reset();
      updateQuiz();
    });
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  const contactFeedback = document.getElementById("contactFeedback");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("cName").value.trim();
      const phone = document.getElementById("cPhone").value.trim();
      if (!name || !phone) return;
      if (contactFeedback) {
        contactFeedback.textContent =
          `Спасибо, ${name}! (В рабочем проекте заявка сразу передаётся в ваш мессенджер.)`;
      }
      contactForm.reset();
    });
  }

  // Burger
  const burgerBtn = document.getElementById("burgerBtn");
  const nav = document.getElementById("nav");
  if (burgerBtn && nav) {
    burgerBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burgerBtn.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  updateQuiz();
  renderProjects();
})();
