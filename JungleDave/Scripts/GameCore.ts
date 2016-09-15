function areThe<T>(items: [T, T], actual1, actual2) {
	return (items[0] == actual1 || items[0] == actual2) && (items[1] == actual1 || items[1] == actual2);
}

class MovableItem {
	public xPosition: number;
	public yPosition: number;

	public xAcceleration: number;
	public yAcceleration: number;

	public width: number;
	public height: number;

	public name: string;
	public type: string;

	constructor(xPos: number, yPos: number, xAccel: number, yAccel: number, width: number, height: number, name: string, type: string) {
		this.xPosition = xPos;
		this.yPosition = yPos;

		this.xAcceleration = xAccel;
		this.yAcceleration = yAccel;

		this.width = width;
		this.height = height;

		this.name = name;
		this.type = type;
	}

	public tick(): void {
		this.xPosition += this.xAcceleration;
		this.yPosition += this.yAcceleration;
	}

	public centerX(): number {
		return this.xPosition + (this.width / 2);
	}

	public centerY(): number { 
		return this.yPosition;
	}

	public isNear(item: MovableItem): boolean {
		return ( Math.abs(this.centerX() - item.centerX()) < this.width && Math.abs(this.centerY() - item.centerY()) < this.height);
	}
}

class ShotNuke extends MovableItem {
	constructor(parent: MovableItem) {
		super(parent.xPosition, parent.yPosition, parent.xAcceleration * 2, parent.yAcceleration * 2, 32, 32, "shotNuke", parent.type);
	}
}

class Canada extends MovableItem {
	constructor(x: number, y: number) {
		super(x, y, 1, 1, 32, 32, "canada", "canada");
	}
}

class Mexico extends MovableItem {
	constructor(x: number, y: number) {
		super(x, y, 0, 0, 32, 32, "mexico", "mexico");
	}
}

class Nuke extends MovableItem {
	constructor(x: number, y: number) {
		super(x, y, 0, 0, 32, 32, "nuke", "nuke");
	}
}

class America extends MovableItem {
	constructor(x: number, y: number) {
		super(x, y, 10, 10, 32, 32, "america", "america");
	}
}

class SmartBomb extends MovableItem {
	public theParent: MovableItem;

	constructor(parent: MovableItem) {
		super(parent.xPosition, parent.yPosition, parent.xAcceleration, 1, 32, 32, "smartbomb", "smartbomb");
		this.theParent = parent;
	}

	public tick(): void {
		this.xAcceleration = this.theParent.xAcceleration;

		this.xPosition += this.xAcceleration;
		this.yPosition += this.yAcceleration;
	}
}

var movableItems: GameObject[] = new Array<GameObject>();
var labels: ControlledLabel[] = new Array<ControlledLabel>();

function randomBetween(num1: number, num2: number) : number {
	 return Math.floor((Math.random() * num2) + num1); 
}

class GameObject {
	public picture: HTMLImageElement;
	public entity: MovableItem; 

	constructor(entity: MovableItem, picture: HTMLImageElement) {
		this.picture = picture;
		this.entity = entity;
	}

	public update(): void {
		this.entity.tick();

		this.picture.style.left = this.entity.xPosition.toString() + "px";
		this.picture.style.top = this.entity.yPosition.toString() + "px";
	}

}

class ControlledLabel {
	public label: HTMLHeadingElement;
	public textObject: Object;

	constructor(label: HTMLHeadingElement, textObject: Object) {
		this.label = label;
		this.textObject = textObject;
	}

	public update() : void {
		this.label.innerHTML = this.textObject.toString();
	}
}

class GameController {

	private mexicoResource: string;
	private canadaResource: string;
	private americaResource: string;
	private nukeResource: string;

	/* Game State Controls */
	public activeNuke: GameObject = null;
	public points: number = 0;
	public streaks: GameObject[];
	public lastStreak: number;

	constructor(mexicoResource: string, canadaResource: string, americaResource: string, nukeResource: string) {
		this.mexicoResource = mexicoResource;
		this.canadaResource = canadaResource;
		this.americaResource = americaResource;
		this.nukeResource = nukeResource;
		this.streaks = new Array<GameObject>();
	}

