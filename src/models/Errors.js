module.exports = {
  "START_DATE_NOT_DEFINED": {
    "code": 0,
    "message": "Param start_date is not defined"
  },
  "END_DATE_NOT_DEFINED": {
    "code": 1,
    "message": "Param end_date is not defined"
  },
  "START_DATE_TYPE_IS_NOT_A_STRING": {
    "code": 2,
    "message": "Param start_date is not a String"
  },
  "END_DATE_TYPE_IS_NOT_A_STRING": {
    "code": 3,
    "message": "Param end_date is not a String"
  },
  "NO_DATA_FOR_SLUG_AGGREGATION_OVERALL": {
    "code": 4,
    "message": "Expected data from slug 'aggregation-overall' are empty!"
  },
  "NO_DETAILS_FOR_SLUG_AGGREGATION_OVERALL": {
    "code": 5,
    "message": "Expected property 'details' from object from 'aggregation-overall' but found none!"
  },
  "NO_SERIES_FOR_KEY_SCORE_IN_SLUG_AGGREGATION_OVERALL": {
    "code": 6,
    "message": "There are no records inside series array for key='score' inside 'aggregation-object'"
  },
  "CAST_START_DATE_END_DATE_ERROR": {
    "code": 7,
    "message": "Seems that date input provided for start_date or end_date is not compliant. Please use ISO date format like: YYYY-MM-DDTHH:mm:ss.SSSz"
  },
  "KEY_STORE_NOT_A_STRING": {
    "code": 8,
    "message": "Param keyStore expected as a String"
  },
  "NO_SERIES_FOR_KEY_EXTRA_IN_SLUG_AGGREGATION_OVERALL": {
    "code": 9,
    "message": "There are no records inside series array for key='extra' inside 'aggregation-object'"
  },
}
