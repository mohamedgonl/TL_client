var LogUtils =  LogUtils || {}

LogUtils.tick = 0;
LogUtils. generateFileName = function () {
    const currentDate = new Date();

    const seconds = currentDate.getSeconds();
    const minutes = currentDate.getMinutes();
    const hours = currentDate.getHours();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = currentDate.getFullYear();

    // Tạo chuỗi theo định dạng "giây-phút-giờ-ngày-tháng-năm.txt"
    const formattedDateTimeString = seconds+"-"+minutes + "-" +hours+"-"+ day + "-" + month + "-" + year+".txt";

    return formattedDateTimeString;
}

LogUtils.writeLog = function (message) {
    const logFilePath = './logs/' + LogUtils.generateFileName();

    try {
        jsb.fileUtils.readF
        jsb.fileUtils.writeStringToFile(message, logFilePath);

    } catch (error) {
        cc.log("WRITE FILE ERROR: " + error);
    }
}
