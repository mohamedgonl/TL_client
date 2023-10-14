
var ColorUlties = ColorUlties || {}

ColorUlties.setGrayObjects = function (objs) {
    if (Array.isArray(objs)) {
        for (var obj of objs) {
            obj.setShaderProgram(cc.shaderCache.getProgram("ShaderUIGrayScale"));
        }
    } else {
        objs.setShaderProgram(cc.shaderCache.getProgram("ShaderUIGrayScale1"));
    }
}

