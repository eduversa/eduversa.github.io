/* eslint-disable react-hooks/exhaustive-deps */

import { Fragment, useEffect, useRef, useState } from "react";

import QrScanner from "qr-scanner";
import { AdminLayout } from "@/layout";
import Image from "next/image";
function generateClassName(prefix, key) {
  const formattedKey = key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return `${prefix}-${formattedKey.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
}

function renderImage(imageUrl) {
  return (
    <div className="profile-image-container">
      <Image
        src={imageUrl}
        alt="Scanned QR Profile"
        className="profile-image"
        width={300}
        height={200}
      />
    </div>
  );
}

function renderFields(data, parentKey = "") {
  return Object.entries(data)
    .filter(
      ([key]) =>
        key !== "__v" &&
        key !== "_id" &&
        key !== "are_addresses_same" &&
        key !== "image" &&
        key !== "status" &&
        key !== "accessLevel" &&
        key !== "createdAt" &&
        key !== "updatedAt"
    )
    .map(([key, value]) => {
      const currentKey = parentKey ? `${parentKey}-${key}` : key;
      const className = generateClassName("field", currentKey);

      if (typeof value === "object" && value !== null) {
        return (
          <Fragment key={currentKey}>
            <div className={className}>
              <h3 className={generateClassName("heading", currentKey)}>
                {key}
              </h3>
              {renderFields(value, currentKey)}
            </div>
          </Fragment>
        );
      } else {
        return (
          <p key={currentKey} className={className}>
            <strong className={generateClassName("label", currentKey)}>
              {key}:
            </strong>{" "}
            {value}
          </p>
        );
      }
    });
}
const QrReader = () => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);

  const [scannedResult, setScannedResult] = useState(undefined);
  const [visible, setVisible] = useState(true);

  const hideResultScreen = () => {
    scanner?.current
      ?.start()
      .then(() => setQrOn(true))
      .catch((err) => {
        if (err) setQrOn(false);
      });
    setScannedResult(undefined);
    setVisible(true);
  };

  const handleOK = async (data) => {
    data.data.accessLevel = "4";
    console.log(data);
    const apiURL = "https://eduversa-api.onrender.com";
    const response = await fetch(`${apiURL}/scanner/process`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const res = await response.json();

    scanner.current.stop();

    setScannedResult(res);
    setVisible(false);
  };

  const onScanSuccess = async (result) => {
    console.log(result);
    await handleOK(JSON.parse(result?.data));
  };

  const onScanFail = (err) => {
    console.log(err);
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,

        preferredCamera: "environment",

        highlightScanRegion: true,

        highlightCodeOutline: true,

        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, [onScanSuccess]);
  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  const renderData = (data) => {
    return (
      <div>
        {Object.keys(data).map((key) => (
          <div
            key={key}
            className={`data-item ${
              typeof data[key] === "object" ? "nested" : ""
            }`}
          >
            <strong>{key}:</strong>{" "}
            {typeof data[key] === "object" ? renderData(data[key]) : data[key]}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      <AdminLayout>
        {visible && (
          <div className="qr-reader">
            <video ref={videoEl}></video>
          </div>
        )}

        {!visible && scannedResult && (
          <div className="scanner__result">
            <button className="btn" onClick={hideResultScreen}>
              Hide
            </button>
            <p className="scanned-result">Scanned Result:</p>
            {scannedResult.data.image && renderImage(scannedResult.data.image)}
            {/* {console.log(scannedResult.data.image)}
            {console.log(scannedResult)} */}

            <div className="profile-fields">{renderFields(scannedResult)}</div>
          </div>
        )}
      </AdminLayout>
    </Fragment>
  );
};

export default QrReader;
