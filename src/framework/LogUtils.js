var LogUtils =  LogUtils || {}

LogUtils.tick = 0;
LogUtils.fileName = "";
LogUtils.logContent = "";
LogUtils.fileCount = 0;

LogUtils.reset = function () {
    LogUtils.tick = 0;
    LogUtils.fileName =  "";
    LogUtils.logContent = "";
}

LogUtils.generateFileName = function () {
    LogUtils.fileCount ++;
    const currentDate = new Date();
    // const seconds = currentDate.getSeconds();
    const minutes = currentDate.getMinutes();
    const hours = currentDate.getHours();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
    const year = currentDate.getFullYear();

    const formattedDateTimeString =hours + "-" +minutes+"-"+ day + "-" + month + "-" + year+".txt";

    return formattedDateTimeString;
}

LogUtils.writeFile = function () {
    let logFilePath = './logs/' +"sync.log."+ LogUtils.generateFileName();
    try {
        jsb.fileUtils.writeStringToFile(LogUtils.logContent, logFilePath);
    } catch (error) {
        cc.log("WRITE FILE ERROR: " + error);
    }
}

LogUtils.writeLog = function (message) {
    LogUtils.logContent +="Tick: " + LogUtils.tick + "\n";
    LogUtils.logContent += message + "\n";
}
