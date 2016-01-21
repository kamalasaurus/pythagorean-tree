var L = 100;
var WIDTH = L * 6;
var HEIGHT = L * 4;

var INITIAL = {
  x: (WIDTH/2 - L/2),
  y: (HEIGHT - L),
  length: L,
  angle: 0
};

var MAXORDER = 8;

var brown = [167, 41, 38];
var green = [153, 207, 28];


var TREE = {

  canvas: null,
  context: null,

  drawTree: function() {
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.context.canvas.width = WIDTH;
    this.context.canvas.height = HEIGHT;

    document.body.appendChild(this.canvas);
    this.draw(INITIAL, 0);
  },

  draw: function(props, order) {

    this.context.save();

    this.context.fillStyle = this.getColor(order);
    this.context.globalAlpha = 0.5;
    this.context.translate(props.x, props.y);
    this.context.rotate(props.angle);

    this.context.fillRect(0, 0, props.length, props.length);

    this.context.restore();

    window.setTimeout(function() {
      this.leftAngle(props, order);
      this.rightAngle(props, order);
    }.bind(this), 1000);
  },

  leftAngle: function(props, order) {
    // go left by l/2 and up by l/2 from the origin of the previous square,
    // rotate up by 45 degrees, if you draw a diagram you'll see that sin and cos
    // invert for the x and y movements given a theta.  You have to subtract the
    // x translation due to the y translation given trignometry.  You really have to
    // think about those diagrams.

    if (order < MAXORDER) {
      var newlength = props.length * Math.sqrt(2)/2;
      var vec = props.length/2;
      var Θ = props.angle;

      var newprops = {
        x: props.x - (vec*Math.cos(Θ) + -vec*Math.sin(Θ)),
        y: props.y - (vec*Math.sin(Θ) + vec*Math.cos(Θ)),
        length: newlength,
        angle: props.angle - Math.PI/4
      };

      this.draw(newprops, ++order);
    }
  },

  rightAngle: function(props, order) {
    // go right by l and up by the diagonal of the new square from the origin of the previous square,
    // rotate down by 45 degrees.  In this case, the y contribution of the x vector is negative for a
    // given theta.  Again, really look at those diagrams.  In general I derived the process by looking
    // at the terminal branches, if you apply both terminal patterns simultaneously to every node the
    // fractal forms.

    if (order < MAXORDER) {
      var newlength = props.length * Math.sqrt(2)/2;
      var xvec = props.length;
      var yvec = newlength * Math.sqrt(2);
      var Θ = props.angle;

      var newprops = {
        x: props.x + (xvec*Math.cos(Θ) + yvec*Math.sin(Θ)),
        y: props.y - (-xvec*Math.sin(Θ) + yvec*Math.cos(Θ)),
        length: newlength,
        angle: props.angle + Math.PI/4
      };

      this.draw(newprops, ++order);
    }
  },

  getColor: function(order) {
    var col = brown.map(function(color, idx) {
      var b_comp = (MAXORDER-order)/MAXORDER * color;
      var g_comp = order/MAXORDER * green[idx];
      return Math.round(b_comp + g_comp);
    });
    return 'rgb(' + col.join(',') + ')';
  }

};

(function render() {
  TREE.drawTree();
})();

