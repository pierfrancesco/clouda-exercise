// DATA
const data = require('../static/data.json');

// MODELS
const Errors = require('./models/Errors');
const Constants = require('./models/Constants');

// CONTROLLERS
const {binarySearchRange, binarySearch} = require('./controllers/utils');

// OTHER
const {performance} = require('perf_hooks');

/***************************************************************************/

/**
 * scoreIntervalQuery - Time Complexity: O(n)
 * @param {String} start_date
 * @param {String} end_date
 * returns {Array}
 *
 * Error: Errors.START_DATE_NOT_DEFINED
 * Error: Errors.START_DATE_TYPE_IS_NOT_A_STRING
 * Error: Errors.END_DATE_NOT_DEFINED
 * Error: Errors.END_DATE_TYPE_IS_NOT_A_STRING
 * Error: Errors.CAST_START_DATE_END_DATE_ERROR
 * Error: Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL
 * Error: Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL
 * Error: Errors.NO_SERIES_FOR_KEY_SCORE_IN_SLUG_AGGREGATION_OVERALL
 */
const scoreIntervalQuery = (start_date, end_date) => {
  const now = performance.now();

  // inputs check
  if (typeof start_date === "undefined") throw Errors.START_DATE_NOT_DEFINED.message;
  if (typeof start_date !== "string") throw Errors.START_DATE_TYPE_IS_NOT_A_STRING.message;
  if (typeof end_date === "undefined") throw Errors.END_DATE_NOT_DEFINED.message;
  if (typeof end_date !== "string") throw Errors.END_DATE_TYPE_IS_NOT_A_STRING.message;

  // cast date from string to date format
  const startDateCast = new Date(start_date);
  const endDateCast = new Date(end_date);

  // check cast date
  if (
    startDateCast === Constants.OTHERS.INVALID_DATE ||
    endDateCast === Constants.OTHERS.INVALID_DATE
  ) throw Errors.CAST_START_DATE_END_DATE_ERROR.message;

  // extract score object & check
  let overallData =
    data.data !== undefined && data.data.length > 0 ?
      data.data.filter(elem => elem.slug === Constants.SLUGS.AGGREGATION_OVERALL) : [];
  if (overallData.length === 0) throw Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL.message;

  // extract details object & check
  let scoreData = overallData.map(elem => elem.details);
  if (scoreData.length === 0) throw Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL.message;

  // extract series for key score & check
  let scoreDataSeries = scoreData[0].filter(elem => elem.key === Constants.KEYS.SCORE);
  if (
    scoreDataSeries.length === 0 ||
    typeof scoreDataSeries[0].series === "undefined"
  ) throw Errors.NO_SERIES_FOR_KEY_SCORE_IN_SLUG_AGGREGATION_OVERALL.message;

  // start search, with exit condition if currentDate is > then end date
  const result = [];
  scoreDataSeries[0].series.some(elem => {
    if (typeof elem.x === "undefined") return false
    let currentDateToCompare = new Date(elem.x);
    if (currentDateToCompare === Constants.OTHERS.INVALID_DATE) return false

    if (currentDateToCompare >= startDateCast && currentDateToCompare <= endDateCast) {
      result.push(elem);
      return false;
    }

    if (currentDateToCompare > endDateCast) return true;
  });

  const timeToComplete = (performance.now() - now) / 1000
  console.log(`Results found with "some": ${result.length} in ${timeToComplete} seconds`);
  return result;
}

/***************************************************************************/

/**
 * scoreIntervalQuery - Time Complexity: O(M * log N)
 * @param {String} start_date
 * @param {String} end_date
 * returns {Array}
 *
 * Error: Errors.START_DATE_NOT_DEFINED
 * Error: Errors.START_DATE_TYPE_IS_NOT_A_STRING
 * Error: Errors.END_DATE_NOT_DEFINED
 * Error: Errors.END_DATE_TYPE_IS_NOT_A_STRING
 * Error: Errors.CAST_START_DATE_END_DATE_ERROR
 * Error: Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL
 * Error: Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL
 * Error: Errors.NO_SERIES_FOR_KEY_SCORE_IN_SLUG_AGGREGATION_OVERALL
 */
