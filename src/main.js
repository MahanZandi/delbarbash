// Embla Carousel Helper Functions
const addThumbBtnsClickHandlers = (emblaApiMain, emblaApiThumb) => {
  const slidesThumbs = emblaApiThumb.slideNodes()

  const scrollToIndex = slidesThumbs.map(
    (_, index) => () => emblaApiMain.scrollTo(index)
  )

  slidesThumbs.forEach((slideNode, index) => {
    slideNode.addEventListener('click', scrollToIndex[index], false)
  })

  return () => {
    slidesThumbs.forEach((slideNode, index) => {
      slideNode.removeEventListener('click', scrollToIndex[index], false)
    })
  }
}

const addToggleThumbBtnsActive = (emblaApiMain, emblaApiThumb) => {
  const slidesThumbs = emblaApiThumb.slideNodes()

  const toggleThumbBtnsState = () => {
    emblaApiThumb.scrollTo(emblaApiMain.selectedScrollSnap())
    const previous = emblaApiMain.previousScrollSnap()
    const selected = emblaApiMain.selectedScrollSnap()
    slidesThumbs[previous].classList.remove('embla-thumbs__slide--selected')
    slidesThumbs[selected].classList.add('embla-thumbs__slide--selected')
  }

  emblaApiMain.on('select', toggleThumbBtnsState)
  emblaApiThumb.on('init', toggleThumbBtnsState)

  return () => {
    const selected = emblaApiMain.selectedScrollSnap()
    slidesThumbs[selected].classList.remove('embla-thumbs__slide--selected')
  }
}

// Initialize Embla Carousel
const OPTIONS = {
  direction: 'rtl'
}
const OPTIONS_THUMBS = {
  containScroll: 'keepSnaps',
  dragFree: true,
  direction: 'rtl'
}

const viewportNodeMainCarousel = document.querySelector('.embla__viewport')
const viewportNodeThumbCarousel = document.querySelector(
  '.embla-thumbs__viewport'
)

// EmblaCarousel is loaded from CDN as a global variable
const emblaApiMain = EmblaCarousel(viewportNodeMainCarousel, OPTIONS)
const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS)

const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(
  emblaApiMain,
  emblaApiThumb
)
const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(
  emblaApiMain,
  emblaApiThumb
)

emblaApiMain
  .on('destroy', removeThumbBtnsClickHandlers)
  .on('destroy', removeToggleThumbBtnsActive)

emblaApiThumb
  .on('destroy', removeThumbBtnsClickHandlers)
  .on('destroy', removeToggleThumbBtnsActive)

// ساخت نقطه‌های indicator
const createDots = () => {
  const dotsContainer = document.getElementById('slider-dots')
  if (!dotsContainer) return
  
  const slideCount = emblaApiMain.slideNodes().length
  dotsContainer.innerHTML = ''
  
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('button')
    dot.className = 'size-1 rounded-full transition-all duration-300'
    dot.style.backgroundColor = '#C5B2B3'
    dot.setAttribute('aria-label', `اسلاید ${i + 1}`)
    
    dot.addEventListener('click', () => {
      emblaApiMain.scrollTo(i)
    })
    
    dotsContainer.appendChild(dot)
  }
}

// بروزرسانی نقطه‌های فعال
const updateDots = () => {
  const dotsContainer = document.getElementById('slider-dots')
  if (!dotsContainer) return
  
  const selectedIndex = emblaApiMain.selectedScrollSnap()
  const dots = dotsContainer.querySelectorAll('button')
  
  dots.forEach((dot, index) => {
    if (index === selectedIndex) {
      dot.style.backgroundColor = '#A44A50' 
      dot.className = 'w-[26px] h-1 rounded-full transition-all duration-300'
    } else {
      dot.style.backgroundColor = '#C5B2B3'
      dot.className = 'size-1 rounded-full cursor-pointer transition-all duration-300'
    }
  })
}

emblaApiMain.on('init', () => {
  createDots()
  updateDots()
})
emblaApiMain.on('select', updateDots)

