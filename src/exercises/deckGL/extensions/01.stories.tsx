import { useMemo, useState } from 'react';

import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import GL from '@luma.gl/constants';
//
import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { Layer, LayerManager } from '@vizzuality/layer-manager-react';

import Map from 'components/map';
import Controls from 'components/map/controls';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';
import TestExtension from 'extensions/test';

const StoryMap = {
  title: 'Exercises/DeckGL/Extensions',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const [viewState, setViewState] = useState(initialViewState);

  const RASTER_DECODED_LAYER = useMemo(() => {
    return [
      new MapboxLayer({
        id: 'deck-test-extension-layer',
        type: TileLayer,
        data: 'https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png',
        tileSize: 256,
        visible: true,
        opacity: 1,
        renderSubLayers: (sl) => {
          const { id: subLayerId, data, tile, visible, opacity: o } = sl;

          const {
            z,
            bbox: { west, south, east, north },
          } = tile;

          if (data) {
            return new BitmapLayer({
              id: subLayerId,
              image: data,
              bounds: [west, south, east, north],
              textureParameters: {
                [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
                [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
                [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
                [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
              },
              zoom: z,
              visible,
              opacity: o,
              extensions: [new TestExtension()],
            });
          }
          return null;
        },
        minZoom: 3,
        maxZoom: 12,
      }),
    ];
  }, []);

  return (
    <>
      <div className="prose">
        <h2>Raster tiles</h2>
        <p>Draw a raster layer with this url source: </p>
        <pre>{`https://earthengine.google.org/static/hansen_2013/gain_alpha/{z}/{x}/{y}.png`}</pre>
      </div>

      <div className="relative grow">
        <Map
          id={id}
          bounds={bounds}
          viewState={viewState}
          mapboxAccessToken={process.env.STORYBOOK_MAPBOX_API_TOKEN}
          onMapViewStateChange={(v) => {
            setViewState(v);
          }}
        >
          {(map) => {
            return (
              <>
                <LayerManager map={map} plugin={PluginMapboxGl}>
                  <Layer id="deck-test-extension-layer" type="deck" deck={RASTER_DECODED_LAYER} />
                </LayerManager>
                <Controls>
                  <ZoomControl id={id} />
                </Controls>
              </>
            );
          }}
        </Map>
      </div>
    </>
  );
};

export const Extensions01 = Template.bind({});
Extensions01.args = {
  id: 'raster',
  className: '',
  viewport: {},
  initialViewState: {},
  onMapViewportChange: (viewport) => {
    console.info('onMapViewportChange: ', viewport);
  },
  onMapReady: ({ map, mapContainer }) => {
    console.info('onMapReady: ', map, mapContainer);
  },
  onMapLoad: ({ map, mapContainer }) => {
    console.info('onMapLoad: ', map, mapContainer);
  },
};
