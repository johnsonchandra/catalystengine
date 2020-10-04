const addZeroToString = (zeroQty, inputString, inputChar) => {
  let resultString = inputString || '';
  let diffDigit = zeroQty - resultString.length;
  while (diffDigit > 0) {
    resultString = `${inputChar || '0'}${resultString}`;
    diffDigit -= 1;
  }
  return resultString;
};

export default addZeroToString;
