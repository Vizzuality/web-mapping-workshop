import React, { useMemo, useState } from 'react';

import { ViewState } from 'react-map-gl';

import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import GL from '@luma.gl/constants';
import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import CartoProvider from '@vizzuality/layer-manager-provider-carto';
import { LayerManager, Layer } from '@vizzuality/layer-manager-react';
import parseAPNG from 'apng-js';
import { useInterval } from 'usehooks-ts';

import Map from 'components/map';
import Legend from 'components/map/legend';
import LegendItem from 'components/map/legend/item/component';
import LegendTypeGradient from 'components/map/legend/types/gradient';
import { CustomMapProps } from 'components/map/types';

const cartoProvider = new CartoProvider();

const StoryMap = {
  title: 'Exercises/DeckGL',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, initialViewState } = args;
  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const [biiOpacity, setBiiOpacity] = useState(1);
  const [biiChangeOpacity, setHumanFootprintOpacity] = useState(0);

  const [frame, setFrame] = useState(0);
  const [delay, setDelay] = useState(null);

  const SATELLITE_DECK_LAYER = useMemo(() => {
    return [
      new MapboxLayer({
        id: `prediction-animated`,
        type: TileLayer,
        frame,
        getPolygonOffset: () => {
          return [0, -50];
        },

        getTileData: (tile) => {
          const { x, y, z, signal } = tile;
          const url = `https://storage.googleapis.com/geo-ai/Redes/Tiles/Tsaratanana2/APNGs/Sentinel/${z}/${x}/${y}.png`;
          const response = fetch(url, { signal });

          if (signal.aborted) {
            return null;
          }

          return response
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
              const apng = parseAPNG(buffer);
              if (apng instanceof Error) {
                throw apng;
              }

              return apng.frames.map((f) => {
                return {
                  ...f,
                  bitmapData: createImageBitmap(f.imageData),
                };
              });
            });
        },
        tileSize: 256,
        visible: true,
        opacity: 1,
        refinementStrategy: 'no-overlap',
        renderSubLayers: (sl) => {
          if (!sl) return null;

          const { id: subLayerId, data, tile, visible, opacity = 1, frame: f } = sl;

          if (!tile || !data) return null;

          const {
            z,
            bbox: { west, south, east, north },
          } = tile;

          const FRAME = data[f];

          if (FRAME) {
            return new BitmapLayer({
              id: subLayerId,
              image: FRAME.bitmapData,
              bounds: [west, south, east, north],
              getPolygonOffset: () => {
                return [0, -50];
              },
              textureParameters: {
                [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
                [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
                [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
                [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
              },
              zoom: z,
              visible,
              opacity,
            });
          }
          return null;
        },
        minZoom: 10,
        maxZoom: 14,
        extent: initialViewState.bounds,
      }),
    ];
  }, [frame, initialViewState.bounds]);

  const BII_ANIMATED_DECK_LAYER = useMemo(() => {
    return [
      new MapboxLayer({
        id: `BII-animated`,
        type: TileLayer,
        frame,
        getPolygonOffset: () => {
          return [0, -50];
        },

        getTileData: (tile) => {
          const { x, y, z, signal } = tile;
          const url = `https://storage.googleapis.com/geo-ai/Redes/Tiles/Tsaratanana/BII/APNGs/${z}/${x}/${y}.png`;
          const response = fetch(url, { signal });

          if (signal.aborted) {
            return null;
          }

          return response
            .then((res) => res.arrayBuffer())
            .then((buffer) => {
              const apng = parseAPNG(buffer);

              if (apng instanceof Error) {
                throw apng;
              }

              return apng.frames.map((f) => {
                return {
                  ...f,
                  bitmapData: createImageBitmap(f.imageData),
                };
              });
            });
        },
        tileSize: 256,
        visible: true,
        opacity: biiOpacity,
        refinementStrategy: 'no-overlap',
        renderSubLayers: (sl) => {
          if (!sl) return null;

          const { id: subLayerId, data, tile, visible, opacity = 1, frame: f } = sl;

          if (!tile || !data) return null;

          const {
            z,
            bbox: { west, south, east, north },
          } = tile;

          const FRAME = data[f];

          if (FRAME) {
            return new BitmapLayer({
              id: subLayerId,
              image: FRAME.bitmapData,
              bounds: [west, south, east, north],
              getPolygonOffset: () => {
                return [0, -50];
              },
              textureParameters: {
                [GL.TEXTURE_MIN_FILTER]: GL.NEAREST,
                [GL.TEXTURE_MAG_FILTER]: GL.NEAREST,
                [GL.TEXTURE_WRAP_S]: GL.CLAMP_TO_EDGE,
                [GL.TEXTURE_WRAP_T]: GL.CLAMP_TO_EDGE,
              },
              zoom: z,
              visible,
              opacity,
            });
          }
          return null;
        },
        minZoom: 10,
        maxZoom: 14,
        extent: initialViewState.bounds,
      }),
    ];
  }, [frame, biiOpacity, initialViewState.bounds]);

  useInterval(() => {
    // 2017-2020
    const f = frame === 4 - 1 ? 0 : frame + 1;

    setFrame(f);
  }, delay);

  return (
    <div className="relative w-full -m-4 h-full bg-[url('/images/tsaratanana-background.png')]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="m-20 h-[560px] border-[30px] rounded-3xl border-black bg-black">
          {/* Timeline */}
          <div className="absolute top-0 left-0 bg-[#FEFEFE] text-black p-4 z-10 flex items-center space-x-10">
            <button
              className="w-12"
              type="button"
              onClick={() => {
                setDelay(delay === null ? 1000 : null);
              }}
            >
              {!delay && 'Play'}
              {delay && 'Pause'}
            </button>
            <input
              type="range"
              min={2017}
              max={2020}
              value={2017 + frame}
              onChange={(e) => {
                setDelay(null);
                setFrame(+e.target.value - 2017);
              }}
            />
            <span className="w-12">{2017 + frame}</span>
          </div>

          {/* Layers */}

          <div className="absolute top-0 right-0 bg-[#FEFEFE] text-black p-4 z-10 flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <label htmlFor="#loss-layer">BII - 2017-2020</label>
              <input
                type="checkbox"
                checked={!!biiOpacity}
                onChange={(e) => {
                  setBiiOpacity(e.target.checked ? 1 : 0);
                }}
              />
            </div>
            <div className="flex items-center space-x-2">
              <label htmlFor="#loss-layer">BII Change - 2017-2020</label>
              <input
                type="checkbox"
                checked={!!biiChangeOpacity}
                onChange={(e) => {
                  setHumanFootprintOpacity(e.target.checked ? 1 : 0);
                }}
              />
            </div>
          </div>

          <Map
            id={id}
            initialViewState={initialViewState}
            viewState={viewState}
            mapboxAccessToken={process.env.STORYBOOK_MAPBOX_API_TOKEN}
            onMapViewStateChange={(v) => {
              setViewState(v);
            }}
          >
            {(map) => (
              <>
                <LayerManager
                  map={map}
                  plugin={PluginMapboxGl}
                  providers={{
                    [cartoProvider.name]: cartoProvider.handleData,
                  }}
                >
                  <Layer
                    id="test-vector"
                    type="vector"
                    params={{
                      color: '#00CC00',
                    }}
                    source={{
                      type: 'vector',
                      provider: {
                        type: 'carto',
                        account: 'wri-01',
                        layers: [
                          {
                            options: {
                              cartocss:
                                '#wdpa_protected_areas {  polygon-opacity: 1.0; polygon-fill: #704489 }',
                              cartocss_version: '2.3.0',
                              sql: 'SELECT * FROM wdpa_protected_areas',
                            },
                            type: 'cartodb',
                          },
                        ],
                      },
                    }}
                    render={{
                      layers: [
                        {
                          type: 'line',
                          'source-layer': 'layer0',
                          paint: {
                            'line-color': '#FFCC00',
                            'line-opacity': 0.5,
                            'line-width': 2,
                          },
                        },
                      ],
                    }}
                  />

                  <Layer
                    id="bii-change"
                    type="raster"
                    source={{
                      type: 'raster',
                      tiles: [
                        'https://storage.googleapis.com/geo-ai/Redes/Tiles/Tsaratanana/BII/{z}/{x}/{y}.png',
                      ],
                    }}
                    opacity={biiChangeOpacity}
                  />
                  <Layer
                    id="bii-deck-layer"
                    type="deck"
                    source={{ parse: false }}
                    render={{ parse: false }}
                    deck={BII_ANIMATED_DECK_LAYER}
                  />
                  <Layer
                    id="satellite-deck-layer"
                    type="deck"
                    source={{ parse: false }}
                    render={{ parse: false }}
                    deck={SATELLITE_DECK_LAYER}
                  />
                </LayerManager>

                <Legend
                  className="left-4 w-[330px] bottom-4 absolute rounded-xl"
                  maxHeight={'1030px'}
                  collapsable={false}
                  onChangeOrder={function F() {}}
                >
                  <LegendItem
                    description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                    icon={null}
                    id="gradient-example-1"
                    name="BII Change - 2017-2020"
                  >
                    <LegendTypeGradient
                      className="text-sm text-gray-300"
                      items={[
                        {
                          color: '#5E8C5B',
                          value: '0',
                        },
                        {
                          color: null,
                          value: '20',
                        },
                        {
                          color: null,
                          value: '40',
                        },
                        {
                          color: null,
                          value: '60',
                        },
                        {
                          color: null,
                          value: '80',
                        },
                        {
                          color: '#B6D3B5',
                          value: '100',
                        },
                      ]}
                    />
                  </LegendItem>
                </Legend>
              </>
            )}
          </Map>
        </div>
      </div>
    </div>
  );
};

export const Tsaratanana = Template.bind({});
Tsaratanana.args = {
  id: 'tsaratanana-layer',
  className: '',
  viewport: {},
  initialViewState: {
    bounds: [48.69140625000001, -14.093957177836236, 49.04296875, -13.752724664396975],
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
