import { useMemo } from 'react';

import { Marker } from 'react-map-gl';

import Supercluster from 'supercluster';

import type { ClusterLayerProps } from './types';

export const ClusterLayer = ({
  dataFeatures,
  zoom,
  bbox,
  MarkerComponent,
  ClusterComponent,
  onSelectMarker,
}: ClusterLayerProps) => {
  const SUPERCLUSTER: Supercluster = useMemo(
    () => new Supercluster({ radius: 40 }).load(dataFeatures),
    [dataFeatures]
  );

  const clusters = useMemo(() => {
    if (!SUPERCLUSTER) return [];

    return SUPERCLUSTER.getClusters(bbox, zoom);
  }, [SUPERCLUSTER, bbox, zoom]);

  const handleSelectMarker = (clusterId: number, coordinates: number[]) => {
    const nextZoom = SUPERCLUSTER.getClusterExpansionZoom(clusterId);
    onSelectMarker(nextZoom, coordinates);
  };

  return (
    <>
      {clusters.map((feature) => {
        const { id, geometry, properties } = feature;
        const { coordinates } = geometry;
        const [longitude, latitude] = coordinates;
        // The feature can be a cluster or a point.
        // If is a cluster (properties.cluster = true):
        // properties = {
        //   cluster: true
        //   cluster_id: number
        //   point_count: number
        //   point_count_abbreviated: number
        // }
        const clusterFeaturesProps = feature.properties as Supercluster.ClusterProperties;
        if (clusterFeaturesProps.cluster) {
          const { cluster_id: clusterId } = clusterFeaturesProps;
          const leaves = SUPERCLUSTER.getLeaves(clusterId, Infinity);
          return (
            <Marker
              key={id}
              latitude={latitude}
              longitude={longitude}
              onClick={() => handleSelectMarker(clusterId, coordinates)}
            >
              <ClusterComponent properties={clusterFeaturesProps} leaves={leaves} />
            </Marker>
          );
        }

        // If is not a cluster, it's a PointFeature, so the properties will be the FeatureProps
        return (
          <Marker key={id} latitude={latitude} longitude={longitude}>
            <MarkerComponent properties={properties} />
          </Marker>
        );
      })}
    </>
  );
};

export default ClusterLayer;
