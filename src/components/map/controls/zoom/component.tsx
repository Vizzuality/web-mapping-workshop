import { FC, useCallback, MouseEvent } from 'react';

import { useMap } from 'react-map-gl';

import cx from 'classnames';

import Icon from 'components/icon';

import ZOOM_IN_SVG from 'svgs/map/zoom-in.svg?sprite';
import ZOOM_OUT_SVG from 'svgs/map/zoom-out.svg?sprite';

import type { ZoomControlProps } from './types';

export const ZoomControl: FC<ZoomControlProps> = ({ id, className }: ZoomControlProps) => {
  const { [id]: mapRef } = useMap();

  const zoom = mapRef?.getZoom();
  const minZoom = mapRef?.getMinZoom();
  const maxZoom = mapRef?.getMaxZoom();

  const increaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!mapRef) return null;

      mapRef.zoomIn();
    },
    [mapRef]
  );

  const decreaseZoom = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (!mapRef) return null;

      mapRef.zoomOut();
    },
    [mapRef]
  );

  return (
    <div
      className={cx({
        'inline-flex flex-col': true,
        [className]: !!className,
      })}
    >
      <button
        className={cx({
          'mb-0.5 p-0.5 rounded-t-3xl text-white bg-black': true,
          'hover:bg-gray-700 active:bg-gray-600': zoom < maxZoom,
          'opacity-50 cursor-default': zoom >= maxZoom,
        })}
        aria-label="Zoom in"
        type="button"
        disabled={zoom >= maxZoom}
        onClick={increaseZoom}
      >
        <Icon icon={ZOOM_IN_SVG} />
      </button>

      <button
        className={cx({
          'p-0.5 rounded-b-3xl text-white bg-black': true,
          'hover:bg-gray-700 active:bg-gray-600': zoom > minZoom,
          'opacity-50 cursor-default': zoom <= minZoom,
        })}
        aria-label="Zoom out"
        type="button"
        disabled={zoom <= minZoom}
        onClick={decreaseZoom}
      >
        <Icon icon={ZOOM_OUT_SVG} />
      </button>
    </div>
  );
};

export default ZoomControl;
