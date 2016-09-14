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
        document.getElementById(name).style.left = this.xPosition.toString();
        document.getElementById(name).style.left = this.yPosition.toString();
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
}());
var movableItems;
var GameController = (function () {
    function GameController(mexicoResource, canadaResource, americaResource, nukeResource) {
        this.mexicoResource = mexicoResource;
        this.canadaResource = canadaResource;
        this.americaResource = americaResource;
        this.nukeResource = nukeResource;
    }
    GameController.prototype.generateItem = function (xPos, yPos, type) {
        var image = document.createElement("img");
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
        document.getElementById("body").appendChild(image);
        var mvIt = new MovableItem(xPos, yPos, 0, 0, image.width, image.height, type, type);
        return [mvIt, image];
    };
    GameController.prototype.getItemByName = function (name) {
        for (var i = 0; i < movableItems.length; i = i + 1) {
            if (movableItems[i][0].name == name) {
                return movableItems[i];
            }
        }
        return null;
    };
    GameController.prototype.updateAll = function () {
        for (var i = 0; i < movableItems.length; i = i + 1) {
            movableItems[i][0].tick();
            movableItems[i][1].style.left = movableItems[i][0].xPosition.toString();
            movableItems[i][1].style.top = movableItems[i][0].yPosition.toString();
        }
    };
    GameController.prototype.collisionEvent = function (item1, item2) {
        if (item1.name == "canada" && item2.name == "mexico") {
            CollisionEvents.canadaNukeCollision();
        }
    };
    GameController.prototype.collisionDetection = function () {
        var element = this.getItemByName("canada")[0];
        for (var i = 0; i < movableItems.length; i = i + 1) {
            var otherElement = movableItems[i][0];
            if (element.isNear(otherElement) && otherElement != element) {
                this.collisionEvent(element, otherElement);
            }
        }
    };
    GameController.prototype.start = function () {
        var _this = this;
        var timer = setInterval(function () {
            _this.updateAll();
            _this.collisionDetection();
        }, 500);
    };
    return GameController;
}());
var CollisionEvents = (function () {
    function CollisionEvents() {
    }
    CollisionEvents.canadaNukeCollision = function () {
        document.title = "Collision Detected";
    };
    return CollisionEvents;
}());
var controller;
function setup() {
    controller = new GameController("Content/america.png", "Content/america.png", "Content/america.png", "Content/america.png");
    controller.start();
}
//# sourceMappingURL=GameCore.js.map