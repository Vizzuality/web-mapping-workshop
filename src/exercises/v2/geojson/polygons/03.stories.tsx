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
import data from 'data/provinces.json';

const StoryMap = {
  title: 'Exercises/Geojson/Polygons',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const PROVINCES = [
  { id: '1', color: '#0080FF' },
  { id: '2', color: '#45B922' },
  { id: '3', color: '#2E97D0' },
  { id: '4', color: '#E7F317' },
  { id: '5', color: '#5CAEA2' },
  { id: '6', color: '#FFF300' },
  { id: '7', color: '#5CA2A2' },
  { id: '8', color: '#FFDC00' },
  { id: '9', color: '#FFD000' },
  { id: '10', color: '#FF0000' },
  { id: '11', color: '#8B7345' },
  { id: '12', color: '#FFAE00' },
  { id: '13', color: '#2ED0D0' },
  { id: '14', color: '#FF9700' },
  { id: '15', color: '#738B3A' },
  { id: '16', color: '#FF7000' },
  { id: '17', color: '#FF5000' },
  { id: '18', color: '#FF0080' },
];

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const COLORS = useMemo(() => {
    return PROVINCES.map(({ id: i, color }) => {
      return [i, color];
    }).flat();
  }, []);

  const LAYER = {
    id: 'spain-ccaa',
    type: 'vector',
    source: {
      data,
      type: 'geojson',
    },
    render: {
      layers: [
        {
          id: 'province-area',
          type: 'fill',
          paint: {
            'fill-color': ['match', ['get', 'cod_ccaa'], ...COLORS, '#ccc'],
            'fill-opacity': 0.5,
          },
        },
        {
          id: 'province-boundary',
          type: 'line',
          paint: {
            'line-color': '#000000',
            'line-opacity': 1,
          },
        },
      ],
    },
  };
  return (
    <>
      <div className="prose">
        <h2>Geojson: Polygons 03</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/Vizzuality/web-mapping-workshop/blob/main/src/data/provinces.json"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geojson
          </a>
          , we want to show the provinces of Spain. We want to show the area of each province with a
          color based on a category attribute and the boundary of each province with a black line.
        </p>

        <Code>
          {`bounds = [-13.392736, 35.469583, 7.701014, 43.460862];
border = '#000000';
opacity = 0.5;
PROVINCES = [{ id: '1', color: '#0080FF' },{ id: '2', color: '#45B922' },{ id: '3', color: '#2E97D0' },{ id: '4', color: '#E7F317' },{ id: '5', color: '#5CAEA2' },{ id: '6', color: '#FFF300' },{ id: '7', color: '#5CA2A2' },{ id: '8', color: '#FFDC00' },{ id: '9', color: '#FFD000' },{ id: '10', color: '#FF0000' },{ id: '11', color: '#8B7345' },{ id: '12', color: '#FFAE00' },{ id: '13', color: '#2ED0D0' },{ id: '14', color: '#FF9700' },{ id: '15', color: '#738B3A' },{ id: '16', color: '#FF7000' },{ id: '17', color: '#FF5000' },{ id: '18', color: '#FF0080' }];`}
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

export const Polygons03 = Template.bind({});
Polygons03.args = {
  id: 'spain-provinces',
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
