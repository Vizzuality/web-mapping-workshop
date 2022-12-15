import Icon from 'components/icon';
import { PinComponentProps } from 'components/map/layers/clusters/types';
import Tooltip from 'components/tooltip';

// import PIN from 'svgs/ui/star.svg?sprite';
import PIN from 'svgs/map/marker.svg?sprite';

import { getColor } from '../helper';

export const MapPin = ({ properties }: PinComponentProps) => {
  return (
    <Tooltip content={<div className="p-2 text-xs bg-white">{properties.type}</div>}>
      <div className="opacity-60">
        <Icon icon={PIN} className="w-4 h-4" style={{ fill: getColor(properties.type) }} />
      </div>
    </Tooltip>
  );
};

export default MapPin;
