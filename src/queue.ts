module.exports.Queue = function () {
    var arr: Array<any> = [];
    this.enqueue = function (value: any): void {
        arr.push(value);
    };
    this.dequeue = function (): any {
        return arr.shift();
    };
    this.peek = function (): any {
        return arr[0];
    };
    this.isEmpty = function (): boolean {
        return arr.length == 0 ? true : false;
    };
    this.print = function (): void {
        arr.forEach(function (element) {
            console.log(element + " ");
        });
    };
};
