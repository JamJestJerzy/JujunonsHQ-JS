function order(number) {
    if (number === 1) return `${number}st`
    if (number === 2) return `${number}nd`
    if (number === 3) return `${number}rd`
    if (number > 3) return `${number}th`
    return 'wtf?'
}

module.exports = { order }