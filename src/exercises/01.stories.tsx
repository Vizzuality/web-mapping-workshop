import { useCallback, useState } from 'react';

import { Layer, MapProvider, ViewState } from 'react-map-gl';

import { Story } from '@storybook/react/types-6-0';
import { useDebounce } from 'usehooks-ts';

import Map from 'components/map';
import Controls from 'components/map/controls';
import FitBoundsControl from 'components/map/controls/fit-bounds';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';
import LayerManager from 'containers/layer-manager';

const StoryMap = {
  title: 'Exercises V2/MapTemplate',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, maxZoom, initialViewState } = args;

  const [viewState, setViewState] = useState<Partial<ViewState>>({});

  const debouncedViewStateValue = useDebounce<Partial<ViewState>>(viewState, 250);

  const handleViewState = useCallback((vw: ViewState) => {
    setViewState(vw);
  }, []);

  return (
    <MapProvider>
      <div className="relative w-full h-screen">
        <Map
          id={id}
          maxZoom={maxZoom}
          bounds={bounds}
          initialViewState={initialViewState}
          viewState={debouncedViewStateValue}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
          onMapViewStateChange={handleViewState}
          mapStyle={'mapbox://styles/mapbox/light-v10'}
        >
          {() => (
            <>
              {/* This custom-layers layer serves as a separator to order
              all the layers on the layer manager above the default map layers */}
              <Layer
                id="custom-layers"
                type="background"
                paint={{
                  'background-color': '#000',
                  'background-opacity': 0,
                }}
              />
              <LayerManager layers={['example']} />
              <Controls>
                <ZoomControl />
                <FitBoundsControl bounds={bounds} />
              </Controls>
            </>
          )}
        </Map>
      </div>
    </MapProvider>
  );
};

export const MapTemplate = Template.bind({});
MapTemplate.args = {
  id: 'map-storybook',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [7.295523, 41.102768, 15.425406, 44.885675],
    fitBoundsOptions: {
      padding: 100,
    },
    maxZoom: 9,
    minZoom: 2,
  },
  bounds: {
    bbox: [7.295523, 41.102768, 15.425406, 44.885675],
    options: {
      padding: 100,
      duration: 1000,
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
  maxZoom: 20,
};
