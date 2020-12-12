class Game {
    constructor(number) {
        this.number = number
        this.board = document.querySelector('.game__board')
        this.correctOptions = []
        this.buttons = document.querySelectorAll('.game__split')
        this.recordsButton = document.querySelector(".game__records")
        this.sourceImage = Slider.getImage()
        this.partsImage;
    }
    makeBoard() {
        for (let row = 0; row < this.number; row++) {
            for (let column = 0; column < this.number; column++) {
                let partOfImage = document.createElement('div')
                let styleObject = {
                    backgroundImage: column == this.number - 1 && row == this.number - 1 ? '' : `url(${this.sourceImage})`,
                    backgroundPosition: column == this.number - 1 && row == this.number - 1 ? '' : `${-(column * 500/this.number)}px ${-(row * 500/this.number)}px`,
                    height: `${500/this.number}px`,
                    width: `${500/this.number}px`,
                    top: `${(row * 500/this.number)}px`,
                    left: `${(column * 500/this.number)}px`,
                }
                for (let attr in styleObject) {
                    partOfImage.style[attr] = styleObject[attr]
                }
                let dataBase = {
                    row,
                    column
                }
                for (let attr in dataBase) {
                    partOfImage.dataset[attr] = dataBase[attr]
                }
                let className = column == this.number - 1 && row == this.number - 1 ? 'game__emptyPart' : 'game__partImage'

                partOfImage.setAttribute('class', className)

                this.board.append(partOfImage)
            }
        }


    }



    move = (e) => {
        let checking = new Checking(e)
        if (checking.getPermission()) {
            const empty = document.querySelector('.game__emptyPart')
            const picked = e.target ? e.target : e

            const emptyRow = parseInt(empty.dataset.row, 10)
            const emptyColumn = parseInt(empty.dataset.column, 10)
            const pickedRow = parseInt(picked.dataset.row, 10)
            const pickedColumn = parseInt(picked.dataset.column, 10)

            const pickedStyle = {
                top: `${(emptyRow * 500/this.number)}px`,
                left: `${(emptyColumn * 500/this.number)}px`
            }

            const emptyStyle = {
                top: `${(pickedRow * 500/this.number)}px`,
                left: `${(pickedColumn * 500/this.number)}px`
            }

            for (let attr in emptyStyle) {
                empty.style[attr] = emptyStyle[attr]
            }

            for (let attr in pickedStyle) {
                picked.style[attr] = pickedStyle[attr]
            }

            picked.dataset.row = emptyRow
            picked.dataset.column = emptyColumn

            empty.dataset.row = pickedRow
            empty.dataset.column = pickedColumn

            if (e.target) checking.win()
        }
    }

    giveMove = () => {
        this.partsImage = document.querySelectorAll('.game__partImage')
        this.partsImage.forEach(element => {
            element.addEventListener('click', this.move)
        })

    }
}
class Possibilities {
    constructor() {
        this.empty = document.querySelector('.game__emptyPart')
        this.row = parseInt(this.empty.dataset.row, 10)
        this.column = parseInt(this.empty.dataset.column, 10)
        this.possibilities = []
        this.number = Math.sqrt(document.querySelector('.game__board').childNodes.length)
    }

