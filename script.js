// app description: Correct each word in the text by click or select it, then type the correct word and press enter

let selection, rangeSelection

const content = document.querySelector('.content')
const form = document.querySelector('#form')
const input = document.querySelector('input')

function init() {
    let texts = content.innerHTML.split(' ').map(e => e.replace('\n', '').replace('<p>', '')).filter(text => text !== '')
    let html = ''

    texts.forEach(text => {
        html += `<span class="word">${text}</span> `
    })

    content.innerHTML = `<p>${html}</p>`
    console.log('initialized')
}

init()

function clearSelection() {
    selection = null
    rangeSelection = null

    const regexp = /<\/?(span|div|img...)\b[^<>]*>/g
    content.innerHTML = content.innerHTML.replace(regexp, "")

    console.log('selection cleared')
}

function getSelections() {
    // get selection
    selection = window.getSelection()

    // get selection text
    let text = selection.toString()

    // if selection text is not empty
    if (text.length > 0) {
        // selection.empty();

        // get index of selected text value
        let ranges = selection.getRangeAt(0).getBoundingClientRect();
        let rx = ranges.x, ry = ranges.y

        form.classList.add('show')
        form.style.top = (ry + 30) + 'px'
        form.style.left = rx + 'px'

        setTimeout(() => {
            // if element is out of screen, move it to the left
            let rect = form.getBoundingClientRect()

            if (rect.right >= window.innerWidth) {
                let out_value = rect.right - window.innerWidth
                form.style.left = rect.left - (out_value + 20) + 'px'
            }
        }, 120);

        // change selected text value
        // let newValue = '<span class="selected">' + text + '</span>'
        selection.deleteFromDocument()
        rangeSelection = selection.getRangeAt(0)
        // selection.getRangeAt(0).insertNode(document.createTextNode(newValue))

        let span = document.createElement('span')
        span.classList.add('selected')
        span.innerHTML = text

        // if selected contains b tag
        selection.getRangeAt(0).insertNode(span)

        // find input and set value
        let input = form.querySelector('input')
        input.value = selection.toString()
        input.focus()
    }
}

document.addEventListener('click', e => {
    if (e.target.classList.contains('word')) {
        // set range selection
        let range = document.createRange()
        range.selectNode(e.target)

        // set selection
        selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)

        getSelections()
    }
})



// mouse listener
document.addEventListener('mousedown', function (e) {
    if (form.classList.contains('show')) {
        clearSelection()
        init()
    }

    form.classList.remove('show')
})

document.addEventListener('mouseup', function (e) {
    getSelections()
})


// on enter
input.addEventListener('keypress', function (e) {
    let enters = ['Enter', 'NumpadEnter']

    if (enters.includes(e.code)) {
        // get input value
        let value = this.value

        let span = document.querySelector('.selected')
        span.textContent = value

        // change selected text value
        // let newValue = value
        // selection.deleteFromDocument()
        // rangeSelection.insertNode(document.createTextNode(newValue))

        // hide form
        form.classList.remove('show')
        clearSelection()
        init()
    }
})


