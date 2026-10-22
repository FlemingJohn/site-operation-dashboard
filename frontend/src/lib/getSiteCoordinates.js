const CITY_COORDINATES = {
  ahmedabad: [23.02, 72.57],
  bengaluru: [12.97, 77.59],
  bangalore: [12.97, 77.59],
  bhubaneswar: [20.3, 85.82],
  chandigarh: [30.73, 76.78],
  chennai: [13.08, 80.27],
  coimbatore: [11.02, 76.96],
  delhi: [28.61, 77.21],
  hyderabad: [17.39, 78.49],
  jaipur: [26.91, 75.79],
  kochi: [9.93, 76.27],
  kolkata: [22.57, 88.36],
  lucknow: [26.85, 80.95],
  madurai: [9.93, 78.12],
  mumbai: [19.08, 72.88],
  nagpur: [21.15, 79.09],
  pune: [18.52, 73.86],
  surat: [21.17, 72.83],
  tambaram: [12.92, 80.13],
  thiruvananthapuram: [8.52, 76.94],
  tuticorin: [8.76, 78.13],
  visakhapatnam: [17.69, 83.22],
};

const REGION_COORDINATES = {
  North: [28.61, 77.21],
  South: [12.97, 77.59],
  East: [22.57, 88.36],
  West: [19.08, 72.88],
};

const INDIA_CENTER = [21.15, 79.09];
const SPREAD_DEGREES = 0.08;
const SPREAD_STEPS = 8;

const spreadOut = ([lat, lng], id) => {
  const angle = ((Number(id) % SPREAD_STEPS) / SPREAD_STEPS) * 2 * Math.PI;
  return [lat + Math.sin(angle) * SPREAD_DEGREES, lng + Math.cos(angle) * SPREAD_DEGREES];
};

export const getSiteCoordinates = (site) => {
  const base =
    CITY_COORDINATES[site.city?.trim().toLowerCase()] ??
    REGION_COORDINATES[site.region] ??
    INDIA_CENTER;
  return spreadOut(base, site.id);
};
