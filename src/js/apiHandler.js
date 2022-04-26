const requestBook = async (bookName) => {
    return new Promise((resolve, reject) => {
        let term = bookName.split(' ').join('+');
        const url = `http://openlibrary.org/search.json?title=${term}`;

        try {
            fetch(url).then(async data => {
                resolve(data.json());

            });
        } catch (error) {
            alert('Erro interno, por favor tente novamente mais tarde');
            reject(error);
        }
    })
}

const requestRelatedBooks = async (data) => {
    return new Promise((resolve, reject) => {

        let term = 'Acessible book';
        let subjectsToAvoid = ['Acessible book', 'Protected DAISY'];

        for (let i = 0; i < data.docs.length; i++) {
            if ('subject' in data.docs[i]) {
                for (let j = 0; j < data.docs[i].subject.length; j++) {
                    let currTerm = data.docs[i].subject[j];
                    if (!subjectsToAvoid.includes(currTerm)) {
                        term = currTerm;
                        break;
                    }
                }
            }

            if (!subjectsToAvoid.includes(term))
                break;
        }

        const url = `http://openlibrary.org/search.json?subject=${term}`;

        try {
            fetch(url).then(data => data.json()).then(async response => {
                resolve(response);
            });
        } catch (error) {
            alert('Erro interno, por favor tente novamente mais tarde');
            reject(error);
        }
    });
}

const mountRelatedBooksGraph = async (data) => {
    return new Promise((resolve, reject) => {

        console.log(data);
        let relatedGraph = [];
        let booksQtt = data.docs.length;
    
        for (let curr = 0; curr < booksQtt; curr++) {
            console.log(`Externo: ${data.docs.length}`);
            let currNode = data.docs.shift();
            currNode.label = curr;
    
            if (!('adjacencyList' in currNode))
                currNode.adjacencyList = [];
    
            let relatedLabel = curr + 1;
            for (let i = 0; i < data.docs.length; i++) {
                let relatedNodeContent = data.docs[i];
                let relatedNode = { label: relatedLabel, weight: 0 };
    
                relatedNode.weight += publishYearWeight(currNode.first_publish_year, relatedNodeContent.first_publish_year);
                relatedNode.weight += languageWeight(currNode.language || [], relatedNodeContent.language || []);
                relatedNode.weight += authorNameWeight(currNode.author_name || [], relatedNodeContent.author_name || []);
                relatedNode.weight += subjectWeight(currNode.subject || [], relatedNodeContent.subject || []);
    
                currNode.adjacencyList.push(relatedNode);
                data.docs[i].adjacencyList = [];
                data.docs[i].adjacencyList.push({ label: currNode.label, weight: relatedNode.weight });
                console.log(data.docs[i].adjacencyList);
                relatedLabel++;
            }
            relatedGraph.push(currNode);
        }
        resolve(relatedGraph);
    });
}

const publishYearWeight = (bookYear, yearToCompare) => {
    let difference = Math.abs(bookYear - yearToCompare);
    if (difference <= 10)
        return 8;
    else if (difference <= 20)
        return 5;
    else if (difference <= 30)
        return 3;
    else
        return 1;
}

const languageWeight = (bookLanguages, languagesToCompare) => {
    return countSimilarity(bookLanguages, languagesToCompare);
}

const authorNameWeight = (bookAuthors, authorToCompare) => {
    return (3 * countSimilarity(bookAuthors, authorToCompare));
}

const subjectWeight = (bookSubjects, subjectsToCompare) => {
    return (2 * countSimilarity(bookSubjects, subjectsToCompare));
}

const countSimilarity = (arrayA, arrayB) => {
    let result = arrayA.filter((elem) => arrayB.includes(elem));
    return result.length;
}

export { requestBook, requestRelatedBooks, mountRelatedBooksGraph };