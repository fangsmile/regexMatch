import { CanvasContext } from "./CanvasContext";

export class EventUtil {

    static on(el: any, eventType: any, hanlder: Function) {
        if (el.addEventListener) {                // 主流浏览器
            el.addEventListener(eventType, hanlder, { passive: false });
        } else if (el.attachEvent) {             // IE8及早期版本
            el.attachEvent(eventType, hanlder);
        }
    }



}

export class Util {
    public static trim(s: string): string {

        return s.replace(/(^\s*)|(\s*$)/g, "");

    }
    public static map = (f:any )=> (x:any) => Array.prototype.map.call(x, f);

    public static clone(parent: any, circular: boolean = undefined, depth: number = undefined, prototype: any = undefined) {
        // maintain two arrays for circular references, where corresponding parents
        // and children have the same index
        var allParents: Array<any> = [];
        var allChildren: Array<any> = [];



        if (typeof circular == 'undefined')
            circular = true;

        if (typeof depth == 'undefined')
            depth = Infinity;

        // recurse this function so we don't reset allParents and allChildren
        function _clone(parent: any, depth: number) {
            // cloning null always returns null
            if (parent === null)
                return null;

            if (depth == 0)
                return parent;

            var child;
            if (typeof parent != 'object') {
                return parent;
            }

            if (Util.isArray(parent)) {
                child = [];
            } else if (Util.isRegExp(parent)) {
                child = new RegExp(parent.source, Util.getRegExpFlags(parent));
                if (parent.lastIndex) child.lastIndex = parent.lastIndex;
            } else if (Util.isDate(parent)) {
                child = new Date(parent.getTime());
            } else {
                if (typeof prototype == 'undefined') child = Object.create(Object.getPrototypeOf(parent));
                else child = Object.create(prototype);
            }

            if (circular) {
                var index = allParents.indexOf(parent);

                if (index != -1) {
                    return allChildren[index];
                }
                allParents.push(parent);
                allChildren.push(child);
            }

            for (var i in parent) {
                child[i] = _clone(parent[i], depth - 1);
            }

            return child;
        }
        return _clone(parent, depth);
    }



    public static getObjClass(objClass:any) {
        if (objClass && objClass.constructor) {
            var strFun = objClass.constructor.toString();
            var className = strFun.substr(0, strFun.indexOf('('));
            className = className.replace('function', '');
            return className.replace(/(^\s*)|(\s*$)/ig, '');
        }
        return typeof (objClass);
    }
    public static isHasChineseStr(value:string) {
        if (/[^\x00-\xff]/g.test(value)) {
            return true;
        } else {
            return false;
        }
    }


    public static objectToString(o: any) {
        return Object.prototype.toString.call(o);
    }
    public static isArray(ar: any) {
        return Array.isArray(ar) || (typeof ar === 'object' && Util.objectToString(ar) === '[object Array]');
    }
    public static isDate(d: any) {
        return typeof d === 'object' && Util.objectToString(d) === '[object Date]';
    }
    public static isRegExp(re: any) {
        return typeof re === 'object' && Util.objectToString(re) === '[object RegExp]';
    }
    public static getRegExpFlags(re: any) {
        var flags = '';
        re.global && (flags += 'g');
        re.ignoreCase && (flags += 'i');
        re.multiline && (flags += 'm');
        return flags;
    }
     //在context上绘制并输成图片
     public static generateClipImage(context:CanvasContext, width:number, height:number, drawElement:any, imageType: string = "image/jpeg") {
        context.canvas.width = width;
        context.canvas.height = height;
        context.drawImage(drawElement, 0, 0, width, height);
        return context.canvas.toDataURL("image/jpeg");
    }

    /**
         * 对单个img元素的加载封装promise
         * @param image 
         * 玄魂 @ 2017-04-05
         */
        public static getImgLoadPromise(image: HTMLImageElement): Promise<any> {
            var promise = new Promise((resolve, reject) => {
                if (image.naturalWidth) {
                    // 如果可以识别naturalWidth
                    // 
                    resolve(image);
                } else if (image.src && image.complete) {
                    //如果 已经加载完成但是naturalWidth
                    //没有初始化，很可能已经数据传输失败（broken）
                    reject(image);
                } else {
                    image.addEventListener('load', fullfill);
                    image.addEventListener('error', fullfill);
                }
                function fullfill() {
                    if (image.naturalWidth) {
                        resolve(image);
                    } else {
                        reject(image);
                    }
                    image.removeEventListener('load', fullfill);
                    image.removeEventListener('error', fullfill);
                }
            });
            return promise;
        }



        public static date2YYYYMMDDhhmmss(d: Date) {
            function t(x:number) {
                if (x < 10) return '0' + x; else return String(x);
            }
            var YYYY = d.getFullYear();
            var MM = d.getMonth() + 1;
            var DD = d.getDate();
            var hh = d.getHours();
            var mm = d.getMinutes();
            var ss = d.getSeconds();
            return t(YYYY) + t(MM) + t(DD) + t(hh) + t(mm) + t(ss);
        }
        public static date2YYYYMMDD(d: Date) {
            function t(x:number) {
                if (x < 10) return '0' + x; else return String(x);
            }
            var YYYY = d.getFullYear();
            var MM = d.getMonth() + 1;
            var DD = d.getDate();
            return t(YYYY) + t(MM) + t(DD);
        }

        public static stringToHtmlDom(html: string) {

            var template = document.createElement('template');
            template.innerHTML = html;
            return template.content.firstChild;

        }
        //获取地址参数
        public static GetQueryString(name:string) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }
    //返回角度
    public static GetSlideAngle(dx: number, dy: number) {
        return Math.atan2(dy, dx) * 180 / Math.PI;
    }
    //根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
    public static GetSlideDirection(startX: number, startY: number, endX: number, endY: number, isJudgeDis: boolean = true) {
        var dy = startY - endY;
        var dx = endX - startX;
        var result = 0;

        //如果滑动距离太短
        if (isJudgeDis && Math.abs(dx) < 2 && Math.abs(dy) < 2) {
            return result;
        }

        var angle = this.GetSlideAngle(dx, dy);
        if (angle >= -60 && angle < 60) {
            result = 4;
        } else if (angle >= 60 && angle < 120) {
            result = 1;
        } else if (angle >= -120 && angle < -60) {
            result = 2;
        }
        else if ((angle >= 120 && angle <= 180) || (angle >= -180 && angle < -120)) {
            result = 3;
        }

        return result;
    }

    //生成指定范围的随机数
    public static RandomNumBoth(Min:number, Max:number) {
        var Range = Max - Min;
        var Rand = Math.random();

        var num = Min + Math.round(Rand * Range); //四舍五入
        return num;
    }

    public static getElPosition(el:any) {
        var xPos = 0;
        var yPos = 0;

        while (el) {
            if (el.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScroll = el.scrollLeft || document.documentElement.scrollLeft;
                var yScroll = el.scrollTop || document.documentElement.scrollTop;

                xPos += (el.offsetLeft - xScroll + el.clientLeft);
                yPos += (el.offsetTop - yScroll + el.clientTop);
            } else {
                // for all other non-BODY elements
                xPos += (el.offsetLeft - el.scrollLeft + el.clientLeft);
                yPos += (el.offsetTop - el.scrollTop + el.clientTop);
            }

            el = el.offsetParent;
        }
        return {
            x: xPos,
            y: yPos
        };
    }
}

String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match:any, number:number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match
            ;
    });
};

String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}