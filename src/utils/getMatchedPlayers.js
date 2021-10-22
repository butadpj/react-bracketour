export const getMatchedPlayers = target => callback => {
  const name = target.firstElementChild.dataset.name;
  const mathcedPlayers = (
    document.querySelectorAll(`[data-name='${name}']`)
  )

  mathcedPlayers.forEach(player => {
    callback(player);
  })
}