var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
function areThe(items, actual1, actual2) {
    return (items[0] == actual1 || items[0] == actual2) && (items[1] == actual1 || items[1] == actual2);
}
var MovableItem = (function () {
    function MovableItem(xPos, yPos, xAccel, yAccel, width, height, name, type) {
        this.xPosition = xPos;
        this.yPosition = yPos;
        this.xAcceleration = xAccel;
        this.yAcceleration = yAccel;
        this.width = width;
        this.height = height;
        this.name = name;
        this.type = type;
    }
    MovableItem.prototype.tick = function () {
        this.xPosition += this.xAcceleration;
        this.yPosition += this.yAcceleration;
    };
    MovableItem.prototype.centerX = function () {
        return this.xPosition + (this.width / 2);
    };
    MovableItem.prototype.centerY = function () {
        return this.yPosition;
    };
    MovableItem.prototype.isNear = function (item) {
        return (Math.abs(this.centerX() - item.centerX()) < this.width && Math.abs(this.centerY() - item.centerY()) < this.height);
    };
    return MovableItem;
})();
var ShotNuke = (function (_super) {
    __extends(ShotNuke, _super);
    function ShotNuke(parent) {
        _super.call(this, parent.xPosition, parent.yPosition, parent.xAcceleration * 2, parent.yAcceleration * 2, 32, 32, "shotNuke", parent.type);
    }
    return ShotNuke;
})(MovableItem);
var Canada = (function (_super) {
    __extends(Canada, _super);
    function Canada(x, y) {
        _super.call(this, x, y, 1, 1, 32, 32, "canada", "canada");
    }
    return Canada;
})(MovableItem);
var Mexico = (function (_super) {
    __extends(Mexico, _super);
    function Mexico(x, y) {
        _super.call(this, x, y, 0, 0, 32, 32, "mexico", "mexico");
    }
    return Mexico;
})(MovableItem);
var Nuke = (function (_super) {
    __extends(Nuke, _super);
    function Nuke(x, y) {
        _super.call(this, x, y, 0, 0, 32, 32, "nuke", "nuke");
    }
    return Nuke;
})(MovableItem);
var America = (function (_super) {
    __extends(America, _super);
    function America(x, y) {
        _super.call(this, x, y, 10, 10, 32, 32, "america", "america");
    }
    return America;
})(MovableItem);
var SmartBomb = (function (_super) {
    __extends(SmartBomb, _super);
    function SmartBomb(parent) {
        _super.call(this, parent.xPosition, parent.yPosition, parent.xAcceleration, 1, 32, 32, "smartbomb", "smartbomb");
        this.theParent = parent;
    }
    SmartBomb.prototype.tick = function () {
        this.xAcceleration = this.theParent.xAcceleration;
        this.xPosition += this.xAcceleration;
        this.yPosition += this.yAcceleration;
    };
    return SmartBomb;
})(MovableItem);
var movableItems = new Array();
var labels = new Array();
function randomBetween(num1, num2) {
    return Math.floor((Math.random() * num2) + num1);
}
var GameObject = (function () {
    function GameObject(entity, picture) {
        this.picture = picture;
        this.entity = entity;
    }
    GameObject.prototype.update = function () {
        this.entity.tick();
        this.picture.style.left = this.entity.xPosition.toString() + "px";
        this.picture.style.top = this.entity.yPosition.toString() + "px";
    };
    return GameObject;
})();
var ControlledLabel = (function () {
    function ControlledLabel(label, textObject) {
        this.label = label;
        this.textObject = textObject;
    }
    ControlledLabel.prototype.update = function () {
        this.label.innerHTML = this.textObject.toString();
    };
    return ControlledLabel;
})();
var GameController = (function () {
    function GameController(mexicoResource, canadaResource, americaResource, nukeResource) {
        /* Game State Controls */
        this.activeNuke = null;
        this.points = 0;
        this.mexicoResource = mexicoResource;
        this.canadaResource = canadaResource;
        this.americaResource = americaResource;
        this.nukeResource = nukeResource;
        this.streaks = new Array();
    }
    GameController.prototype.wrap = function (item) {
        var type = item.name;
        var image = document.createElement("img");
        image.style.position = "absolute";
        image.height = 32;
        image.width = 32;
        if (type == "mexico") {
            image.src = this.mexicoResource;
        }
        else if (type == "canada") {
            image.src = this.canadaResource;
        }
        else if (type == "america") {
            image.src = this.americaResource;
        }
        else if (type == "nuke") {
            image.src = this.nukeResource;
        }
        else if (type == "shotNuke") {
            image.src = this.nukeResource;
        }
        else if (type == "smartbomb") {
            image.src = this.americaResource;
        }
        return new GameObject(item, image);
    };
    GameController.prototype.generateItem = function (xPos, yPos, type) {
        var mvIt;
        if (type == "mexico") {
            mvIt = new Mexico(xPos, yPos);
        }
        else if (type == "canada") {
            mvIt = new Canada(xPos, yPos);
        }
        else if (type == "america") {
            mvIt = new America(xPos, yPos);
        }
        else if (type == "nuke") {
            mvIt = new Nuke(xPos, yPos);
        }
        else if (type == "shotNuke") {
            mvIt = new ShotNuke(this.getGameObjectByName("canada").entity);
        }
        else if (type == "smartbomb") {
            mvIt = new SmartBomb(this.getGameObjectByName("canada").entity);
        }
        var wrapped = this.wrap(mvIt);
        movableItems.push(wrapped);
        document.getElementById("body").appendChild(wrapped.picture);
        return wrapped;
    };
    GameController.prototype.plotRandom = function (type) {
        this.generateItem(randomBetween(10, window.innerWidth), randomBetween(10, window.innerHeight), type);
    };
    GameController.prototype.shootNuke = function () {
        this.generateItem(0, 0, "shotNuke");
    };
    GameController.prototype.shootSmartBomb = function () {
        this.generateItem(150, 150, "smartbomb");
    };
    GameController.prototype.shootNukeFromParent = function (parent) {
        var mvIt = new ShotNuke(parent);
        var image = document.createElement("img");
        image.style.position = "absolute";
        image.height = 32;
        image.width = 32;
        image.src = this.nukeResource;
        movableItems.push(new GameObject(mvIt, image));
    };
    GameController.prototype.getGameObjectByName = function (name) {
        for (var i = 0; i < movableItems.length; i = i + 1) {
            if (movableItems[i].entity.name == name) {
                return movableItems[i];
            }
        }
        return null;
    };
    GameController.prototype.updateAll = function () {
        document.getElementById("statusbar").innerText = this.points.toString() + " points.";
        Streaks.streakCheck();
        for (var i = 0; i < movableItems.length; i = i + 1) {
            movableItems[i].update();
        }
        for (var i = 0; i < movableItems.length; i++) {
            labels[i].update();
        }
    };
    GameController.prototype.collisionDetection = function () {
        var element, otherElement;
        for (var i = 0; i < movableItems.length; i = i + 1) {
            element = movableItems[i];
            for (var b = 0; b < movableItems.length; b++) {
                otherElement = movableItems[b];
                if (element.entity.isNear(otherElement.entity) && otherElement != element) {
                    this.collisionEvent(element, otherElement);
                }
            }
        }
    };
    GameController.prototype.collisionEvent = function (item1, item2) {
        if (item1.entity.name == "canada" && item2.entity.name == "nuke") {
            CollisionEvents.canadaNukeCollision(item1, item2);
        }
        else if (item1.entity.name == "canada" && item2.entity.name == "mexico") {
            CollisionEvents.canadaMexicoCollision(item1, item2);
        }
        else if (item1.entity.name == "shotNuke" && item2.entity.name == "mexico") {
            CollisionEvents.shotNukeMexicoCollision(item1, item2);
        }
        else if (item1.entity.name == "shotNuke" && item2.entity.name == "nuke") {
            CollisionEvents.shotNukeNuke(item1, item2);
        }
        else if (item1.entity.name == "mexico" && item2.entity.name == "mexico") {
            CollisionEvents.mexicoMexico(item1, item2);
        }
        else if (item1.entity.name == "smartbomb" && item2.entity.name == "mexico") {
            CollisionEvents.smartbombMexico(item1, item2);
        }
        else if (item1.entity.name == "smartbomb" && item2.entity.name == "nuke") {
            CollisionEvents.smartbombNuke(item1, item2);
        }
    };
    GameController.prototype.clean = function () {
        for (var i = 0; i < movableItems.length; i++) {
            if (movableItems[i].entity.xPosition > window.innerWidth || movableItems[i].entity.yPosition > window.innerHeight || movableItems[i].entity.yPosition < 0) {
                if (movableItems[i].entity.name == "canada") {
                    alert("You have lost with " + controller.points + " points");
                    location.reload();
                }
                CollisionEvents.removeElement(movableItems[i]);
            }
        }
    };
    GameController.prototype.handleInput = function (input) {
        var canadaElement = this.getGameObjectByName("canada");
        var xFactor = 0;
        if (input == "W" || input == "w") {
            canadaElement.entity.yAcceleration -= 3 + xFactor;
        }
        else if (input == "A" || input == "a") {
            canadaElement.entity.xAcceleration -= 3 + xFactor;
        }
        else if (input == "S" || input == "s") {
            canadaElement.entity.yAcceleration += 3 + xFactor;
        }
        else if (input == "D" || input == "d") {
            canadaElement.entity.xAcceleration += 3 + xFactor;
        }
        else if (input == "P" || input == "p") {
            this.shootSmartBomb();
        }
    };
    GameController.prototype.start = function () {
        var _this = this;
        var timer = setInterval(function () {
            _this.collisionDetection();
            _this.updateAll();
        }, 10);
        var otherTimer = setInterval(function () {
            _this.clean();
        }, 5000);
    };
    return GameController;
})();
var CollisionEvents = (function () {
    function CollisionEvents() {
    }
    CollisionEvents.removeElement = function (item) {
        document.getElementById("body").removeChild(item.picture);
        movableItems.splice(movableItems.indexOf(item), 1);
    };
    CollisionEvents.canadaNukeCollision = function (canada, nuke) {
        controller.points++;
        controller.plotRandom("nuke");
        controller.plotRandom("mexico");
        CollisionEvents.removeElement(nuke);
    };
    CollisionEvents.canadaMexicoCollision = function (canada, nuke) {
        alert("Game Over. Score: " + controller.points);
        location.reload();
    };
    CollisionEvents.shotNukeMexicoCollision = function (shotNuke, mexico) {
        controller.points += 2;
        controller.plotRandom("nuke");
        mexico.entity.xAcceleration = randomBetween(-10, 10);
        mexico.entity.yAcceleration = randomBetween(-10, 10);
    };
    CollisionEvents.shotNukeNuke = function (shotNuke, nuke) {
        controller.points++;
        controller.plotRandom("nuke");
        CollisionEvents.removeElement(shotNuke);
        for (var i = 0; i < 10; i++) {
            controller.plotRandom("nuke");
        }
        var theNukes = movableItems.filter(function (x) { return x.entity.name == "nuke"; });
        for (var i = 0; i < theNukes.length; i++) {
            theNukes[i].entity.xAcceleration = randomBetween(-10, 10);
            theNukes[i].entity.yAcceleration = randomBetween(-10, 10);
        }
        controller.plotRandom("nuke");
    };
    CollisionEvents.mexicoMexico = function (mexico1, mexico2) {
        CollisionEvents.shotNukeMexicoCollision(mexico1, mexico2);
    };
    CollisionEvents.smartbombNuke = function (smartbomb, nuke) {
        CollisionEvents.removeElement(nuke);
        smartbomb.entity.yAcceleration = 100;
    };
    CollisionEvents.smartbombMexico = function (smartbomb, mexico) {
        controller.generateItem(mexico.entity.xPosition, mexico.entity.yPosition, "nuke");
        CollisionEvents.removeElement(mexico);
    };
    return CollisionEvents;
})();
var Streaks = (function () {
    function Streaks() {
    }
    Streaks.streakCheck = function () {
        if (controller.points > 0 && controller.lastStreak != controller.points) {
            controller.lastStreak = controller.points;
            if (controller.points % 5 == 0) {
                this.streak("shotNuke");
            }
            if (controller.points % 10 == 0) {
                this.streak("america");
            }
            if (controller.points % 25 == 0) {
                this.streak("smartbomb");
            }
        }
    };
    Streaks.streak = function (streakName) {
        var canadaElement = controller.getGameObjectByName("canada");
        if (streakName == "shotNuke") {
            controller.shootNuke();
        }
        else if (streakName == "smartBomb") {
            controller.shootSmartBomb();
        }
    };
    return Streaks;
})();
/* *** Actual Game Setup (with webpage)*** */
var controller;
// Sets up the Controller and runs it
function setup() {
    controller = new GameController("Content/mexico.png", "Content/canada.png", "Content/america.png", "Content/nuke.png");
    controller.generateItem(250, 250, "canada");
    controller.generateItem(150, 150, "nuke");
    // Pass key events to "handle"
    document.onkeypress = function (evt) {
        controller.handleInput(evt.key);
    };
    var statusbar = document.createElement("h1");
    document.getElementById("body").appendChild(statusbar);
    labels.push(new ControlledLabel(statusbar, controller.getGameObjectByName("canada").entity.yAcceleration));
    controller.start();
}