// Product slider backdrop functions
function showProductSliderBackdrop() {
  const backdrop = document.getElementById('product-slider-backdrop')
  if (backdrop) {
    backdrop.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
  }
}

function hideProductSliderBackdrop() {
  const backdrop = document.getElementById('product-slider-backdrop')
  if (backdrop) {
    backdrop.classList.add('hidden')
    document.body.style.overflow = 'auto'
  }
}



const prevButton = document.getElementById('embla-prev')
const nextButton = document.getElementById('embla-next')

if (prevButton) {
  prevButton.addEventListener('click', () => {
    emblaApiMain.scrollPrev()
  })
}

if (nextButton) {
  nextButton.addEventListener('click', () => {
    emblaApiMain.scrollNext()
  })
}

const updateButtonStates = () => {
  if (!prevButton || !nextButton) return
  
  if (!emblaApiMain.canScrollPrev()) {
    prevButton.style.opacity = ''
    prevButton.style.cursor = 'not-allowed'
  } else {
    prevButton.style.opacity = '1'
    prevButton.style.cursor = 'pointer'
  }
  
  if (!emblaApiMain.canScrollNext()) {
    nextButton.style.opacity = ''
    nextButton.style.cursor = 'not-allowed'
  } else {
    nextButton.style.opacity = '1'
    nextButton.style.cursor = 'pointer'
  }
}

emblaApiMain.on('init', updateButtonStates)
emblaApiMain.on('select', updateButtonStates)

// Product Color Selection Component
const productColors = [
  { id: 1, name: "رنگ شماره ۱", available: true, price: 145000 },
  { id: 2, name: "رنگ شماره ۲", available: true, price: 145000 },
  { id: 3, name: "رنگ شماره ۳", available: true, price: 145000 },
  { id: 4, name: "رنگ شماره ۴", available: false, price: 145000 },
  { id: 5, name: "رنگ شماره ۵", available: false, price: 145000 },
  { id: 6, name: "رنگ شماره ۶", available: true, price: 145000 }
]

let selectedColor = null
let quantity = 1

// Render color options
function renderColorOptions() {
  const container = document.getElementById('color-options')
  if (!container) return
  
  container.innerHTML = ''
  
  productColors.forEach(color => {
    const colorItem = document.createElement('div')
    colorItem.className = `relative border rounded-[10px] py-[10px] px-[14px] cursor-pointer transition-all ${
      color.available ? 'border-[#E8E8E8]' : 'border-[#E8E8E8] opacity-50 cursor-not-allowed'
    } ${selectedColor?.id === color.id ? 'border-red-500 border-2 bg-red-50' : ''}`
    
    colorItem.innerHTML = `
      <div class="flex items-center justify-between text-xs text-[#2D2D2D]">
        <span>${color.name}</span>
        ${!color.available ? '<span class="text-xs text-red-600">اتمام موجودی</span>' : ''}
        ${selectedColor?.id === color.id ? '<i class="fa-solid fa-check text-red-600"></i>' : ''}
      </div>
    `
    
    if (color.available) {
      colorItem.addEventListener('click', () => selectColor(color))
    }
    
    container.appendChild(colorItem)
  })
}

// Select color
function selectColor(color) {
  if (!color.available) return
  
  selectedColor = color
  renderColorOptions()
  updateAddToCartButton()
  updatePrice()
}

// Update quantity
function updateQuantity(change) {
  const newQuantity = quantity + change
  if (newQuantity < 1) return
  if (newQuantity > 99) return // max limit
  
  quantity = newQuantity
  document.getElementById('quantity-display').textContent = quantity.toLocaleString('fa-IR')
  updatePrice()
}

// Update price display
function updatePrice() {
  const priceDisplay = document.getElementById('price-display')
  if (!priceDisplay || !selectedColor) return
  
  const totalPrice = selectedColor.price * quantity
  priceDisplay.textContent = totalPrice.toLocaleString('fa-IR')
}