const scoreIntervalQueryOptimized = (start_date, end_date) => {
  const now = performance.now();

  // inputs check
  if (typeof start_date === "undefined") throw Errors.START_DATE_NOT_DEFINED.message;
  if (typeof start_date !== "string") throw Errors.START_DATE_TYPE_IS_NOT_A_STRING.message;
  if (typeof end_date === "undefined") throw Errors.END_DATE_NOT_DEFINED.message;
  if (typeof end_date !== "string") throw Errors.END_DATE_TYPE_IS_NOT_A_STRING.message;

  // cast date from string to date format
  const startDateCast = new Date(start_date);
  const endDateCast = new Date(end_date);

  // check cast date
  if (
    startDateCast === Constants.OTHERS.INVALID_DATE ||
    endDateCast === Constants.OTHERS.INVALID_DATE
  ) throw Errors.CAST_START_DATE_END_DATE_ERROR.message;

  // extract score object & check
  let overallData =
    data.data !== undefined && data.data.length > 0 ?
      data.data.filter(elem => elem.slug === Constants.SLUGS.AGGREGATION_OVERALL) : [];
  if (overallData.length === 0) throw Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL.message;

  // extract details object & check
  let scoreData = overallData.map(elem => elem.details);
  if (scoreData.length === 0) throw Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL.message;

  // extract series for key score & check
  let scoreDataSeries = scoreData[0].filter(elem => elem.key === Constants.KEYS.SCORE);
  if (
    scoreDataSeries.length === 0 ||
    typeof scoreDataSeries[0].series === "undefined"
  ) throw Errors.NO_SERIES_FOR_KEY_SCORE_IN_SLUG_AGGREGATION_OVERALL.message;

  // start search, binary first, then scan O(m * log n) first
  const result = [];
  const indexToStartSearch = binarySearchRange(scoreDataSeries[0].series, startDateCast, endDateCast);

  // start search left to right;
  let rightReached = false;
  let rightIndex = indexToStartSearch;
  while (!rightReached) {
    result.push(scoreDataSeries[0].series[rightIndex]);
    rightIndex++;
    if (
      scoreDataSeries[0].series[rightIndex] === undefined ||
      new Date(scoreDataSeries[0].series[rightIndex].x) > endDateCast) rightReached = true;
  }

  let leftReached = false;
  let leftIndex = indexToStartSearch;
  while (!leftReached) {
    leftIndex--;
    if (leftIndex < 0 || new Date(scoreDataSeries[0].series[leftIndex].x) < startDateCast) leftReached = true;
    if (leftReached === false) result.push(scoreDataSeries[0].series[leftIndex]);
  }

  const timeToComplete = (performance.now() - now) / 1000
  console.log(`Results found binary: ${result.length} in ${timeToComplete} seconds`);

  return result;
}

// Best case for first function
scoreIntervalQuery('2015-08-19T14:00:19.352000Z', '2015-10-12T07:27:47.493000Z');
scoreIntervalQueryOptimized('2015-08-19T14:00:19.352000Z', '2015-10-12T07:27:47.493000Z');

// All elements (worst case for optimized cause optimization is === to with "some" solution)
//scoreIntervalQuery('2015-08-19T14:00:19.352000Z', '2019-11-19T17:14:34.796982Z');
//scoreIntervalQueryOptimized('2015-08-19T14:00:19.352000Z', '2019-11-19T17:14:34.796982Z');

// Worst case for linear solution last few dates
//scoreIntervalQuery('2019-08-02T10:33:07.768360Z', '2019-10-31T11:24:10.593497Z');
//scoreIntervalQueryOptimized('2019-08-02T10:33:07.768360Z', '2019-10-31T11:24:10.593497Z');

//scoreIntervalQuery('2014-08-19T14:00:19.352000Z', '2020-10-12T07:27:47.493000Z');
//scoreIntervalQueryOptimized('2014-08-19T14:00:19.352000Z', '2020-10-12T07:27:47.493000Z');

/***************************************************************************/

/**
 * retrieveExtraInfo - Time Complexity O(log n)
 * @param {String} keyScore
 * return {Object}
 *
 * Error: Errors.KEY_STORE_NOT_A_STRING
 * Error: Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL
 * Error: Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL
 * Error: Errors.NO_SERIES_FOR_KEY_EXTRA_IN_SLUG_AGGREGATION_OVERALL
 */
const retrieveExtraInfo = (keyScore) => {
  // inputs check
  if (typeof keyScore !== "string") throw Errors.KEY_STORE_NOT_A_STRING.message

  // extract score object & check
  let overallData =
    data.data !== undefined && data.data.length > 0 ?
      data.data.filter(elem => elem.slug === Constants.SLUGS.AGGREGATION_OVERALL) : [];
  if (overallData.length === 0) throw Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL.message;

  // extract details object & check
  let extraData = overallData.map(elem => elem.details);
  if (extraData.length === 0) throw Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL.message;

  // extract series for key score & check
  let extraDataSeries = extraData[0].filter(elem => elem.key === Constants.KEYS.EXTRA);
  if (
    extraDataSeries.length === 0 ||
    typeof extraDataSeries[0].series === "undefined"
  ) throw Errors.NO_SERIES_FOR_KEY_EXTRA_IN_SLUG_AGGREGATION_OVERALL.message;

  // perform binary search
  let result = binarySearch(extraDataSeries[0].series, new Date(keyScore));
  if (typeof result.y !== "undefined") return result.y
  return {}
}

console.log(retrieveExtraInfo("2017-01-17T12:56:49.551434Z"));


