const sliders = document.querySelectorAll(".anim-in");

const appearOptions = {
    threshold: 0,
    rootMargin: "0px 0px -50px 0px"
  };
  
const appearOnScroll = new IntersectionObserver(function(
entries,
appearOnScroll
) {
entries.forEach(entry => {
    if (!entry.isIntersecting) {
    return;
    } else {
    entry.target.classList.add("start");
    appearOnScroll.unobserve(entry.target);
    }
});
},
appearOptions);

setTimeout(() => {
  sliders.forEach(slider => {
  appearOnScroll.observe(slider);
  });
}, 300)