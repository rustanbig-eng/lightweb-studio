(() => {
  const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
  const projectsGrid = document.getElementById("projectsGrid");
  const filterTabs = document.getElementById("filterTabs");
  const burgerBtn = document.getElementById("burgerBtn");
  const nav = document.getElementById("nav");
  const briefForm = document.getElementById("briefForm");

  let activeCategory = "all";

  function createProjectCard(item, index) {
    const card = document.createElement("article");
    card.className = "project-card";

    const bar = document.createElement("div");
    bar.className = "project-frame__bar";
    const numSpan = document.createElement("span");
    numSpan.className = "project-frame__index";
    numSpan.textContent = String(index + 1).padStart(2, "0");
    const catSpan = document.createElement("span");
    catSpan.textContent = item.categoryLabel;
    bar.append(numSpan, catSpan);

    const cover = document.createElement("div");
    cover.className = "project-cover";

    if (item.previewImg) {
      const img = document.createElement("img");
      img.src = item.previewImg;
      img.alt = item.title;
      img.loading = "lazy";
      cover.append(img);
    }

    const body = document.createElement("div");
    body.className = "project-body";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const subtitle = document.createElement("p");
    subtitle.className = "project-subtitle";
    subtitle.textContent = item.subtitle;

    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = item.description;

    const tags = document.createElement("div");
    tags.className = "project-tags";
    (item.tags || []).forEach((tagText) => {
      const span = document.createElement("span");
      span.textContent = tagText;
      tags.append(span);
    });

    const result = document.createElement("div");
    result.className = "project-result";
    result.textContent = item.result || "";

    const link = document.createElement("a");
    link.href = item.liveUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.className = "btn btn--ghost btn--full";
    link.textContent = "Открыть живой сайт ↗";

    body.append(title, subtitle, desc, tags, result, link);
    card.append(bar, cover, body);
    return card;
  }

  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.textContent = "";
    const filtered = projects.filter(
      (p) => activeCategory === "all" || p.category === activeCategory
    );
    filtered.forEach((item, index) => {
      projectsGrid.append(createProjectCard(item, index));
    });
  }

  if (filterTabs) {
    filterTabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".tab");
      if (!btn) return;
      filterTabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("is-active"));
      btn.classList.add("is-active");
      activeCategory = btn.dataset.filter || "all";
      renderProjects();
    });
  }

  if (burgerBtn && nav) {
    burgerBtn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burgerBtn.setAttribute("aria-expanded", String(open));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        burgerBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (briefForm) {
    briefForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const biz = document.getElementById("bizInput").value.trim();
      const link = document.getElementById("linkInput").value.trim();
      if (!biz) return;

      const text =
        `Здравствуйте! Интересует сайт под ключ от LightWeb Studio.\n` +
        `Бизнес: ${biz}` +
        (link ? `\nТекущая ссылка: ${link}` : "");

      window.open(`https://wa.me/79036171771?text=${encodeURIComponent(text)}`, "_blank", "noopener");
    });
  }

  // Reviews (confirmed list from reviews.js + local browser submissions)
  const REVIEWS_STORAGE_KEY = "lightweb_reviews_v1";
  const reviewsList = document.getElementById("reviewsList");
  const reviewForm = document.getElementById("reviewForm");
  const starPicker = document.getElementById("starPicker");
  const reviewFeedback = document.getElementById("reviewFeedback");
  let selectedRating = 5;

  function loadStoredReviews() {
    try {
      const raw = localStorage.getItem(REVIEWS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveStoredReviews(items) {
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota / privacy mode errors
    }
  }

  function updateStarsUI(rating) {
    if (!starPicker) return;
    starPicker.querySelectorAll(".star-btn").forEach((btn) => {
      const val = Number(btn.dataset.star);
      const on = val <= rating;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  }

  function renderReviews() {
    if (!reviewsList) return;
    reviewsList.replaceChildren();

    const baseReviews = Array.isArray(window.PORTFOLIO_REVIEWS) ? window.PORTFOLIO_REVIEWS : [];
    const localReviews = loadStoredReviews();
    const allReviews = [...localReviews, ...baseReviews];

    if (allReviews.length === 0) {
      const empty = document.createElement("div");
      empty.className = "reviews-empty";
      const title = document.createElement("strong");
      title.textContent = "Пока здесь нет опубликованных отзывов";
      const desc = document.createElement("span");
      desc.textContent = "Если мы уже работали с вами над сайтом, оставьте первый отзыв через форму справа.";
      empty.append(title, desc);
      reviewsList.appendChild(empty);
      return;
    }

    allReviews.forEach((item) => {
      const card = document.createElement("article");
      card.className = "review-card";

      const top = document.createElement("div");
      top.className = "review-card__top";

      const authorWrap = document.createElement("div");
      const author = document.createElement("div");
      author.className = "review-card__author";
      author.textContent = item.name || "Клиент";
      authorWrap.appendChild(author);

      if (item.company) {
        const company = document.createElement("div");
        company.className = "review-card__company";
        company.textContent = item.company;
        authorWrap.appendChild(company);
      }

      const rating = Math.max(1, Math.min(5, Number(item.rating) || 5));
      const stars = document.createElement("div");
      stars.className = "review-stars";
      stars.setAttribute("aria-label", `Оценка ${rating} из 5`);
      stars.textContent = "★".repeat(rating) + "☆".repeat(5 - rating);

      top.append(authorWrap, stars);

      const textEl = document.createElement("p");
      textEl.className = "review-text";
      textEl.textContent = item.text || "";

      const meta = document.createElement("div");
      meta.className = "review-meta";
      const dateSpan = document.createElement("span");
      dateSpan.textContent = item.date || "";
      meta.appendChild(dateSpan);
      if (item.pending) {
        const statusSpan = document.createElement("span");
        statusSpan.textContent = "Сохранено в вашем браузере";
        meta.appendChild(statusSpan);
      }

      card.append(top, textEl, meta);
      reviewsList.appendChild(card);
    });
  }

  if (starPicker) {
    starPicker.addEventListener("click", (e) => {
      const btn = e.target.closest(".star-btn");
      if (!btn) return;
      selectedRating = Number(btn.dataset.star) || 5;
      updateStarsUI(selectedRating);
    });
    updateStarsUI(selectedRating);
  }

  if (reviewForm) {
    reviewForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("reviewName");
      const companyInput = document.getElementById("reviewCompany");
      const textInput = document.getElementById("reviewText");

      const name = nameInput.value.trim();
      const company = companyInput.value.trim();
      const text = textInput.value.trim();

      if (!name || !text) {
        if (reviewFeedback) {
          reviewFeedback.className = "review-feedback review-feedback--err";
          reviewFeedback.textContent = "Пожалуйста, укажите имя и текст отзыва.";
        }
        return;
      }

      const newReview = {
        name,
        company,
        rating: selectedRating,
        text,
        date: new Date().toLocaleDateString("ru-RU"),
        pending: true,
      };

      const stored = loadStoredReviews();
      stored.unshift(newReview);
      saveStoredReviews(stored);
      renderReviews();
      reviewForm.reset();
      selectedRating = 5;
      updateStarsUI(selectedRating);

      if (reviewFeedback) {
        reviewFeedback.className = "review-feedback review-feedback--ok";
        reviewFeedback.replaceChildren();
        const msg = document.createElement("div");
        msg.textContent = "Спасибо! Отзыв добавлен на страницу. Чтобы он стал виден всем посетителям сайта, отправьте копию нам в WhatsApp:";
        const waText =
          `Отзыв о работе LightWeb Studio\n` +
          `Имя: ${name}\n` +
          (company ? `Компания: ${company}\n` : "") +
          `Оценка: ${newReview.rating}/5\n` +
          `Отзыв: ${text}`;
        const waLink = document.createElement("a");
        waLink.className = "btn btn--ghost btn--sm review-feedback__wa";
        waLink.href = `https://wa.me/79036171771?text=${encodeURIComponent(waText)}`;
        waLink.target = "_blank";
        waLink.rel = "noopener";
        waLink.textContent = "Отправить отзыв в WhatsApp";
        reviewFeedback.append(msg, waLink);
      }
    });
  }

  renderReviews();
  renderProjects();
})();
