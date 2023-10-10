
var NumberUltis = NumberUltis ||  {}

NumberUltis.formatNumberTo4Digits= function (number) {
    if (typeof number !== 'number' || number < 0 || number >= 10000) {
        return "Invalid Input";
    }

    let numberString = number.toString();

    while (numberString.length < 4) {
        numberString = "0" + numberString;
    }

    return numberString;
}