let innerCursor = document.querySelector(".inner-cursor");

document.addEventListener("mousemove", moveCursor);

function moveCursor(e) {
  let x = e.clientX;
  let y = e.clientY;

    innerCursor.style.left = x + "px";
    innerCursor.style.top = y + "px";
//   innerCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
//   outerCursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
}

document.addEventListener("click", (e) => {
    innerCursor.classList.add("grow");
    
    setTimeout(() => {
        innerCursor.classList.remove("grow");
    }, 100);
    });

let links = Array.from(document.querySelectorAll("a"));

links.forEach((link) => {
  link.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  link.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});