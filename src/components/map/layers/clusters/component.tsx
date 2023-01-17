import { useMemo } from 'react';

import { Marker, useMap } from 'react-map-gl';

import Supercluster from 'supercluster';

import type { ClusterLayerProps } from './types';

export const ClusterLayer = ({
  mapId,
  data,
  MarkerComponent,
  ClusterComponent,
  onSelectMarker,
}: ClusterLayerProps) => {
  const { [mapId]: mapRef } = useMap();
  const bbox = mapRef.getBounds().toArray().flat() as [number, number, number, number];
  const zoom = mapRef.getZoom();

  const SUPERCLUSTER: Supercluster = useMemo(
    () => new Supercluster({ radius: 40 }).load(data),
    [data]
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
        // Be sure that the id you use in the key is unique, otherwise you will get rerender blinking
        return (
          <Marker key={properties.cartodb_id} latitude={latitude} longitude={longitude}>
            <MarkerComponent key={`marker-${properties.cartodb_id}`} properties={properties} />
          </Marker>
        );
      })}
    </>
  );
};

export default ClusterLayer;
