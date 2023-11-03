/**
 * Created by KienVN on 5/28/2015.
 */

fr.toMoneyString = function(num)
{
    var isNegative = false;
    var formattedNumber = num;
    if(num < 0){
        isNegative = true;
    }
    num = Math.abs(num);
    var hau_to;
    if(num >= 1000000000){
        hau_to = 'G';
        formattedNumber = (num/1000000000).toFixed(3);
    } else if (num >= 1000000){
        hau_to = 'M';
        formattedNumber = (num/1000000).toFixed(3);
    } else if (num >= 1000){
        hau_to = 'K';
        formattedNumber = (num/1000).toFixed(3);
    }else
    {
        formattedNumber = num.toString();
    }

    formattedNumber = formattedNumber.replace('.000',hau_to).replace('.00',hau_to).replace('.0',hau_to);
    var indexOfDot = formattedNumber.indexOf('.');
    if(indexOfDot > 0)
    {
        var buff = formattedNumber.substring(indexOfDot + 1);
        if(buff[2] == '0')
        {
            buff = buff.replace(/0/g,'');
            formattedNumber = formattedNumber.substring(0,indexOfDot+1) + buff + hau_to;
        }
        else{
            formattedNumber = formattedNumber.replace('.',hau_to).replace(/00$/,'').replace(/0$/,'');
        }
    }
    if(isNegative)
    {
        formattedNumber = '-' + formattedNumber;
    }
    return formattedNumber;
};

fr.toGameTimeString = function (seconds) {
    if (seconds < 60) {
        return seconds + "s";
    } else if (seconds < 3600) {
        let minutes = Math.floor(seconds / 60);
        let remainingSeconds = seconds % 60;
        return minutes + "m" + remainingSeconds + "s";
    } else if (seconds < 86400) {
        let hours = Math.floor(seconds / 3600);
        let remainingMinutes = Math.floor((seconds % 3600) / 60);
        return hours + "h" + remainingMinutes + "m";
    } else {
        let days = Math.floor(seconds / 86400);
        let remainingHours = Math.floor((seconds % 86400) / 3600);
        return days + "d" + remainingHours + "h";
    }
}

fr.getTimeDifferenceString = function (x, y) {
    const secondsDifference = Math.abs(x - y);

    const days = Math.floor(secondsDifference / (60 * 60 * 24));
    const hours = Math.floor((secondsDifference % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((secondsDifference % (60 * 60)) / 60);
    const seconds = secondsDifference % 60;

    let result = '';

    if (days > 0) {
        result += days + "d";
    }
    if (hours > 0) {
        result += hours + "h";
    }
    if (minutes > 0) {
        result += minutes + "m";
    }
    if (seconds > 0) {
        result += seconds + "s";
    }

    return result;
}