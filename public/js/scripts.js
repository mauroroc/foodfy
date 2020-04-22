//Menu Ativo
const currentPage = location.pathname;
const menuItems = document.querySelectorAll("header .links a");

for (item of menuItems) {
    if (currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active");
    }
}

function changePhoto(event) {
    document.querySelector('#mainPhoto').src = event.target.src;
};