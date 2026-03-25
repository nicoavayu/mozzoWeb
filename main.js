const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => observer.observe(element));
}
