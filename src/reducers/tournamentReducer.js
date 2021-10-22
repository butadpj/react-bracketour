import { 
  shuffle, 
  groupArrayBy,
  randomNumberBetween
} from '../utils';

export const tournamentReducer = (state, action) => {
  switch(action.type) {
    case 'GENERATE_1ST_ROUND_BRACKETS': {
      const shuffledNames = shuffle(action.payload.names);
      const playerCount = action.payload.playerCount;

      const generatedPlayers = [...Array(Number(playerCount))].map((_, i) => (
        { name: shuffledNames[i], score: 0}
      ));

      return [
        {
          number: 1,
          players: generatedPlayers,
          showConnectors: false,
        }
      ]
    }

    case 'NEXT_ROUND': {
      const previousRound = action.payload.previousRound;
      const groupCount = action.payload.groupCount;

      const currentPlayers = state.filter(round => (
        round.number === previousRound
      ))[0].players;

      const groupedPlayers = groupArrayBy(currentPlayers, groupCount);

      const getWinnersFromGroupedArray = (groupedArray) => {
        const selectRandomWinner = (array) => {
          if (array.length > 1) 
            return array[randomNumberBetween(0, 1)]  
          return array[0];    
        } 
        
        const winners = groupedArray.map(group => {
          const winner = selectRandomWinner(group);

          // State mutation alert!!!
          // I've tried to avoid mutating states but
          // this is a lot simpler that doing immutable
          // updates with the current data structure I'm
          // using. The 'random generated winner' algorithm 
          // has introduced a lot of complexity to the 
          // data structure.

          // I'm only mutating the players object on the
          // previous round and the winners' scores will
          // be reset to 0 on the next round, so there
          // shouldn't be unexpected bugs to encounter. 
          winner.score = randomNumberBetween(2, 3);

          group.map(player => {
            if (player.score === 0) {
              
              // will also mutate the state
              player.score = randomNumberBetween(0, 1);
              return player
            }
            return player
          })

          return winner
        })
        
        return winners
      }

      const winners = getWinnersFromGroupedArray(groupedPlayers);

      return [
        ...state.map(round => round.number === previousRound ? (
          {...round, showConnectors: true}
        ) : (
          round
        )),
        { 
          number: previousRound + 1, 
          players: winners.map(winner => ({...winner, score: 0}))
        } 
      ]
    }

    default: {
      return state
    }
  }
}