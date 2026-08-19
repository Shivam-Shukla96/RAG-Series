import ollama  from './client.js';

async function webSearch(query, numResults = 3){
    const result = await ollama.webSearch({
        query, 
        num : numResults, 
        sort : 'relevance', 
        time : '1d', 
        safe : 'active', 
        lang : 'en'
    })

    return result.results.map(r=> {
        return {title : r.title, url : r.url, snippet : r.snippet}
    })
}

async function getContext(query) {
    const sources = await webSearch(query, 3)

    let context = ""

    for (const src of sources) {
        context += `Title : ${src.title}\n`
        context += `URL : ${src.url}\n`
        context += `Snippet : ${src.snippet}\n\n`
    }

    return context
}

export { getContext }