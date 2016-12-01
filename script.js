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
    
    var entityId = 0;
    
    class Entity {
        constructor() {
            var entity = this;
            this.id = entityId++;
            this.position = new Vector2();
            this.speed = new Vector2();
            this.elem = $('<div>').addClass('point').appendTo('body');
            this.row = $('<tr>').appendTo('#table_entities');
            this.columns = {
                id: $('<td>').text(this.id).appendTo(this.row),
                position: $('<td>').appendTo(this.row),
                speed: $('<td>').appendTo(this.row),
                color: $('<td>').appendTo(this.row),
                actions: $('<td>').appendTo(this.row),
            }
            this.colorPicker = $('<input />')
                .attr('type', 'color')
                .change(function(){
                    entity.elem.css('background-color', $(this).val());
                })
                .appendTo(this.columns.color)
                .change();
            $('<button>')
                .addClass('btn btn-xs btn-danger')
                .text(' Löschen')
                .prepend($('<i>').addClass('glyphicon glyphicon-trash'))
                .appendTo(this.columns.actions)
                .click(function(){
					entity.elem.remove();
					entity.row.remove();
					
                    var index = entities.indexOf(entity);
                    if (index > -1) {
                        entities.splice(index, 1);
                    }
                });
        }
    };
    
    $('#button_add').click(function(){
        entities.push(new Entity());
    });
	
	$('#button_rainbow').click(function(){
		var generateColors = function(count) {
			var generateColor = function(position) {
				var makeCode = function(r, g, b) {
					return '#' +
					(r < 16 ? '0' : '') + Math.round(r).toString(16) +
					(g < 16 ? '0' : '') + Math.round(g).toString(16) +
					(b < 16 ? '0' : '') + Math.round(b).toString(16);
				}

					 if(position >= 0 && position <= 255)     return makeCode(255,                    position,               0);
				else if(position >= 256 && position <= 511)   return makeCode(255 - (position - 256), 255,                    0);
				else if(position >= 512 && position <= 767)   return makeCode(0,                      255,                    position - 512);
				else if(position >= 768 && position <= 1023)  return makeCode(0,                      255 - (position - 768), 255);
				else if(position >= 1024 && position <= 1279) return makeCode(position - 1024,        0,                      255);
				else if(position >= 1280 && position <= 1535) return makeCode(255,                    0,                      255 - (position - 1280));
			};

			var colors = [];
			for(var position = 0; position <= 1535; position += (1536 / count))
				colors.push(generateColor(position));
			return colors;
		};
		
		var colors = generateColors(entities.length);
		for(var i = 0; i < entities.length; i++) {
			entities[i].elem.css('background-color', colors[i]);
			entities[i].colorPicker.val(colors[i]);
		}
	});
    
    for (var i = 0; i < 8; i++) {
        $('#button_add').click();
    }
    
    var mousePosition = new Vector2;

    $(document).mousemove(function(event) {
        mousePosition = new Vector2(
            event.pageX,
            event.pageY
        );
    });

    setInterval(function() {
        var DELTAT = parseFloat($('#input_deltat').val());
        var SEGLEN = parseFloat($('#input_seglen').val());
        var SPRINGK = parseFloat($('#input_springk').val());
        var MASS = parseFloat($('#input_mass').val());
        var GRAVITY = parseFloat($('#input_gravity').val());
        var RESISTANCE = parseFloat($('#input_resistance').val());
        var STOPVEL = parseFloat($('#input_stopvel').val());
        var STOPACC = parseFloat($('#input_stopacc').val());
        var BOUNCE = parseFloat($('#input_bounce').val());
        
        var collisionUp = $('#input_collisionUp').is(':checked');
        var collisionLeft = $('#input_collisionLeft').is(':checked');
        var collisionRight = $('#input_collisionRight').is(':checked');
        var collisionDown = $('#input_collisionDown').is(':checked');
        
        $('#display_deltat').text(DELTAT);
        $('#display_seglen').text(SEGLEN);
        $('#display_springk').text(SPRINGK);
        $('#display_mass').text(MASS);
        $('#display_gravity').text(GRAVITY);
        $('#display_resistance').text(RESISTANCE);
        $('#display_stopvel').text(STOPVEL);
        $('#display_stopacc').text(STOPACC);
        $('#display_bounce').text(BOUNCE);

        var windowSize = new Vector2($(window).width(), $(window).height());
        
        $.each(entities, function(i, entity){
            var springForce = function(i, j) {
                var d = i.sub(j);
                var len = d.length();
                return len > SEGLEN ? d.div(len).mul(SPRINGK).mul(len - SEGLEN) : new Vector2();
            }

            var spring = springForce(i > 0 ? entities[i - 1].position : mousePosition, entity.position);

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

            if(collisionLeft) {
                if (entity.position.getX() < 0) {
                    if (entity.speed.getX() < 0) {
                        entity.speed.setX(BOUNCE * -entity.speed.getX());
                    }
                    entity.position.setX(0);
                }
            }

            if(collisionUp) {
                if (entity.position.getY() < 0) {
                    if (entity.speed.getY() < 0) {
                        entity.speed.setY(BOUNCE * -entity.speed.getY());
                    }
                    entity.position.setY(0);
                }
            }

            if(collisionRight) {
                if (entity.position.getX() >= windowSize.getX() - entity.elem.width()) {
                    if (entity.speed.getX() > 0) {
                        entity.speed.setX(BOUNCE * -entity.speed.getX());
                    }
                    entity.position.setX(windowSize.getX() - entity.elem.width());
                }
            }

            if(collisionDown) {
                if (entity.position.getY() >=  windowSize.getY() - entity.elem.height()) {
                    if (entity.speed.getY() > 0) {
                        entity.speed.setY(BOUNCE * -entity.speed.getY());
                    }
                    entity.position.setY(windowSize.getY() - entity.elem.height());
                }
            }

            entity.elem.css({
                'left': entity.position.getX(),
                'top': entity.position.getY()
            });
            entity.columns.position.text(Math.round(entity.position.getX()) + ', ' + Math.round(entity.position.getY()));
            entity.columns.speed.text(Math.round(entity.speed.getX()) + ', ' + Math.round(entity.speed.getY()));
        });
    }, 20);
});