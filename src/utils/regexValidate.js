export const regexValidate = (patternType = '') => {
  if (patternType) {
    let pattern;

    if (patternType === 'number') pattern = /^[0-9]*$/
    if (patternType === 'letter') pattern = /[A-Za-z]/

    return fn => fn(pattern)
  }
}
