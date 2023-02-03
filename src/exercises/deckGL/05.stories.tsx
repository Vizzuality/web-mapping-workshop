import React, { useMemo } from 'react';

import StaticMap from 'react-map-gl';

import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import DeckGL from '@deck.gl/react';
import { Story } from '@storybook/react/types-6-0';

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
  const { initialViewState, mapStyle } = args;

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
      new ScatterplotLayer({
        mapStyle: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        id: 'scatterplot-layer',
        data: companiesData.features,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 10,
        lineWidthMinPixels: 0.5,
        getPosition: (d) => d.geometry.coordinates[0],
        getRadius: () => 5,
        getFillColor: () => [255, 140, 0],
        getLineColor: () => [0, 0, 0],
      }),
    ];
  }, []);

  const PROCESSES_DECK_LAYER = useMemo(() => {
    return [
      new PathLayer({
        id: 'path-layer',
        data: processesData.features,
        pickable: true,
        widthScale: 20,
        widthMinPixels: 2,
        getPath: (d) => d.geometry.coordinates,
        getColor: (d) => colorToRGBArray(d.properties.process),
        getWidth: () => 0.4,
      }),
    ];
  }, []);

  return (
    <div className="w-screen h-screen">
      <DeckGL
        layers={[...PROCESSES_DECK_LAYER, ...COMPANIES_DECK_LAYER]}
        initialViewState={initialViewState}
        controller={true}
      >
        <StaticMap reuseMaps mapStyle={mapStyle} />
      </DeckGL>
    </div>
  );
};

export const DeckGLBasemap = Template.bind({});
DeckGLBasemap.args = {
  id: 'paths-deckgl-map',
  initialViewState: {
    bearing: 0,
    latitude: 40.35535765713118,
    longitude: -3.743920171563559,
    padding: { top: 0, bottom: 0, left: 0, right: 0 },
    pitch: 0,
    zoom: 15.953620076646475,
  },
  mapStyle: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
};
