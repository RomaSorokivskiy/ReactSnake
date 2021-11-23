'use strict';
const React = require('react');
const importJsx = require('import-jsx');
const {Text, Box,useStdin, useInput} = require('ink');
const { useState, useEffect, useContext } = require('react');
const useInterval = require('./useInterval')
const End = importJsx("./End")

const FieldSize = 16;
const FieldRow=[...new Array(FieldSize).keys()];

const ARROW_UP = "\u001B[A";
const ARROW_DOWN = "\u001B[B";
const ARROW_LEFT = "\u001B[D";
const ARROW_RIGHT = "\u001B[C";

let foodItem={
	x:Math.floor(Math.random()* FieldSize),
	y:Math.floor(Math.random()* FieldSize),
}

const Direction = {
	Right:{x:1,y:0},
	Left:{x:-1,y:0},
	Top:{x:0,y:-1},
	Bottom:{x:0,y:1},
}

function getItem(x,y,snakeSegments){
	if(foodItem.x===x && foodItem.y ===y){
		return <Text color='red'> ● </Text>
	}

	for(const segment of snakeSegments){
		if(segment.x===x && segment.y===y){
			return <Text color='green'> ■ </Text>
		}
	}
}

function limitByField(pos){
	if( pos >=FieldSize ){
		return null;
	}
	if(pos<0){
		return FieldSize-1;
	}

	return pos;
}

function newPosition(segments,direction){
	const [head]=segments;
	const newHead={
		x:limitByField(head.x + direction.x),
		y:limitByField(head.y + direction.y)
	}
	if(collidesWithFood(newHead,foodItem)){
		foodItem = {
			x:Math.floor(Math.random()* FieldSize),
			y:Math.floor(Math.random()* FieldSize),
		};
		return [newHead,...segments];
	}
	return [newHead,...segments.slice(0,-1)]
}

function collidesWithFood(head, foodItem){
	return head.x === foodItem.x && head.y === foodItem.y
}

const App = () => {

	const [snakeSegments, setSnakeSegments] = useState([
		{x:8,y:8},
		{x:8,y:7},
		{x:8,y:6},
	])
	const [direction, setDirection] = useState(Direction.Left);
	const { stdin, setRawMode } = useStdin()
	useEffect(()=>{
		setRawMode(true);
		stdin.on("data",data=>{
			const value = data.toString();
			if(value == ARROW_UP){
				setDirection(Direction.Top)
			}
			if(value == ARROW_DOWN){
				setDirection(Direction.Bottom)
			}
			if(value == ARROW_LEFT){
				setDirection(Direction.Left)
			}
			if(value == ARROW_RIGHT){
				setDirection(Direction.Right)
			}
		})
	})

	const [head,...tail]=snakeSegments;

	const itersectsWithItself = tail.some(segment=>segment.x===head.x && segment.y===head.y)

	useInterval(()=>{
		setSnakeSegments(segments=>newPosition(segments,direction))
	},itersectsWithItself ? null:150)

	return(
		<Box flexDirection='column' alignItems='center' borderStyle="round">
			<Text>
				<Text color="green">Snake </Text>
				Game
			</Text>
			{itersectsWithItself ?(<End size={FieldSize}></End>):(
					<Box flexDirection='column'>
						{FieldRow.map(y=>(
							<Box key={y}>
								{FieldRow.map(x =>(
									<Box key={x}>{ getItem(x,y,snakeSegments) || <Text> . </Text>}</Box>
								))}
							</Box>
						))}
					</Box>
			)}
		</Box>
	)
};

module.exports = App;
