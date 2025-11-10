// main.js — نسخهٔ اصلاح‌شده و آماده
// پیش‌نیاز: EmblaCarousel باید از CDN یا باندل قبل از این فایل لود شده باشد.
// مثال در HTML:
// <script src="https://cdn.jsdelivr.net/npm/embla-carousel/embla-carousel.umd.js"></script>
// <script src="/js/main.js" defer></script>

let emblaApiMain = null;
let emblaApiThumb = null;
let emblaApiReviews = null;

/* ===========================
   داده‌های نمونه و وضعیت‌ها
   =========================== */
const productColors = [
  { id: 1, name: "رنگ شماره ۱", available: true, price: 145000 },
  { id: 2, name: "رنگ شماره ۲", available: true, price: 145000 },
  { id: 3, name: "رنگ شماره ۳", available: true, price: 145000 },
  { id: 4, name: "رنگ شماره ۴", available: false, price: 145000 },
  { id: 5, name: "رنگ شماره ۵", available: false, price: 145000 },
  { id: 6, name: "رنگ شماره ۶", available: true, price: 145000 },
];

let selectedColor = null;
let quantity = 1;

// موبایل
let mobileSelectedColor = null;
let mobileQuantity = 1;

/* ===========================
   توابع کمکی Embla (thumbs)
   =========================== */
const addThumbBtnsClickHandlers = (emblaApiMainLocal, emblaApiThumbLocal) => {
  if (!emblaApiThumbLocal) return () => { };
  const slidesThumbs = emblaApiThumbLocal.slideNodes();
  const handlers = slidesThumbs.map((_, index) => () =>
    emblaApiMainLocal.scrollTo(index)
  );

  slidesThumbs.forEach((slideNode, index) => {
    slideNode.addEventListener("click", handlers[index], false);
  });

  return () => {
    slidesThumbs.forEach((slideNode, index) => {
      slideNode.removeEventListener("click", handlers[index], false);
    });
  };
};

const addToggleThumbBtnsActive = (emblaApiMainLocal, emblaApiThumbLocal) => {
  if (!emblaApiThumbLocal) return () => { };
  const slidesThumbs = emblaApiThumbLocal.slideNodes();

  const toggleThumbBtnsState = () => {
    // sync thumb scroll with main
    const selected = emblaApiMainLocal.selectedScrollSnap();
    const previous = emblaApiMainLocal.previousScrollSnap();
    if (typeof previous === "number" && slidesThumbs[previous]) {
      slidesThumbs[previous].classList.remove("embla-thumbs__slide--selected");
    }
    if (typeof selected === "number" && slidesThumbs[selected]) {
      slidesThumbs[selected].classList.add("embla-thumbs__slide--selected");
    }
    // scroll thumb carousel to selected
    emblaApiThumbLocal.scrollTo(selected);
  };

  emblaApiMainLocal.on("select", toggleThumbBtnsState);
  emblaApiThumbLocal.on("init", toggleThumbBtnsState);

  return () => {
    try {
      const selected = emblaApiMainLocal.selectedScrollSnap();
      if (typeof selected === "number" && slidesThumbs[selected]) {
        slidesThumbs[selected].classList.remove("embla-thumbs__slide--selected");
      }
      emblaApiMainLocal.off("select", toggleThumbBtnsState);
      emblaApiThumbLocal.off("init", toggleThumbBtnsState);
    } catch (e) {
      // ignored
    }
  };
};

/* ===========================
   دات‌ها (dots) برای اسلایدر اصلی
   =========================== */
const createDots = (emblaApiMainLocal) => {
  const dotsContainer = document.getElementById("slider-dots");
  if (!dotsContainer || !emblaApiMainLocal) return;

  const slideCount = emblaApiMainLocal.slideNodes().length;
  dotsContainer.innerHTML = "";

  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("button");
    dot.className = "size-1 rounded-full transition-all duration-300";
    dot.style.backgroundColor = "#C5B2B3";
    dot.setAttribute("aria-label", `اسلاید ${i + 1}`);

    dot.addEventListener("click", () => {
      emblaApiMainLocal.scrollTo(i);
    });

    dotsContainer.appendChild(dot);
  }
};

const updateDots = (emblaApiMainLocal) => {
  const dotsContainer = document.getElementById("slider-dots");
  if (!dotsContainer || !emblaApiMainLocal) return;

  const selectedIndex = emblaApiMainLocal.selectedScrollSnap();
  const dots = dotsContainer.querySelectorAll("button");

  dots.forEach((dot, index) => {
    if (index === selectedIndex) {
      dot.style.backgroundColor = "#A44A50";
      dot.className = "w-[26px] h-1 rounded-full transition-all duration-300";
    } else {
      dot.style.backgroundColor = "#C5B2B3";
      dot.className =
        "size-1 rounded-full cursor-pointer transition-all duration-300";
    }
  });
};

