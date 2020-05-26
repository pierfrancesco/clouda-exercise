/**
 * binarySearchMod
 * @param array
 * @param startDate
 * @param endDate
 * @returns {number}
 */
const binarySearchMod = (array, startDate, endDate) => {
  let left = 0;
  let right = array.length - 1;
  let foundedFirstElementInTheMiddleIndex = -1;
  while (left <= right) {
    let middleIndex = parseInt((right + left) / 2);
    let currentDate = new Date(array[middleIndex].x);
    if (currentDate >= startDate && currentDate <= endDate) {
      foundedFirstElementInTheMiddleIndex = middleIndex;
      return foundedFirstElementInTheMiddleIndex;
    } else if (currentDate < startDate) {
      left = middleIndex + 1
    } else if (currentDate > endDate) {
      right = middleIndex - 1;
    }
  }
  return foundedFirstElementInTheMiddleIndex;
}

module.exports = {
  binarySearchMod: binarySearchMod
}
