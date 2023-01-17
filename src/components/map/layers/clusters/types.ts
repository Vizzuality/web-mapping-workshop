import React from 'react';

import Supercluster from 'supercluster';

export type PinComponentProps = {
  properties: Supercluster.AnyProps;
};

export type ClusterComponentProps = {
  properties: Supercluster.ClusterProperties;
  leaves: Supercluster.PointFeature<Supercluster.AnyProps>[];
};

export type ClusterLayerProps = {
  mapId: string;
  data: Supercluster.PointFeature<Supercluster.AnyProps>[];
  MarkerComponent: React.FC<PinComponentProps>;
  ClusterComponent: React.FC<ClusterComponentProps>;
  onSelectMarker: (nextZoom: number, coordinates: number[]) => void;
};
