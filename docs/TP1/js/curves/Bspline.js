class CubicBsplineCurve {
    // All points must be a Vec3.
    constructor(p0, p1, p2, p3){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
    }

    // 0 <= t <= 1.
    getPoint(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, (1.0/6.0) * Math.pow(1-t, 3));
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, 0.5*Math.pow(1-t, 3) - t*t + (2.0/3.0));
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, 0.5*Math.pow(1-t, 3) - 0.5*t*t + 0.5*t + (1.0/6.0));
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p3, (1.0/6.0) * Math.pow(t, 3));
        vec3.add(retval, retval, aux);
        
        return retval;
    }
}

class CuadraticBsplineCurve {
    // All points must be a Vec3.
    constructor(p0, p1, p2){
        this.p0 = p0;
        this.p1 = p1;
        this.p2 = p2;
    }

    // 0 <= t <= 1.
    getPoint(t) {
        var aux = vec3.create();
        var retval = vec3.create();
        vec3.scale(aux, this.p0, 0.5*(1-t)*(1-t));
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p1, 0.5 + (t-1)*t);
        vec3.add(retval, retval, aux);
        vec3.scale(aux, this.p2, 0.5 * t*t);
        vec3.add(retval, retval, aux);
        
        return retval;
    }
}