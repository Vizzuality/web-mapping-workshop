import { useState } from 'react';

import { ViewState } from 'react-map-gl';

import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { Layer, LayerManager } from '@vizzuality/layer-manager-react';

import Code from 'components/code';
import Map from 'components/map';
import Controls from 'components/map/controls';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';
import data from 'data/valencia.json';

const StoryMap = {
  title: 'Exercises/Geojson/Lines',
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const stops = [0, '#FE4365', 0.2, '#FC9D9A', 0.6, '#F9CDAD', 0.9, '#C8C8A9', 1, '#83AF9B'];

  const LAYER = {
    id: 'valencia-routes-gradient',
    type: 'vector',
    source: {
      data,
      type: 'geojson',
      lineMetrics: true,
    },
    render: {
      layers: [
        {
          type: 'line',
          layout: {
            'line-cap': 'square',
            'line-join': 'round',
          },
          paint: {
            'line-width': 2,
            'line-gradient': ['interpolate', ['linear'], ['line-progress'], ...stops],
          },
        },
      ],
    },
  };
  return (
    <>
      <div className="prose">
        <h2>Geojson: Lines 05</h2>
        <p>
          Draw a geojson linestring collection, center the map on it and color it with a{' '}
          <b>color ramp</b> based on a <b>string attribute</b>, and display it with the following
          styles:
        </p>

        <Code>
          {`border = '#000000';
opacity = 0.5;`}
        </Code>
      </div>
      <Map
        id={id}
        bounds={bounds}
        initialViewState={initialViewState}
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
                <Layer key={LAYER.id} {...LAYER} />
              </LayerManager>
              <Controls>
                <ZoomControl id={id} />
              </Controls>
            </>
          );
        }}
      </Map>
    </>
  );
};

export const Lines05 = Template.bind({});
Lines05.args = {
  id: 'valencia-provinces',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [-0.477576, 39.389689, -0.257849, 39.542355],
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