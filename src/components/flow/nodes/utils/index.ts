import { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'

interface ExtendedPolygon extends Polygon {
  properties: Record<string, any>
}

export const isPolygonOrFeatureOfPolygons = (feature: Feature | FeatureCollection | Polygon | MultiPolygon): boolean => {
  if (feature.type === 'FeatureCollection' &&
    feature.features.length > 1 &&
    feature.features.every(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon')) {
    return true
  }

  if (feature.type === 'Polygon' || feature.type === 'MultiPolygon') {
    return true
  }

  return false
}

export const extractPolygons = (feature: Feature | FeatureCollection): ExtendedPolygon[] => {
  if (feature.type === 'FeatureCollection') {
    // @ts-expect-error For some reason ts is not recognizing this as valid type
    return feature.features.map(f => ({ ...f.geometry, properties: f.properties }))
  }
  // @ts-expect-error For some reason ts is not recognizing this has coordinates
  return [feature]
}
