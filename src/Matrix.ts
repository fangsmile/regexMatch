export class Matrix {
    /**
     * scale x
     */
    a: number;
    /**
     * skew y
     */
    b: number;
    /**
     * skewx
     */
    c: number;
    /**
     * scale y
     */
    d: number;
    /**
     * translate x
     */
    e: number;
    /**
     * translate y
     */
    f: number;

    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number) {
        this.a = a || 1;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d || 1;
        this.e = e || 0;
        this.f = f || 0;
    }

    setValue(a: number, b: number, c: number, d: number, e: number, f: number) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
    }

    /**
     * 获取当前矩阵的逆矩阵
     */
    getInverse() {

        var a = this.a,
            b = this.b,
            c = this.c,
            d = this.d,
            e = this.e,
            f = this.f,
            m = new Matrix(),
            dt = (a * d - b * c);

        m.a = d / dt;
        m.b = -b / dt;
        m.c = -c / dt;
        m.d = a / dt;
        m.e = (c * f - d * e) / dt;
        m.f = -(a * f - b * e) / dt;

        return m;
    }

    /**
     * 插值计算
     * @param m2 
     * @param t 
     */
    interpolate(m2:Matrix, t:number) {

		var m = new Matrix();

		m.a = this.a + (m2.a - this.a) * t;
		m.b = this.b + (m2.b - this.b) * t;
		m.c = this.c + (m2.c - this.c) * t;
		m.d = this.d + (m2.d - this.d) * t;
		m.e = this.e + (m2.e - this.e) * t;
		m.f = this.f + (m2.f - this.f) * t;

		return m;
	}
}