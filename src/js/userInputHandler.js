import { requestBook } from "./apiHandler";

const init = () => {
    let searchButton = document.querySelector("button#send-book");
    searchButton.addEventListener("click", handleInput);
}

const handleInput = (event) => {
    event.preventDefault();

    let book = document.querySelector("input#user-input");
    console.log(book.value);
    requestBook(book.value);
}

init();