	public wrap(item: MovableItem) : GameObject {
		var type = item.name;

		var image: HTMLImageElement = document.createElement("img");

		image.style.position = "absolute";
		image.height = 32;
		image.width = 32;


		if(type == "mexico") {
			image.src = this.mexicoResource;
		} else if (type == "canada") {
			image.src = this.canadaResource;
		} else if (type == "america") {
			image.src = this.americaResource;
		} else if (type == "nuke") {
			image.src = this.nukeResource;
		} else if (type == "shotNuke") {
			image.src = this.nukeResource;
		} else if (type == "smartbomb") {
			image.src = this.americaResource;
		}

		return new GameObject(item, image);
	}

	public generateItem(xPos: number, yPos: number, type: string) : GameObject {
		var mvIt: MovableItem;

		if(type == "mexico") {
			mvIt = new Mexico(xPos, yPos);
		} else if (type == "canada") {
			mvIt = new Canada(xPos, yPos);
		} else if (type == "america") {
			mvIt = new America(xPos, yPos);
		} else if (type == "nuke") {
			mvIt = new Nuke(xPos, yPos);
		} else if (type == "shotNuke") {
			mvIt = new ShotNuke(this.getGameObjectByName("canada").entity);
		} else if (type == "smartbomb") {
			mvIt = new SmartBomb(this.getGameObjectByName("canada").entity);
		}

		var wrapped = this.wrap(mvIt);
		movableItems.push(wrapped);
		document.getElementById("body").appendChild(wrapped.picture);

		return wrapped;
	}

	public plotRandom(type: string) : void {
		this.generateItem(randomBetween(10, window.innerWidth), randomBetween(10, window.innerHeight), type);
	}

	public shootNuke() : void {
		this.generateItem(0, 0, "shotNuke");
	}

	public shootSmartBomb() : void {
		this.generateItem(150, 150, "smartbomb");
	}

	public shootNukeFromParent(parent: MovableItem) : void {
		var mvIt = new ShotNuke(parent);
		var image: HTMLImageElement = document.createElement("img");

		image.style.position = "absolute";
		image.height = 32;
		image.width = 32;

		image.src = this.nukeResource;

		movableItems.push(new GameObject(mvIt, image));
	}

	public getGameObjectByName(name: string): GameObject {
		for(var i = 0; i < movableItems.length; i = i + 1) {
			if(movableItems[i].entity.name == name) {
				return movableItems[i];
			}
		}
		return null;
	}

	public updateAll() : void {
		document.getElementById("statusbar").innerText = this.points.toString() + " points.";
		Streaks.streakCheck();

		for(var i = 0; i < movableItems.length; i = i + 1) {
			movableItems[i].update();
		}
		for(var i = 0; i < movableItems.length; i++) {
			labels[i].update();
		}
	}

	public collisionDetection(): void {
		var element, otherElement;

		for(var i = 0; i < movableItems.length; i = i + 1) {
			element = movableItems[i];
			for(var b = 0; b < movableItems.length; b++) {
				otherElement = movableItems[b];
				
				if(element.entity.isNear(otherElement.entity) && otherElement != element) {
					this.collisionEvent(element, otherElement);
				}
			}
		}
	}

	public collisionEvent(item1: GameObject, item2: GameObject): void {
		if(item1.entity.name == "canada" && item2.entity.name == "nuke") {
			CollisionEvents.canadaNukeCollision(item1, item2);
		} else if (item1.entity.name == "canada" && item2.entity.name == "mexico") {
			CollisionEvents.canadaMexicoCollision(item1, item2);
		} else if (item1.entity.name == "shotNuke" && item2.entity.name == "mexico") {
			CollisionEvents.shotNukeMexicoCollision(item1, item2);
		} else if(item1.entity.name == "shotNuke" && item2.entity.name == "nuke") {
			CollisionEvents.shotNukeNuke(item1, item2);
		} else if(item1.entity.name == "mexico" && item2.entity.name == "mexico") {
			CollisionEvents.mexicoMexico(item1, item2);
		} else if(item1.entity.name == "smartbomb" && item2.entity.name == "mexico") {
			CollisionEvents.smartbombMexico(item1, item2);
		} else if(item1.entity.name == "smartbomb" && item2.entity.name == "nuke") {
			CollisionEvents.smartbombNuke(item1, item2);
		}
	}