/* ===========================
   کنترل Prev/Next و وضعیت آنها
   =========================== */
const updateButtonStates = (emblaApiMainLocal, prevButton, nextButton) => {
  if (!prevButton || !nextButton || !emblaApiMainLocal) return;

  if (!emblaApiMainLocal.canScrollPrev()) {
    prevButton.style.opacity = "0.5";
    prevButton.style.cursor = "not-allowed";
    prevButton.disabled = true;
  } else {
    prevButton.style.opacity = "1";
    prevButton.style.cursor = "pointer";
    prevButton.disabled = false;
  }

  if (!emblaApiMainLocal.canScrollNext()) {
    nextButton.style.opacity = "0.5";
    nextButton.style.cursor = "not-allowed";
    nextButton.disabled = true;
  } else {
    nextButton.style.opacity = "1";
    nextButton.style.cursor = "pointer";
    nextButton.disabled = false;
  }
};

/* ===========================
   Product Color (desktop)
   =========================== */
function renderColorOptions() {
  const container = document.getElementById("color-options");
  if (!container) return;

  container.innerHTML = "";

  productColors.forEach((color) => {
    const colorItem = document.createElement("div");
    colorItem.className = `relative border rounded-[10px] py-[10px] px-2 cursor-pointer transition-all ${color.available
      ? "border-[#E8E8E8]"
      : "border-[#E8E8E8] opacity-50 cursor-not-allowed"
      } ${selectedColor?.id === color.id ? "border-red-500 bg-red-50" : ""}`;

    colorItem.innerHTML = `
      <div class="flex items-center justify-between text-xs text-[#2D2D2D]">
        <span>${color.name}</span>
        ${!color.available
        ? '<span class="text-xs text-red-600">اتمام موجودی</span>'
        : ""
      }
        ${selectedColor?.id === color.id
        ? '<div class="bg-[#EAB9B9] w-5 h-5 flex items-center justify-center rounded-md"> <i class="fa-solid fa-check text-red-600"></i> </div>'
        : ""
      }
      </div>
    `;

    if (color.available) {
      colorItem.addEventListener("click", () => selectColor(color));
    }

    container.appendChild(colorItem);
  });

  updateAddToCartButton();
  updatePrice();
}

function selectColor(color) {
  if (!color.available) return;
  selectedColor = color;
  renderColorOptions();
  updateAddToCartButton();
  updatePrice();
}

function updateQuantity(change) {
  const newQuantity = quantity + change;
  if (newQuantity < 1) return;
  if (newQuantity > 99) return;
  quantity = newQuantity;
  const qEl = document.getElementById("quantity-display");
  if (qEl) qEl.textContent = quantity.toLocaleString("fa-IR");
  updatePrice();
}

function updatePrice() {
  const priceDisplay = document.getElementById("price-display");
  if (!priceDisplay || !selectedColor) return;
  const totalPrice = selectedColor.price * quantity;
  priceDisplay.textContent = totalPrice.toLocaleString("fa-IR");
}

function updateAddToCartButton() {
  const btn = document.getElementById("add-to-cart-btn");
  if (!btn) return;

  if (selectedColor) {
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  }
}

function addToCart() {

  if (!selectedColor) {
    alert("لطفاً یک رنگ انتخاب کنید");
    return;
  }
  console.log("افزودن به سبد خرید:", {
    color: selectedColor,
    quantity,
    totalPrice: selectedColor.price * quantity,
  });
  alert(`${quantity} عدد ${selectedColor.name} به سبد خرید اضافه شد`);
}

/* ===========================
   Mobile color selection
   =========================== */
function renderMobileColorOptions() {
  const container = document.getElementById("mobile-color-options");
  if (!container) return;

  container.innerHTML = "";

  productColors.forEach((color) => {
    const colorItem = document.createElement("div");
    colorItem.className = `relative border rounded-[10px] py-[10px] px-[14px] cursor-pointer transition-all ${color.available
      ? "border-[#E8E8E8]"
      : "border-[#E8E8E8] opacity-50 cursor-not-allowed"
      } ${mobileSelectedColor?.id === color.id ? "border-red-500 border-2 bg-red-50" : ""}`;

    colorItem.innerHTML = `
      <div class="flex items-center justify-between text-xs text-[#2D2D2D]">
        <span>${color.name}</span>
        ${!color.available
        ? '<span class="text-xs text-red-600">اتمام موجودی</span>'
        : ""
      }
        ${mobileSelectedColor?.id === color.id
        ? '<i class="fa-solid fa-check text-red-600"></i>'
        : ""
      }
      </div>
    `;

    if (color.available) {
      colorItem.addEventListener("click", () => selectMobileColor(color));
    }

    container.appendChild(colorItem);
  });

  updateMobileAddToCartButton();
}