    get() {
        if (this.row == 0 || this.row == this.number - 1) {
            let addInRow = this.row == 0 ? 1 : -1
            if (this.column == 0 || this.column == this.number - 1) {
                let addInColumn = this.column == 0 ? 1 : -1
                this.possibilities.push(JSON.stringify({
                    row: this.row,
                    column: this.column + addInColumn
                }))
            } else {
                this.possibilities.push(JSON.stringify({
                        row: this.row,
                        column: this.column + 1
                    }),
                    JSON.stringify({
                        row: this.row,
                        column: this.column - 1
                    })
                )
            }
            this.possibilities.push(JSON.stringify({
                row: this.row + addInRow,
                column: this.column
            }))
        } else if (this.row !== 0 && this.row !== this.number - 1) {
            if (this.column == 0 || this.column == this.number - 1) {
                let addInColumn = this.column == 0 ? 1 : -1
                this.possibilities.push(JSON.stringify({
                    row: this.row,
                    column: this.column + addInColumn
                }))
            } else {
                this.possibilities.push(JSON.stringify({
                        row: this.row,
                        column: this.column + 1
                    }),
                    JSON.stringify({
                        row: this.row,
                        column: this.column - 1
                    })
                )
            }

            this.possibilities.push(JSON.stringify({
                    row: this.row - 1,
                    column: this.column
                }),
                JSON.stringify({
                    row: this.row + 1,
                    column: this.column
                })
            )
        }

        return this.possibilities
    }

}
class Checking {
    constructor(element) {
        this.move = false

        let possibilities = new Possibilities()
        this.possibilities = possibilities.get()
        this.clicked = element.target ? element.target : element
        this.position = JSON.stringify({
            row: parseInt(this.clicked.dataset.row, 10),
            column: parseInt(this.clicked.dataset.column, 10)
        })

        this.winning = []
        this.currentCombination = []

        this.parts = document.querySelector('.game__board').childNodes
        this.number = Math.sqrt(this.parts.length)
    }

    getPermission() {
        this.possibilities.forEach(element => {
            if (element == this.position) this.move = true
        })

        return this.move
    }

    win() {
        for (let i = 0; i < this.parts.length; i++) {
            this.winning.push(i)
        }
        for (let row = 0; row < this.number; row++) {
            for (let column = 0; column < this.number; column++) {
                let lookedtop = Math.floor(row * 500 / this.number)
                let lookedleft = Math.floor(column * 500 / this.number)

                this.parts.forEach((element, index) => {
                    if (parseInt(element.style.top) == lookedtop && parseInt(element.style.left) == lookedleft) {
                        this.currentCombination.push(index)

                    }
                })
            }
        }
        if (JSON.stringify(this.currentCombination) == JSON.stringify(this.winning)) {
            Stopper.stop()

            while (document.querySelector(".game__board").firstChild) {
                document.querySelector(".game__board").removeChild(document.querySelector(".game__board").firstChild);
            }

            let board = new Game(this.number)
            board.makeBoard()

            setTimeout(() => {
                let name = prompt(`Twój czas to ${Stopper.getResult()}. \nPodaj swóją nazwę i zapisz wynik: `)
                if (name) {
                    let newRecord = new Record(false, name)
                    newRecord.getRecords(true, name)
                    newRecord.make()
                }
            }, 200)

        }
    }
}
class Stopper {

    static startTime = new Date();
    static currentTime = 0
    static millieconds = 0
    static seconds = 0
    static minutes = 0
    static hours = 0
    static fullTime = ''
    static timer = document.querySelectorAll('.game__stoperNumber')
    static interval = 0
    static stopInterval = 0
    static inl = 0
    static seconds = 0

    static time() {

        Stopper.currentTime = new Date()
        const limitMilliseconds = 1000 - Stopper.startTime.getMilliseconds()

        Stopper.milliSeconds = Stopper.currentTime.getMilliseconds() >= Stopper.startTime.getMilliseconds() ? Stopper.currentTime.getMilliseconds() - Stopper.startTime.getMilliseconds() : Stopper.currentTime.getMilliseconds() + limitMilliseconds
        Stopper.seconds = Math.floor(((Stopper.currentTime - Stopper.startTime) % 60000) / 1000)
        Stopper.minutes = Math.floor((Stopper.currentTime - Stopper.startTime) / 60000)
        Stopper.hours = Math.floor((Stopper.currentTime - Stopper.startTime) / (1000 * 60 * 60) % 24)

        if (Stopper.milliSeconds < 100) {
            if (Stopper.milliSeconds < 10) {
                Stopper.milliSeconds = '00' + Stopper.milliSeconds
            } else {
                Stopper.milliSeconds = "0" + Stopper.milliSeconds
            }
        }
        Stopper.fullTime = `${Stopper.hours == 0 ? Stopper.hours = "0" + Stopper.hours : Stopper.hours}:${Stopper.minutes < 10 ? Stopper.minutes = '0' + Stopper.minutes : Stopper.minutes}:${Stopper.seconds < 10 ? Stopper.seconds = '0' + Stopper.seconds : Stopper.seconds}:${Stopper.milliSeconds}`

        Stopper.seconds = (Stopper.currentTime - Stopper.startTime)
        for (let i = Stopper.seconds.toString().length; i < 9; i++) {
            Stopper.seconds = '0' + Stopper.seconds.toString()
        }
        Stopper.timer.forEach((element, index) => {
            element.src = `./cyferki/c${Stopper.seconds[index]}.gif`
        })

    }

