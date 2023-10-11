import { useState, useMemo } from 'react';

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

const HIGHWAYS = [
  { id: 'pedestrian', color: '#0080FF' },
  { id: 'living_street', color: '#45B922' },
  { id: 'residential', color: '#2E97D0' },
  { id: 'tertiary', color: '#E7F317' },
  { id: 'footway', color: '#5CAEA2' },
  { id: 'primary_link', color: '#FFF300' },
  { id: 'primary', color: '#5CA2A2' },
  { id: 'trunk', color: '#FFDC00' },
  { id: 'trunk_link', color: '#FFD000' },
  { id: 'cycleway', color: '#FF0000' },
  { id: 'service', color: '#8B7345' },
  { id: 'unclassified', color: '#FFAE00' },
  { id: 'track', color: '#2ED0D0' },
  { id: 'steps', color: '#FF9700' },
  { id: 'proposed', color: '#738B3A' },
];

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const STOPS = useMemo(() => {
    return HIGHWAYS.map((h) => [h.id, h.color]).flat();
  }, []);

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
          paint: {
            'line-color': ['match', ['get', 'highway'], ...STOPS, 'green'],
            'line-width': 1,
          },
          layout: {
            'line-cap': 'square',
          },
        },
      ],
    },
  };

  return (
    <>
      <div className="prose">
        <h2>Geojson: Lines 02</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/Vizzuality/web-mapping-workshop/blob/main/src/data/valencia.json"
            target="_blank"
            rel="noreferrer"
          >
            Geojson
          </a>
          {', '} center the map on it and color it with a <b>color ramp</b> based on{' '}
          <b>the highway type</b>, and display it with the following styles:
        </p>

        <Code>
          {`bounds = [-0.477576, 39.389689, -0.257849, 39.542355];
width= 1;
HIGHWAYS = [
  { id: 'pedestrian', color: '#0080FF' },
  { id: 'living_street', color: '#45B922' },
  { id: 'residential', color: '#2E97D0' },
  { id: 'tertiary', color: '#E7F317' },
  { id: 'footway', color: '#5CAEA2' },
  { id: 'primary_link', color: '#FFF300' },
  { id: 'primary', color: '#5CA2A2' },
  { id: 'trunk', color: '#FFDC00' },
  { id: 'trunk_link', color: '#FFD000' },
  { id: 'cycleway', color: '#FF0000' },
  { id: 'service', color: '#8B7345' },
  { id: 'unclassified', color: '#FFAE00' },
  { id: 'track', color: '#2ED0D0' },
  { id: 'steps', color: '#FF9700' },
  { id: 'proposed', color: '#738B3A' },
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

export const Lines02 = Template.bind({});
Lines02.args = {
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
