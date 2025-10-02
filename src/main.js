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

// Initialize product selection
document.addEventListener('DOMContentLoaded', function() {
  renderColorOptions()
  
  // Quantity buttons
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

// Initialize accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderAccordionItems();
});
