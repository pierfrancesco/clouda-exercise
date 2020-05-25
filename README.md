# clouda-exercise

---
# Requirements

The data in the data.json file represent the data point to be plotted on a line graph.

- Write a function that having a start_date and an end_date as input returns the subset of data included between the two for the slug ‘aggregation-overall’ and for the key ‘score’
  - Assume the start_date and end_date exactly match the “x” key in the serie
  - start_date and end_date must be included in the returned data (you mean in the Expected result?).
  - The series always contains start_date and end_date
	
  Input: 
  start_date: "2015-08-19T14:00:19.352000Z"
  end_date: "2015-10-12T07:27:47.493000Z"

  Expected result:
  ```json
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

- Write the same function as above to match the case that:
  - The series does not always contains end_date or start_date (so you want the range of elements between start_date and end_date even if there's not the exact value in series?)
  - Start_date and end_date don’t match the “x” key in the serie (so you want for fist case:range start_date to last element in list? and for second case: end_date to first element in list?)

- Consider that we want to display the data with the key “extra” on mouse over on a point of the key “score”. Write a function to format the data for this use case. (Format data how? Retrieve them given an input? Concatenate them, provide them as an object? Is possible to have an input/output example?)

---

# Response

## First part

For this first part of the exercise I wrote a function called `scoreIntervalQuery`. 
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

