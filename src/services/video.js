import { post } from "./apiRequest";

const hdConstraints = {
    width: { min: 1280 }, height: { min: 720 },
};

const fullhdConstraints = {
    width: { min: 1920 }, height: { min: 1080 },
};

export default class VideoService {

    _video;
    _cameraId;
    _stream;
    _recorder;
    _data = [];

    setVideoRef(video) {
        this._video = video;
        return this;
    }

    setCameraId(cameraId) {
        this._cameraId = cameraId;
        return this;
    }

    async getDevices() {
        if (navigator.mediaDevices.enumerateDevices) {
            const devices = await navigator.mediaDevices.enumerateDevices();
            return devices.filter(device => device.kind === "videoinput");
        } else {
            return [];
        }
    }

    getUserMediaById = async () => {
        try {
            return navigator.mediaDevices.getUserMedia({
                video: {
                    ...{
                        deviceId: { exact: this._cameraId }
                    },
                    ...fullhdConstraints
                }
            })
        } catch (e) {
            console.error("getUserMediaById", e);
        }
    }

    updateDevice = async () => {
        if (!this._cameraId || !this._video) return;

        this._stream = await this.getUserMediaById();
        if (this._stream) {
            try {
                this._video.srcObject = this._stream;
            } catch (error) {
                this._video.src = URL.createObjectURL(this._stream);
            }
            this._video.onloadedmetadata = function (e) {
                e.target.play();
            };
        }
        return this;
    }

    startRecording() {
        this._recorder = new MediaRecorder(this._stream);
        this._data = [];

        this._recorder.ondataavailable = event => this._data.push(event.data);
        this._recorder.start()

        new Promise((resolve, reject) => {
            this._recorder.onstop = resolve;
            this._recorder.onerror = event => reject(event.name);
        }).then(() => this.recordingEnded())
    }

    stopRecording() {
        this._recorder.stop();
    }

    recordingEnded() {
        const recordedBlob = new Blob(this._data, { type: "video/mp4" });
        console.log(URL.createObjectURL(recordedBlob));
        this._video.srcObject = null;
        this._video.src = URL.createObjectURL(recordedBlob);
        this._video.loop = true;
        this._video.play();
    }

    async discardRecording() {
        this._data = [];
        this._video.src = null;
        await this.updateDevice();
    }

    static saveVideoToServer = async (dir, camId, blob, cameraData) => {
        const recordedBlob = new Blob(blob, { type: "video/mp4" });
        const data = {
            dir,
            camId,
            rotation: cameraData.rotation,
            video: await VideoService.blobToBase64(recordedBlob)
        }
        return await post(`video/save`, data);
    }

    static blobToBase64(blob) {
        return new Promise((resolve, _) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    }

}
