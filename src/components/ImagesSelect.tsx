import { Image, Upload, UploadFile } from "antd";
import { Dispatch, SetStateAction, useState } from "react";

type ImagesSelectProps = {
  fileList: UploadFile[];
  setFileList: Dispatch<SetStateAction<UploadFile[]>>;
};

export function ImagesSelect({ fileList, setFileList }: ImagesSelectProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const getBase64 = (file: File | Blob) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handlePreview = (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = file.url;
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };
  return (
    <>
      <span style={{ marginTop: "10px" }}>사진 선택: </span>
      <Upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        listType="picture-card"
        fileList={fileList}
        accept="image/png, image/jpeg"
        onPreview={handlePreview}
        beforeUpload={async (file) => {
          setFileList([...fileList, { ...file, url: await getBase64(file) }]);
          return false;
        }}
        onRemove={(file) => {
          setFileList(fileList.filter((f) => f.uid !== file.uid));
        }}
      >
        <button style={{ border: 0, background: "none" }} type="button">
          {/* <PlusOutlined /> */}
          <div style={{ marginTop: 8 }}>사진 추가</div>
        </button>
      </Upload>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </>
  );
}
