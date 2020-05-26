# clouda-exercise


- Write the same function as above to match the case that:
  - The series does not always contains end_date or start_date (so you want the range of elements between start_date and end_date even if there's not the exact value in series?)
  - Start_date and end_date don’t match the “x” key in the serie (so you want for fist case:range start_date to last element in list? and for second case: end_date to first element in list?)

- Consider that we want to display the data with the key “extra” on mouse over on a point of the key “score”. Write a function to format the data for this use case. (Format data how? Retrieve them given an input? Concatenate them, provide them as an object? Is possible to have an input/output example?)

---

# Response

## First part

```
- Write a function that having a start_date and an end_date as input returns the subset of data included between the two for the slug ‘aggregation-overall’ and for the key ‘score’
  - Assume the start_date and end_date exactly match the “x” key in the serie
  - start_date and end_date must be included in the returned data (you mean in the Expected result?).
  - The series always contains start_date and end_date
	
  Input: 
  start_date: "2015-08-19T14:00:19.352000Z"
  end_date: "2015-10-12T07:27:47.493000Z"

  Expected result:
  [
    {
      "y":282,
      "x":"2015-08-19T14:00:19.352000Z"
    },
    {
      "y":227,
      "x":"2015-10-08T14:45:31.991000Z"
    },
    {
      "y":185,
      "x":"2015-10-12T07:27:47.493000Z"
    }
  ]
```

For this first part of the exercise I wrote a function called `scoreIntervalQuery`. 

```javascript
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
  if (typeof start_date === "undefined") throw Errors.START_DATE_NOT_DEFINED;
  if (typeof start_date !== "string") throw Errors.START_DATE_TYPE_IS_NOT_A_STRING;
  if (typeof end_date === "undefined") throw Errors.END_DATE_NOT_DEFINED;
  if (typeof end_date !== "string") throw Errors.END_DATE_TYPE_IS_NOT_A_STRING;

  // cast date from string to date format
  const startDateCast = new Date(start_date);
  const endDateCast = new Date(end_date);

  // check cast date
  if (
    startDateCast === Constants.OTHERS.INVALID_DATE ||
    endDateCast === Constants.OTHERS.INVALID_DATE
  ) throw Errors.CAST_START_DATE_END_DATE_ERROR;

  // extract score object & check
  let overallData =
    data.data !== undefined && data.data.length > 0 ?
      data.data.filter(elem => elem.slug === Constants.SLUGS.AGGREGATION_OVERALL) : [];
  if (overallData.length === 0) throw Errors.NO_DATA_FOR_SLUG_AGGREGATION_OVERALL;

  // extract details object & check
  let scoreData = overallData.map(elem => elem.details);
  if (scoreData.length === 0) throw Errors.NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL;

  // extract series for key score & check
  let scoreDataSeries = scoreData[0].filter(elem => elem.key === Constants.KEYS.SCORE);
  if (
    scoreDataSeries.length === 0 ||
    typeof scoreDataSeries[0].series === "undefined"
  ) throw Errors.NO_SERIES_FOR_KEY_SCORE_IN_SLUG_AGGREGATION_OVERALL;

  // start search, brute force O(n) first
  const result = [];
  scoreDataSeries[0].series.forEach(elem => {
    if (typeof elem.x === "undefined") return
    let currentDateToCompare = new Date(elem.x);
    if (currentDateToCompare === Constants.OTHERS.INVALID_DATE) return

    if (currentDateToCompare >= startDateCast && currentDateToCompare <= endDateCast) {
      result.push(elem);
    }
  });

  const timeToComplete = (performance.now() - now) / 1000
  console.log(`Results found naive: ${result.length} in ${timeToComplete} seconds`);
  return {
    result: result,
    start_date: start_date,
    end_date: end_date
  };
}
```

It takes two parameters and return an object such this:
```javascript
{
  "result" : array,
  "start_date" : start_date,
  "end_date" : end_date
}
```

I assumed that the inputs are strings, so the function checks if input types are string otherwise it fires an error.
I added some checks while exploring the data object in case some properties or data are missing (never say never).

Finally I made a 2nd function which is called `scoreIntervalQueryOptimized` that search for date range with 
binary search rather than a naive scan of all the values. This is possible because the series is sorted ASC by date.

## HOW TO RUN THE CODE

The functions are made under node env so, once cloned the repo, running `npm start` will execute the file inside 
`scr/index.js`;

In this moment there are two functions calls, the one naive and the other optimized.
```javascript
// src/index.js

// Exercise
scoreIntervalQuery('2015-08-19T14:00:19.352000Z', '2015-10-12T07:27:47.493000Z');
scoreIntervalQueryOptimized('2015-08-19T14:00:19.352000Z', '2015-10-12T07:27:47.493000Z');
```

## RESULTS
Here some results ran on my machine with node (NB: run one instruction at time to prevent memory caching of any kind):


```javascript
// Exercise
scoreIntervalQuery('2015-08-19T14:00:19.352000Z', '2015-10-12T07:27:47.493000Z');
// Results found naive: 3 in 0.0025558149814605712 seconds
scoreIntervalQueryOptimized('2015-08-19T14:00:19.352000Z', '2015-10-12T07:27:47.493000Z');
// Results found binary: 3 in 0.00041268500685691834 seconds


// All elements (worst case for optimized cause optimization is === to naive solution)
scoreIntervalQuery('2015-08-19T14:00:19.352000Z', '2019-11-19T17:14:34.796982Z');
//Results found naive: 1086 in 0.0026423140168190004 seconds
scoreIntervalQueryOptimized('2015-08-19T14:00:19.352000Z', '2019-11-19T17:14:34.796982Z');
// Results found binary: 1086 in 0.00235623699426651 seconds


// Worst case for linear solution last few dates
scoreIntervalQuery('2019-08-02T10:33:07.768360Z', '2019-10-31T11:24:10.593497Z');
// Results found naive: 5 in 0.002391831010580063 seconds
scoreIntervalQueryOptimized('2019-08-02T10:33:07.768360Z', '2019-10-31T11:24:10.593497Z');
// Results found binary: 5 in 0.00040950697660446165 seconds

