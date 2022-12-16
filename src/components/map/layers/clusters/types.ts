import React from 'react';

import { Map } from 'mapbox-gl';
import Supercluster from 'supercluster';

export type PinComponentProps = {
  properties: Supercluster.AnyProps;
};

export type ClusterComponentProps = {
  properties: Supercluster.ClusterProperties;
  leaves: Supercluster.PointFeature<Supercluster.AnyProps>[];
};

export type ClusterLayerProps = {
  dataFeatures: Supercluster.PointFeature<Supercluster.AnyProps>[];
  map: Map;
  bbox: [number, number, number, number];
  zoom: number;
  MarkerComponent: React.FC<PinComponentProps>;
  ClusterComponent: React.FC<ClusterComponentProps>;
  onSelectMarker: (nextZoom: number, coordinates: number[]) => void;
};
