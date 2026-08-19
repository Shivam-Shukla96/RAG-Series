
async function printResponse(response) {

    let inThinking = false
    let content = ''
    let thinking = ''

    for await (const part of response) {

        if (part.message.thinking) {
            if (!inThinking) {
                inThinking = true
                process.stdout.write('Thinking:\n')
            }
            process.stdout.write(part.message.thinking)

            thinking += part.message.thinking
        }
        else if (part.message.content) {
            if (inThinking) {
                inThinking = false
                process.stdout.write('\n\nAnswer:\n')
            }
            process.stdout.write(part.message.content);
            content += part.message.content
        }
    }
}

export { printResponse, thinkingAndAnswerStream }



