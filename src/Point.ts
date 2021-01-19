export class Point   {
    x: number;
    y: number;
    private lineWidth: number=null;//优化笔锋的时候加入
    constructor(x:number, y:number) {
        this.x = x;
        this.y = y;
    }
    getLineWidth() {
        return this.lineWidth;
    }
    setLineWidth(lineWidth: number) {
        this.lineWidth = lineWidth;
    }
}