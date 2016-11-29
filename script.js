var DELTAT = .01;
var SEGLEN = 10;
var SPRINGK = 10;
var MASS = 1;
var GRAVITY = 50;
var RESISTANCE = 10;
var STOPVEL = 0.1;
var STOPACC = 0.1;
var DOTSIZE = 32;
var BOUNCE = 0.75;

class Vector2 {
	constructor(vec, y) {
		if(typeof vec === "undefined" &&
		   typeof y === "undefined") {
			this.x = 0;
			this.y = 0;
		} else if(typeof vec === "number" &&
		   typeof y === "undefined") {
			this.x = vec;
			this.y = vec;
		} else if(typeof vec === "number" &&
		   typeof y === "number") {
			this.x = vec;
			this.y = y;
		} else if(typeof vec === "object" && vec.constructor == Vector2) {
			this.x = vec.getX()
			this.y = vec.getY();
		} else
			throw 'Vector2::constructor(): Invalid types ' + (typeof vec) + ' ' + (typeof y);
	}
	
	getX() {
		return this.x;
	}
	
	getY() {
		return this.y;
	}
	
	setX(x) {
		if(typeof x !== "number") 
			throw 'Vector2::setX(): Invalid type ' + (typeof x);
		
		this.x = x;
	}
	
	setY(y) {
		if(typeof y !== "number")
			throw 'Vector2::setY(): Invalid type ' + (typeof y);
		
		this.y = y;
	}

	add(vec, y) {
		if(typeof vec === "number" &&
		   typeof y === "undefined") {
			return new Vector2(
				this.x + vec,
				this.y + vec
			);
		} else if(typeof vec === "number" &&
		   typeof y === "number") {
			return new Vector2(
				this.x + vec,
				this.y + y
			);
		} else if(typeof vec === "object" && vec.constructor == Vector2) {
			return new Vector2(
				this.x + vec.getX(),
				this.y + vec.getY()
			);
		} else
			throw 'Vector2::add(): Invalid types ' + (typeof vec) + ' ' + (typeof y);
	}

	sub(vec, y) {
		if(typeof vec === "number" &&
		   typeof y === "undefined") {
			return new Vector2(
				this.x - vec,
				this.y - vec
			);
		} else if(typeof vec === "number" &&
		   typeof y === "number") {
			return new Vector2(
				this.x - vec,
				this.y - y
			);
		} else if(typeof vec === "object" && vec.constructor == Vector2) {
			return new Vector2(
				this.x - vec.getX(),
				this.y - vec.getY()
			);
		} else
			throw 'Vector2::sub(): Invalid types ' + (typeof vec) + ' ' + (typeof y);
	}

	mul(vec, y) {
		if(typeof vec === "number" &&
		   typeof y === "undefined") {
			return new Vector2(
				this.x * vec,
				this.y * vec
			);
		} else if(typeof vec === "number" &&
		   typeof y === "number") {
			return new Vector2(
				this.x * vec,
				this.y * y
			);
		} else if(typeof vec === "object" && vec.constructor == Vector2) {
			return new Vector2(
				this.x * vec.getX(),
				this.y * vec.getY()
			);
		} else
			throw 'Vector2::mul(): Invalid types ' + (typeof vec) + ' ' + (typeof y);
	}

	div(vec, y) {
		if(typeof vec === "number" &&
		   typeof y === "undefined") {
			return new Vector2(
				this.x / vec,
				this.y / vec
			);
		} else if(typeof vec === "number" &&
		   typeof y === "number") {
			return new Vector2(
				this.x / vec,
				this.y / y
			);
		} else if(typeof vec === "object" && vec.constructor == Vector2) {
			return new Vector2(
				this.x / vec.getX(),
				this.y / vec.getY()
			);
		} else
			throw 'Vector2::div(): Invalid types ' + (typeof vec) + ' ' + (typeof y);
	}
	
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
};

$(document).ready(function($) {
	var entities = [];
	
	class Entity {
		constructor() {
			this.position = new Vector2();
			this.speed = new Vector2();
			this.elem = $('<div>').addClass('point').appendTo('body')
		}
	};
	
	for (var i = 0; i < 8; i++) {
		entities.push(new Entity());
	}

	$(document).mousemove(function(event) {
		entities[0].position = new Vector2(
			event.pageX,
			event.pageY
		);
	});

	setInterval(function() {
		var windowSize = new Vector2($(window).width(), $(window).height());
		
		$.each(entities, function(i, entity){
			if(i > 0) {
				var spring = new Vector2();
				
				var springForce = function(i, j) {
					var d = i.sub(j);
					var len = d.length();
					return len > SEGLEN ? d.div(len).mul(SPRINGK).mul(len - SEGLEN) : new Vector2();
				}

				if (i > 0) {
					spring = spring.add(springForce(entities[i - 1].position, entity.position));
				}

				if (i < (entities.length - 1)) {
					spring = spring.add(springForce(entities[i + 1].position, entity.position));
				}

				var resist = entity.speed.mul(-RESISTANCE);
				var accel = spring.add(resist).div(MASS).add(0, GRAVITY);

				entity.speed = entity.speed.add(accel.mul(DELTAT));

				if (Math.abs(entity.speed.getX()) < STOPVEL &&
					Math.abs(entity.speed.getY()) < STOPVEL &&
					Math.abs(accel.getX()) < STOPACC &&
					Math.abs(accel.getY()) < STOPACC) {
					entity.speed = new Vector2();
				}

				entity.position = entity.position.add(entity.speed);
			}

			if (entity.position.getX() < 0) {
				if (entity.speed.getX() < 0) {
					entity.speed.setX(BOUNCE * -entity.speed.getX());
				}
				entity.position.setX(0);
			}

			if (entity.position.getX() >= windowSize.getX() - entity.elem.width()) {
				if (entity.speed.getX() > 0) {
					entity.speed.setX(BOUNCE * -entity.speed.getX());
				}
				entity.position.setX(windowSize.getX() - entity.elem.width());
			}

			if (entity.position.getY() >=  windowSize.getY() - entity.elem.height()) {
				if (entity.speed.getY() > 0) {
					entity.speed.setY(BOUNCE * -entity.speed.getY());
				}
				entity.position.setY(windowSize.getY() - entity.elem.height());
			}

			entity.elem.css({
				'left': entity.position.getX(),
				'top': entity.position.getY()
			});
		});
	}, 20);
});