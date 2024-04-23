const socket = io({
	query: {
		role: 'ADMIN'
	}
});

const startGame$ = document.querySelector('#start-game');
const emergencyNOTIF$ = document.querySelector('#meeting-status');
emergencyNOTIF$.style.display = 'none';
const progress$ = document.querySelector('#progress');
const progressBar$ = document.querySelector('.progress-bar');

const TotalTasksValue$ = document.querySelector('#TotalTasksValue');
const TotalTasksValueButton$ = document.querySelector('#TotalTasksValueButton');
const TotalTasksDoneValue$ = document.querySelector('#TotalTasksDoneValue');
const TotalTasksDoneButton$ = document.querySelector('#TotalTasksDoneButton');

startGame$.addEventListener('click', () => {
	socket.emit('start-game');
});

/**
 * Sounds
 */

async function wait(milliseconds) {
	await new Promise(resolve => {
		setTimeout(() => resolve(), milliseconds);
	});
}

const SOUNDS = {
	meeting: new Audio('/sounds/meeting.mp3'),
	sabotage: new Audio('/sounds/sabotage.mp3'),
	start: new Audio('/sounds/start.mp3'),
	sussyBoy: new Audio('/sounds/sussy-boy.mp3'),
	voteResult: new Audio('/sounds/vote-result.mp3'),
	youLose: new Audio('/sounds/you-lose.mp3'),
	youWin: new Audio('/sounds/you-win.mp3')
};

socket.on('play-meeting', async () => {
	emergencyNOTIF$.style.display = 'block';
	await SOUNDS.meeting.play();
	await wait(2000);
	await SOUNDS.sussyBoy.play();
});

socket.on('end-meeting', async () => {
	emergencyNOTIF$.style.display = 'none';
	console.log("end2")
});

socket.on('play-win', async () => {
	await SOUNDS.youWin.play();
});

socket.on('progress', progress => {
	progress$.innerHTML = (progress * 100).toFixed(0);
	progressBar$.style.width = `${progress * 100}%`;
});



document.querySelector(".end-meeting").addEventListener("click", () => {
	console.log("end0")
	socket.emit('end-meeting');
	console.log("end1")
})


TotalTasksValueButton$.addEventListener("click", (e) => {
	e.preventDefault()
	socket.emit('setTotal', Number(TotalTasksValue$.value))
	TotalTasksValue$.value = ''

})

TotalTasksDoneButton$.addEventListener("click", (e) => {
	e.preventDefault()
	socket.emit('setDone', Number(TotalTasksDoneValue$.value))
	TotalTasksDoneValue$.value = ''
})



socket.emit("refresh");