import { Feature, Polygon } from 'geojson'
import { polygon } from '@turf/helpers'
export const isPolygonOrFeatureOfPolygons = (feature: Feature): boolean => {
  if (feature.type === 'FeatureCollection' &&
    feature.features.length > 1 &&
    feature.features.every(f => f.geometry.type === 'Polygon' || f.geometry.type === 'MultiPolygon') === true) {
    return true
  }

  if (feature.type === 'Polygon' || feature.type === 'MultiPolygon') {
    return true
  }

  return false
}

export const extractPolygons = (feature: Feature): Polygon[] => {
  if (feature.type === 'FeatureCollection') {
    return feature.features.map(f => ({ ...f.geometry, properties: f.properties }))
  }

  return [feature]
}
