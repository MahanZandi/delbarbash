document.addEventListener("DOMContentLoaded", () => {
    const hamburgerMenu = document.getElementById("hamburger-menu");
    const hamburgerContent = document.getElementById("hamburger-content");
    const subMenuHamburgerContent = document.getElementById("subMenuhamburger-content");
    const openCategories = document.getElementById("open-categories");
    const backdrop = document.getElementById("hamburger-backdrop");

    // Menu data
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

    // Open hamburger menu
    function openHamburgerMenu() {
        hamburgerMenu.classList.remove("hidden");
        document.body.style.overflow = "hidden";

        setTimeout(() => {
            backdrop.classList.replace("opacity-0", "opacity-100");
            hamburgerContent.classList.replace("translate-x-full", "translate-x-0");
        }, 10);
    }

    // Close hamburger menu
    function closeHamburgerMenu() {
        backdrop.classList.replace("opacity-100", "opacity-0");
        hamburgerContent.classList.replace("translate-x-0", "translate-x-full");
        subMenuHamburgerContent.classList.replace("translate-x-0", "translate-x-full");
        setTimeout(() => {

            hamburgerMenu.classList.add("hidden");
            document.body.style.overflow = "auto";
        }, 300);
    }

    // Dynamically render submenu header and items
    function renderSubMenu(title, items) {
        subMenuHamburgerContent.innerHTML = `
      <div class="p-6">
        <div class="flex items-center gap-3 mb-6">
          <button id="subCategories-close"
            class="w-8 h-8 border border-primary-600 rounded-full flex items-center justify-center">
            <img src="./public/icons/arrow-back-icon.png" alt="Back" />
          </button>
          <h2 class="text-[15px] font-medium text-primary-600">${title}</h2>
        </div>

        <nav class="flex flex-col gap-[34px]"></nav>
      </div>
    `;

        const subMenuNav = subMenuHamburgerContent.querySelector("nav");

        // Generate menu links dynamically
        items.forEach(item => {
            const link = document.createElement("a");
            link.href = item.href;
            link.className = "flex items-center justify-between text-gray-800 hover:text-primary-600 transition-colors";
            link.innerHTML = `
        <span class="flex items-center justify-center gap-2">
          <img src="${item.icon}" alt="${item.title}" class="w-7 h-7 object-contain" />
          <span class="text-[#9A6767]">${item.title}</span>
        </span>
        <i class="fa-solid fa-chevron-left text-primary-600"></i>
      `;
            subMenuNav.appendChild(link);
        });

        // Back button handler
        const subCategoriesClose = subMenuHamburgerContent.querySelector("#subCategories-close");
        subCategoriesClose.addEventListener("click", () => {
            subMenuHamburgerContent.classList.replace("translate-x-0", "translate-x-full");
            hamburgerContent.classList.replace("translate-x-full", "translate-x-0");
        });
    }

    // Open "Categories" submenu
    openCategories.addEventListener("click", (e) => {
        e.preventDefault();

        hamburgerContent.classList.replace("translate-x-0", "translate-x-full");

        // Render submenu content dynamically
        renderSubMenu("دسته‌بندی محصولات", accordionItems);

        subMenuHamburgerContent.classList.replace("translate-x-full", "translate-x-0");
    });

    // Close the entire menu when clicking backdrop
    backdrop.addEventListener("click", closeHamburgerMenu);

});
