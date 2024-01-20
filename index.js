const canvas = document.querySelector('.canvas')
const button = document.querySelector('.button')

const ctx = canvas.getContext('2d')
const centerX = canvas.width / 2
const centerY = canvas.height / 2
const radius = 200

// Количество секторов круга
const numberOfSectors = 6

// Количество попыток
let numberOfAttempts = 0

let rotation = 0
let animationFrameId = null

let isSpinning = false

// Изображения для canvas должны быть геометрически сектором круга (его 1 / numberOfSectors частью)
const items = [
    {
        id: 0,
        probability: 0.001,
        source: './images/symbol-1.svg',
        message: '1'
    },
    {
        id: 1,
        probability: 0.099,
        source: './images/symbol-2.svg',
        message: '2'
    },
    {
        id: 2,
        probability: 0.4,
        source: './images/symbol-3.svg',
        message: '3'
    },
    {
        id: 3,
        probability: 0.25,
        source: './images/symbol-4.svg',
        message: '4'
    },
    {
        id: 4,
        probability: 0.15,
        source: './images/symbol-5.svg',
        message: '5'
    },
    {
        id: 5,
        probability: 0.1,
        source: './images/symbol-6.svg',
        message: '6'
    }
]

const fixedResult = [items[5], items[4], items[3]]

const imagesLoaded = items.map(() => false)

const images = items.map((item, index) => {
    const image = new Image()
    image.src = item.source
    image.onload = () => {
        imagesLoaded[index] = true
        if (imagesLoaded.every(Boolean)) {
            draw()
        }
    }

    return image
})

const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation)

    const sectorAngle = (2 * Math.PI) / numberOfSectors

    for (let i = 0; i < numberOfSectors; i++) {
        ctx.save()

        const angle = i * sectorAngle + sectorAngle / 2

        ctx.rotate(angle)

        const scaleWidth = (2 * radius * Math.sin(sectorAngle / 2)) / images[i].width
        const scaleHeight = radius / images[i].height
        const scale = Math.min(scaleWidth, scaleHeight)

        const scaledWidth = images[i].width * scale
        const scaledHeight = images[i].height * scale

        ctx.drawImage(images[i], -scaledWidth / 2, -radius, scaledWidth, scaledHeight)

        ctx.restore()
    }

    ctx.restore()
}

const getSector = () => fixedResult[numberOfAttempts]

const getRandomSector = () => {
    let random = Math.random()
    let accumulatedProbability = 0

    for (let i = 0; i < items.length; i++) {
        accumulatedProbability += items[i].probability

        if (random <= accumulatedProbability) {
            return items[i]
        }
    }

    return items[items.length - 1]
}

const showAlert = (sector) => {
    alert(sector.message)
}

const spin = () => {
    if (isSpinning) return

    isSpinning = true

    const targetItem = numberOfAttempts < fixedResult.length ? getSector() : getRandomSector()

    console.log(targetItem)

    numberOfAttempts += 1

    const targetIndex = items.findIndex((item) => {
        return item === targetItem
    })

    console.log(targetIndex)

    const sectorAngle = (2 * Math.PI) / numberOfSectors

    const finalAngle = -targetIndex * sectorAngle - sectorAngle / 2

    const fullRotations = 4 * 2 * Math.PI

    const duration = 5000
    const start = performance.now()

    const animate = (time) => {
        let timeFraction = (time - start) / duration
        if (timeFraction > 1) timeFraction = 1

        const easeOutFraction = 1 - Math.pow(1 - timeFraction, 3)

        rotation = fullRotations * easeOutFraction + finalAngle * easeOutFraction

        if (timeFraction < 1) {
            requestAnimationFrame(animate)
        } else {
            reset()
            showAlert(items[targetIndex])
        }

        draw()
    }

    requestAnimationFrame(animate)
}

const update = () => {
    rotation += 0.05

    draw()

    animationFrameId = requestAnimationFrame(update)
}

const reset = () => {
    isSpinning = false

    rotation = 0

    draw()

    cancelAnimationFrame(animationFrameId)
}

button.addEventListener('click', () => spin())

let result = []

for (let i = 0; i < 100000; i++) {
    const sector = getRandomSector()

    const existing = result.find((item) => item.id === sector.id)

    if (existing) {
        const index = result.findIndex((item) => item === existing)

        result[index].quantity += 1
    } else {
        result.push({ id: sector.id, probability: sector.probability, quantity: 1 })
    }
}

console.log(result)
