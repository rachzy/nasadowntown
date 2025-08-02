// Most of this functions were taken from https://github.com/ajhollid/kepler-utils
// I decided pasting them here instead of just importing them from the lib to adapt them to typescript

const toRadians = (deg: number) => (deg * Math.PI) / 180;

/**
 * Calculates the eccentric anomaly of an orbit
 * http://www.jgiesen.de/kepler/kepler.html
 *
 * @param {number} ecc - The eccentricity of the orbit.
 * @param {number} m - The mean anomaly of the orbit.
 * @param {number} precision - The number of decimal places to round to.
 * @returns {number}  - The eccentric anomaly of the orbit, rounded to the specified number of decimal places.
 * @example
 *
 * // returns 0.5236
 * calcEccAnom(0.1, 30, 4);
 */
export const calcEccAnom = (ecc: number, m: number, precision: number) => {
  let M = m;
  const pi = Math.PI;
  const K = pi / 180.0;
  const maxIter = 30;
  let i = 0;
  const delta = 10 ** -precision;
  let E;
  let F;

  M /= 360.0;
  M = 2.0 * pi * (M - Math.floor(M));

  if (ecc < 0.8) E = m;
  else E = pi;

  F = E - ecc * Math.sin(M) - M;
  while (Math.abs(F) > delta && i < maxIter) {
    E -= F / (1.0 - ecc * Math.cos(E));
    F = E - ecc * Math.sin(E) - M;
    i += 1;
  }

  E /= K;
  return Math.round(E * 10 ** precision) / 10 ** precision;
};

/**
 * Calculates the true anomaly of an orbit
 * http://www.braeunig.us/space/plntpos.htm
 *
 * @param {number} ecc - The eccentricity of the orbit.
 * @param {number} eccAnom - The eccentric anomaly of the orbit.
 * @returns {number} - The true anomaly of the orbit.
 *
 * @example
 * // returns 60.00000000000001
 * calcTrueAnom(0.1, 30);
 */
export const calcTrueAnom = (ecc: number, eccAnom: number) => {
  const K = Math.PI / 180;
  const trueAnomArg =
    Math.sqrt((1 + ecc) / (1 - ecc)) * Math.tan(toRadians(eccAnom) / 2);
  if (trueAnomArg < 0) {
    return 2 * (Math.atan(trueAnomArg) / K + 180);
  }
  return 2 * (Math.atan(trueAnomArg) / K);
};

/**
 * Calculates the radius vector of an orbit
 * @param {number} a - The semi-major axis of the orbit.
 * @param {number} e - The eccentricity of the orbit.
 * @param {number} trueAnom - The true anomaly of the orbit.
 * @returns {number} The radius vector of the orbit.
 *
 * @example
 * // returns 1.25
 * calcRadiusVector(1, 0.1, 30);
 */
export const calcRadiusVector = (a: number, e: number, trueAnom: number) =>
  (a * (1 - e ** 2)) / (1 + e * Math.cos(toRadians(trueAnom)));

/**
 * Calculates the heliocentric coordinates of an orbit
 * http://www.stargazing.net/kepler/ellipse.html#twig04
 *
 * @param {number} a - The semi-major axis of the orbit.
 * @param {number} e - The eccentricity of the orbit.
 * @param {number} i - The inclination of the orbit.
 * @param {number} trueAnom - The true anomaly of the orbit.
 * @param {number} lascNode - The longitude of the ascending node.
 * @param {number} lPeri - The longitude of the perihelion.
 * @returns {Object} - The heliocentric coordinates {x,y,z} of the orbit.
 *
 * @example
 * // returns { x: 0.9370425713469824, y: 0.3047684419800381, z: 0.17364817766693033 }
 * calcHelioCentric(1, 0.1, 30, 30, 30, 30);
 */
export const calcHelioCentric = (
  a: number,
  e: number,
  i: number,
  trueAnom: number,
  lascNode: number,
  lPeri: number
) => {
  const r = calcRadiusVector(a, e, trueAnom);
  const x =
    r *
    (Math.cos(toRadians(lascNode)) *
      Math.cos(toRadians(trueAnom + lPeri - lascNode)) -
      Math.sin(toRadians(lascNode)) *
        Math.sin(toRadians(trueAnom + lPeri - lascNode)) *
        Math.cos(toRadians(i)));
  const y =
    r *
    (Math.sin(toRadians(lascNode)) *
      Math.cos(toRadians(trueAnom + lPeri - lascNode)) +
      Math.cos(toRadians(lascNode)) *
        Math.sin(toRadians(trueAnom + lPeri - lascNode)) *
        Math.cos(toRadians(i)));
  const z =
    r *
    (Math.sin(toRadians(trueAnom + lPeri - lascNode)) * Math.sin(toRadians(i)));
  return { x, y, z };
};
