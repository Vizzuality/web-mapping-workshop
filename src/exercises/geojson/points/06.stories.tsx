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
import AIRPORTS_DATA from 'data/airports.json';
const StoryMap = {
  title: 'Exercises/Geojson/Points',
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const AIRPORTS_LAYER = {
    id: 'airports',
    type: 'geojson',
    source: {
      type: 'geojson',
      data: AIRPORTS_DATA,
    },
    images: [
      {
        id: 'airport',
        src: '/images/airplane.svg',
        options: {},
      },
    ],
    render: {
      layers: [
        {
          type: 'symbol',
          layout: {
            'icon-image': 'airport',
            'icon-ignore-placement': true,
            'icon-allow-overlap': true,
            'icon-rotate': 315,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 0.18, 0.15, 0.2, 0.1],
          },
        },
        {
          type: 'circle',
          paint: {
            'circle-color': '#0000FF',
            'circle-opacity': 0.3,
            'circle-radius': 10,
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="prose">
        <h2>Geojson: Points 06</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/codeforgermany/click_that_hood/blob/main/public/data/airports.geojson"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geojson
          </a>
          , draw a point collection, center it on the map and display them as <b>images</b> with
          following styles:
        </p>
        <Code>{`const color = '#ffCC00';`}</Code>
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
                <Layer key={AIRPORTS_LAYER.id} {...AIRPORTS_LAYER} />
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

export const Points06 = Template.bind({});
Points06.args = {
  id: 'airports-map',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [-154.335938, -63.548552, 154.335938, 63.548552],
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
