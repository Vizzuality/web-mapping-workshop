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
          id: 'no-cluster',
          metadata: {
            position: 'top',
          },
          type: 'circle',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#FFF',
            'circle-stroke-width': 2,
            'circle-radius': 5,
          },
        },
      ],
    },
  };
  return (
    <>
      <div className="prose">
        <h2>Geojson: Points 04</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/codeforgermany/click_that_hood/blob/main/public/data/airports.geojson"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geojson
          </a>
          , draw a point collection, center it on the map and display them as <b>circle clusters</b>{' '}
          with a <b>count inside</b> and the following styles (when the property is an array of
          values, the value must be interpolated with the `point_count`):
        </p>
        <b>Cluster</b>
        <Code>
          {`color = ['#51bbd6','#f1f075','#f28cb1'];
border = '#000000';
opacity = 0.5;
radius = [16, 18, 20];`}
        </Code>
        <b>Symbol</b>
        <Code>{`fontSize = [10, 11, 12];`}</Code>
        <b>Circle</b>
        <Code>{`color = '#FFF';
strokeWidth = 2;
radius = 5;`}</Code>
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

export const Points04 = Template.bind({});
Points04.args = {
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
