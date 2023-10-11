import { useState } from 'react';

import { ViewState } from 'react-map-gl';

import { Story } from '@storybook/react/types-6-0';

import Code from 'components/code';
import Map from 'components/map';
import Controls from 'components/map/controls';
import FitBoundsControl from 'components/map/controls/fit-bounds';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';
import LayerContainer from 'containers/layer-manager/layers/layer-container';
import data from 'data/valencia.json';

const StoryMap = {
  title: 'Exercises V2/Geojson/Lines',
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;
  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const SOURCE = {
    data,
    type: 'geojson',
  };

  const LAYERS = [
    {
      id: 'valencia-provinces',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#ffCC00',
        'line-width': 5,
        'line-opacity': 0.5,
      },
    },
  ];

  return (
    <>
      <div className="prose">
        <h2>Geojson: Lines 01</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/Vizzuality/web-mapping-workshop/blob/main/src/data/valencia.json"
            target="_blank"
            rel="noreferrer"
          >
            Geojson
          </a>
          {', '}
          center it on the map and display it as <b>lines</b> with the followng styles:
        </p>
        <Code>
          {`bounds = [-0.477576, 39.389689, -0.257849, 39.542355];
color = '#ffCC00';
opacity = 0.5;
width = 5;`}
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
        {() => {
          return (
            <>
              <LayerContainer source={SOURCE} layers={LAYERS} />
              <Controls>
                <ZoomControl />
                <FitBoundsControl bounds={bounds} />
              </Controls>
            </>
          );
        }}
      </Map>
    </>
  );
};

export const Lines01 = Template.bind({});
Lines01.args = {
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
