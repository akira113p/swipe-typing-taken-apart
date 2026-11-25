// Every tunable number of the recognizer, with its unit.
//
// The paper does not publish its values. These were chosen by a grid search on 1,500
// simulated swipes (tests/finger.js); around them accuracy changes by less than the noise,
// so the round numbers were kept.

export const DEFAULTS = {
  samplePoints: 48, //            N: points per resampled path
  shapeSize: 1, //                L: the larger side of the normalized box ("shape units")
  minShapeSpanKeys: 0.5, //       smaller swipes are not blown up (taps)
  sigmaShape: 0.12, //            shape units: tolerance of the shape judge
  sigmaPlaceKeys: 0.4, //         key widths: tolerance of the place judge
  sigmaLettersKeys: 0.25, //      key widths: how far from a key centre a finger usually passes
  pruneRadiusKeys: 1.5, //        key widths: first and last key must be this close to the swipe's ends
  priorWeight: 0.25, //           lambda: 1 (plain Bayes) let common words swamp the geometry
  usePruning: true,
  useShape: true,
  usePlace: true,
  useLetters: true,
  usePrior: true,
};