    static getNewStartTime() {
        Stopper.startTime = new Date()
    }

    static getResult() {
        return Stopper.fullTime
    }

    static getSeconds() {
        let seconds = Stopper.currentTime - Stopper.startTime
        return seconds
    }
    static start = () => {

        Stopper.getNewStartTime()
        Stopper.interval = setInterval(() => Stopper.time(), 1)
    }

    static stop = () => {
        clearInterval(Stopper.interval)
    }

    static reset() {
        Stopper.timer.forEach((element, index) => {
            element.src = `./cyferki/c0.gif`
        })
    }
}
class Mixin {
    static interval = 0
    static correctOptions = []

    static mix() {
        let partImages = document.querySelectorAll('.game__partImage')
        let possibilities = new Possibilities()
        Mixin.correctOptions = possibilities.get()
        let random = Math.round(Math.random() * Mixin.correctOptions.length)
        partImages.forEach(element => {
            const position = JSON.stringify({
                row: parseInt(element.dataset.row, 10),
                column: parseInt(element.dataset.column, 10)
            })
            if (position == this.correctOptions[random]) {
                let game = new Game(Math.sqrt(partImages.length + 1))
                game.move(element, true)
            }
        })

    }

    static start = () => {
        Mixin.interval = setInterval(() => Mixin.mix(), 2)
    }

    static stop = () => {
        clearInterval(Mixin.interval)
    }
}
class Record {
    constructor(mode, name) {
        this.result = Stopper.getResult()
        this.seconds = Stopper.getSeconds()
        this.records = document.cookie.split(';')
        this.id = this.records[0] == '' ? 0 : this.records.length
        this.date = new Date
        this.name = name
        this.mode = mode ? mode : Math.sqrt(document.querySelector('.game__board').childNodes.length)
        this.modeTable = []
    }
    make() {
        this.date.setTime(this.date.getTime() + (2 * 24 * 60 * 60 * 1000));
        let length = this.modeTable.length >= 10 ? 10 : this.modeTable.length
        for (let i = 0; i < length; i++) {
            document.cookie = `${i + 10 * (this.mode - 3)}=${this.modeTable[i].result}%Time=${this.modeTable[i].seconds}%Mode=${this.modeTable[i].mode}%Name=${this.modeTable[i].name};${this.date};path=/`;
        }
    }

    getRecords(withNewRecord) {
        let tempTable = []
        let tempTableSecond = []
        this.records.forEach(element => {
            tempTable.push(element.split('%'))
        })
        if (tempTable[0] != '') {
            tempTable.forEach((element) => {
                if (element[2].split('=')[1] == this.mode) {
                    let tempObject = {
                        id: element[0].split('=')[0],
                        result: element[0].split('=')[1],
                        seconds: element[1].split('=')[1],
                        mode: element[2].split('=')[1],
                        name: element[3].split('=')[1]
                    }
                    tempTableSecond.push(tempObject)
                }
            })
        }
        if (withNewRecord) {
            tempTableSecond.push({
                id: this.id,
                result: this.result,
                seconds: this.seconds,
                mode: this.mode,
                name: this.name
            })
        }
        this.modeTable = tempTableSecond.sort(function (a, b) {
            return parseInt(a.seconds) - parseInt(b.seconds)
        })

        return this.modeTable

    }
}
class Buttons {
    constructor() {
        this.board = document.querySelector('.game__board')
        this.modeButtons = document.querySelectorAll('.game__split')
        this.recordsButton = document.querySelector(".game__records")
        this.recordsButton.dataset.mode = "game"
    }

