import { Source, SourceProps, Layer, LayerProps } from 'react-map-gl';

const LayerContainer = ({ source, layers }: { source: SourceProps; layers: LayerProps[] }) => (
  <Source {...source}>
    {layers?.map((layer, i) => {
      const beforeId = i === 0 ? null : `${layers[i - 1]}-layer`;
      return <Layer key={layer.id} {...layer} beforeId={beforeId} />;
    })}
  </Source>
);

export default LayerContainer;
