import React, { useState, useMemo } from 'react';

import { ViewState } from 'react-map-gl';

import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { LayerManager, Layer } from '@vizzuality/layer-manager-react';

import Map from 'components/map';
import { CustomMapProps } from 'components/map/types';
import DATA from 'data/companies.json';

const StoryMap = {
  title: 'Exercises/DeckGL/Paths',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, initialViewState } = args;
  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const COMPANIES_DECK_LAYER = useMemo(() => {
    return [
      // siempre devolver mapbox layer solo si trabajamos con mapbox
      new MapboxLayer({
        id: 'scatterplot-layer',
        type: ScatterplotLayer,
        data: DATA.features,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: (d) => d.geometry.coordinates[0],
        getRadius: () => 10,
        getFillColor: () => [255, 140, 0], //vector 3
        getLineColor: () => [0, 0, 0],
      }),
    ];
  }, []);

  return (
    <div className="relative w-[calc(100%_+_32px)] h-screen bg-[url('/images/pampas-background.png')] bg-no-repeat -m-4">
      <div className="max-w-[1630px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="m-20 h-[600px] border-[30px] rounded-[46px] border-black bg-black">
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
            <Map
              id={id}
              initialViewState={initialViewState}
              viewState={viewState}
              mapboxAccessToken={process.env.STORYBOOK_MAPBOX_API_TOKEN}
              logoPosition="bottom-right"
              onMapViewStateChange={(v) => {
                setViewState(v);
              }}
            >
              {(map) => {
                return (
                  <>
                    <LayerManager map={map} plugin={PluginMapboxGl}>
                      <Layer
                        id="scatterplot-layer"
                        type="deck"
                        source={{ parse: false }}
                        render={{ parse: false }}
                        deck={COMPANIES_DECK_LAYER}
                      />
                    </LayerManager>
                  </>
                );
              }}
            </Map>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Paths01 = Template.bind({});
Paths01.args = {
  id: 'paths',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [-3.797293, 40.316246, -3.737469, 40.341242],
    fitBoundsOptions: {
      padding: -50,
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