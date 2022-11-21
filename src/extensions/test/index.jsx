import { LayerExtension } from '@deck.gl/core/typed';

class TestExtension extends LayerExtension {
  getShaders() {
    return {
      inject: {
        'vs:#decl': /*glsl*/ `
          varying vec4 v_texWorld;
          varying vec3 v_texWorldCommon;
        `,
        'vs:#main-end': /*glsl*/ `
          v_texWorld = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
          v_texWorldCommon = positions.xyz;
        `,
        'fs:#decl': /*glsl*/ `
          uniform float zoom;
          uniform float startYear;
          uniform float endYear;
          varying vec4 v_texWorld;
          varying vec3 v_texWorldCommon;

          float circle(vec2 pt, vec2 center, float radius, float edge_thickness){
            vec2 p = pt - center;
            float len = length(p);
            float result = 1.0-smoothstep(radius-edge_thickness, radius, len);
            return result;
          }
        `,

        'fs:#main-end': /*glsl*/ `
          // decode function
          // vec3 color = mix(bitmapColor.rgb, vec3(1.0,0.0,0.0), v_texWorld.x);
          vec3 color = mix(bitmapColor.rgb, vec3(1.0,0.0,0.0), (abs(v_texWorldCommon.x / 180.)));
          gl_FragColor = vec4(color, bitmapColor.a);
        `,
      },
    };
  }
}

export default TestExtension;
