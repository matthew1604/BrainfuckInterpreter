class BrainfuckInterpreter {
    constructor(tds) {
        this.memory = tds
        this.currentIndex = 0
        this.changesIndex = {}
        this.setCurrentIndex(0)
        this.input = document.getElementById('input')
        this.output = document.getElementById('output')
        this.input_type = 0
        this.output_type = 0
        this.delay = 2
        this.current_input_type = 0
        this.current_output_type = 0
        this.input_program = document.getElementById('input-program')
        this.pointer_program = 0
        this.listLoop = []
        this.pointer_input_program = 0
    }

    interpret() {
        this.zero()
        const inputValue = this.input.value
        const program = inputValue.replace(/[^+-.,<>\[\]]/g, '')

        let char
        this.interval = setInterval( () => {
            char = program.charAt(this.pointer_program)
            this.doCommand(char)
            if (++this.pointer_program >= program.length) clearInterval(this.interval)
        }, this.delay)
    }

    doCommand(char) {
        let currentCell = this.memory[this.currentIndex]
        let currentValue = parseInt(currentCell.innerText)

        switch (char) {
            case '+':
                this.setVal(currentCell, currentValue + 1)
                break
            case '-':
                this.setVal(currentCell, currentValue - 1)
                break
            case '.':
                this.print(currentValue)
                break
            case ',':
                this.setVal(currentCell, this.read())
                break
            case '<':
                this.setCurrentIndex(this.currentIndex - 1)
                break
            case '>':
                this.setCurrentIndex(this.currentIndex + 1)
                break
            case '[':
                this.listLoop.push(this.pointer_program)
                break
            case ']':
                if (currentValue !== 0)
                    this.pointer_program = this.listLoop[this.listLoop.length - 1]
                else this.listLoop.pop()
                break
            default: break
        }
    }

    setVal(cell, val) {
        if (isNaN(val)) val = 0
        else while (val < 0) val += 256
        val %= 256
        cell.innerText = val.toString()
        this.changesIndex[this.currentIndex] = val !== 0
    }

    readWord() {
        let readChar = this.input_program.value.charAt(this.pointer_input_program++)
        let res = ''
        while (!isNaN(readChar.charCodeAt(0)) && readChar.charCodeAt(0) !== 32) {
            res += readChar
            readChar = this.input_program.value.charAt(this.pointer_input_program++)
        }
        return res.trim()
    }

    read() {
        let val
        switch(this.current_input_type) {
            case 0:
                val = this.input_program.value.charCodeAt(this.pointer_input_program++)
                break
            case 1:
                val = parseInt(this.readWord(), 10)
                break
            case 2:
                val = parseInt(this.readWord(), 2)
                break
            case 3:
                val = parseInt(this.readWord(), 16)
                break
            case 4:
                val = parseInt(this.readWord(), 8)
                break
            default: break
        }

        return val
    }

    setCurrentIndex(i) {
        if (i < 0) i = 0
        else if (i >= this.memory.length) i = this.memory.length - 1 

        this.memory[this.currentIndex].style.backgroundColor = 'cornsilk'
        this.currentIndex = i
        this.memory[i].style.backgroundColor = 'lightskyblue'
    }

    print(val) {
        switch (this.current_output_type) {
            case 0:
                val = String.fromCharCode(val)
                break
            case 1:
                val = val.toString(10)
                while (val.length < 3) val = '0' + val
                val += ' '
                break
            case 2:
                val = val.toString(2)
                while (val.length < 8) val = '0' + val
                val += ' '
                break
            case 3:
                val = val.toString(16)
                if (val.length < 2) val = '0' + val
                val += ' '
                break
            case 4:
                val = val.toString(8)
                while (val.length < 3) val = '0' + val
                val += ' '
                break
            default : break
        }
        this.output.value += val
    }

    setInputType(event) {
        this.input_type = parseInt(event.currentTarget.value)
    }

    setOutputType(event) {
        this.output_type = parseInt(event.currentTarget.value)
    }

    setDelay(event) {
        this.delay = parseInt(event.currentTarget.value)
    }

    zero() {
        clearInterval(this.interval)
        this.output.value = ''
        for (let i in this.changesIndex) {
            if (this.changesIndex[i])
                this.memory[i].innerText = '0'
        }
        this.changesIndex = {}
        this.pointer_program = 0
        this.listLoop = []
        this.pointer_input_program = 0
        this.current_input_type = this.input_type
        this.current_output_type = this.output_type
        this.setCurrentIndex(0)
    }

    static fromCharCode(nb) {
        if (nb <= 31 || nb == 127) return '\\' + nb
        if (nb == 10) return '\\n'
        return String.fromCharCode(nb)
    }

}