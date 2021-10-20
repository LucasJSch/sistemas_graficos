class CubicBezierConcatenator {
    // The user has to make sure to pass points that generate a smooth line.
    constructor(points){
        this.points = points;
        this.n_points = points.length;
        this.beziers = [];
        for (var i = 0; i < this.n_points-3; i+=4) {
            var bezier = new CubicBezierCurve(this.points[i], this.points[i+1], this.points[i+2], this.points[i+3]);
            this.beziers.push(bezier);
        }
    }

    // 0 <= t <= ceil(n_points/3)
    getPoint(t) {
        var curveNumber = Math.floor(t);
        var u = t % 1;

        if (curveNumber > this.beziers.length-1) {
            console.log("ERROR: Invalid t in CuadraticBsplineConcatenator. t = " + t);
        }

        return this.beziers[curveNumber].getPoint(u);
    }

    // 0 <= t <= ceil(n_points/3)
    getFirstDerivative(t) {
        var curveNumber = Math.floor(t);
        var u = t % 1;

        if (curveNumber > this.beziers.length-1) {
            console.log("ERROR: Invalid t in CuadraticBsplineConcatenator. t = " + t);
        }

        return this.beziers[curveNumber].getFirstDerivative(u);
    }

    getNumberOfCurves() {
        return this.beziers.length;
    }
}