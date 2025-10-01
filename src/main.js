// Accordion items data
const accordionItems = [
    {
        id: 1,
        title: "مراقبت از پوست",
        icon: "./public/icons/icon-lipstick.png",
        href: "#skincare"
    },
    {
        id: 2,
        title: "آرایشی و بهداشتی",
        icon: "./public/icons/icon-perfume.png",
        href: "#cosmetics"
    },
    {
        id: 3,
        title: "لباس و پوشاک",
        icon: "./public/icons/icon-clothing.png",
        href: "#clothing"
    },
    {
        id: 4,
        title: "لوازم خانگی",
        icon: "./public/icons/icon-cup.png",
        href: "#home"
    },
    {
        id: 5,
        title: "لوازم الکتریکی",
        icon: "./public/icons/icon-lightning-.png",
        href: "#electric"
    },
    {
        id: 6,
        title: "لوازم برقی",
        icon: "./public/icons/icon-hair-dryer.png",
        href: "#appliances"
    },
    {
        id: 7,
        title: "خورشیدی",
        icon: "./public/icons/icon-solar.png",
        href: "#solar"
    },
    {
        id: 8,
        title: "دارو و مکمل",
        icon: "./public/icons/icon-drugs.png",
        href: "#pharmacy"
    }
];

// Function to render accordion items
function renderAccordionItems() {
    const accordionList = document.getElementById('accordion-list');
    
    if (accordionList) {
        // Clear existing items
        accordionList.innerHTML = '';
        
        // Map through accordion items and create HTML
        accordionItems.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${item.href}" class="flex items-center justify-between transition-all">
                    <img src="${item.icon}" alt="${item.title}" class="size-[24px] object-contain pl-[5px]">
                    <span class="text-sm ">${item.title}</span>
                    <i class="fa-solid fa-angle-down size-[16px] pr-2"></i>
                </a>
            `;
            accordionList.appendChild(listItem);
        });
    }
}

// Initialize accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderAccordionItems();
});
