import { useRef, useState } from 'react';

import { MapRef, ViewState } from 'react-map-gl';

import { Story } from '@storybook/react/types-6-0';
import Supercluster from 'supercluster';

import Map from 'components/map';
import Controls from 'components/map/controls';
import ZoomControl from 'components/map/controls/zoom';
import ClusterLayer from 'components/map/layers/clusters';
import MarkerCluster from 'components/map/markers/cluster';
import MarkerPin from 'components/map/markers/pin';
import { CustomMapProps } from 'components/map/types';
import AIRPORTS_DATA from 'data/airports.json';

const StoryMap = {
  title: 'Exercises/Geojson/Points',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, initialViewState } = args;

  const mapRef = useRef<MapRef>();

  const [viewState, setViewState] = useState<Partial<ViewState>>({ zoom: 0 });

  const DATA = AIRPORTS_DATA.features as Supercluster.PointFeature<Supercluster.AnyProps>[];

  const onSelectMarker = (nextZoom: number, coordinates: [number, number]) => {
    mapRef.current?.flyTo({ zoom: nextZoom, center: coordinates });
  };

  return (
    <>
      <div className="prose">
        <h2>Geojson: Custom cluster</h2>
        <p>
          With this{' '}
          <a
            href="https://github.com/codeforgermany/click_that_hood/blob/main/public/data/airports.geojson"
            target="_blank"
            rel="noreferrer noopener"
          >
            Geojson
          </a>
          , draw a point collection, center it on the map and display them as <b>custom clusters</b>{' '}
          a dou with a <b>doughnut with the features.type as value</b> and <b>count inside</b>
        </p>
      </div>
      <Map
        id={id}
        initialViewState={initialViewState}
        viewState={viewState}
        mapboxAccessToken={process.env.STORYBOOK_MAPBOX_API_TOKEN}
        onMapLoad={({ map }) => {
          mapRef.current = map;
        }}
        onMapViewStateChange={(v) => {
          setViewState(v);
        }}
      >
        {() => {
          return (
            <>
              <ClusterLayer
                mapId={id}
                data={DATA}
                MarkerComponent={MarkerPin}
                ClusterComponent={MarkerCluster}
                onSelectMarker={onSelectMarker}
              />
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

export const Points08 = Template.bind({});
Points08.args = {
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
