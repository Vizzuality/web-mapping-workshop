import { useMemo, useState } from 'react';

import { BrushingExtension } from '@deck.gl/extensions';
import { GeoJsonLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
//
import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { Layer, LayerManager } from '@vizzuality/layer-manager-react';

import Map from 'components/map';
import Controls from 'components/map/controls';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';
//
import PROVINCES_DATA from 'data/provinces.json';

const StoryMap = {
  title: 'Playground/DeckGL/Extensions',
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
        type: GeoJsonLayer,
        data: PROVINCES_DATA,
        stroked: true,
        filled: true,
        extruded: true,
        lineWidthScale: 20,
        lineWidthMinPixels: 2,
        getFillColor: [160, 160, 180, 200],
        getLineColor: [255, 255, 255],
        getLineWidth: 1,
        getElevation: 30,
        visible: true,
        opacity: 1,
        extensions: [new BrushingExtension()],
        brushingRadius: 100000,
      }),
    ];
  }, []);

  return (
    <>
      <div className="relative grow">
        <Map
          id={id}
          bounds={bounds}
          viewState={viewState}
          initialViewState={initialViewState}
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

export const BrushingPolygonsSource = Template.bind({});
BrushingPolygonsSource.args = {
  id: 'mask',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [-13.392736, 35.469583, 7.701014, 43.460862],
    fitBoundsOptions: {
      padding: 50,
    },
  },
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
