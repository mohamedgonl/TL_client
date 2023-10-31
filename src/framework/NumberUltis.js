var NumberUltis = NumberUltis || {}

NumberUltis.formatNumberTo4Digits = function (number) {
    if (typeof number !== 'number' || number < 0 || number >= 10000) {
        return "Invalid Input";
    }

    let numberString = number.toString();

    while (numberString.length < 4) {
        numberString = "0" + numberString;
    }

    return numberString;
}

NumberUltis.formatSecondToString = function (sec) {
    if (typeof sec !== 'number' || sec >= 10000) {
        return "Invalid Input";
    }

    if (sec < 0)
        return '0s';

    const minutes = Math.floor(sec / 60);
    const seconds = sec - minutes * 60;

    let res = '';
    if (minutes > 0)
        res += minutes.toString() + 'm';
    res += seconds.toString() + 's';

    return res;
}