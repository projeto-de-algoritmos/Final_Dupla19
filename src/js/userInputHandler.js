import { mountRelatedBooksGraph, requestBook, requestRelatedBooks } from "./apiHandler";
import Graph from "./graph";

let container = document.querySelector('div.content');

const init = () => {
    let searchButton = document.querySelector("button#send-book");
    searchButton.addEventListener("click", handleInput);
}

const handleInput = async (event) =>{
    event.preventDefault();
    let title = '<h1>Livros recomendados:</h1>';
    container.innerHTML = title;

    let book = document.querySelector("input#user-input");
    requestBook(book.value).then(transformedData => {
        requestRelatedBooks(transformedData).then(response => {
            mountRelatedBooksGraph(response).then(relatedGraph => {
                console.log(relatedGraph);
                let graph = new Graph(relatedGraph.length);
                for (let i = 0; i < relatedGraph.length; i++){
                    let node = relatedGraph[i].label;
                    graph.addNode(node);
                }

                for (let i = 0; i < relatedGraph.length; i++){
                    let node = relatedGraph[i].label;
                    for (let j = 0; j < relatedGraph[i].adjacencyList.length; j++){
                        let relatedNode = relatedGraph[i].adjacencyList[j].label;
                        let weight = relatedGraph[i].adjacencyList[j].weight;
                        graph.addEdge(node, relatedNode, weight);
                    }
                }
                graph.primMST();

                graph.computeMaximumWeight();
                let cluster = graph.cluster;

                renderRecommendations(graph.cluster, relatedGraph);
                for (let i = 0; i < relatedGraph[cluster].adjacencyList.length; i++){
                    renderRecommendations(relatedGraph[cluster].adjacencyList[i].label, relatedGraph);
                }
            });
        });
    });

}

const renderRecommendations = (bookIndex, fullGraph) => {
    let subtitle = `<h2>${fullGraph[bookIndex].title}</h2>`;
    let author_name = `<h3>${fullGraph[bookIndex].author_name}</h3>`;
    let cover = `<img src='http://covers.openlibrary.org/b/isbn/${fullGraph[bookIndex].isbn[0]}-M.jpg'>`;
    container.innerHTML += subtitle + author_name + cover;
}

init();