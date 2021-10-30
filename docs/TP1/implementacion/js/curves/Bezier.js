class CubicBezierCurve {
    // All points must be a Vec3.
    constructor(p0, p1, p2, p3){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    getPoint(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, Math.pow(1-t, 3));
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, 3*(t-1)*(t-1)*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, 3*(1-t)*t*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p3, Math.pow(t, 3));
        vec3.add(retval, retval, aux);
        
        return retval;
    }

    // 0 <= t <= 1.
    getFirstDerivative(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, -3.0*t*t + 6.0*t - 3.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, 9.0*t*t - 12.0*t + 3.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, -9.0*t*t + 6.0*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p3, 3.0*t*t);
        vec3.add(retval, retval, aux);
        
        return retval;
    }

    // 0 <= t <= 1.
    getSecondDerivative(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, -6.0*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, 18.0*t - 12.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, -18.0*t + 6.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p3, 6.0*t);
        vec3.add(retval, retval, aux);
        
        return retval;
    }
}

class CuadraticBezierCurve {
    // All points must be a Vec3.
    constructor(p0, p1, p2){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    getPoint(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, (1-t)*(1-t));
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, (t-1)*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, t*t);
        vec3.add(retval, retval, aux);
        
        return retval;
    }

    // 0 <= t <= 1.
    getFirstDerivative(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, 2.0*t - 2.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, 1 - 2.0*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, 2.0*t);
        vec3.add(retval, retval, aux);
        
        return retval;
    }

    // 0 <= t <= 1.
    getSecondDerivative(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, 2.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, -2.0);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, 2.0);
        vec3.add(retval, retval, aux);
        
        return retval;
    }
}