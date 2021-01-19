import * as PointerEvent from "./PointerEvent";
import { EventManger, DomEventType } from './EventManger';

class index {
    /**
   * 全局事件处理代理
   */
    eventManger: EventManger;
    isDrawing: boolean = false;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
    points: any = new Array();
    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('c');
        this.context = this.canvas.getContext('2d');
        this.context.strokeStyle = "rgba(255,0,75,0.5)";
        this.context.lineWidth = 13;
        // this.context.lineJoin="round";
        this.context.globalCompositeOperation = "source-over"
        this.eventManger = new EventManger();
        this.initMousedown();
        this.initDrag();
        this.initDragup();
        this.initPinch();
        
        // sqlite.open("../892739385.db",{});

    }
    initMousedown() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.pointerDown, function (e: PointerEvent.PointerEventInfo) {
            that.isDrawing = true;
            
            that.points.push({ x: e.clientX, y: e.clientY });
            // that.context.moveTo(e.clientX, e.clientY);
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('mathtool', handler, document.body)

    }
    initDrag() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.dragMove, function (e: PointerEvent.PointerEventInfo) {
            if (that.isDrawing) {
                that.context.beginPath();
                that.context.moveTo(e.lastX, e.lastY);
                that.context.lineTo(e.clientX, e.clientY);
                that.points.push({ x: e.clientX, y: e.clientY });
                that.context.stroke();

            }
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('mathtool', handler, document.body);
    }

    initDragup() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.dragEnd, function (e: PointerEvent.PointerEventInfo) {
            if (that.isDrawing) {
                that.context.beginPath();
                that.context.moveTo(e.lastX, e.lastY);
                that.context.lineTo(e.clientX, e.clientY);
                that.points.push({ x: e.clientX, y: e.clientY });
                that.context.stroke();

            }
            that.isDrawing = false;
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('mathtool', handler, document.body);
    }
    initPinch() {
        var that = this;
        let handler = new PointerEvent.HandlerInfo(PointerEvent.PointerEventType.pinch, function (e: PointerEvent.PointerEventInfo) {
                console.log("initPinch pinchType ", e.pinchType, e)

                if (e.pinchType == "pinchMove"&&that.points.length>=2) {
                    that.context.translate(e.pageX-e.lastX,e.pageY-e.lastY);
                    that.context.clearRect(0,0,1920,1080);
                    that.context.beginPath();
                    that.context.moveTo(that.points[0].x, that.points[0].y);
                    for(let i=1;i<that.points.length;i++){
                        that.context.lineTo(that.points[i].x, that.points[i].y);
                    }
                    that.context.stroke();
                }
            
        }, false, PointerEvent.ButtonType.LTPButton, this);
        this.eventManger.registerPointerEvent('mathtool', handler, document.body);
    }
}

new index();