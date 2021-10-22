import React from 'react';
import { Header, Input, Form, Button, Brackets } from './components';
import { regexValidate, addClassTo, getMatchedPlayers } from './utils';
import { names } from './api/names';
import { tournamentReducer } from './reducers/tournamentReducer';
import './App.css';

const numbersOnly = regexValidate('number');
const MAX_PARTICIPANTS = 50;
const MIN_PARTICIPANTS = 2;

const tournamentRounds = [
  // {
  //   number: 1,
  //   players: [
  //    { name: 'First', score; 2 },
  //    { name: 'Second', score; 1 },
  //   ],
  //   showConnectors: true,
  // },
  // {
  //   number: 2,
  //   players: [
  //    { name: 'First', score; 'W' },
  //   ]
  //   showConnectors: false,
  // },
];

const App = () => {
  const [tournamentState, dispatch] = React.useReducer(
    tournamentReducer,
    tournamentRounds,
  );

  const [participantsInput, setParticipantsInput] = React.useState('');
  const [inputStatus, setInputStatus] = React.useState(null);

  const [showForm, setShowForm] = React.useState(true);
  const [showBrackets, setShowBrackets] = React.useState(false);
  const [buttonDisabled, setButtonDisabled] = React.useState(false);

  const minElementRef = React.useRef(null);
  const maxElementRef = React.useRef(null);
  const bracketsRef = React.useRef(null);

  // No previous round yet, so we start at 0
  const previousRound = React.useRef(0);
  const groupCount = React.useRef(0);

  const handleInputChange = (e) => {
    setParticipantsInput(e.target.value);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    setShowForm(false);
    setShowBrackets(true);
    groupCount.current = Math.ceil(participantsInput / 2);
    dispatch({
      type: 'GENERATE_1ST_ROUND_BRACKETS',
      payload: {
        names: names,
        playerCount: participantsInput,
      },
    });
  };

  const handleEditBrackets = () => {
    setShowForm(true);
    setShowBrackets(false);
    setButtonDisabled(false);

    previousRound.current = 0;
    groupCount.current = 0;
  };

  const handleNextRound = () => {
    previousRound.current = previousRound.current + 1;

    dispatch({
      type: 'NEXT_ROUND',
      payload: {
        previousRound: previousRound.current,
        groupCount: groupCount.current,
      },
    });

    groupCount.current = Math.ceil(groupCount.current / 2);
  };

  const makePlayerGlow = (player) => {
    player.closest('.player').classList.add('active');
    player.classList.add('active');
  };

  const removePlayerGlow = (player) => {
    player.closest('.player').classList.remove('active');
    player.classList.remove('active');
  };

  // Input Validation
  React.useEffect(() => {
    if (participantsInput) {
      const inputValidationResult = numbersOnly((pattern) => {
        if (
          participantsInput && // not empty
          pattern.test(participantsInput) && // valid number
          Number(participantsInput) <= MAX_PARTICIPANTS &&
          Number(participantsInput) >= MIN_PARTICIPANTS
        )
          return {
            valid: true,
          };

        if (Number(participantsInput) > MAX_PARTICIPANTS)
          return {
            valid: false,
            error: 'max',
          };

        if (Number(participantsInput) < MIN_PARTICIPANTS)
          return {
            valid: false,
            error: 'min',
          };

        // default
        return {
          valid: false,
          error: 'Please input a valid number',
        };
      });

      setInputStatus(inputValidationResult);

      if (!inputValidationResult.valid) {
        if (inputValidationResult.error === 'min') {
          const removeAfterSecond = addClassTo(
            'apply-shake',
            minElementRef.current,
          );
          removeAfterSecond(1.5);
        }
        if (inputValidationResult.error === 'max') {
          const removeAfterSecond = addClassTo(
            'apply-shake',
            maxElementRef.current,
          );
          removeAfterSecond(1.5);
        }
      }
      return;
    }

    setInputStatus(null);
  }, [participantsInput]);

  // Check for a final winner and hover feature
  React.useEffect(() => {
    let timeOutId;
    if (tournamentState.length) {
      const latestRound = tournamentState[tournamentState.length - 1];
      if (latestRound.players.length === 1) {
        const winnerName = latestRound.players[0].name;
        latestRound.players[0].score = 'W'; // mutate state
        setButtonDisabled(true);
        timeOutId = setTimeout(() => {
          alert(`The winnner of this tournament is: ${winnerName}`);
        }, 200);
      }

      bracketsRef.current.addEventListener('mouseover', (e) => {
        handleMouseOver(e);
      });

      bracketsRef.current.addEventListener('mouseout', (e) => {
        handleMouseOut(e);
      });

      const handleMouseOver = (e) => {
        if (e.target.classList.contains('player')) {
          const matchedPlayers = getMatchedPlayers(e.target);

          matchedPlayers((player) => {
            makePlayerGlow(player);
          });
        }

        if (
          e.target.classList.contains('player__name') ||
          e.target.classList.contains('player__score')
        ) {
          const matchedPlayers = getMatchedPlayers(e.target.closest('.player'));

          matchedPlayers((player) => {
            makePlayerGlow(player);
          });
        }
      };

      const handleMouseOut = (e) => {
        if (e.target.classList.contains('player')) {
          const matchedPlayers = getMatchedPlayers(e.target);

          matchedPlayers((player) => {
            removePlayerGlow(player);
          });
        }

        if (
          e.target.classList.contains('player__name') ||
          e.target.classList.contains('player__score')
        ) {
          const matchedPlayers = getMatchedPlayers(e.target.closest('.player'));

          matchedPlayers((player) => {
            removePlayerGlow(player);
          });
        }
      };
    }

    return () => {
      clearInterval(timeOutId);
    };
  }, [tournamentState]);

  return (
    <div className='app'>
      <Header />
      {showForm && (
        <Form onSubmit={handleFormSubmit}>
          <Input
            value={participantsInput}
            onChange={handleInputChange}
            status={
              inputStatus ? (inputStatus.valid ? 'success' : 'danger') : ''
            }
          />
          <div className='constraints'>
            <h4 className='min' ref={minElementRef}>
              min: {MIN_PARTICIPANTS}
            </h4>
            <h4 className='max' ref={maxElementRef}>
              max: {MAX_PARTICIPANTS}
            </h4>
          </div>
          <Button
            type='submit'
            disabled={inputStatus ? (inputStatus.valid ? false : true) : true}
            classNames={[
              'submit__btn',
              `${
                inputStatus ? (inputStatus.valid ? '' : 'disabled') : 'disabled'
              }`,
            ]}
          >
            Generate
          </Button>
        </Form>
      )}
      {showBrackets && (
        <Brackets>
          <div className='brackets-nav'>
            <Button onClick={handleEditBrackets} classNames={['btn--outline']}>
              Edit Brackets
            </Button>
            <Button
              disabled={buttonDisabled}
              onClick={handleNextRound}
              classNames={[buttonDisabled ? 'disabled' : '']}
            >
              Next round
            </Button>
          </div>
          <main className='brackets-main' ref={bracketsRef}>
            {tournamentState.map((round, i) => (
              <React.Fragment key={i}>
                <div key={round.number} className={`round${round.number}`}>
                  {round.players.map((player, i) => (
                    <div
                      key={i}
                      className={`player ${
                        player.score === 'W' ? 'winner' : ''
                      }`}
                    >
                      <div
                        className={`player__name ${
                          player.score === 'W' ? 'winner' : ''
                        }`}
                        data-name={player.name}
                      >
                        {player.name}
                      </div>
                      <div className='player__score'>{player.score}</div>
                    </div>
                  ))}
                </div>
                {round.showConnectors && (
                  <>
                    <div className={`connectors-r${round.number}`}>
                      {[...Array(Math.ceil(round.players.length / 2))].map(
                        (_, i) => (
                          <div key={i}></div>
                        ),
                      )}
                    </div>
                    <div className={`lines-r${round.number}`}>
                      {[...Array(Math.ceil(round.players.length / 4))].map(
                        (_, i) => (
                          <div key={i}></div>
                        ),
                      )}
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
          </main>
        </Brackets>
      )}
    </div>
  );
};

export default App;
