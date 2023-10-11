import { useState, useRef } from 'react';

import type { MapRef, ViewState } from 'react-map-gl';

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
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const mapRef = useRef<MapRef>(null);

  const { id, bounds, initialViewState } = args;
  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const LAYER = {
    id: 'spain-ccaa-hover',
    type: 'vector',
    source: {
      data,
      type: 'geojson',
      promoteId: 'cartodb_id',
    },
    render: {
      layers: [
        {
          type: 'fill',
          paint: {
            'fill-color': [
              'case',
              ['>', ['get', 'population'], 2000000],
              '#1C5183',
              ['all', ['>=', ['get', 'population'], 2], ['<', ['get', 'population'], 300000]],
              '#6D7789',
              '#E7B092',
            ],
          },
        },
        {
          type: 'line',
          paint: {
            'line-color': [
              'case',
              ['>', ['get', 'population'], 2000000],
              '#E7B092',
              ['all', ['>=', ['get', 'population'], 2], ['<', ['get', 'population'], 300000]],
              '#1C5183',
              '#6D7789',
            ],
            'line-width': 0.8,
            'line-opacity': 0.5,
          },
        },
      ],
    },
  };

  const handleMapLoad = ({ map }) => {
    mapRef.current = map;
  };

  return (
    <>
      <div className="prose">
        <h2>Geojson: Polygons 05</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/Vizzuality/web-mapping-workshop/blob/main/src/data/provinces.json"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geojson
          </a>
          , we want to show the provinces of Spain. We want to color each province conditionally
          based on a numeric attribute .{' '}
          <i>Note: This map is for learning purposes, data may not be accurate with reality</i>
        </p>
        <Code>
          {`
          color = '#1C5183', // for population over 2000000
          color = '#6D7789', // for population between 2 and 300000
          color = '#E7B092', // for the rest of the cases

          border = '#E7B092', // for population over 2000000
          border = '#1C5183', // for population between 2 and 300000
          border = '#6D7789', // for the rest of the cases

          opacity = 0.5, // border opacity
          width = 0.8 // border width
        `}
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
        onMapLoad={handleMapLoad}
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

export const Polygons05 = Template.bind({});
Polygons05.args = {
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
  onHover: ({ map, mapContainer }) => {
    console.info('onHover: ', map, mapContainer);
  },
};