// Update add to cart button state
function updateAddToCartButton() {
  const btn = document.getElementById('add-to-cart-btn')
  if (!btn) return
  
  if (selectedColor) {
    btn.disabled = false
    btn.classList.remove('opacity-50', 'cursor-not-allowed')
  } else {
    btn.disabled = true
    btn.classList.add('opacity-50', 'cursor-not-allowed')
  }
}

// Add to cart action
function addToCart() {
  if (!selectedColor) {
    alert('لطفاً یک رنگ انتخاب کنید')
    return
  }
  
  console.log('افزودن به سبد خرید:', {
    color: selectedColor,
    quantity: quantity,
    totalPrice: selectedColor.price * quantity
  })
  
  alert(`${quantity} عدد ${selectedColor.name} به سبد خرید اضافه شد`)
}

// Mobile Modal Variables
let mobileSelectedColor = null
let mobileQuantity = 1

// Render mobile color options
function renderMobileColorOptions() {
  const container = document.getElementById('mobile-color-options')
  if (!container) return
  
  container.innerHTML = ''
  
  productColors.forEach(color => {
    const colorItem = document.createElement('div')
    colorItem.className = `relative border rounded-[10px] py-[10px] px-[14px] cursor-pointer transition-all ${
      color.available ? 'border-[#E8E8E8]' : 'border-[#E8E8E8] opacity-50 cursor-not-allowed'
    } ${mobileSelectedColor?.id === color.id ? 'border-red-500 border-2 bg-red-50' : ''}`
    
    colorItem.innerHTML = `
      <div class="flex items-center justify-between text-xs text-[#2D2D2D]">
        <span>${color.name}</span>
        ${!color.available ? '<span class="text-xs text-red-600">اتمام موجودی</span>' : ''}
        ${mobileSelectedColor?.id === color.id ? '<i class="fa-solid fa-check text-red-600"></i>' : ''}
      </div>
    `
    
    if (color.available) {
      colorItem.addEventListener('click', () => selectMobileColor(color))
    }
    
    container.appendChild(colorItem)
  })
}

// Select mobile color
function selectMobileColor(color) {
  if (!color.available) return
  
  mobileSelectedColor = color
  renderMobileColorOptions()
  updateMobileAddToCartButton()
}

// Update mobile quantity
function updateMobileQuantity(change) {
  const newQuantity = mobileQuantity + change
  if (newQuantity < 1) return
  if (newQuantity > 99) return // max limit
  
  mobileQuantity = newQuantity
  document.getElementById('mobile-quantity-display').textContent = mobileQuantity.toLocaleString('fa-IR')
}

// Update mobile price display


// Update mobile add to cart button state
function updateMobileAddToCartButton() {
  const btn = document.getElementById('mobile-add-to-cart-btn')
  if (!btn) return
  
  if (mobileSelectedColor) {
    btn.disabled = false
    btn.classList.remove('opacity-50', 'cursor-not-allowed')
  } else {
    btn.disabled = true
    btn.classList.add('opacity-50', 'cursor-not-allowed')
  }
}

// Add to cart action for mobile
function addToCartMobile() {
  if (!mobileSelectedColor) {
    alert('لطفاً یک رنگ انتخاب کنید')
    return
  }
  
  console.log('افزودن به سبد خرید (موبایل):', {
    color: mobileSelectedColor,
    quantity: mobileQuantity,
    totalPrice: mobileSelectedColor.price * mobileQuantity
  })
  
  alert(`${mobileQuantity} عدد ${mobileSelectedColor.name} به سبد خرید اضافه شد`)
  
  // Close modal after adding to cart
  closeMobileModal()
}

// Open mobile modal with animation
function openMobileModal() {
  const modal = document.getElementById('mobile-product-modal')
  const modalContent = document.getElementById('mobile-modal-content')
  const backdrop = document.getElementById('mobile-modal-backdrop')
  
  if (modal && modalContent && backdrop) {
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    
    // Trigger animations after a small delay to ensure the modal is visible
    setTimeout(() => {
      backdrop.classList.remove('opacity-0')
      backdrop.classList.add('opacity-100')
      
      modalContent.classList.remove('translate-y-full')
      modalContent.classList.add('translate-y-0')
    }, 10)
  }
}

