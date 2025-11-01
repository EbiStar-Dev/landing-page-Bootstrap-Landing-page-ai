document.querySelectorAll('.slider-container').forEach(container => {
    const slider = container.querySelector('.slider');
    const cards = slider.querySelectorAll('.card');
    const totalCards = cards.length;

    // خواندن تنظیمات از HTML
function getVisibleCards(defaultCards) {
  if (window.innerWidth < 576) {
    return 1; // موبایل کوچک
  } else if (window.innerWidth < 768) {
    return 2; // موبایل بزرگ
  } else if (window.innerWidth < 992) {
    return 3; // تبلت
  }
  return defaultCards; // دسکتاپ
}
const visibleCards = getVisibleCards(parseInt(container.dataset.cardsVisible) || 7);

const speed = parseInt(container.dataset.speed) || 3000;

    let currentIndex = Math.floor(visibleCards / 2); // مرکز

    // ساخت موقعیت‌ها بر اساس تعداد قابل نمایش
    const positions = [];
    const scaleStep = 0.15;
    const moveStep = 150;

    for (let i = 0; i < visibleCards; i++) {
        let dist = i - Math.floor(visibleCards / 2);
        let scale = 1 - Math.abs(dist) * scaleStep;
        let opacity = 1 - Math.abs(dist) * 0.1;
        let z = visibleCards - Math.abs(dist);
        positions.push({
            class: `pos-${i}`,
            transform: `translateX(${dist * moveStep}px) scale(${scale})`,
            opacity,
            zIndex: z
        });
    }

    // افزودن CSS داینامیک برای این اسلایدر
    const style = document.createElement('style');
    positions.forEach(pos => {
        style.innerHTML += `
        #${container.id} .${pos.class} {
            transform: ${pos.transform};
            opacity: ${pos.opacity};
            z-index: ${pos.zIndex};
        }
        `;
    });
    document.head.appendChild(style);

    // ساخت کنترل‌ها (prev + dots + next)
    const controls = document.createElement("div");
    controls.className = "slider-controls";

    const prevBtn = document.createElement("button");
    const nextBtn = document.createElement("button");
    prevBtn.className = "slider-prev";
    nextBtn.className = "slider-next";
prevBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
    stroke-linejoin="round" class="lucide lucide-chevron-right">
    <path d="m9 18 6-6-6-6"/>
</svg>`;

nextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" 
    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
    stroke-linejoin="round" class="lucide lucide-chevron-left">
    <path d="m15 18-6-6 6-6"/>
</svg>`;


    const dotsContainer = document.createElement("div");
    dotsContainer.className = "slider-dots";

    for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement("span");
        dot.className = "slider-dot";
        dot.dataset.index = i;
        dotsContainer.appendChild(dot);

        dot.addEventListener("click", () => {
            currentIndex = i;
            updateSlider();
        });
    }

    // چینش دکمه‌ها و نقطه‌ها
    controls.appendChild(prevBtn);
    controls.appendChild(dotsContainer);
    controls.appendChild(nextBtn);
    container.appendChild(controls);

    function updateSlider() {
        cards.forEach((card, index) => {
            card.className = 'card';
            let offset = (index - currentIndex + totalCards) % totalCards;
            let posIndex = offset < 0 ? offset + totalCards : offset;
            card.classList.add(positions[posIndex] ? positions[posIndex].class : positions[0].class);
        });

        // بروزرسانی نقطه‌ها
        dotsContainer.querySelectorAll(".slider-dot").forEach((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        });
    }

    function slideNext() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateSlider();
    }

    function slidePrev() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateSlider();
    }

    nextBtn.addEventListener("click", slideNext);
    prevBtn.addEventListener("click", slidePrev);

    updateSlider();
    let autoSlide = setInterval(slideNext, speed);

    container.addEventListener('mouseenter', () => clearInterval(autoSlide));
    container.addEventListener('mouseleave', () => autoSlide = setInterval(slideNext, speed));
});