	public clean() : void {
		for(var i = 0; i < movableItems.length; i++) {
			if(movableItems[i].entity.xPosition > window.innerWidth || movableItems[i].entity.yPosition > window.innerHeight || movableItems[i].entity.yPosition < 0) {
				if(movableItems[i].entity.name == "canada") {
					alert("You have lost with " + controller.points + " points");
					location.reload();
				}
				CollisionEvents.removeElement(movableItems[i]);
			}
		}
	}
	public handleInput(input: string): void {
		var canadaElement = this.getGameObjectByName("canada");
		var xFactor = 0;
		if(input == "W" || input == "w") {
			canadaElement.entity.yAcceleration -= 3 + xFactor;
		} else if(input == "A" || input == "a") {
			canadaElement.entity.xAcceleration -= 3 + xFactor;
		} else if(input == "S" || input == "s") {
			canadaElement.entity.yAcceleration += 3 + xFactor;
		} else if(input == "D" || input == "d") {
			canadaElement.entity.xAcceleration += 3 + xFactor;
		} else if(input == "P" || input == "p") {
			this.shootSmartBomb();
		}
	}

	public start(): void { 
		var timer = setInterval(() => {
			this.collisionDetection();
			this.updateAll();
		}, 10);
		var otherTimer = setInterval( () => {
			this.clean();
		}, 5000);
	}
}

class CollisionEvents {

	public static removeElement(item: GameObject): void {
		document.getElementById("body").removeChild(item.picture);
		movableItems.splice(movableItems.indexOf(item), 1);
	}

	public static canadaNukeCollision(canada: GameObject, nuke: GameObject) : void {
		controller.points++;

		controller.plotRandom("nuke");
		controller.plotRandom("mexico");

		CollisionEvents.removeElement(nuke);
	}

	public static canadaMexicoCollision(canada: GameObject, nuke: GameObject) : void {
		alert("Game Over. Score: " + controller.points);
		location.reload();
	}

	public static shotNukeMexicoCollision(shotNuke: GameObject, mexico: GameObject): void {
		controller.points += 2;
		controller.plotRandom("nuke");

		mexico.entity.xAcceleration = randomBetween(-10, 10);
		mexico.entity.yAcceleration = randomBetween(-10, 10);
	}

	public static shotNukeNuke(shotNuke: GameObject, nuke: GameObject): void { 
		controller.points++;
		controller.plotRandom("nuke");

		CollisionEvents.removeElement(shotNuke);

		for(var i = 0; i < 10; i++) {
			controller.plotRandom("nuke");
		}

		var theNukes = movableItems.filter((x) => x.entity.name == "nuke");

		for(var i = 0; i < theNukes.length; i++) {
			theNukes[i].entity.xAcceleration = randomBetween(-10, 10);
			theNukes[i].entity.yAcceleration = randomBetween(-10, 10);
		}

		controller.plotRandom("nuke");
	}

	public static mexicoMexico(mexico1: GameObject, mexico2: GameObject): void {
		CollisionEvents.shotNukeMexicoCollision(mexico1, mexico2)
	}

	public static smartbombNuke(smartbomb: GameObject, nuke: GameObject) : void {
		CollisionEvents.removeElement(nuke);

		smartbomb.entity.yAcceleration = 100;
	}

	public static smartbombMexico(smartbomb: GameObject, mexico: GameObject) : void {
		controller.generateItem(mexico.entity.xPosition, mexico.entity.yPosition, "nuke");
		CollisionEvents.removeElement(mexico);
	}
}

class Streaks {
	public static streakCheck(): void {
		if(controller.points > 0 && controller.lastStreak != controller.points) {
			controller.lastStreak = controller.points;
			if(controller.points % 5 == 0) {
				this.streak("shotNuke");
			}
			if(controller.points % 10 == 0) {
				this.streak("america");
			}
			if(controller.points % 25 == 0) {
				this.streak("smartbomb");
			}
			}
		}

	public static streak(streakName: string): void {
		var canadaElement = controller.getGameObjectByName("canada");

		if(streakName == "shotNuke") {
			controller.shootNuke();
		} else if(streakName == "smartBomb") {
			controller.shootSmartBomb();
		}
	}
}

/* *** Actual Game Setup (with webpage)*** */

var controller: GameController; 

// Sets up the Controller and runs it
function setup()
{
	controller = new GameController("Content/mexico.png", "Content/canada.png", "Content/america.png", "Content/nuke.png");
	controller.generateItem(250, 250, "canada");
	controller.generateItem(150, 150, "nuke");

	// Pass key events to "handle"
	document.onkeypress = function(evt) {
    	controller.handleInput(evt.key);
	};

	var statusbar = document.createElement("h1");
	document.getElementById("body").appendChild(statusbar);

	labels.push(new ControlledLabel(statusbar, controller.getGameObjectByName("canada").entity.yAcceleration));
	controller.start();
}