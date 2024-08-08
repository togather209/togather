import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setReceiptData,
  setActiveTab,
  setTeamPlan,
} from "../../../redux/slices/receiptSlice";
import "./ReceiptForm.css";
import PaperReceipt from "../../../assets/receipt/paperReceipt.png";
import MobileReceipt from "../../../assets/receipt/mobileReceipt.png";
import Button from "../../common/Button";
import Camera from "../../../assets/receipt/camera.png";
import ActiveCamera from "../../../assets/receipt/activeCamera.png";
import Picture from "../../../assets/receipt/picture.png";
import ActivePicture from "../../../assets/receipt/activePicture.png";
import ConnectReceiptSchedule from "./ConnectReceiptScheduleModal";
import Close from "../../../assets/icons/common/close.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CameraCapture from "./recognizeDetail/CameraCapture";
import OcrComponent from "./recognizeDetail/OcrComponent";
import GeneralOcrComponent from "./recognizeDetail/GeneralOcrComponent"; // GeneralOcrComponent를 import합니다.

function RecognizeComponent({ defaultReceipt }) {
  const dispatch = useDispatch();

  const [activeType, setActiveType] = useState("paper");
  const [recognizedResult, setRecognizedResult] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookmark, setBookmark] = useState({ id: -1, name: "" });
  const [isEditStatus, setIsEditStatus] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  let { teamId, planId, color } = useSelector((state) => state.receipt);

  useEffect(() => {
    if (!teamId || !planId) {
      teamId = localStorage.getItem("teamId");
      planId = localStorage.getItem("planId");

      if (teamId && planId) {
        dispatch(setTeamPlan({ teamId, planId }));
      } else {
        console.error("teamId 또는 planId가 전달되지 않았습니다.");
        return;
      }
    }

    if (defaultReceipt !== undefined) {
      console.log("defaultReceipt is not null");
      setIsEditStatus(true);
      setRecognizedResult(defaultReceipt);
      setEditedItems(defaultReceipt.items);

      if (defaultReceipt.bookmarkId !== null) {
        setBookmark({
          id: defaultReceipt.bookmarkId,
          name: defaultReceipt.bookmarkName,
        });
      }
    }
  }, [defaultReceipt]);

  const handleReceiptType = (type) => {
    setSelectedImageType(null);
    setRecognizedResult(null);
    setIsEditing(false);
    setActiveType(type);
    setSelectedImage(null);
  };

  const handleCameraButton = () => {
    console.log("카메라 버튼 클릭");
    setSelectedImageType(null);
    setSelectedImage(null);
    setIsCameraOpen(true);
  };

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };

  const handleImageButton = () => {
    setSelectedImageType(null);
    setSelectedImage(null);
    console.log("image 버튼 클릭");
    document.getElementById("file-input").click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageBase64 = reader.result;

        // 이미지 로드를 위해 새로운 이미지 객체를 생성합니다.
        const img = new Image();
        img.src = imageBase64;
        img.onload = () => {
          // Canvas를 생성하여 이미지를 그립니다.
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          // Canvas를 JPG 형식의 base64 문자열로 변환합니다.
          const jpgBase64 = canvas.toDataURL("image/jpeg");
          setSelectedImage(jpgBase64);
          setSelectedImageType("image");
          setIsOcrLoading(true);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditButton = () => {
    setIsEditing(true);
  };

  const handleSaveButton = () => {
    const filteredItems = editedItems.filter(
      (item) => item.count > 0 && item.unitPrice > 0
    );
    const updatedResult = { ...recognizedResult, items: filteredItems };

    setRecognizedResult(updatedResult);
    setEditedItems(filteredItems);
    setIsEditing(false);
  };

  const handleChange = (index, field, value) => {
    const updatedItems = editedItems.map((item, i) =>
      i === index
        ? {
            ...item,
            [field]:
              field === "name" ? value : value === "" ? "" : Number(value),
          }
        : item
    );
    setEditedItems(updatedItems);
  };

  const handleConnectSchedule = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = (selectedBookmark) => {
    setBookmark(selectedBookmark);
    setIsModalOpen(false);
  };

  const handleDisconnectPlace = () => {
    setBookmark({ id: -1, name: "" });
  };

  const handleNextTab = () => {
    console.log("다음버튼 눌렀다");
    if (recognizedResult !== null) {
      console.log("recognizedResult null 아님");
      const newReceiptData = {
        items: recognizedResult.items,
        businessName: recognizedResult.businessName,
        paymentDate: recognizedResult.paymentDate,
        bookmarkId: bookmark.id,
        totalPrice: recognizedResult.items.reduce(
          (total, item) => total + item.unitPrice,
          0
        ),
        color,
      };
      console.log(newReceiptData);

      dispatch(setReceiptData(newReceiptData));
      dispatch(setActiveTab("calculate"));
    }
  };

  return (
    <div className="recognize-component">
      {isCameraOpen ? (
        <CameraCapture
          onCapture={(image) => {
            setSelectedImage(image);
            setSelectedImageType("camera");
            setIsOcrLoading(true);
            setIsCameraOpen(false);
          }}
          onClose={handleCloseCamera}
        />
      ) : (
        <>
          {!isEditStatus && (
            <div className="receipt-type">
              <button
                className={`type-button ${
                  activeType === "paper" ? "active" : ""
                }`}
                onClick={() => handleReceiptType("paper")}
              >
                종이 영수증
              </button>
              <button
                className={`type-button ${
                  activeType === "mobile" ? "active" : ""
                }`}
                onClick={() => handleReceiptType("mobile")}
              >
                모바일 결제내역
              </button>
            </div>
          )}
          {recognizedResult === null && (
            <div className="reciept-type-img-container">
              <div
                className={`receipt-type-img ${
                  activeType === "paper" ? "active" : "inactive"
                }`}
                onClick={() => {
                  setActiveType("paper");
                }}
              >
                <img src={PaperReceipt} alt="paper" />
              </div>
              <div
                className={`receipt-type-img ${
                  activeType === "mobile" ? "active" : "inactive"
                }`}
                onClick={() => {
                  setActiveType("mobile");
                }}
              >
                <img src={MobileReceipt} alt="mobile" />
              </div>
            </div>
          )}
          <div className="recognition-section">
            <div className="recognize-options">
              {recognizedResult === null && (
                <div className="recognize-badge">영수증을 인식해보세요!</div>
              )}
              {recognizedResult !== null && (
                <div className="recognize-header">
                  <div className="recognize-result-title">인식결과</div>
                  {!isEditing && (
                    <button
                      className={`edit-result ${
                        isEditStatus ? "" : "not-edit"
                      }`}
                      onClick={handleEditButton}
                    >
                      편집
                    </button>
                  )}
                  {isEditing && (
                    <button
                      className={`save-result ${
                        isEditStatus ? "" : "not-edit"
                      }`}
                      onClick={handleSaveButton}
                    >
                      저장
                    </button>
                  )}
                </div>
              )}
              {!isEditStatus && (
                <div className="recognize-image-buttons">
                  {selectedImageType === "camera" ? (
                    <img
                      src={ActiveCamera}
                      alt="active-camera"
                      onClick={handleCameraButton}
                    />
                  ) : (
                    <img
                      src={Camera}
                      alt="camera"
                      onClick={handleCameraButton}
                    />
                  )}
                  {selectedImageType === "image" ? (
                    <img
                      src={ActivePicture}
                      alt="active-image"
                      onClick={handleImageButton}
                    />
                  ) : (
                    <img
                      src={Picture}
                      alt="image"
                      onClick={handleImageButton}
                    />
                  )}
                  <input
                    type="file"
                    id="file-input"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          </div>
          {selectedImage &&
            isOcrLoading &&
            (activeType === "paper" ? (
              <OcrComponent
                image={selectedImage}
                onOcrResult={(result) => {
                  setRecognizedResult(result);
                  setIsOcrLoading(false);
                  setEditedItems(result.items);
                }}
              />
            ) : (
              <GeneralOcrComponent
                image={selectedImage}
                onOcrResult={(result) => {
                  setRecognizedResult(result);
                  setIsOcrLoading(false);
                  setEditedItems(result.items);
                }}
              />
            ))}
          {recognizedResult === null && (
            <div className="recognized-content no-content">
              <p>인식된 내용이 없어요</p>
              <p>영수증을 인식해 정산을 시작해보세요!</p>
            </div>
          )}
          {recognizedResult !== null && isEditing ? (
            <div className="recognized-edit-info">
              <input
                type="text"
                className="recognized-store-name edit"
                value={recognizedResult.businessName}
                onChange={(e) =>
                  setRecognizedResult({
                    ...recognizedResult,
                    businessName: e.target.value,
                  })
                }
              />
              <DatePicker
                selected={new Date(recognizedResult.paymentDate)}
                onChange={(date) =>
                  setRecognizedResult({
                    ...recognizedResult,
                    paymentDate: date.toISOString().split("T")[0],
                  })
                }
                dateFormat="yyyy/MM/dd"
                className="recognized-payment-date edit"
              />
            </div>
          ) : (
            recognizedResult !== null && (
              <>
                <div className="recognized-store-name">
                  <p>{recognizedResult.businessName}</p>
                </div>
                <div className="recognized-payment-date">
                  <p>
                    {new Date(
                      recognizedResult.paymentDate
                    ).toLocaleDateString()}
                  </p>
                </div>
              </>
            )
          )}
          {recognizedResult !== null && (
            <div className="recognized-content">
              <table>
                <thead>
                  <tr>
                    <th>품목</th>
                    <th>수량</th>
                    <th>금액</th>
                  </tr>
                </thead>
                <tbody>
                  {editedItems.map((item, index) => (
                    <tr key={index}>
                      {isEditing ? (
                        <>
                          <td>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) =>
                                handleChange(index, "name", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.count}
                              onChange={(e) =>
                                handleChange(index, "count", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) =>
                                handleChange(index, "unitPrice", e.target.value)
                              }
                            />
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            {item.name.length > 10
                              ? item.name.match(/.{1,10}/g).map((part, idx) => (
                                  <span key={idx}>
                                    {part}
                                    <br />
                                  </span>
                                ))
                              : item.name}
                          </td>
                          <td>{item.count}개</td>
                          <td>{item.unitPrice.toLocaleString()}원</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr className="recognized-content-line" />
              <div className="total">
                <p>총액</p>
                <p>
                  {editedItems
                    .reduce(
                      (total, item) =>
                        total + (item.unitPrice === "" ? 0 : item.unitPrice),
                      0
                    )
                    .toLocaleString()}
                  원
                </p>
              </div>
            </div>
          )}
          {recognizedResult !== null && bookmark.id === -1 && (
            <button
              className="connect-schedule"
              onClick={handleConnectSchedule}
            >
              장소연결
            </button>
          )}
          {recognizedResult !== null && bookmark.id !== -1 && (
            <div className="connected-place-info">
              <div>연결된 장소</div>
              <div className="connected-place-name">
                {bookmark.name}
                <img
                  src={Close}
                  alt="disconnect"
                  className="disconnect-button"
                  onClick={handleDisconnectPlace}
                />
              </div>
            </div>
          )}
          <Button
            type={recognizedResult === null ? "gray" : "purple"}
            onClick={handleNextTab}
          >
            다음
          </Button>
          {isModalOpen && (
            <ConnectReceiptSchedule
              onClose={closeModal}
              onConfirm={handleConfirm}
            />
          )}
        </>
      )}
    </div>
  );
}

export default RecognizeComponent;
