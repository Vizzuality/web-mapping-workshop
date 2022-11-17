import { ReactNode } from 'react';

export interface LegendItemProps {
  id: string;
  name: string;
  description?: string;
  icon?: ReactNode;
  checkbox?: boolean;
  checked?: boolean;
  children?: ReactNode;
  checkbox?: boolean;
  onCheck?: (e: any) => void;
}