// Close mobile modal with animation
function closeMobileModal() {
  const modal = document.getElementById('mobile-product-modal')
  const modalContent = document.getElementById('mobile-modal-content')
  const backdrop = document.getElementById('mobile-modal-backdrop')
  
  if (modal && modalContent && backdrop) {
    // Start closing animations
    backdrop.classList.remove('opacity-100')
    backdrop.classList.add('opacity-0')
    
    modalContent.classList.remove('translate-y-0')
    modalContent.classList.add('translate-y-full')
    
    // Hide modal after animation completes
    setTimeout(() => {
      modal.classList.add('hidden')
      document.body.style.overflow = 'auto'
    }, 300) // Match the duration-300 class
  }
}

// Hamburger Menu Functions
function openHamburgerMenu() {
  const menu = document.getElementById('hamburger-menu')
  const content = document.getElementById('hamburger-content')
  const backdrop = document.getElementById('hamburger-backdrop')
  
  if (menu && content && backdrop) {
    menu.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    
    // Trigger animations after a small delay
    setTimeout(() => {
      backdrop.classList.remove('opacity-0')
      backdrop.classList.add('opacity-100')
      
      content.classList.remove('translate-x-full')
      content.classList.add('translate-x-0')
    }, 10)
  }
}

function closeHamburgerMenu() {
  const menu = document.getElementById('hamburger-menu')
  const content = document.getElementById('hamburger-content')
  const backdrop = document.getElementById('hamburger-backdrop')
  
  if (menu && content && backdrop) {
    // Start closing animations
    backdrop.classList.remove('opacity-100')
    backdrop.classList.add('opacity-0')
    
    content.classList.remove('translate-x-0')
    content.classList.add('translate-x-full')
    
    // Hide menu after animation completes
    setTimeout(() => {
      menu.classList.add('hidden')
      document.body.style.overflow = 'auto'
    }, 300)
  }
}

