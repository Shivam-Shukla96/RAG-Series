
function buildMessage(query, context) {

    const prompt = `You are an AI assistant. Use the context below to answer the question.
    Context: ${context}
    Question: ${query}
    If the answer is not in the context, say "I don't know".`;

    return [
        { role: 'system', content: prompt },
        { role: 'user', content: query }
    ]
}

export { buildMessage }