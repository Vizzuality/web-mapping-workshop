import { LayerExtension } from '@deck.gl/core';

class HighlightExtension extends LayerExtension {
  getShaders() {
    return {
      inject: {
        'vs:#decl': /*glsl*/ `
          uniform float uMouseLng;
          uniform float uMouseLat;
          varying vec4 v_texWorld;
          varying vec3 v_texWorldCommon;
          varying vec4 v_mousePosition;
          varying vec3 v_mousePositionCommon;
        `,
        'vs:#main-end': /*glsl*/ `
          v_texWorld = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
          v_texWorldCommon = positions.xyz;
          v_mousePosition = project_position_to_clipspace(vec3(uMouseLng, uMouseLat, 0.0), positions64Low, vec3(0.0));
          v_mousePositionCommon = vec3(uMouseLng, uMouseLat, 0.0);
        `,
        'fs:#decl': /*glsl*/ `
          uniform float zoom;
          uniform float startYear;
          uniform float endYear;
          uniform float uMouseLng;
          uniform float uMouseLat;
          varying vec4 v_texWorld;
          varying vec3 v_texWorldCommon;
          varying vec4 v_mousePosition;

          float circle(vec2 pt, vec2 center, float radius, float edge_thickness){
            vec2 p = pt - center;
            float len = length(p);
            float result = 1.0-smoothstep(radius-edge_thickness, radius, len);
            return result;
          }
        `,

        'fs:#main-end': /*glsl*/ `
          // decode function
          vec3 color = mix(bitmapColor.rgb, vec3(1.0,0.0,0.0), (abs(v_texWorldCommon.x / 180.)));
          gl_FragColor = vec4(color, bitmapColor.a);
        `,
      },
    };
  }

  updateState({ props }) {
    const { uMouseLng: uMouseLng, uMouseLat: uMouseLat } = props;

    for (const model of this.getModels()) {
      model.setUniforms({
        uRadius: 1000,
        uMousePos: [uMouseLng, uMouseLat],
      });
    }
  }
}

export default HighlightExtension;
