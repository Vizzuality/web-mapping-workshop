import React, { useState, useMemo } from 'react';

import { ViewState } from 'react-map-gl';

import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { LayerManager, Layer } from '@vizzuality/layer-manager-react';

import Map from 'components/map';
import { CustomMapProps } from 'components/map/types';
import companiesData from 'data/companies.json';
import processesData from 'data/processes.json';

const StoryMap = {
  title: 'Exercises/DeckGL/Paths',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, initialViewState } = args;
  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const colorToRGBArray = (process) => {
    if (process === 'energy') {
      return [255, 147, 146];
    } else if (process === 'water') {
      return [0, 255, 255];
    } else if (process === 'material') {
      return [156, 203, 134];
    } else {
      return [207, 89, 126];
    }
  };

  const COMPANIES_DECK_LAYER = useMemo(() => {
    return [
      // Return Mapbox Layer when we work with Mapbox
      new MapboxLayer({
        id: 'scatterplot-layer',
        type: ScatterplotLayer,
        data: companiesData.features,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: (d) => d.geometry.coordinates[0],
        getRadius: () => 5,
        getFillColor: () => [255, 140, 0], //vector 3
        getLineColor: () => [0, 0, 0],
      }),
    ];
  }, []);

  const PROCESSES_DECK_LAYER = useMemo(() => {
    return [
      new MapboxLayer({
        id: 'path-layer',
        type: PathLayer,
        data: processesData.features,
        pickable: true,
        widthScale: 10,
        widthMinPixels: 0.5,
        getPath: (d) => d.geometry.coordinates,
        getColor: (d) => colorToRGBArray(d.properties.process),
        getWidth: () => 1,
      }),
    ];
  }, []);

  return (
    <div className="w-screen h-screen ">
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
                <Layer
                  id="path-layer"
                  type="deck"
                  source={{ parse: false }}
                  render={{ parse: false }}
                  deck={PROCESSES_DECK_LAYER}
                />
              </LayerManager>
            </>
          );
        }}
      </Map>
    </div>
  );
};

export const Mapbox = Template.bind({});
Mapbox.args = {
  id: 'paths',
  className: '',
  viewport: {},
  initialViewState: {
    bearing: 0,
    latitude: 40.35535765713118,
    longitude: -3.743920171563559,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    pitch: 0,
    zoom: 15.953620076646475,
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
