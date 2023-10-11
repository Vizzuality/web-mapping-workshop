import { useMemo, useState } from 'react';

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

const AIRPORT_TYPES = [
  {
    id: 'mid',
    color: '#e65154',
  },
  {
    id: 'military mid',
    color: '#26b6ff',
  },
  {
    id: 'major',
    color: '#67e6d1',
  },
  {
    id: 'small',
    color: '#cd76d6',
  },
  {
    id: 'mid and military',
    color: '#ffca8c',
  },
  {
    id: 'major and military',
    color: '#fff2b3',
  },
  {
    id: 'military',
    color: '#ff8cd9',
  },
  {
    id: 'military major',
    color: '#c8f2a9',
  },
  {
    id: 'spaceport',
    color: '#d4b8ff',
  },
];

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const AIRPORTS_STOPS = useMemo(() => {
    return AIRPORT_TYPES.map((a) => [a.id, a.color]).flat();
  }, []);

  const AIRPORTS_LAYER = {
    id: 'airports',
    type: 'geojson',
    source: {
      type: 'geojson',
      data: AIRPORTS_DATA,
    },
    render: {
      layers: [
        {
          type: 'circle',
          paint: {
            'circle-color': ['match', ['get', 'type'], ...AIRPORTS_STOPS, '#DDD'],
            'circle-opacity': 0.5,
            'circle-radius': 5,
            'circle-stroke-color': ['match', ['get', 'type'], ...AIRPORTS_STOPS, '#DDD'],
            'circle-stroke-width': 1,
          },
        },
      ],
    },
  };
  return (
    <>
      <div className="prose">
        <h2>Geojson: Points 03</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/codeforgermany/click_that_hood/blob/main/public/data/airports.geojson"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geojson
          </a>
          , draw a point collection, fill it with a <b>color ramp</b> based on the <b>type</b>,
          center the map on it and display them with following styles:
        </p>
        <Code>
          {`opacity = 0.5;
radius = 5;
AIRPORT_TYPES = [
  { id: 'mid', color: '#e65154',},
  { id: 'military mid', color: '#26b6ff',},
  { id: 'major', color: '#67e6d1',},
  { id: 'small', color: '#cd76d6',},
  { id: 'mid and military', color: '#ffca8c',},
  { id: 'major and military', color: '#fff2b3',},
  { id: 'military', color: '#ff8cd9',},
  { id: 'military major', color: '#c8f2a9',},
  { id: 'spaceport', color: '#d4b8ff',},
];`}
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

export const Points03 = Template.bind({});
Points03.args = {
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
