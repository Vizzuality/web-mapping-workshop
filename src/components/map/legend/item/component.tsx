import { FC, useState } from 'react';

import cx from 'classnames';

// import Checkbox from 'components/forms/checkbox';

import type { LegendItemProps } from './types';

export const LegendItem: FC<LegendItemProps> = ({
  id,
  name,
  description,
  icon,
  children,
  checkbox = false,
}: LegendItemProps) => {
  const [biiChangeOpacity, setHumanFootprintOpacity] = useState(0);
  console.log({ biiChangeOpacity });
  return (
    <div className="relative">
      {checkbox && (
        <input
          type="checkbox"
          className="absolute bg-black cursor-pointer top-3.5 left-3.5 focus:text-black focus:ring-black checked:bg-black"
          checked={!!biiChangeOpacity}
          onChange={(e) => {
            e.preventDefault();
            setHumanFootprintOpacity(e.target.checked ? 1 : 0);
          }}
        />
      )}
      <div
        key={id}
        className={cx({
          'py-3 px-5': true,
          'ml-5': checkbox,
        })}
      >
        <div className="flex">
          <div
            className={cx({
              relative: true,
              'pl-5': icon,
            })}
          >
            {icon && <div className="absolute top-0 left-0">{icon}</div>}
            <div className="text-sm text-white font-heading">{name}</div>
          </div>
        </div>

        <div className="text-sm text-gray-300">{description}</div>

        {children && <div className="mt-2.5">{children}</div>}
      </div>
    </div>
  );
};

export default LegendItem;