    game = (e) => {

        let clicked = e.target

        if (clicked.dataset.mode == 'on' && this.recordsButton.dataset.mode == "game") {
            Stopper.stop()
            Mixin.stop()
            Stopper.reset()

            while (this.board.firstChild) {
                this.board.removeChild(this.board.firstChild);
            }

            let number = clicked.dataset.number
            let board = new Game(number)
            if (clicked.dataset.choosen !== 'true' && clicked.dataset.mode == 'on') {
                this.modeButtons.forEach(element => element.dataset.choosen = 'false')
                clicked.dataset.choosen = 'true'
            }

            this.modeButtons.forEach(element => {
                element.dataset.mode = 'off'
                if (element.dataset.choosen == 'true') element.style.backgroundColor = '#338033'
                else element.style.backgroundColor = 'transparent'
            })


            board.makeBoard()
            board.giveMove()
            Mixin.start()

            setTimeout(() => Mixin.stop(), 400 * clicked.dataset.number)
            setTimeout(() => {
                Stopper.start()
                board.buttons.forEach(element => {
                    element.dataset.mode = 'on'
                })
            }, 400 * clicked.dataset.number)


        } else if (clicked.dataset.mode == 'on' && this.recordsButton.dataset.mode == "records") {

            while (this.board.firstChild) {
                this.board.removeChild(this.board.firstChild);
            }


            let number = clicked.dataset.number


            if (clicked.dataset.choosen !== 'true' && clicked.dataset.mode == 'on') {
                this.modeButtons.forEach(element => element.dataset.choosen = 'false')
                clicked.dataset.choosen = 'true'
            }
            this.modeButtons.forEach(element => {
                if (element.dataset.choosen == 'true') element.style.backgroundColor = '#338033'
                else element.style.backgroundColor = 'transparent'
            })

            let table = document.createElement('table')
            table.setAttribute('class', "game__table")
            let records = new Record(number).getRecords(false)

            records.forEach(element => {
                let tr = document.createElement('tr')
                let idTh = document.createElement('th')
                let nameTh = document.createElement('th')
                let resultTh = document.createElement('th')
                idTh.innerHTML = parseInt(element.id) > 9 ? `Nr. ${(parseInt(element.id) + 1) - (number - 3) * 10}` : `Nr. ${(parseInt(element.id) + 1)}`
                resultTh.innerHTML = element.result
                nameTh.innerHTML = element.name
                tr.append(idTh)
                tr.append(nameTh)
                tr.append(resultTh)
                table.append(tr.cloneNode(true))
            })

            for (let i = records.length + 1; i <= 10; i++) {
                let tr = document.createElement('tr')
                let idTh = document.createElement('th')
                let nameTh = document.createElement('th')
                let resultTh = document.createElement('th')
                idTh.innerHTML = `Nr. ${i}`
                tr.append(idTh)
                tr.append(nameTh)
                tr.append(resultTh)
                table.append(tr.cloneNode(true))
            }


            this.board.append(table)
        }
    }



