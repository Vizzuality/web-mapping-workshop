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
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
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
          id: 'clusters',
          metadata: {
            position: 'top',
          },
          type: 'circle',
          filter: ['has', 'point_count'],
          paint: {
            'circle-stroke-color': '#000000',
            'circle-opacity': 0.5,
            'circle-radius': ['step', ['get', 'point_count'], 16, 25, 18, 50, 20],
            'circle-color': [
              'step',
              ['get', 'point_count'],
              '#51bbd6',
              25,
              '#f1f075',
              50,
              '#f28cb1',
            ],
          },
        },
        {
          id: 'cluster-count',
          metadata: {
            position: 'top',
          },
          type: 'symbol',
          filter: ['has', 'point_count'],
          layout: {
            'text-allow-overlap': true,
            'text-ignore-placement': true,
            'text-field': '{point_count_abbreviated}',
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': ['step', ['get', 'point_count'], 10, 25, 11, 50, 12],
          },
        },
        {
          metadata: {
            position: 'top',
          },
          type: 'symbol',
          filter: ['!', ['has', 'point_count']],
          layout: {
            'icon-image': 'airport',
            'icon-ignore-placement': true,
            'icon-allow-overlap': true,
            'icon-rotate': 315,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 0.18, 0.15, 0.2, 0.1],
          },
        },
        {
          metadata: {
            position: 'top',
          },
          filter: ['!', ['has', 'point_count']],
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
          following styles: * when the property is an array of values, the value must be
          interpolated with the `point_count` in case of color and radius, and with `zoom` in case
          of iconSize:
        </p>
        <b>Cluster</b>
        <Code>{`color = ['#51bbd6','#f1f075', '#f28cb1];
opacity = 0.5;
radius = [16,18,20];
strokeColor = '#000000';`}</Code>
        <b>Symbol</b>
        <Code>{`iconSize = [0.15, 0.1];`}</Code>
        <b>Circle</b>
        <Code>{`color = '#0000FF';
opacity = 0.3;
radius = 10;`}</Code>
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
    bounds: [-237.65625, -78.836065, 238.007813, 78.767792],
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
