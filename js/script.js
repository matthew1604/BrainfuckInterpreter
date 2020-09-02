const table = document.getElementById('table-output')
const runBtn = document.getElementById('run-btn')
const input_type_select = document.getElementById('input-type')
const output_type_select = document.getElementById('output-type')
const zeroBtn = document.getElementById('zero-btn')
const delay = document.getElementById('delay')
const label = document.getElementById('label')
const label_numCell = document.getElementById('cell-nb')
const label_value = document.getElementById('label-value')
const tr_output_row = document.createElement('tr')
let timeOutLabel

function showLabel(event) {
    clearTimeout(timeOutLabel)
    timeOutLabel = setTimeout( () => {
        label.style.display = 'block'
        label.style.top = event.clientY + 10 + 'px'
        label.style.left = event.clientX + 10 + 'px'
        label_numCell.innerText = this.cell
        label_value.innerText = BrainfuckInterpreter.fromCharCode(this.td.innerText)
    }, 500)
}

function hideLabel() {
    clearTimeout(timeOutLabel)
    label.style.display = 'none'
}

const tds = []
for (let i = 0; i < 1000; i++) {
    tds[i] = document.createElement('td')
    tds.id = 'td_' + i
    tds[i].innerText = '0'
    tds[i].addEventListener('mouseenter', showLabel.bind({cell: i, td: tds[i]}))
    tds[i].addEventListener('mouseout', hideLabel)
    tr_output_row.appendChild(tds[i])
}

table.appendChild(tr_output_row)

const interpreter = new BrainfuckInterpreter(tds)
runBtn.addEventListener('click', interpreter.interpret.bind(interpreter))
input_type_select.addEventListener('change', interpreter.setInputType.bind(interpreter))
output_type_select.addEventListener('change', interpreter.setOutputType.bind(interpreter))
zeroBtn.addEventListener('click', interpreter.zero.bind(interpreter))
delay.addEventListener('change', interpreter.setDelay.bind(interpreter))