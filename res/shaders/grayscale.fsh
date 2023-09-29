varying vec2 v_texCoord;
uniform sampler2D CC_Texture0;

void main()
{
    vec4 texColor = texture2D(CC_Texture0, v_texCoord);
    float gray = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));
    gl_FragColor = vec4(vec3(gray), texColor.a);
}
