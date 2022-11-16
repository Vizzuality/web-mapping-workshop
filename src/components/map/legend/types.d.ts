export interface LegendProps {
  className?: string;
  children: React.ReactNode;
  maxHeight: string | number;
  collapsable?: boolean;
  onChangeOrder: (id: string[]) => void;
}

export type LegendTypeItem = {
  value: string;
  color: string;
};
