import { EhEvent } from "../dist/EhEvent";

export class ChangePositionEvent {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    swap() {
        this.x ^= this.y;
        this.y ^= this.x;
        this.x ^= this.y;
    }
}

export const changePosition = EhEvent.fromClass(ChangePositionEvent);
export const changeName = EhEvent.fromInstance({ name: "" }, "changeName");
export const direct = EhEvent.fromClass(class Direct { constructor(msg) { this.msg = msg; } });