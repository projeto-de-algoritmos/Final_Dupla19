import { mountRelatedBooksGraph, requestBook, requestRelatedBooks } from "./apiHandler";

const init = () => {
    let searchButton = document.querySelector("button#send-book");
    searchButton.addEventListener("click", handleInput);
}

const handleInput = async (event) =>{
    event.preventDefault();

    let book = document.querySelector("input#user-input");
    console.log(book.value);
    requestBook(book.value).then(transformedData => {
        requestRelatedBooks(transformedData).then(response => {
            mountRelatedBooksGraph(response).then(relatedGraph => {
                console.log(relatedGraph);
            })
        })
    })

}

init();