    showRecords = (e) => {
        let number = 3
        let mixining = 'on'
        Stopper.reset()

        this.modeButtons.forEach(element => {
            if (element.dataset.choosen == "true") {
                number = parseInt(element.dataset.number)
            }
            mixining = element.dataset.mode
        })

        if (this.recordsButton.dataset.mode == 'game' && mixining == 'on') {
            this.recordsButton.dataset.mode = "records"
            Stopper.stop()

            this.recordsButton.innerHTML = "WRÓĆ DO GRANIA"

            let node = document.querySelector(".game__board")
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }

            let table = document.createElement('table')
            table.setAttribute('class', "game__table")
            let records = new Record(number).getRecords(false)
            records.forEach(element => {
                let tr = document.createElement('tr')
                let idTh = document.createElement('th')
                let nameTh = document.createElement('th')
                let resultTh = document.createElement('th')
                idTh.innerHTML = parseInt(element.id) > 9 ? `Nr. ${(parseInt(element.id) + 1) - (number - 3) * 10}` : `Nr. ${(parseInt(element.id) + 1)}`
                resultTh.innerHTML = element.result
                nameTh.innerHTML = element.name
                tr.append(idTh)
                tr.append(nameTh)
                tr.append(resultTh)
                table.append(tr.cloneNode(true))
            })

            for (let i = records.length + 1; i <= 10; i++) {
                let tr = document.createElement('tr')
                let idTh = document.createElement('th')
                let nameTh = document.createElement('th')
                let resultTh = document.createElement('th')
                idTh.innerHTML = `Nr. ${i}`
                tr.append(idTh)
                tr.append(nameTh)
                tr.append(resultTh)
                table.append(tr.cloneNode(true))
            }

            this.board.append(table)

        } else if (this.recordsButton.dataset.mode == 'records') {
            this.recordsButton.innerHTML = 'ZOBACZ REKORDY'
            this.recordsButton.dataset.mode = "game"
            while (this.board.firstChild) {
                this.board.removeChild(this.board.firstChild);
            }

            this.modeButtons.forEach(element => {
                element.dataset.choosen = 'false'
                element.style.backgroundColor = 'transparent'
            })
        }
    }

    configButtons() {
        this.recordsButton.addEventListener('click', this.showRecords)
        this.modeButtons.forEach((element, index) => {
            element.dataset.number = index + 3
            element.dataset.mode = 'on'
            element.dataset.choosen = 'false'
            element.addEventListener('click', this.game)
        })

    }
}
class Slider {
    static window = document.querySelector(".game__window")
    static buttons = document.querySelectorAll(".game__sliderButton")
    static position = 0
    static interval = 0
    static constant = document.querySelector(".game__window").offsetHeight
    static slide = (e) => {
        Slider.constant
        let clicked = e.target
        if (clicked.dataset.move == 'front' && clicked.dataset.mode == 'on') {
            clicked.dataset.mode = 'false'
            if (Slider.position == Slider.constant * 3) {
                Slider.position = 0
            }
            Slider.interval = setInterval(() => {
                Slider.window.scrollLeft = Slider.position + 2
                Slider.position = Slider.position + 2
                if (Slider.position % Slider.constant == 0) {
                    clearInterval(Slider.interval)
                    clicked.dataset.mode = 'on'
                }
            }, 5)
        } else if (clicked.dataset.move == 'back' && clicked.dataset.mode == 'on') {
            clicked.dataset.mode = 'false'
            if (Slider.position == 0) {
                Slider.position = Slider.constant * 3
            }
            Slider.interval = setInterval(() => {
                Slider.window.scrollLeft = Slider.position - 2
                Slider.position = Slider.position - 2
                if (Slider.position % Slider.constant == 0) {
                    clearInterval(Slider.interval)
                    clicked.dataset.mode = 'on'
                }
            }, 5)
        }

        Slider.getImage()
    }

    static sliderButtonsListeners() {
        Slider.buttons.forEach((element, index) => {
            let data = index == 0 ? 'back' : 'front'
            element.dataset.mode = 'on'
            element.dataset.move = data
            element.addEventListener('click', Slider.slide)
        })
    }

    static getImage() {
        let number = Slider.position / Slider.constant
        let src;
        document.querySelectorAll('.game__image').forEach((element, index) => {
            if (number == index) {
                src = element.src
            }
        })
        return src
    }

}


let buttons = new Buttons()
buttons.configButtons()
Slider.sliderButtonsListeners()