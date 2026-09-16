// Pure geometry for the delivery map. No DOM, so it is unit-testable under Node.

// Frame a set of {lat, lon} points in a width x height canvas with proportional
// padding, and hand back an equirectangular projector for that frame. Degenerate
// inputs (one point, or several at the same place) get a minimum span so the
// projection never divides by zero.
export function fitBox(points, { width, height, padFrac = 0.12 } = {}) {
  const lats = points.map((p) => p.lat);
  const lons = points.map((p) => p.lon);
  let west = Math.min(...lons);
  let east = Math.max(...lons);
  let south = Math.min(...lats);
  let north = Math.max(...lats);

  const MIN_SPAN = 4; // degrees
  if (east - west < MIN_SPAN) {
    const mid = (east + west) / 2;
    west = mid - MIN_SPAN / 2;
    east = mid + MIN_SPAN / 2;
  }
  if (north - south < MIN_SPAN) {
    const mid = (north + south) / 2;
    south = mid - MIN_SPAN / 2;
    north = mid + MIN_SPAN / 2;
  }

  const padX = (east - west) * padFrac;
  const padY = (north - south) * padFrac;
  west -= padX; east += padX; south -= padY; north += padY;

  // Preserve aspect ratio. A wide, shallow route (Fort Liberty to Deir ez-Zor spans
  // 119 degrees of longitude but almost no latitude) stretched to fill the canvas
  // squashes degrees-per-pixel differently on each axis — measured at 13.7x vertical
  // on that route — which smears continents into vertical bands. Expand whichever
  // axis is deficient, never contract, so every point stays in frame.
  const canvasAspect = width / height;
  const lonSpan = east - west;
  const latSpan = north - south;
  if (lonSpan / latSpan < canvasAspect) {
    const want = latSpan * canvasAspect;
    const mid = (east + west) / 2;
    west = mid - want / 2;
    east = mid + want / 2;
  } else {
    const want = lonSpan / canvasAspect;
    const mid = (north + south) / 2;
    south = mid - want / 2;
    north = mid + want / 2;
  }

  const bbox = [west, south, east, north];
  const project = (lat, lon) => ({
    x: ((lon - west) / (east - west)) * width,
    y: ((north - lat) / (north - south)) * height,
  });
  return { bbox, project };
}

// Control point for a quadratic bezier that bows perpendicular to a-b.
// bow is a fraction of the a-b distance.
export function arcControl(a, b, bow = 0.22) {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular, consistently to one side so repeated renders never flip the arc.
  return { x: mx + (dy / len) * len * bow, y: my - (dx / len) * len * bow };
}

export function quadPoint(a, c, b, t) {
  const u = 1 - t;
  return {
    x: u * u * a.x + 2 * u * t * c.x + t * t * b.x,
    y: u * u * a.y + 2 * u * t * c.y + t * t * b.y,
  };
}

// Heading along the curve at t, in degrees, for rotating the travelling marker.
export function quadTangent(a, c, b, t) {
  const u = 1 - t;
  const dx = 2 * u * (c.x - a.x) + 2 * t * (b.x - c.x);
  const dy = 2 * u * (c.y - a.y) + 2 * t * (b.y - c.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}
