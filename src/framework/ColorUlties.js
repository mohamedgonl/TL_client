
var ColorUlties = ColorUlties || {}

ColorUlties.setGrayObjects = function (objs, enable = false) {
    if (Array.isArray(objs)) {
        for (var obj of objs) {
            obj.setShaderProgram(cc.shaderCache.getProgram(enable ? cc.SHADER_POSITION_TEXTURE : "ShaderUIGrayScale"));
        }
    } else {
        objs.setShaderProgram(cc.shaderCache.getProgram(enable ? cc.SHADER_POSITION_TEXTURE : "ShaderUIGrayScale"));
    }
}