function selectMobileColor(color) {
  if (!color.available) return;
  mobileSelectedColor = color;
  renderMobileColorOptions();
  updateMobileAddToCartButton();
}

function updateMobileQuantity(change) {
  const newQuantity = mobileQuantity + change;
  if (newQuantity < 1) return;
  if (newQuantity > 99) return;
  mobileQuantity = newQuantity;
  const el = document.getElementById("mobile-quantity-display");
  if (el) el.textContent = mobileQuantity.toLocaleString("fa-IR");
}

function updateMobileAddToCartButton() {
  const btn = document.getElementById("mobile-add-to-cart-btn");
  if (!btn) return;

  if (mobileSelectedColor) {
    btn.disabled = false;
    btn.classList.remove("opacity-50", "cursor-not-allowed");
  } else {
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
  }
}

function addToCartMobile() {
  const colorItems = document.querySelectorAll(".color-item.available");
  if (!colorItems) {
    alert("لطفاً یک رنگ انتخاب کنید");
    return;
  }

  alert(`به سبد خرید اضافه شد`);
  closeMobileModal();


  // if (!mobileSelectedColor) {
  //   alert("لطفاً یک رنگ انتخاب کنید");
  //   return;
  // }

  // console.log("افزودن به سبد خرید (موبایل):", {
  //   color: mobileSelectedColor,
  //   quantity: mobileQuantity,
  //   totalPrice: mobileSelectedColor.price * mobileQuantity,
  // });

  // alert(`${mobileQuantity} عدد ${mobileSelectedColor.name} به سبد خرید اضافه شد`);
  // closeMobileModal();
}

/* ===========================
   Mobile modal open/close
   =========================== */
function openMobileModal() {
  console.log("first")
  const modal = document.getElementById("mobile-product-modal");
  const modalContent = document.getElementById("mobile-modal-content");
  const backdrop = document.getElementById("modal-backdrop-product-selection");

  if (modal && modalContent && backdrop) {
    modal.classList.remove("hidden");
    // document.body.style.overflow = "hidden";

    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");

      modalContent.classList.remove("translate-y-full");
      modalContent.classList.add("translate-y-0");
    }, 10);
  }
}

function closeMobileModal() {
  const modal = document.getElementById("mobile-product-modal");
  const modalContent = document.getElementById("mobile-modal-content");
  const backdrop = document.getElementById("modal-backdrop-product-selection");

  if (modal && modalContent && backdrop) {
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    modalContent.classList.remove("translate-y-0");
    modalContent.classList.add("translate-y-full");

    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 300);
  }
}

function openCommentModal() {
  const modal = document.getElementById("comment-modal");
  const modalContent = document.getElementById("comment-modal-content");
  const backdrop = document.getElementById("comment-modal-backdrop");
  const stickyAccordion = document.querySelector('.sticky-accordion');


  if (modal && modalContent && backdrop) {
    stickyAccordion.classList.add("!z-40");
    modal.classList.remove("hidden");
    // document.body.style.overflow = "hidden";

    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");

      modalContent.classList.remove("translate-y-full");
      modalContent.classList.add("translate-y-0");
    }, 10);
  }
}

function closeCommentModal() {
  const modal = document.getElementById("comment-modal");
  const modalContent = document.getElementById("comment-modal-content");
  const backdrop = document.getElementById("comment-modal-backdrop");
  const stickyAccordion = document.querySelector('.sticky-accordion');


  if (modal && modalContent && backdrop) {
    stickyAccordion.classList.remove("!z-40");
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    modalContent.classList.remove("translate-y-0");
    modalContent.classList.add("translate-y-full");

    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 200);
  }
}

function openshareModal() {

  const modal = document.getElementById("mobile-share-product-modal");
  const modalContent = document.getElementById("mobile-share-modal-content");
  const backdrop = document.getElementById("mobile-share-modal-backdrop");
  const stickyAccordion = document.querySelector('.sticky-accordion');


  if (modal && modalContent && backdrop) {
    stickyAccordion?.classList.add("!z-40");

    modal.classList.remove("hidden");

    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");

      modalContent.classList.remove("translate-y-full");
      modalContent.classList.add("translate-y-0");
    }, 10);
  }
}

function closeshareModal() {
  const modal = document.getElementById("mobile-share-product-modal");
  const modalContent = document.getElementById("mobile-share-modal-content");
  const backdrop = document.getElementById("mobile-share-modal-backdrop");
  const stickyAccordion = document.querySelector('.sticky-accordion');


  if (modal && modalContent && backdrop) {

    stickyAccordion?.classList.remove("!z-40");

    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    modalContent.classList.remove("translate-y-0");
    modalContent.classList.add("translate-y-full");

    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 200);
  }
}

