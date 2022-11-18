import { FC } from 'react';

import cx from 'classnames';

import type { WrapperProps } from './types';

export const Wrapper: FC<WrapperProps> = ({ children, fixedHeight }: WrapperProps) => (
  <div
    className={cx({
      'relative flex w-full space-x-10': true,
      'h-[calc(100vh_-_32px)]': fixedHeight,
    })}
  >
    {children}
  </div>
);

export default Wrapper;
