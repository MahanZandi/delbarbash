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
    dot.className = 'w-2 h-2 rounded-full transition-all duration-300'
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
      dot.className = 'w-8 h-2 rounded-full transition-all duration-300'
    } else {
      dot.style.backgroundColor = '#C5B2B3'
      dot.className = 'w-2 h-2 rounded-full cursor-pointer transition-all duration-300'
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
