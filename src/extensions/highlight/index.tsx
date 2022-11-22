import { LayerExtension } from '@deck.gl/core';
import { Layer } from '@deck.gl/core/typed';

class HighlightExtension extends LayerExtension {
  getShaders() {
    return {
      inject: {
        'vs:#decl': /*glsl*/ `
          uniform vec2 uMousePos;
          uniform float uRadius;

          varying vec4 v_texWorld;
          varying vec3 v_texWorldCommon;
          varying vec4 v_mousePosition;
          varying vec3 v_mousePositionCommon;
          varying vec3 v_commonUnitsPerMeter;
        `,
        'vs:#main-end': /*glsl*/ `
          v_texWorld = project_position_to_clipspace(positions, positions64Low, vec3(0.0), geometry.position);
          v_texWorldCommon = positions.xyz;
          v_mousePosition = project_position_to_clipspace(vec3(uMousePos, 0.0), positions64Low, vec3(0.0));
          v_mousePositionCommon = vec3(uMousePos, 0.0);
          v_commonUnitsPerMeter = project_uCommonUnitsPerMeter;
        `,
        'fs:#decl': /*glsl*/ `
          uniform vec2 uMousePos;
          uniform float uRadius;

          varying vec4 v_texWorld;
          varying vec3 v_texWorldCommon;
          varying vec4 v_mousePosition;
          varying vec3 v_mousePositionCommon;
          varying vec3 v_commonUnitsPerMeter;

          bool isInPointRange() {
            vec2 source_commonspace = v_texWorldCommon.xy;
            vec2 target_commonspace = v_mousePositionCommon.xy;
            float distance = length((target_commonspace - source_commonspace) / v_commonUnitsPerMeter.xy);
            return distance <= uRadius;
          }
        `,

        'fs:#main-end': /*glsl*/ `
          // decode function
          vec3 color = mix(bitmapColor.rgb, vec3(1.0,0.0,0.0), (abs(v_texWorldCommon.x / 180.)));
          if (isInPointRange()) {
            color = vec3(1.0, 1.0, 0.0);
          }
          gl_FragColor = vec4(color, bitmapColor.a);
        `,
      },
    };
  }

  updateState(this: Layer, params: any) {
    const { props } = params;
    const { uMouseLng: uMouseLng, uMouseLat: uMouseLat, uRadius } = props;

    // console.log(this, params);

    for (const model of this.getModels()) {
      model.setUniforms({
        uRadius,
        uMousePos: [uMouseLng, uMouseLat],
      });
    }
  }
}

export default HighlightExtension;
