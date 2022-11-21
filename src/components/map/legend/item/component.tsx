import { FC } from 'react';

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
  checked,
  onCheck,
}: LegendItemProps) => {
  return (
    <div className="relative">
      {checkbox && (
        <input
          type="checkbox"
          className="absolute bg-black cursor-pointer top-3.5 left-5 focus:text-black text-black focus:ring-black focus:bg-black checked:bg-black checked:border-[0.5px] checked:border-white hover:border-[0.5px] hover:border-white"
          checked={checked}
          onChange={onCheck}
        />
      )}
      <div
        key={id}
        className={cx({
          'py-3 px-5': true,
          'ml-6': checkbox,
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
            <div className="text-sm font-semibold text-white font-heading">{name}</div>
          </div>
        </div>

        <div className="text-sm text-gray-300">{description}</div>

        {children && <div className="mt-2.5">{children}</div>}
      </div>
    </div>
  );
};

export default LegendItem;
