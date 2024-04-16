/* eslint-disable react-hooks/exhaustive-deps */

import { Fragment, useEffect, useRef, useState } from "react";

import QrScanner from "qr-scanner";
import { AdminLayout } from "@/layout";
import Head from "next/head";

const QrReader = () => {
  const scanner = useRef();
  const videoEl = useRef(null);
  const qrBoxEl = useRef(null);
  const [qrOn, setQrOn] = useState(true);

  const [scannedResult, setScannedResult] = useState(undefined);

  const hideResultScreen = () => {
    scanner?.current
      ?.start()
      .then(() => setQrOn(true))
      .catch((err) => {
        if (err) setQrOn(false);
      });
    setScannedResult(undefined);
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

    setScannedResult(JSON.stringify(res));
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
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <Fragment>
      <Head></Head>
      <AdminLayout>
        <div className="qr-reader">
          <video ref={videoEl}></video>

          {scannedResult && (
            <div className="scanner__result">
              <button className="btn" onClick={hideResultScreen}>
                Hide
              </button>
              <p>Scanned Result:</p>
              <ul>
                <li>{scannedResult}</li>
                {console.log(scannedResult)}
              </ul>
            </div>
          )}
        </div>
      </AdminLayout>
    </Fragment>
  );
};

export default QrReader;
