import { useEffect, useState } from 'react'
import * as ReactDOM from 'react-dom/client'
import {
	calculateNextValue,
	calculateStatus,
	calculateWinner,
	// 💰 these could be handy
	// isValidGameState,
	// type GameState,
	type Squares,
} from '#shared/tic-tac-toe-utils'

function Board({
	squares,
	onClick,
}: {
	squares: Squares
	onClick: (index: number) => void
}) {
	function renderSquare(i: number) {
		const value = squares[i]
		const label = value ? `square ${i}, ${value}` : `square ${i} empty`

		return (
			<button className="square" onClick={() => onClick(i)} aria-label={label}>
				{squares[i]}
			</button>
		)
	}

	return (
		<div>
			<div className="board-row">
				{renderSquare(0)}
				{renderSquare(1)}
				{renderSquare(2)}
			</div>
			<div className="board-row">
				{renderSquare(3)}
				{renderSquare(4)}
				{renderSquare(5)}
			</div>
			<div className="board-row">
				{renderSquare(6)}
				{renderSquare(7)}
				{renderSquare(8)}
			</div>
		</div>
	)
}

// 🐨 our new default state will be a GameState object
const defaultState = Array(9).fill(null)

// 🐨 probably makes sense to change the name of the localStorageKey to 'tic-tac-toe'
const localStorageKey = 'squares'
function App() {
	// 🐨 You can now call this simply "state" and "setState" and it's now GameState instead of Squares
	const [squares, setSquares] = useState<Squares>(() => {
		let localStorageValue
		try {
			localStorageValue = JSON.parse(
				window.localStorage.getItem(localStorageKey) ?? 'null',
			)
		} catch {
			// something is wrong in localStorage, so don't use it
		}

		// 🐨 you now need to make sure it's a valid game state object.
		// 💰 isValidGameState(localStorageValue) will do that for you
		return localStorageValue && Array.isArray(localStorageValue)
			? localStorageValue
			: defaultState
	})

	// 🐨 get the "currentSquares" from state.history[state.currentStep]

	// 🐨 any reference to "squares" below should be changed to "currentSquares"
	const winner = calculateWinner(squares)
	const nextValue = calculateNextValue(squares)
	const status = calculateStatus(winner, squares, nextValue)

	useEffect(() => {
		// 🐨 we should serialize the entire state here instead of just the squares
		window.localStorage.setItem(localStorageKey, JSON.stringify(squares))
		// 🐨 update the dependency array to be state instead of squares
	}, [squares])

	function selectSquare(index: number) {
		if (winner || squares[index]) return
		// 🐨 this is now previousState, not previousSquares
		setSquares(previousSquares => {
			// 🐨 create an updated history and squares object
			// 🦉 note that the history should be from index 0 to the current step plus the new squares
			// and the new current step should be equal to the last index of the new history
			return previousSquares.with(index, nextValue)
		})
	}

	function restart() {
		setSquares(defaultState)
	}

	// 🐨 create moves by mapping over the history and rendering on <li> for each
	// step in the history. This should have a button which when clicked calls
	// `setState` to update the currentStep.
	const moves = 'TODO: create moves lis'

	return (
		<div className="game">
			<div className="game-board">
				<Board onClick={selectSquare} squares={squares} />
				<button className="restart" onClick={restart}>
					restart
				</button>
			</div>
			<div className="game-info">
				<div aria-live="polite">{status}</div>
				<ol>{moves}</ol>
			</div>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
ReactDOM.createRoot(rootEl).render(<App />)
