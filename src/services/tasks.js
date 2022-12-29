import _ from "lodash";
import { runCommandById } from "./command";

export default class TaskService {

    data;

    updateData(_data) {
        this.data = this.removeFinished(_data);
        this.sortByDate();

        if (!this.isRunning() && this.data.length > 0) {
            console.log(this.data);
            runCommandById(this.data[0]._id);
        }

        return this;
    }

    removeFinished = (_data) => _data.filter(d => d.status !== "finished");
    isRunning = () => this.data.some(d => d.status === "running");

    sortByDate = () => {
        this.data = this.data.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
    }

}
