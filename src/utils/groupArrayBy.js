export const groupArrayBy = (array, groupNumber) => {
  const perGroup = Math.ceil(array.length / groupNumber);
  return new Array(groupNumber)
    .fill('')
    .map((_, i) => array.slice(i * perGroup, (i + 1) * perGroup));
}