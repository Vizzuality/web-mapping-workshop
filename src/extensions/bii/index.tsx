import { Layer, LayerExtension } from '@deck.gl/core/typed';

class BIIExtension extends LayerExtension {
  getShaders() {
    return {
      inject: {
        'fs:#decl': /*glsl*/ `
          uniform vec3 uMinColor;
          uniform vec3 uMaxColor;
        `,
        'fs:#main-end': /*glsl*/ `
          float l = length(bitmapColor);
          float lmin = length(vec4(uMinColor, 1.0));
          float lmax = length(vec4(uMaxColor, 1.0));

          float f = (l - lmin) / (lmax - lmin);

          // float r = bitmapColor.r;
          // float g = bitmapColor.g;
          // float b = bitmapColor.b;

          // float minr = uMinColor.r;
          // float ming = uMinColor.g;
          // float minb = uMinColor.b;

          // float maxr = uMaxColor.r;
          // float maxg = uMaxColor.g;
          // float maxb = uMaxColor.b;

          // float r1 = (r - minr) / (maxr - minr);
          // float g1 = (g - ming) / (maxg - ming);
          // float b1 = (b - minb) / (maxb - minb);

          // float o = (r1 + g1 + b1) / 3.0;

          vec4 color = mix(bitmapColor, vec4(bitmapColor.rgb, 0.0), f);

          gl_FragColor = vec4(color.rgb, color.a * opacity);
          gl_FragColor = bitmapColor;
        `,
      },
    };
  }

  updateState(this: Layer, params: any) {
    const { props } = params;
    const { uMinColor, uMaxColor } = props;

    // console.log(this, params);

    for (const model of this.getModels()) {
      model.setUniforms({
        uMinColor,
        uMaxColor,
      });
    }
  }
}

export default BIIExtension;
