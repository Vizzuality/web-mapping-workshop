import React, { useMemo, useState } from 'react';

import { ViewState } from 'react-map-gl';

import cx from 'classnames';

import { TileLayer } from '@deck.gl/geo-layers';
import { BitmapLayer } from '@deck.gl/layers';
import { MapboxLayer } from '@deck.gl/mapbox';
import GL from '@luma.gl/constants';
import { Story } from '@storybook/react/types-6-0';
import PluginMapboxGl from '@vizzuality/layer-manager-plugin-mapboxgl';
import CartoProvider from '@vizzuality/layer-manager-provider-carto';
import { LayerManager, Layer } from '@vizzuality/layer-manager-react';
import parseAPNG from 'apng-js';
import useBreakpoint from 'use-breakpoint';
import { useInterval } from 'usehooks-ts';

import Icon from 'components/icon';
import Map from 'components/map';
import Legend from 'components/map/legend';
import LegendItem from 'components/map/legend/item/component';
import LegendTypeGradient from 'components/map/legend/types/gradient';
import { CustomMapProps } from 'components/map/types';
import { BREAKPOINTS } from 'styles/styles.config';

import PAUSE_SVG from 'svgs/ui/pause.svg?sprite';
import PLAY_SVG from 'svgs/ui/play.svg?sprite';

const cartoProvider = new CartoProvider();

const StoryMap = {
  title: 'Exercises/DeckGL',
  component: Map,
  argTypes: {},
};

export default StoryMap;

const Template: Story<CustomMapProps> = (args: CustomMapProps) => {
  const { id, initialViewState } = args;
  const { minWidth } = useBreakpoint(BREAKPOINTS);

  const [viewState, setViewState] = useState<Partial<ViewState>>();

  const [biiOpacity, setBiiOpacity] = useState(1);
  const [biiChangeOpacity, setHumanFootprintOpacity] = useState(0);
  const [satelliteOpacity, setSatelliteOpacity] = useState(1);

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
        opacity: satelliteOpacity,
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
  }, [frame, initialViewState.bounds, satelliteOpacity]);

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

  const YEARS = [
    {
      value: 2017,
      label: '2017',
    },
    {
      value: 2018,
      label: '2018',
    },
    {
      value: 2019,
      label: '2019',
    },
    {
      value: 2020,
      label: '2020',
    },
  ];

  return (
    <div className="relative w-full -m-4 h-full bg-[url('/images/tsaratanana-background.png')] bg-no-repeat">
      <div className="max-w-[1630px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="m-20 h-[700px] border-[30px] rounded-3xl border-black bg-black">
          <div className="relative w-full h-full overflow-hidden rounded-2xl">
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

                  {/* Timeline */}
                  <div className="absolute z-10 flex items-center pt-1 pb-3.5 pl-6 pr-12 space-x-7 text-white bg-black rounded-full c-timeline-slider top-4 left-4 w-[330px]">
                    <button
                      className="w-6 pt-2.5"
                      type="button"
                      onClick={() => {
                        setDelay(delay === null ? 1000 : null);
                      }}
                    >
                      {!delay && <Icon icon={PLAY_SVG} className="w-6 h-6" />}
                      {delay && <Icon icon={PAUSE_SVG} className="w-5 h-6" />}
                    </button>
                    <div className="flex flex-col space-y-3 w-[230px]">
                      <input
                        className="w-full h-px bg-white rounded-lg appearance-none cursor-pointer"
                        type="range"
                        id="tickmarks"
                        min={2017}
                        max={2020}
                        value={2017 + frame}
                        onChange={(e) => {
                          setDelay(null);
                          setFrame(+e.target.value - 2017);
                        }}
                      />

                      <datalist
                        id="tickmarks"
                        className="pointer-events-none absolute z-20 flex space-x-[31px]  text-white top-[6px] right-[30px]"
                      >
                        {YEARS.map((y) => {
                          return (
                            <div key={y.label} className="flex flex-col items-center space-y-1">
                              <div
                                className={cx({
                                  'w-1.5 h-1.5 bg-white rounded-full': true,
                                  'scale-150': 2017 + frame === y.value,
                                })}
                              />
                              <option
                                className={cx({
                                  'font-sans transition ease-in-out delay-300 text-sm': true,
                                  'font-bold': 2017 + frame === y.value,
                                })}
                                value={y.value}
                                label={y.label}
                              />
                            </div>
                          );
                        })}
                      </datalist>
                    </div>
                  </div>

                  <Legend
                    className="left-4 max-w-[330px] bottom-4 py-4 px-2 absolute rounded-xl z-10"
                    maxHeight={'1030px'}
                    collapsable={minWidth < BREAKPOINTS.lg}
                    sortable={false}
                  >
                    <LegendItem
                      description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                      icon={null}
                      id="gradient-example-1"
                      name="BII - 2017-2020"
                      checkbox
                      checked={!!biiOpacity}
                      onCheck={(e) => {
                        setBiiOpacity(e.target.checked ? 1 : 0);
                      }}
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

                    <LegendItem
                      description="Lorem ipsum dolor sit amet consectetur adipisicing elit."
                      icon={null}
                      id="gradient-example-1"
                      name="BII Change - 2017-2020"
                      checkbox
                      checked={!!biiChangeOpacity}
                      onCheck={(e) => {
                        setHumanFootprintOpacity(e.target.checked ? 1 : 0);
                      }}
                    >
                      <LegendTypeGradient
                        className="text-sm text-gray-300"
                        items={[
                          {
                            color: '#E79F5F',
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
                            color: '#F1C48F',
                            value: null,
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
                            color: '#8FB0F1',
                            value: '100',
                          },
                        ]}
                      />
                    </LegendItem>
                    <LegendItem
                      icon={null}
                      id="satellite-layer"
                      name="Satellite"
                      checkbox
                      checked={!!satelliteOpacity}
                      onCheck={(e) => {
                        setSatelliteOpacity(e.target.checked ? 1 : 0);
                      }}
                    />
                  </Legend>
                </>
              )}
            </Map>
          </div>
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
    bounds: [48.494319, -14.0634, 48.967417, -13.834493],
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
