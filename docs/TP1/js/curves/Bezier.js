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
}