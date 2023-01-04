import { Button, Modal, Slider, Typography } from "antd";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { baseUrl } from "../../services/apiRequest";
import { listCalibrationImages, setCalibrationImage } from "../../services/calibration";

function CalibrationSelectImages({ }) {
    const [images, setImages] = useState();
    const { id } = useParams();


    const loadData = async () => {
        setImages(null);
        const data = await listCalibrationImages(id);
        setImages(data);
    }

    useEffect(() => {
        loadData()
    }, []);

    return (<div>
        {images && <>
            <Typography.Title level={3}>Intrinsic</Typography.Title>
            <div className='grid grid-cols-4 gap-4'>
                {images.intri.map(cam => <CameraImagePreview id={id} cam={cam} folder={images.folder} loadData={loadData} type="intri" />)}
            </div>
            <hr className="my-6" />
            <Typography.Title level={3}>Extrinsic</Typography.Title>
            <div className='grid grid-cols-4 gap-4'>
                {images.extri.map(cam => <CameraImagePreview id={id} cam={cam} folder={images.folder} loadData={loadData} type="extri" />)}
            </div>
        </>}
    </div>);
}

function CameraImagePreview({ id, cam, folder, type, loadData }) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentImage, setCurrentImage] = useState(0);

    const selectImage = async () => {
        setLoading(true);
        await setCalibrationImage(id, type, folder, cam.folder, cam.files[currentImage])
        setLoading(false);
        loadData();
        setShowModal(false);
    }

    return (<>
        <Modal
            title="Select Image"
            visible={showModal}
            onCancel={() => setShowModal(false)}
            onOk={() => { selectImage() }}
            confirmLoading={loading}
        >
            <img src={`${baseUrl}../files/calibration/${folder}/${type}/images/${cam.folder}/${cam.files[currentImage]}`} />
            <Slider
                max={cam.files.length - 1}
                value={currentImage}
                onChange={(value) => setCurrentImage(value)}
            />
        </Modal>

        <div className="w-full bg-white p-3">
            <img src={`${baseUrl}../files/calibration/${folder}/${type}/images/${cam.folder}/${cam.files[0]}`} />
            <div className="mt-3 flex items-center justify-between">
                Images count: {cam.files.length}
                <Button onClick={() => setShowModal(true)} shape="circle" icon={<i className="ri-checkbox-multiple-blank-fill"></i>}></Button>
            </div>
        </div>
    </>)
}

export default CalibrationSelectImages;
