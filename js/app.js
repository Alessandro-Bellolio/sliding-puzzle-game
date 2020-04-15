/*A class for the game where I can specify the parent element to select, the image to use,
the width and the number of blocks to play.

It handles the setup and controls of the game, and also checks for certain conditions such as is the puzzle is assembled.
*/
class PicturePuzzle {
	constructor(el, imageSrc, width, dimension) {
		this.parentEl = el;
		this.dimension = dimension;
		this.imageSrc = imageSrc;
		this.width = width;
		this.cells = [];

		this.init();

		const img = new Image();
		img.onload = () => {
			this.height = img.height * this.width / img.width;

			this.el.style.width = `${this.width}px`;
			this.el.style.height = `${this.height}px`;

			this.setup();
		};
		img.src = this.imageSrc;
	}

	init() {
		this.el = this.createWrapper();
		this.parentEl.appendChild(this.el);
	}

	createWrapper() {
		const div = document.createElement('div');
		div.style.position = 'relative';
		div.style.margin = '0 auto';

		return div;
	}

	setup() {
		for (let i = 0; i < this.dimension * this.dimension; i++) {
			this.cells.push(new Cell(this, i));
		}

		this.shuffle();
	}

	shuffle() {
		for (let i = this.cells.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			this.swapCells(i, j);
		}
	}

	swapCells(i, j) {
		[ this.cells[i], this.cells[j] ] = [ this.cells[j], this.cells[i] ];
		this.cells[i].setPosition(i);
		this.cells[j].setPosition(j);

		if (this.isAssembled()) {
			this.gameCompleted();
		}
	}

	isAssembled() {
		for (let i = 0; i < this.cells.length; i++) {
			if (i !== this.cells[i].index) {
				return false;
			}
		}
		return true;
	}

	findPosition(index) {
		return this.cells.findIndex((cell) => cell.index === index);
	}

	findEmpty() {
		return this.cells.findIndex((cell) => cell.isEmpty);
	}

	gameCompleted() {
		const lastIndex = this.cells.length - 1;
		const x = lastIndex % this.dimension;
		const y = Math.floor(lastIndex / this.dimension);
		const left = this.cells[lastIndex].width * x;
		const top = this.cells[lastIndex].height * y;

		this.cells.forEach((cell) => (cell.el.innerHTML = ''));
		this.cells[lastIndex].el.style.backgroundImage = `url(${this.imageSrc})`;
		this.cells[lastIndex].el.style.backgroundPosition = `-${left}px -${top}px`;

		window.setTimeout(() => {
			alert('GOOD JOB! PUZZLE COMPLETED!');
		}, 1000);
	}
}

/* This class handles the setup of each block, from the position to click listeners.
*/
class Cell {
	constructor(puzzle, index) {
		this.isEmpty = false;
		this.index = index;
		this.puzzle = puzzle;

		this.width = this.puzzle.width / this.puzzle.dimension;
		this.height = this.puzzle.height / this.puzzle.dimension;

		this.el = this.createDiv();
		puzzle.el.appendChild(this.el);

		if (this.index === this.puzzle.dimension * this.puzzle.dimension - 1) {
			this.isEmpty = true;
			return;
		}
		this.setImage();
	}

	createDiv() {
		const div = document.createElement('div');

		div.style.backgroundSize = `${this.puzzle.width}px ${this.puzzle.height}px`;
		div.style.border = '1px solid #FFF';
		div.style.position = 'absolute';
		div.style.width = `${this.width}px`;
		div.style.height = `${this.height}px`;

		const number = document.createElement('div');
		number.append(`${this.index + 1}`);
		number.style.color = 'white';
		number.style.width = '10%';
		number.style.padding = '1px';
		number.style.paddingLeft = '3px';
		number.style.backgroundColor = 'grey';
		if (this.index !== this.puzzle.dimension * this.puzzle.dimension - 1) {
			div.append(number);
		}

		div.onclick = () => {
			const currentCellIndex = this.puzzle.findPosition(this.index);
			const emptyCellIndex = this.puzzle.findEmpty();
			const { x, y } = this.getXY(currentCellIndex);
			const { x: emptyX, y: emptyY } = this.getXY(emptyCellIndex);

			if ((x === emptyX || y === emptyY) && (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1)) {
				this.puzzle.swapCells(currentCellIndex, emptyCellIndex);
			}
		};

		return div;
	}

	setImage() {
		const { x, y } = this.getXY(this.index);
		const left = this.width * x;
		const top = this.height * y;

		this.el.style.backgroundImage = `url(${this.puzzle.imageSrc})`;
		this.el.style.backgroundPosition = `-${left}px -${top}px`;
	}

	setPosition(index) {
		const { left, top } = this.getPositionFromIndex(index);

		this.el.style.left = `${left}px`;
		this.el.style.top = `${top}px`;
	}

	getPositionFromIndex(index) {
		const { x, y } = this.getXY(index);
		return {
			left: this.width * x,
			top: this.height * y
		};
	}

	getXY(index) {
		return {
			x: index % this.puzzle.dimension,
			y: Math.floor(index / this.puzzle.dimension)
		};
	}
}

//Here I create an instance of the PicturePuzzle class with specified parameters to start the game.
const picturePuzzle = new PicturePuzzle(document.querySelector('#puzzle-wrapper'), './img/monks.jpg', 600, 4);