function copyProductLink() {
  const copyLinkBtn = document.getElementById("copy-product-link");
  const toast = document.getElementById("toast");
  const productLink = copyLinkBtn.dataset.url;
  navigator.clipboard.writeText(productLink)
  navigator.clipboard.writeText(productLink)
    .then(() => {
      // نمایش توست
      toast.classList.remove("opacity-0", "pointer-events-none");
      toast.classList.add("opacity-100");
      setTimeout(() => {
        toast.classList.add("opacity-0", "pointer-events-none");
        toast.classList.remove("opacity-100");
      }, 3000);
    })
    .catch(err => {
      console.error("خطا در کپی لینک: ", err);
    });
}

/* ===========================
   Accordion rendering
   =========================== */
const accordionItems = [
  { id: 1, title: "مراقبت از پوست", icon: "./public/icons/icon-lipstick.png", href: "#skincare" },
  { id: 2, title: "آرایشی و بهداشتی", icon: "./public/icons/icon-perfume.png", href: "#cosmetics" },
  { id: 3, title: "لباس و پوشاک", icon: "./public/icons/icon-clothing.png", href: "#clothing" },
  { id: 4, title: "لوازم خانگی", icon: "./public/icons/icon-cup.png", href: "#home" },
  { id: 5, title: "لوازم الکتریکی", icon: "./public/icons/icon-lightning-.png", href: "#electric" },
  { id: 6, title: "لوازم برقی", icon: "./public/icons/icon-hair-dryer.png", href: "#appliances" },
  { id: 7, title: "خورشیدی", icon: "./public/icons/icon-solar.png", href: "#solar" },
  { id: 8, title: "دارو و مکمل", icon: "./public/icons/icon-drugs.png", href: "#pharmacy" },
];