// Initialize product selection
document.addEventListener('DOMContentLoaded', function() {
  renderColorOptions()
  renderMobileColorOptions()
  
  // Desktop quantity buttons
  const decreaseBtn = document.getElementById('decrease-btn')
  const increaseBtn = document.getElementById('increase-btn')
  const addToCartBtn = document.getElementById('add-to-cart-btn')
  
  if (decreaseBtn) {
    decreaseBtn.addEventListener('click', () => updateQuantity(-1))
  }
  
  if (increaseBtn) {
    increaseBtn.addEventListener('click', () => updateQuantity(1))
  }
  
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', addToCart)
  }
  
  // Mobile modal buttons
  const mobileSelectBtn = document.getElementById('mobile-select-model-btn')
  const mobileModalClose = document.getElementById('mobile-modal-close')
  const mobileModal = document.getElementById('mobile-product-modal')
  const mobileDecreaseBtn = document.getElementById('mobile-decrease-btn')
  const mobileIncreaseBtn = document.getElementById('mobile-increase-btn')
  const mobileAddToCartBtn = document.getElementById('mobile-add-to-cart-btn')
  
  if (mobileSelectBtn) {
    mobileSelectBtn.addEventListener('click', openMobileModal)
  }
  
  if (mobileModalClose) {
    mobileModalClose.addEventListener('click', closeMobileModal)
  }
  
  // Add click listener to backdrop for closing modal
  const mobileModalBackdrop = document.getElementById('mobile-modal-backdrop')
  if (mobileModalBackdrop) {
    mobileModalBackdrop.addEventListener('click', closeMobileModal)
  }
  
  if (mobileDecreaseBtn) {
    mobileDecreaseBtn.addEventListener('click', () => updateMobileQuantity(-1))
  }
  
  if (mobileIncreaseBtn) {
    mobileIncreaseBtn.addEventListener('click', () => updateMobileQuantity(1))
  }
  
  if (mobileAddToCartBtn) {
    mobileAddToCartBtn.addEventListener('click', addToCartMobile)
  }
  
  // Hamburger menu buttons
  const hamburgerBtn = document.getElementById('hamburger-btn')
  const hamburgerClose = document.getElementById('hamburger-close')
  const hamburgerBackdrop = document.getElementById('hamburger-backdrop')
  
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', openHamburgerMenu)
  }
  
  if (hamburgerClose) {
    hamburgerClose.addEventListener('click', closeHamburgerMenu)
  }
  
  if (hamburgerBackdrop) {
    hamburgerBackdrop.addEventListener('click', closeHamburgerMenu)
  }
})

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
                <a href="${item.href}" class="flex items-center justify-between transition-all text-primary-400">
                    <img src="${item.icon}" alt="${item.title}" class="size-[24px] object-contain pl-[5px]">
                    <span class="text-sm">${item.title}</span>
                    <i class="fa-solid fa-angle-down size-[16px] pr-2"></i>
                </a>
            `;
            accordionList.appendChild(listItem);
        });
    }
}

// Desktop Category Modal Functions
function openDesktopModal(categoryData) {
  const modal = document.getElementById('desktop-category-modal')
  const content = document.getElementById('desktop-modal-content')
  const backdrop = document.getElementById('desktop-modal-backdrop')
  const title = document.getElementById('desktop-modal-title')
  const body = document.getElementById('desktop-modal-body')
  
  if (modal && content && backdrop && body) {
    // Render modal content
    body.innerHTML = `
      <div class="grid grid-cols-6 gap-6">
        ${categoryData.subcategories.map(subcategory => `
          <div class="space-y-3">
            <div class="bg-primary-600 text-white px-4 py-3 rounded-lg text-center font-bold text-base">
              ${subcategory.name}
            </div>
            <div class="space-y-2">
              ${subcategory.items.map(item => `
                <button class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-right text-sm transition-colors">
                  ${item}
                </button>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `
    
    modal.classList.remove('hidden')
    document.body.style.overflow = 'hidden'
    
    // Trigger animations
    setTimeout(() => {
      backdrop.classList.remove('opacity-0')
      backdrop.classList.add('opacity-100')
      
      content.classList.remove('opacity-0', 'scale-95')
      content.classList.add('opacity-100', 'scale-100')
    }, 10)
  }
}

function closeDesktopModal() {
  const modal = document.getElementById('desktop-category-modal')
  const content = document.getElementById('desktop-modal-content')
  const backdrop = document.getElementById('desktop-modal-backdrop')
  
  if (modal && content && backdrop) {
    // Start closing animations
    backdrop.classList.remove('opacity-100')
    backdrop.classList.add('opacity-0')
    
    content.classList.remove('opacity-100', 'scale-100')
    content.classList.add('opacity-0', 'scale-95')
    
    // Hide modal after animation completes
    setTimeout(() => {
      modal.classList.add('hidden')
      document.body.style.overflow = 'auto'
    }, 300)
  }
}

// Category data for desktop modal
const categoryData = {
  'skincare': {
    title: 'مراقبت از پوست',
    subcategories: [
      {
        name: 'پاک‌کننده',
        items: ['پن صابون', 'ژل شستشو', 'میکسلار واتر', 'تونر', 'اسکراب', 'همه محصولات پاک‌کننده']
      },
      {
        name: 'مرطوب‌کننده',
        items: ['کرم روز', 'کرم شب', 'سرم', 'لوسیون بدن', 'کرم دور چشم', 'همه محصولات مرطوب‌کننده']
      },
      {
        name: 'محافظت',
        items: ['کرم ضد آفتاب', 'کرم ضد لک', 'کرم ضد چروک', 'کرم دور چشم', 'همه محصولات محافظت']
      },
      {
        name: 'ماسک',
        items: ['ماسک صورت', 'ماسک دور چشم', 'ماسک لب', 'ماسک بدن', 'همه محصولات ماسک']
      },
      {
        name: 'ابزار',
        items: ['براش صورت', 'اسفنج', 'دستگاه پاکسازی', 'ابزار ماساژ', 'همه ابزار مراقبت']
      },
      {
        name: 'تخصصی',
        items: ['محصولات ضد پیری', 'محصولات روشن‌کننده', 'محصولات آکنه', 'محصولات حساس', 'همه محصولات تخصصی']
      }
    ]
  },
  'cosmetics': {
    title: 'آرایشی و بهداشتی',
    subcategories: [
      {
        name: 'چشم',
        items: ['سایه', 'ریمل', 'ریمل رنگی', 'خط چشم', 'خط چشم رنگی', 'مداد چشم', 'مداد هاشور ابرو', 'مژه', 'فرمژه', 'صابون ابرو', 'همه محصولات چشم']
      },
      {
        name: 'لب',
        items: ['رژ لب جامد', 'رژ لب مایع', 'پک رژ لب', 'بالم لب', 'برق لب', 'تینت لب', 'لیپ گلاس', 'خط لب', 'حجم دهنده لب', 'همه محصولات لب']
      },
      {
        name: 'صورت',
        items: ['کرم پودر', 'کوشن', 'بی بی کرم', 'کانتور و کانسیلر', 'هایلایتر', 'پنکک', 'پرایمر', 'رژگونه', 'فیکساتور', 'لیفت صورت', 'همه محصولات صورت']
      },
      {
        name: 'ناخن',
        items: ['لاک', 'ناخن مصنوعی', 'ابزار ناخن', 'ست مانیکور', 'همه محصولات ناخن']
      },
      {
        name: 'ابزار آرایشی',
        items: ['براش پد', 'کیف آرایش', 'تراش', 'همه ابزار آرایشی']
      },
      {
        name: 'دیگر ملزومات',
        items: ['پک آرایشی', 'رنگ مو', 'مو کلیپسی', 'همه محصولات آرایشی']
      }
    ]
  }
}

// Initialize accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderAccordionItems();
    
    // Add click listeners to accordion items
    const accordionList = document.getElementById('accordion-list')
    if (accordionList) {
      accordionList.addEventListener('click', (e) => {
        const link = e.target.closest('a')
        if (link) {
          e.preventDefault()
          const href = link.getAttribute('href')
          const categoryKey = href.replace('#', '')
          
          if (categoryData[categoryKey]) {
            openDesktopModal(categoryData[categoryKey])
          }
        }
      })
    }
    
    // Desktop modal event listeners
    const desktopModalBackdrop = document.getElementById('desktop-modal-backdrop')
    
    if (desktopModalBackdrop) {
      desktopModalBackdrop.addEventListener('click', closeDesktopModal)
    }
});


// Reviews Embla Carousel
const reviews = [
  {
      name: "میترا احمدی",
      date: "۱۲ تیر ۱۴۰۴",
      rating: 5,
      comment: "خرید ازاین وبسایت بشدت رضایت بخشه ... عالیه 👌",
      avatar: ""
  },
  {
      name: "علیرضا رضایی",
      date: "۱۵ مرداد ۱۴۰۴",
      rating: 4,
      comment: "بسیار خوب، فقط کمی زمان تحویل طول کشید.",
      avatar: "/public/images/motor.png" 
  },
  {
    name: "میترا احمدی",
    date: "۱۲ تیر ۱۴۰۴",
    rating: 5,
    comment: "خرید ازاین وبسایت بشدت رضایت بخشه ... عالیه 👌",
    avatar: ""
},
{
    name: "علیرضا رضایی",
    date: "۱۵ مرداد ۱۴۰۴",
    rating: 4,
    comment: "بسیار خوب، فقط کمی زمان تحویل طول کشید.",
    avatar: "/public/images/motor.png" 
},
{
  name: "میترا احمدی",
  date: "۱۲ تیر ۱۴۰۴",
  rating: 5,
  comment: "خرید ازاین وبسایت بشدت رضایت بخشه ... عالیه 👌",
  avatar: ""
},
{
  name: "علیرضا رضایی",
  date: "۱۵ مرداد ۱۴۰۴",
  rating: 4,
  comment: "بسیار خوب، فقط کمی زمان تحویل طول کشید.",
  avatar: "/public/images/motor.png" 
},
];

// Initialize Reviews Embla Carousel
const REVIEWS_OPTIONS = {
  direction: 'rtl',
  loop: true,
  slidesToScroll: 1,
  containScroll: 'trimSnaps'
}

const viewportNodeReviews = document.querySelector('.embla-reviews__viewport')
const emblaApiReviews = EmblaCarousel(viewportNodeReviews, REVIEWS_OPTIONS)

// Render reviews as slides
function renderReviews() {
  const reviewsContainer = document.getElementById("reviews-container");
  if (!reviewsContainer) return;
  
  reviewsContainer.innerHTML = '';
  
  reviews.forEach(review => {
    const reviewSlide = document.createElement("div");
    reviewSlide.classList.add("embla-reviews__slide");
    
    const reviewDiv = document.createElement("div");
    reviewDiv.classList.add("w-[374px]", "h-[139px]", "flex", "flex-col", "gap-4", "bg-primary-100", "rounded-[20px]", "pr-[28px]", "pt-[20px]", "pl-[23px]", "pb-[25px]", "shrink-0");

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

// Create dots for reviews
const createReviewsDots = () => {
  const dotsContainer = document.getElementById('reviews-dots')
  if (!dotsContainer) return
  
  const slideCount = emblaApiReviews.slideNodes().length
  dotsContainer.innerHTML = ''
  
  for (let i = 0; i < slideCount; i++) {
    const dot = document.createElement('button')
    dot.className = 'size-1 rounded-full transition-all duration-300'
    dot.style.backgroundColor = '#C5B2B3'
    dot.setAttribute('aria-label', `نقد و بررسی ${i + 1}`)
    
    dot.addEventListener('click', () => {
      emblaApiReviews.scrollTo(i)
    })
    
    dotsContainer.appendChild(dot)
  }
}

// Update dots for reviews
const updateReviewsDots = () => {
  const dotsContainer = document.getElementById('reviews-dots')
  if (!dotsContainer) return
  
  const selectedIndex = emblaApiReviews.selectedScrollSnap()
  const dots = dotsContainer.querySelectorAll('button')
  
  dots.forEach((dot, index) => {
    if (index === selectedIndex) {
      dot.style.backgroundColor = '#A44A50' 
      dot.className = 'w-[26px] h-1 rounded-full transition-all duration-300'
    } else {
      dot.style.backgroundColor = '#C5B2B3'
      dot.className = 'size-1 rounded-full cursor-pointer transition-all duration-300'
    }
  })
}

// Initialize reviews carousel
emblaApiReviews.on('init', () => {
  renderReviews()
  createReviewsDots()
  updateReviewsDots()
})

emblaApiReviews.on('select', updateReviewsDots)

// Sticky Navbar and Accordion on Scroll
window.addEventListener('scroll', () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  // Desktop
  const navbar = document.getElementById('desktop-navbar');
  const accordion = document.getElementById('desktop-accordion');
  const backdrop = document.getElementById('sticky-backdrop');
  
  if (navbar && accordion && backdrop) {
    if (scrollTop > 100) {
      navbar.classList.add('sticky-navbar');
      accordion.classList.add('sticky-accordion');
      backdrop.classList.add('active');
    } else {
      navbar.classList.remove('sticky-navbar');
      accordion.classList.remove('sticky-accordion');
      backdrop.classList.remove('active');
    }
  }
  
  // Mobile
  const mobileNavbar = document.getElementById('mobile-navbar');
  const mobileBackdrop = document.getElementById('sticky-backdrop-mobile');
  
  if (mobileNavbar && mobileBackdrop) {
    if (scrollTop > 50) {
      mobileNavbar.classList.add('sticky-mobile-navbar');
      mobileBackdrop.classList.add('active');
    } else {
      mobileNavbar.classList.remove('sticky-mobile-navbar');
      mobileBackdrop.classList.remove('active');
    }
  }
});

