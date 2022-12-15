import { useMemo } from 'react';

import { Marker } from 'react-map-gl';

import { BBox } from 'geojson';
import Supercluster from 'supercluster';

import type { ClusterLayerProps } from './types';

export const ClusterLayer = ({
  data,
  map,
  MarkerComponent,
  ClusterComponent,
  onSelectMarker,
}: ClusterLayerProps) => {
  const bbox = map.getBounds().toArray().flat() as BBox;
  const zoom = map.getZoom();

  const SUPERCLUSTER: Supercluster = useMemo(
    () => new Supercluster({ radius: 40 }).load(data?.features),
    [data?.features]
  );

  const clusters = useMemo(() => {
    if (!SUPERCLUSTER) return [];

    return SUPERCLUSTER.getClusters(bbox, zoom);
  }, [SUPERCLUSTER, bbox, zoom]);

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
              onClick={() => onSelectMarker(properties)}
            >
              <ClusterComponent
                properties={properties as Supercluster.ClusterProperties}
                leaves={leaves}
              />
            </Marker>
          );
        }

        // If is not a cluster, it's a PointFeature, so the properties will be the FeatureProps
        return (
          <Marker
            key={id}
            latitude={latitude}
            longitude={longitude}
            onClick={() => onSelectMarker(properties)}
          >
            <MarkerComponent properties={feature} />
          </Marker>
        );
      })}
    </>
  );
};

export default ClusterLayer;