function renderAccordionItems() {
  const accordionList = document.getElementById("accordion-list");
  if (!accordionList) return;
  accordionList.innerHTML = "";

  accordionItems.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <a href="${item.href}" class="flex items-center cursor-pointer  justify-between transition-all text-primary-400">
          <img src="${item.icon}" alt="${item.title}" class="size-[24px] object-contain pl-[5px]">
          <span class="text-sm pl-[10px]">${item.title}</span>
          <i class="fa-solid fa-angle-down arrow-down-icon"></i>
      </a>
    `;
    accordionList.appendChild(listItem);
  });
}


/* ===========================
   Desktop category modal
   =========================== */
function openDesktopModal(categoryData) {
  const modal = document.getElementById("desktop-category-modal");
  const content = document.getElementById("desktop-modal-content");
  const backdrop = document.getElementById("desktop-modal-backdrop");
  const body = document.getElementById("desktop-modal-body");

  if (modal && content && backdrop && body) {
    console.log("yessssssssss")
    body.innerHTML = `
      <div class="grid grid-cols-6 gap-6 ">
        ${categoryData.subcategories
        .map(
          (subcategory) => `
          <ul class="space-y-3">
            <li class="bg-primary-600 text-white px-4 py-3 rounded-lg text-center font-bold text-base">
              ${subcategory.name}
            </li>
            <li class="space-y-2">
              ${subcategory.items
              .map(
                (item) => `
                <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-right text-sm transition-colors">
                  ${item}
                </button>
              `
              )
              .join("")}
            </li>
          </ul>
        `
        )
        .join("")}
      </div>
    `;

    modal.classList.remove("hidden");
    // document.body.style.overflow = "hidden";

    setTimeout(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");

      content.classList.remove("opacity-0", "scale-95");
      content.classList.add("opacity-100", "scale-100");
    }, 10);
  }
}

function closeDesktopModal() {
  const modal = document.getElementById("desktop-category-modal");
  const content = document.getElementById("desktop-modal-content");
  const backdrop = document.getElementById("desktop-modal-backdrop");

  if (modal && content && backdrop) {
    backdrop.classList.remove("opacity-100");
    backdrop.classList.add("opacity-0");

    content.classList.remove("opacity-100", "scale-100");
    content.classList.add("opacity-0", "scale-95");

    setTimeout(() => {
      modal.classList.add("hidden");
      document.body.style.overflow = "auto";
    }, 300);
  }
}

const categoryData = {
  skincare: {
    title: "مراقبت از پوست",
    subcategories: [
      { name: "پاک‌کننده", items: ["پن صابون", "ژل شستشو", "میکسلار واتر", "تونر", "اسکراب", "همه محصولات پاک‌کننده"] },
      { name: "مرطوب‌کننده", items: ["کرم روز", "کرم شب", "سرم", "لوسیون بدن", "کرم دور چشم", "همه محصولات مرطوب‌کننده"] },
      { name: "محافظت", items: ["کرم ضد آفتاب", "کرم ضد لک", "کرم ضد چروک", "کرم دور چشم", "همه محصولات محافظت"] },
      { name: "ماسک", items: ["ماسک صورت", "ماسک دور چشم", "ماسک لب", "ماسک بدن", "همه محصولات ماسک"] },
      { name: "ابزار", items: ["براش صورت", "اسفنج", "دستگاه پاکسازی", "ابزار ماساژ", "همه ابزار مراقبت"] },
      { name: "تخصصی", items: ["محصولات ضد پیری", "محصولات روشن‌کننده", "محصولات آکنه", "محصولات حساس", "همه محصولات تخصصی"] },
    ],
  },
  cosmetics: {
    title: "آرایشی و بهداشتی",
    subcategories: [
      { name: "چشم", items: ["سایه", "ریمل", "ریمل رنگی", "خط چشم", "خط چشم رنگی", "مداد چشم", "مداد هاشور ابرو", "مژه", "فرمژه", "صابون ابرو", "همه محصولات چشم"] },
      { name: "لب", items: ["رژ لب جامد", "رژ لب مایع", "پک رژ لب", "بالم لب", "برق لب", "تینت لب", "لیپ گلاس", "خط لب", "حجم دهنده لب", "همه محصولات لب"] },
      { name: "صورت", items: ["کرم پودر", "کوشن", "بی بی کرم", "کانتور و کانسیلر", "هایلایتر", "پنکک", "پرایمر", "رژگونه", "فیکساتور", "لیفت صورت", "همه محصولات صورت"] },
      { name: "ناخن", items: ["لاک", "ناخن مصنوعی", "ابزار ناخن", "ست مانیکور", "همه محصولات ناخن"] },
      { name: "ابزار آرایشی", items: ["براش پد", "کیف آرایش", "تراش", "همه ابزار آرایشی"] },
      { name: "دیگر ملزومات", items: ["پک آرایشی", "رنگ مو", "مو کلیپسی", "همه محصولات آرایشی"] },
    ],
  },
};

/* ===========================
   Reviews carousel
   =========================== */
const reviews = [
  {
    name: "میترا احمدی", date: "۱۲ تیر ۱۴۰۴", rating: 5, comment: "خرید ازاین وبسایت بشدت رضایت بخشه ... عالیه 👌",
    avatar: ""
  },
  {
    name: "علیرضا رضایی", date: "۱۵ مرداد ۱۴۰۴", rating: 4, comment: "بسیار خوب، فقط کمی زمان تحویل طول کشید.",
    avatar: "/public/images/motor.png"
  },
  {
    name: "میترا احمدی", date: "۱۲ تیر ۱۴۰۴", rating: 5, comment: "خرید ازاین وبسایت بشدت رضایت بخشه ... عالیه 👌",
    avatar: ""
  },
  {
    name: "علیرضا رضایی", date: "۱۵ مرداد ۱۴۰۴", rating: 4, comment: "بسیار خوب، فقط کمی زمان تحویل طول کشید.",
    avatar: "/public/images/motor.png"
  },
  {
    name: "میترا احمدی", date: "۱۲ تیر ۱۴۰۴", rating: 5, comment: "خرید ازاین وبسایت بشدت رضایت بخشه ... عالیه 👌",
    avatar: ""
  },
  {
    name: "علیرضا رضایی", date: "۱۵ مرداد ۱۴۰۴", rating: 4, comment: "بسیار خوب، فقط کمی زمان تحویل طول کشید.",
    avatar: "/public/images/motor.png"
  },
];

function renderReviews() {
  const reviewsContainer = document.getElementById("reviews-container");
  if (!reviewsContainer) return;
  reviewsContainer.innerHTML = "";

  reviews.forEach((review) => {
    const reviewSlide = document.createElement("div");
    reviewSlide.classList.add("embla-reviews__slide");

    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add(
      "w-[270px]",
      "min-[380px]:w-[320px]",
      "min-[450px]:w-[374px]",
      "h-[139px]",
      "flex",
      "flex-col",
      "gap-4",
      "bg-primary-100",
      "rounded-[20px]",
      "pr-[28px]",
      "pt-[20px]",
      "pl-[23px]",
      "pb-[25px]",
      "shrink-0"
    );

    const avatar = review.avatar || "/public/icons/icon-person.png";

    reviewDiv.innerHTML = `
        <div class="flex justify-between">
            <div class="flex gap-4">
                <div class="bg-primary-300 p-[11px] rounded-full">
                    <img class="size-[32px]" src="${avatar}" alt="person">
                </div>
                <div class="flex-col flex">
                    <span class="font-medium text-primary-550">${review.name}</span>
                    <span class="text-[10px] text-primary-350">${review.date}</span>
                </div>
            </div>
            <div class="text-primary-350">
                <span class="text-[10px]">۵/</span>
                <span class="text-[12px] font-semibold">${review.rating}</span>
            </div>
        </div>
        <p class="text-[12px] text-[#2D2D2D]">${review.comment}</p>
    `;

    reviewSlide.appendChild(reviewDiv);
    reviewsContainer.appendChild(reviewSlide);
  });
}


const createReviewsDots = (emblaApiReviewsLocal) => {
  const dotsContainer = document.getElementById("reviews-dots");
  if (!dotsContainer || !emblaApiReviewsLocal) return;

  const slideCount = emblaApiReviewsLocal.slideNodes().length;
  dotsContainer.innerHTML = "";

  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement("button");
    dot.className = "size-1 rounded-full transition-all duration-300";
    dot.style.backgroundColor = "#C5B2B3";
    dot.setAttribute("aria-label", `نقد و بررسی ${i + 1}`);

    dot.addEventListener("click", () => {
      emblaApiReviewsLocal.scrollTo(i);
    });

    dotsContainer.appendChild(dot);
  }
};

const updateReviewsDots = (emblaApiReviewsLocal) => {
  const dotsContainer = document.getElementById("reviews-dots");
  if (!dotsContainer || !emblaApiReviewsLocal) return;

  const selectedIndex = emblaApiReviewsLocal.selectedScrollSnap();
  const dots = dotsContainer.querySelectorAll("button");

  dots.forEach((dot, index) => {
    if (index === selectedIndex) {
      dot.style.backgroundColor = "#A44A50";
      dot.className = "w-[26px] h-1 rounded-full transition-all duration-300";
    } else {
      dot.style.backgroundColor = "#C5B2B3";
      dot.className =
        "size-1 rounded-full cursor-pointer transition-all duration-300";
    }
  });
};

/* ===========================
   Sticky navbar on scroll
   =========================== */
window.addEventListener("scroll", () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  const navbar = document.getElementById("desktop-navbar");
  const accordion = document.getElementById("desktop-accordion");
  const backdrop = document.getElementById("sticky-backdrop");
  const desktopModalContent = document.getElementById("desktop-modal-content");

  if (navbar && accordion && backdrop) {
    if (scrollTop > 100) {
      console.log("scrollTop > 100")
      desktopModalContent.style.top = "150px";
      navbar.classList.add("sticky-navbar");
      accordion.classList.add("sticky-accordion");
      backdrop.classList.add("active");
    } else {
      console.log("scrollTop <<<< 100")
      desktopModalContent.style.top = "120px";
      navbar.classList.remove("sticky-navbar");
      accordion.classList.remove("sticky-accordion");
      backdrop.classList.remove("active");
    }
  }

  const mobileNavbar = document.getElementById("mobile-navbar");
  const mobileBackdrop = document.getElementById("sticky-backdrop-mobile");

  if (mobileNavbar && mobileBackdrop) {
    if (scrollTop > 50) {
      mobileNavbar.classList.add("sticky-mobile-navbar");
      mobileBackdrop.classList.add("active");
    } else {
      mobileNavbar.classList.remove("sticky-mobile-navbar");
      mobileBackdrop.classList.remove("active");
    }
  }
});

/* ===========================
   Initialize everything on DOMContentLoaded
   =========================== */
document.addEventListener("DOMContentLoaded", function () {
  // بررسی وجود Embla
  if (typeof EmblaCarousel !== "function") {
    console.error(
      "EmblaCarousel در دسترس نیست — لطفاً کتابخانه Embla را قبل از این فایل لود کنید."
    );
  }

  // رندر رنگ‌ها و آکاردئون
  renderColorOptions();
  renderMobileColorOptions();
  renderAccordionItems();



  // دسکتاپ quantity buttons
  const decreaseBtn = document.getElementById("decrease-btn");
  const increaseBtn = document.getElementById("increase-btn");
  const addToCartBtn = document.getElementById("add-to-cart-btn");
  const openCommentDesktop = document.getElementById("openCommentDesktop");


  if (decreaseBtn) decreaseBtn.addEventListener("click", () => updateQuantity(-1));
  if (increaseBtn) increaseBtn.addEventListener("click", () => updateQuantity(1));
  if (addToCartBtn) addToCartBtn.addEventListener("click", addToCart);
  if (openCommentDesktop) openCommentDesktop.addEventListener("click", openCommentModal);


  // mobile modal buttons
  const mobileSelectBtn = document.getElementById("mobile-select-model-btn");
  const commentSelectBtn = document.getElementById("openCommentMobile");
  const commentCloseModal = document.getElementById("comment-close");
  const commentModalBackdrop = document.getElementById("comment-modal-backdrop");

  const openShareMobile = document.getElementById("openShareMobile");
  const openShareDesktop = document.getElementById("openShareDesktop");

  const ShareCloseModal = document.getElementById("mobile-modal-share-close");
  const mobileShareModalBackdrop = document.getElementById("mobile-share-modal-backdrop");
  const ShareBtnClose = document.getElementById("mobile-modal-share-btn-close");
  const copyLinkBtn = document.getElementById("copy-product-link");

  const mobileModalClose = document.getElementById("mobile-modal-close");
  const modalBackdropProductSelection = document.getElementById("modal-backdrop-product-selection");

  const mobileDecreaseBtn = document.getElementById("mobile-decrease-btn");
  const mobileIncreaseBtn = document.getElementById("mobile-increase-btn");
  const mobileAddToCartBtn = document.getElementById("mobile-add-to-cart-btn");
  const mobileModalBackdrop = document.getElementById("mobile-modal-backdrop");

  if (mobileSelectBtn) mobileSelectBtn.addEventListener("click", openMobileModal);
  if (commentSelectBtn) commentSelectBtn.addEventListener("click", openCommentModal);
  if (mobileModalClose) mobileModalClose.addEventListener("click", closeMobileModal);
  if (modalBackdropProductSelection) modalBackdropProductSelection.addEventListener("click", closeMobileModal);

  if (commentCloseModal) commentCloseModal.addEventListener("click", closeCommentModal);
  if (commentModalBackdrop) commentModalBackdrop.addEventListener("click", closeCommentModal);
  if (openShareMobile) openShareMobile.addEventListener("click", openshareModal);
  if (openShareDesktop) openShareDesktop.addEventListener("click", openshareModal);

  if (mobileShareModalBackdrop) mobileShareModalBackdrop.addEventListener("click", closeshareModal);
  if (ShareCloseModal) ShareCloseModal.addEventListener("click", closeshareModal);
  if (ShareBtnClose) ShareBtnClose.addEventListener("click", closeshareModal);
  if (copyLinkBtn) copyLinkBtn.addEventListener("click", copyProductLink);

  if (mobileModalBackdrop) mobileModalBackdrop.addEventListener("click", closeMobileModal);
  if (mobileDecreaseBtn) mobileDecreaseBtn.addEventListener("click", () => updateMobileQuantity(-1));
  if (mobileIncreaseBtn) mobileIncreaseBtn.addEventListener("click", () => updateMobileQuantity(1));
  if (mobileAddToCartBtn) mobileAddToCartBtn.addEventListener("click", addToCartMobile);




  /* =============
     Initialize Embla — only if viewports exist
     ============= */
  const viewportNodeMainCarousel = document.querySelector(".embla__viewport");
  const viewportNodeThumbCarousel = document.querySelector(".embla-thumbs__viewport");
  const viewportNodeReviews = document.querySelector(".embla-reviews__viewport");


  // Main & thumbs
  if (viewportNodeMainCarousel) {
    const OPTIONS = { direction: "rtl" };

    const OPTIONS_THUMBS = {
      containScroll: "keepSnaps",
      dragFree: true,
      direction: "rtl",
      axis: "x", // 👈 موبایل: عمودی / دسکتاپ: افقی
    };

    try {
      emblaApiMain = typeof EmblaCarousel === "function" ? EmblaCarousel(viewportNodeMainCarousel, OPTIONS) : null;
      if (viewportNodeThumbCarousel && typeof EmblaCarousel === "function") {
        emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS);
      }
      // Thumb handlers
      const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(emblaApiMain, emblaApiThumb);
      const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(emblaApiMain, emblaApiThumb);

      if (emblaApiMain) {
        emblaApiMain.on("destroy", removeThumbBtnsClickHandlers);
        emblaApiMain.on("destroy", removeToggleThumbBtnsActive);
      }
      if (emblaApiThumb) {
        emblaApiThumb.on("destroy", removeThumbBtnsClickHandlers);
        emblaApiThumb.on("destroy", removeToggleThumbBtnsActive);
      }

      // Dots for main
      if (emblaApiMain) {
        emblaApiMain.on("init", () => {
          createDots(emblaApiMain);
          updateDots(emblaApiMain);
        });
        emblaApiMain.on("select", () => updateDots(emblaApiMain));
      }

      // Prev / Next buttons
      const prevButton = document.getElementById("embla-prev");
      const nextButton = document.getElementById("embla-next");

      if (prevButton) {
        prevButton.addEventListener("click", () => emblaApiMain && emblaApiMain.scrollPrev());
      }
      if (nextButton) {
        nextButton.addEventListener("click", () => emblaApiMain && emblaApiMain.scrollNext());
      }

      if (emblaApiMain) {
        emblaApiMain.on("init", () => updateButtonStates(emblaApiMain, prevButton, nextButton));
        emblaApiMain.on("select", () => updateButtonStates(emblaApiMain, prevButton, nextButton));
      }
    } catch (e) {
      console.error("خطا در ایجاد Embla main/thumb:", e);
    }

  } // end main carousel init

  // Reviews carousel — اول render کن سپس embla رو بساز
  if (viewportNodeReviews) {
    renderReviews();
    try {
      const REVIEWS_OPTIONS = { direction: "rtl", loop: true, slidesToScroll: 1, containScroll: "trimSnaps" };
      emblaApiReviews = typeof EmblaCarousel === "function" ? EmblaCarousel(viewportNodeReviews, REVIEWS_OPTIONS) : null;

      if (emblaApiReviews) {
        emblaApiReviews.on("init", () => {
          createReviewsDots(emblaApiReviews);
          updateReviewsDots(emblaApiReviews);
        });
        emblaApiReviews.on("select", () => updateReviewsDots(emblaApiReviews));
      }
    } catch (e) {
      console.error("خطا در ایجاد Embla reviews:", e);
    }
  }


  const accordionList = document.getElementById("accordion-list");
  const desktopModalBackdrop = document.getElementById("desktop-modal-backdrop");

  let currentLink = null;
  let currentIcon = null;

  if (accordionList) {
    
    accordionList.addEventListener(
      "mouseenter",
      (e) => {
        console.log("first")
        accordionList.classList.add("relative", "bg-white", "z-60");
        const link = e.target.closest("a");
        if (!link) return;
        currentIcon?.classList.remove("-rotate-180", "!text-[#C41818]");
        currentLink?.querySelector("span").classList.remove("!text-[#C41818]")


        currentLink = link;
        currentIcon = link.querySelector(".arrow-down-icon");

        if (currentIcon)
          currentIcon.classList.add("-rotate-180", "!text-[#C41818]", "transition-transform", "duration-300");

        const href = link.getAttribute("href");
        const categoryKey = href?.replace("#", "");
        if (categoryData[categoryKey]) {
          currentLink.querySelector("span").classList.add("!text-[#C41818]")

          setTimeout(() => openDesktopModal(categoryData[categoryKey]), 300);
        } else {
          closeModal();
        }
      },
      true
    );
  }

  if (desktopModalBackdrop) {
    desktopModalBackdrop.addEventListener("mouseenter", () => {
      closeModal();
    });
  }

  function closeModal() {
    closeDesktopModal();
    currentLink.querySelector("span").classList.remove("!text-[#C41818]")
    currentIcon?.classList.remove("-rotate-180", "!text-[#C41818]");
    accordionList.classList.remove("relative", "bg-white", "z-60");
  }

});

/* ===========================
  Handle Product Selection
   =========================== */

function openMobileSelectionProduct(mobileSelection) {
  if (!mobileSelection) return;
  setTimeout(() => {
    mobileSelection.classList.remove("hidden");
  }, 200);

}

function closeMobileSelectionProduct(mobileSelection) {
  setTimeout(() => {
    mobileSelection.classList.add("hidden");
  }, 100);

  
}



document.addEventListener("DOMContentLoaded", function () {


  const addToCartBtn = document.getElementById("mobile-add-to-cart-btn");
  const colorItems = document.querySelectorAll(".color-item.available");

  // تنظیم اولیه دکمه غیرفعال
  function updateAddToCartBtn() {
    const activeColor = document.querySelector(".color-item.active");
    if (activeColor) {
      // رنگ انتخاب شده: دکمه فعال
      addToCartBtn.disabled = false;
      addToCartBtn.classList.remove("bg-[#E0E0E0]", "text-[#B1B1B1]", "hover:bg-red-700");
      addToCartBtn.classList.add("bg-red-600", "text-white");
    } else {
      // هیچ رنگی انتخاب نشده: دکمه غیرفعال
      addToCartBtn.disabled = true;
      addToCartBtn.classList.remove("bg-red-600", "text-white", "hover:bg-red-700");
      addToCartBtn.classList.add("bg-[#E0E0E0]", "text-[#B1B1B1]");
    }
  }


  colorItems.forEach((item) => {
    item.addEventListener("click", function () {
      colorItems.forEach((el) => {
        el.classList.remove("active");
        const checkIcon = el.querySelector(".check-icon");
        if (checkIcon) {
          checkIcon.classList.add("hidden");
        }
      });
      this.classList.add("active");
      const checkIcon = this.querySelector(".check-icon");
      if (checkIcon) {
        checkIcon.classList.remove("hidden");
      }
      console.log("Selected color id:", this.id);

      updateAddToCartBtn();
    });
  });
});