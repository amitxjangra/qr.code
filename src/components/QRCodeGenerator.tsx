"use client";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

const QRCodeGenerator = ({ text }: { text: String }) => {
  const canvasRef = useRef(null);
  //   var canvas = document.getElementById('viewport'),
  // context = canvas.getContext('2d');

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      const img = new Image();
      img.src = "/phone1.png"; // Replace with your image URL
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 267, 500); // Draw image at (50,50) with 200x200 size
      };
    }
  }, [canvasRef]);

  const handleClick = async () => {
    const val = document.getElementById("qr_to_text")?.value;
    if (canvasRef.current && val) {
      const ctx = canvasRef.current.getContext("2d");

      let qrCode = await QRCode.toDataURL(val);
      const code = new Image();
      code.src = qrCode;
      code.onload = () => {
        ctx.recta;
        ctx.drawImage(code, 33, 75, 200, 200);
        ctx.lineWidth = 20;
        ctx.strokeStyle = "rgb(16,21,36)";
        ctx.strokeRect(38, 80, 190, 190);
      };
    }
  };

  return (
    <>
      <button onClick={handleClick}>click</button>
      <div className="relative">
        <canvas ref={canvasRef} width={"268px"} height={"500px"} />
        <button className="absolute top-[320px] left-[58px] w-[150px] h-10 bg-red-300 rounded-full"> <Download />Download</button>
        <button className="absolute top-[390px] left-[58px] w-[150px] h-10 bg-red-300 rounded-full">Share</button>

      </div>
    </>
  );
};

export default QRCodeGenerator;
