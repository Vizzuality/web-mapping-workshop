import { useMemo } from 'react';

import { PieChart, Pie, Cell, Tooltip, Label } from 'recharts';

import { ClusterComponentProps } from 'components/map/layers/clusters/types';

import { getColor } from '../helper';

export const MapCluster = ({ leaves, properties }: ClusterComponentProps) => {
  const { point_count: pointCount } = properties;

  const data = useMemo(() => {
    return leaves.reduce((prev: { name: string; value: number }[], { type }) => {
      const hasType = prev.findIndex((item) => item.name === type);
      if (hasType >= 0) {
        const result = [...prev];
        result[hasType] = { ...result[hasType], value: result[hasType].value + 1 };
        return result;
      }
      return [...prev, { name: type, value: 1 }];
    }, []);
  }, [leaves]);

  return (
    <PieChart width={40} height={40}>
      <Pie data={data} innerRadius={10} outerRadius={15} fillOpacity={0.6} dataKey="value">
        {data.map(({ name }) => (
          <Cell key={`cell-${name}`} fill={getColor(name)} />
        ))}
        <Label position="center">{pointCount}</Label>
      </Pie>
      <Tooltip />
    </PieChart>
  );
};

export default MapCluster;
