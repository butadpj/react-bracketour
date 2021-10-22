export const addClassTo = (className, element) => {
  if (typeof className === 'string') element.classList.add(className);
  if (Array.isArray(className)) element.classList.add(...className);
  return second => {
    setTimeout(() => {element.classList.remove(className)}, (second * 1000))
  }
}