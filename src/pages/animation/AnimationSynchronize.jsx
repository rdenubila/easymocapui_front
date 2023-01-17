import { Button, Modal, Slider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { listAnimationImages, syncAnimationVideo } from "../../services/animation";
import { baseUrl } from "../../services/apiRequest";

function AnimationSynchronize({ }) {
    const [images, setImages] = useState();
    const { id } = useParams();
    const [frameOffset, setFrameOffset] = useState(0);
    const [camFrame, setCamFrame] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadData = async () => {
        setImages(null);
        const data = await listAnimationImages(id);
        setCamFrame(data.images.map(cam => 0));
        setImages(data);
    }

    useEffect(() => {
        loadData()
    }, []);

    const setFrame = (index, frame) => {
        let newFrame = [...camFrame];
        newFrame[index] = frame;
        setCamFrame(newFrame);
    }

    const onSync = async () => {
        const data = images.images.map((cam, i) => ({
            folder: cam.folder,
            firstFrame: camFrame[i]
        }))
        setLoading(true);
        await syncAnimationVideo(id, { data });
        setLoading(false);
    }

    return (<div>
        {images && <>
            <div className="p-3 bg-white shadow-lg mb-4 rounded">
                <Slider
                    max={images.images[0].files.length * .85}
                    value={frameOffset}
                    onChange={(value) => setFrameOffset(value)}
                />
            </div>
            <div className='grid grid-cols-4 gap-4'>
                {images.images.map((cam, i) =>
                    <CameraImagePreview
                        index={i}
                        frame={camFrame[i]}
                        setCurrentFrame={setFrame}
                        cam={cam}
                        folder={images.folder}
                        loadData={loadData}
                        offset={frameOffset}
                        type="images"
                    />)}
            </div>
            <hr className="my-6" />
            <div className="text-center">
                <Button loading={loading} onClick={() => onSync()}>Synchronize</Button>
            </div>
        </>}
    </div >);
}

function CameraImagePreview({ index, frame, setCurrentFrame, cam, folder, loadData, offset }) {

    const getFrame = () => offset + frame;

    return (<>

        <div className="w-full bg-white p-3">
            <img src={`${baseUrl}../files/animation/${folder}/images/${cam.folder}/${cam.files[getFrame()]}`} />
            <div className="mt-3 flex justify-between gap-2 items-center">
                <div className="w-6">{frame}</div>
                <div className="flex-1">
                    <Slider
                        max={cam.files.length - 1}
                        value={frame}
                        onChange={(value) => setCurrentFrame(index, value)}
                    />
                </div>
            </div>
        </div>
    </>)
}

export default AnimationSynchronize;
