export default class EventsService {
    type;

    constructor(_type) {
        this.type = _type;
    }

    dispatch(data) {
        document.dispatchEvent(new CustomEvent(this.type, { detail: data }));
    }

    addListener(fn) {
        document.addEventListener(this.type, fn);
    }

    removeListener(fn) {
        document.removeEventListener(this.type, fn);
    }

}
