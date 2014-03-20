/*
Vector2D.js
Simple but fairly thorough 2D vector class.  There are a handful of non-destructive static functions 
as well as instance functions.  

If you ignore certain parts this can work equally well as a 'Point' class.  Just be careful not to
confuse yourself when trying to distinguish the difference between a point and a vector in whatever
context you use this in. :)


Copyright (c) 2014 Mike Ferron (mikeferron.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
associated documentation files (the "Software"), to deal in the Software without restriction, 
including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or 
substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.

Special thanks to Harry Brundage (https://github.com/airhorns).  This code got started by adapting
his work here:
http://github.com/hornairs/blog/blob/master/assets/coffeescripts/flocking/vector.coffee
*/

Vector2D = (function() {

    /*
     * STATIC METHODS
     */

    //Non destructive static method auto-generation stuff...
    //works for the 1-argument functions
    var name, _fn, _i, _len, _ref;

    _ref = ['add', 'subtract', 'multiply', 'divide', 'dot'];

    _fn = function(name) {
        return Vector2D[name] = function(a, b) {
            return a.duplicate()[name](b);
        };
    };

    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        _fn(name);
    }

    //Defining any other static methods manually...
    //because their argument structure differs or they don't make sense at the instance level

    //Linear interpolation
    Vector2D.lerp = function(a, b, t) {
        return b.duplicate().subtract(a).multiply(t).add(a);
    };

    //Creates a vector from a given angle
    Vector2D.fromAngle = function(a) {
        return new Vector2D(Math.cos(a), Math.sin(a));
    };

    //Random vector with a magnitude of 1 (or just about 1...)
    Vector2D.random = function() {
        return new Vector2D.fromAngle(Math.floor(Math.random() * (Math.PI * 2 - 0 + 1)) + 0);
    };

    /*
     * CONSTRUCTOR
     */

    function Vector2D(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    /*
     * INSTANCE METHODS
     */

    Vector2D.prototype.zero = function() {
        this.x = this.y = 0;
        return this;
    };

    Vector2D.prototype.abs = function() {
        this.x = Math.abs(this.x);
        this.y = Math.abs(this.y);
        return this;
    };

    Vector2D.prototype.duplicate = function() {
        return new Vector2D(this.x, this.y);
    };
    Vector2D.prototype.clone = Vector2D.prototype.duplicate;

    Vector2D.prototype.magnitude = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2D.prototype.length = Vector2D.prototype.magnitude;

    Vector2D.prototype.negative = function() {
        return this.multiply(-1);
    };
    Vector2D.prototype.reverse = Vector2D.prototype.negative;

    Vector2D.prototype.normalize = function() {
        var m = this.magnitude();

        if (m > 0)
            this.divide(m);

        return this;
    };
    Vector2D.prototype.unit = Vector2D.prototype.normalize;

    Vector2D.prototype.limit = function(max) {
        if (this.magnitude() > max) {
            this.normalize();

            return this.multiply(max);
        } else {
            return this;
        }
    };

    Vector2D.prototype.heading = function() {
        return -1 * Math.atan2(-1 * this.y, this.x);
    };

    Vector2D.prototype.eucl_distance = function(other) {
        var dx, dy;

        dx = this.x - other.x;
        dy = this.y - other.y;

        return Math.sqrt(dx * dx + dy * dy);
    };

    Vector2D.prototype.distance = function(other, dimensions) {
        var dx, dy;

        if (dimensions === null)
            dimensions = false;


        dx = Math.abs(this.x - other.x);
        dy = Math.abs(this.y - other.y);

        if (dimensions) {
            dx = dx < dimensions.width / 2 ? dx : dimensions.width - dx;
            dy = dy < dimensions.height / 2 ? dy : dimensions.height - dy;
        }

        return Math.sqrt(dx * dx + dy * dy);
    };

    Vector2D.prototype.add = function(other) {
        this.x += other.x;
        this.y += other.y;

        return this;
    };

    Vector2D.prototype.subtract = function(other) {
        this.x -= other.x;
        this.y -= other.y;

        return this;
    };

    Vector2D.prototype.multiply = function(n) {
        this.x = this.x * n;
        this.y = this.y * n;

        return this;
    };

    Vector2D.prototype.divide = function(n) {
        this.x = this.x / n;
        this.y = this.y / n;

        return this;
    };

    Vector2D.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y;
    };

    Vector2D.prototype.lerp = function(other, t) {
        this.x = this.x + t * (other.x - this.x);
        this.y = this.y + t * (other.y - this.y);
        return this;
    };

    Vector2D.prototype.projectOnto = function(other) {
        return other.duplicate().multiply(this.dot(other));
    };

    Vector2D.prototype.wrapRelativeTo = function(position, dimensions) {
        var a, d, key, map_d, v, _ref1;

        v = this.duplicate();
        _ref1 = {
            x: "width",
            y: "height"
        };

        for (a in _ref1) {
            key = _ref1[a];
            d = this[a] - position[a];
            map_d = dimensions[key];
            if (Math.abs(d) > map_d / 2) {
                if (d > 0) {
                    v[a] = (map_d - this[a]) * -1;
                } else {
                    v[a] = this[a] + map_d;
                }
            }
        }
        return v;
    };

    Vector2D.prototype.equals = function(other) {
        return this.x == other.x && this.y == other.y;
    };

    Vector2D.prototype.invalid = function() {
        return (this.x === Infinity) || isNaN(this.x) || this.y === Infinity || isNaN(this.y);
    };

    return Vector2D;

})();
