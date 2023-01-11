import Icon from 'components/icon';
import { PinComponentProps } from 'components/map/layers/clusters/types';

// import PIN from 'svgs/ui/star.svg?sprite';
import PIN from 'svgs/map/marker.svg?sprite';

import { getColor } from '../helper';

export const MapPin = ({ properties }: PinComponentProps) => {
  return (
    <div className="opacity-60">
      <Icon icon={PIN} className="w-4 h-4" style={{ fill: getColor(properties.type) }} />
    </div>
  );
};

export default MapPin;
