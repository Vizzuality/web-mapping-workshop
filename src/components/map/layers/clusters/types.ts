import React from 'react';

import { FeatureCollection, Point } from 'geojson';
import { Map } from 'mapbox-gl';
import Supercluster, { ClusterProperties } from 'supercluster';

export type PinComponentProps = {
  properties: Supercluster.AnyProps;
};

export type ClusterComponentProps = {
  properties: ClusterProperties;
  leaves: Supercluster.PointFeature<Supercluster.AnyProps>[];
};

export type ClusterLayerProps = {
  data: FeatureCollection<Point>;
  map: Map;
  MarkerComponent: React.FC<PinComponentProps>;
  ClusterComponent: React.FC<ClusterComponentProps>;
  onSelectMarker: (properties: Supercluster.AnyProps | ClusterProperties) => void;
};
