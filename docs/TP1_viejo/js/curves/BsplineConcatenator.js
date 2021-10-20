class CuadraticBsplineConcatenator {
    constructor(points){
        this.points = points;
        this.n_points = points.length;
        this.bsplines = [];
        for (var i = 0; i < this.n_points-2; i++) {
            var bspline = new CuadraticBsplineCurve(this.points[i], this.points[i+1], this.points[i+2]);
            this.bsplines.push(bspline);
        }
    }

    // 0 <= t <= ceil(n_points/3)
    getPoint(t) {
        var curveNumber = Math.floor(t);
        var u = t % 1;

        if (curveNumber > this.bsplines.length-1) {
            console.log("ERROR: Invalid t in CuadraticBsplineConcatenator. t = " + t);
        }

        return this.bsplines[curveNumber].getPoint(u);
    }

    // 0 <= t <= ceil(n_points/3)
    getFirstDerivative(t) {
        var curveNumber = Math.floor(t);
        var u = t % 1;

        if (curveNumber > this.bsplines.length-1) {
            console.log("ERROR: Invalid t in CuadraticBsplineConcatenator. t = " + t);
        }

        return this.bsplines[curveNumber].getFirstDerivative(u);
    }

    getNumberOfCurves() {
        return this.bsplines.length;
    }
}