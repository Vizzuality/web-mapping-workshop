import { useState, useRef, useMemo, useEffect } from 'react';

import type { MapRef } from 'react-map-gl';
import { ViewState } from 'react-map-gl';

import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import { Layer, LayerManager } from '@vizzuality/layer-manager-react';

import Code from 'components/code';
import Map from 'components/map';
import Controls from 'components/map/controls';
import ZoomControl from 'components/map/controls/zoom';
import { CustomMapProps } from 'components/map/types';

const StoryMap = {
  title: 'Exercises/Geojson/Lines',
  argTypes: {},
};

export default StoryMap;

const data = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: [
          [-0.39163, 39.4788496],
          [-0.3916603, 39.4788927],
          [-0.3916401, 39.4789296],
          [-0.3916969, 39.4790101],
          [-0.3921357, 39.4796318],
          [-0.3921746, 39.4796838],
          [-0.3921245, 39.479727],
          [-0.3922805, 39.4799695],
          [-0.3924849, 39.4802766],
          [-0.39253, 39.4803243],
          [-0.3926137, 39.4802978],
          [-0.3929072, 39.4806792],
          [-0.3929476, 39.4807031],
          [-0.3930423, 39.480821],
          [-0.3931109, 39.4808072],
          [-0.3931716, 39.4808293],
          [-0.3932883, 39.4808675],
          [-0.3933763, 39.4809045],
          [-0.3933976, 39.480949],
          [-0.3933792, 39.4810409],
          [-0.3933396, 39.4811378],
          [-0.3933543, 39.481186],
          [-0.3933888, 39.481232],
          [-0.3933896, 39.4812837],
          [-0.3933706, 39.4813153],
          [-0.3933694, 39.4813652],
          [-0.3934624, 39.4814868],
          [-0.3934809, 39.481511],
          [-0.3934294, 39.4815671],
          [-0.3933752, 39.4816263],
          [-0.3933013, 39.4817255],
          [-0.3931902, 39.4818952],
          [-0.3931339, 39.4820145],
          [-0.3931003, 39.4821229],
          [-0.3931145, 39.4822492],
          [-0.3932821, 39.4824903],
          [-0.3935263, 39.482798],
          [-0.3935556, 39.4828392],
          [-0.3935784, 39.4828987],
          [-0.3948693, 39.484711],
          [-0.3949344, 39.4848028],
          [-0.3949515, 39.4848138],
          [-0.3950195, 39.4848592],
          [-0.3955108, 39.4855733],
          [-0.3955786, 39.485693],
          [-0.3955839, 39.4858016],
          [-0.395515, 39.4859026],
          [-0.3955614, 39.4859619],
          [-0.3956659, 39.4860956],
          [-0.3957371, 39.4861865],
          [-0.3958601, 39.486202],
          [-0.3960288, 39.4863163],
          [-0.3962079, 39.4865664],
          [-0.3963044, 39.4867042],
          [-0.3963174, 39.4867518],
          [-0.3963522, 39.4868154],
          [-0.3964072, 39.4868504],
          [-0.396499, 39.4869307],
          [-0.3966393, 39.4871211],
          [-0.3966755, 39.4872043],
          [-0.3967359, 39.4872501],
          [-0.3969917, 39.4876069],
          [-0.3970353, 39.4876936],
          [-0.3970733, 39.4877445],
          [-0.3971255, 39.48778],
          [-0.3973221, 39.4880517],
        ],
        type: 'LineString',
      },
    },
  ],
};

function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);

    return () => clearInterval(id);
  }, [delay]);
}

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, bounds, initialViewState } = args;

  const mapRef = useRef<MapRef>(null);
  const [frame, setFrame] = useState(0);
  const [viewState, setViewState] = useState<Partial<ViewState>>();
  const [layersInteractiveIds, setLayersInteractiveIds] = useState([]);

  const DATA = useMemo(() => {
    const [line] = data.features;
    const { coordinates } = line.geometry;

    const newLine = {
      ...line,
      geometry: {
        type: 'LineString',
        coordinates: coordinates.slice(0, frame),
      },
    };

    return {
      ...data,
      features: [newLine],
    };
  }, [frame]);

  useInterval(() => {
    const [line] = data.features;
    const { coordinates } = line.geometry;

    setFrame((frame + 1) % coordinates.length);
  }, 50);

  const LAYER = {
    id: 'valencia-routes-gradient',
    type: 'vector',
    source: {
      data: DATA,
      type: 'geojson',
    },
    render: {
      layers: [
        {
          id: 'valencia-routes-gradient',
          type: 'line',
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-width': 5,
            'line-opacity': 0.5,
            'line-color': '#FE4365',
            'line-dasharray': [0, 1, 2],
          },
        },
      ],
    },
  };

  const handleMapLoad = ({ map }) => {
    mapRef.current = map;
  };

  const onAfterAdd = (layerModel) => {
    layerModel.mapLayer.layers.forEach((l) => {
      const { id: layerId } = l;
      if (!layersInteractiveIds.includes(layerId)) {
        setLayersInteractiveIds((prevLayersInteractiveIds) => [
          ...prevLayersInteractiveIds,
          layerId,
        ]);
      }
    });
  };

  const onAfterRemove = (layerModel) => {
    layerModel.mapLayer.layers.forEach((l) => {
      const { id: layerId } = l;

      if (layersInteractiveIds.includes(layerId)) {
        setLayersInteractiveIds((prevLayersInteractiveIds) => {
          const arr = prevLayersInteractiveIds.filter((e) => e !== layerId);

          return arr;
        });
      }
    });
  };

  return (
    <>
      <div className="prose">
        <h2>Geojson: Lines 03</h2>
        <b>Animate</b> a geojson linestring collection, center the map on it and display it with the
        following styles:
        <Code>{`color = '#FE4365';
opacity = 0.5;`}</Code>
      </div>

      <Map
        id={id}
        bounds={bounds}
        initialViewState={initialViewState}
        viewState={viewState}
        onMapLoad={handleMapLoad}
        mapboxAccessToken={process.env.STORYBOOK_MAPBOX_API_TOKEN}
        onMapViewStateChange={(v) => {
          setViewState(v);
        }}
        interactiveLayerIds={layersInteractiveIds}
      >
        {(map) => {
          return (
            <>
              <LayerManager map={map} plugin={PluginMapboxGl}>
                <Layer
                  key={LAYER.id}
                  {...LAYER}
                  onAfterAdd={onAfterAdd}
                  onAfterRemove={onAfterRemove}
                />
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

export const Lines03 = Template.bind({});
Lines03.args = {
  id: 'valencia-provinces',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [-0.3973221, 39.4788496, -0.39163, 39.4880517],
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
