"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, Forward, PaintRoller, SendHorizontal } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

function debounceAsync<T extends (...args: any[]) => Promise<any>>(
  func: T,
  delay: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeoutId: NodeJS.Timeout;
  let lastPromise: Promise<ReturnType<T>>;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    clearTimeout(timeoutId);

    return new Promise((resolve, reject) => {
      timeoutId = setTimeout(async () => {
        try {
          lastPromise = func(...args);
          const result = await lastPromise;
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}

const QRCodeGenerator = () => {
  const [donwloadable, setDownloadable] = useState(false);
  const [text, setText] = useState("Scan Me!!");
  const canvasRef = useRef(null);
  const [paintLayer, setPaintLayer] = useState(false);
  const [qrSrc, setQrSrc] = useState("");
  //   var canvas = document.getElementById('viewport'),
  // context = canvas.getContext('2d');

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      const img = new Image();
      img.src = "/phone1.png"; // Replace with your image URL
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 267, 500); // Draw image at (50,50) with 200x200 size
      };
    }
  }, [canvasRef]);

  const handleClick = async () => {
    const ele = document.getElementById("qr_to_text") as HTMLTextAreaElement;
    let val = ele.value;
    if (canvasRef.current && val) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      let qrCode = await QRCode.toDataURL(val, {
        quality: 1,
        color: {
          dark: "#000",
          light: "#fff",
        },
      });
      const code = new Image();
      code.src = qrCode;
      setQrSrc(qrCode);
      code.onload = () => {
        if (ctx !== null) {
          // ctx.rect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(code, 33, 75, 200, 200);
          ctx.lineWidth = 20;
          ctx.strokeStyle = "rgb(16,21,36)";
          ctx.strokeRect(38, 80, 190, 190);
          ctx.font = "bold 16px Arial";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText(text, 134, 320);
        }
      };
      setDownloadable(true);
    }
  };
  const downloadQR = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const image = canvas.toDataURL("image/png", 1.0); // Convert to JPG

      const link = document.createElement("a");
      link.href = image;
      link.download = "canvas-image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const togglePaintLayer = useCallback(() => {
    setPaintLayer(!paintLayer);
  }, [paintLayer]);

  const handleDarkColorChange = useDebounce(async (color: string) => {
    const ele = document.getElementById("qr_to_text") as HTMLTextAreaElement;
    if (canvasRef.current && color) {
      const canvas = canvasRef.current as HTMLCanvasElement;
      const ctx = canvas.getContext("2d");

      let qrCode = await QRCode.toDataURL(ele.value, {
        quality: 1,
        color: {
          dark: color,
          light: "#fff",
        },
      });

      const code = new Image();
      code.src = qrCode;
      setQrSrc(qrCode);

      code.onload = () => {
        if (ctx !== null) {
          ctx.drawImage(code, 33, 75, 200, 200);
          ctx.lineWidth = 20;
          ctx.strokeStyle = "rgb(16,21,36)";
          ctx.strokeRect(38, 80, 190, 190);
          ctx.font = "bold 16px Arial";
          ctx.fillStyle = "white";
          ctx.textAlign = "center";
          ctx.fillText(text, 134, 320);
        }
      };
    }
  }, 300); // Adjust debounce delay as needed

  return (
    <>
      <div className="flex gap-5 h-[500px] w-[268px] flex-col items-center justify-center bg-black rounded-lg p-5 drop-shadow-[0_0_10px_black]">
        <input
          type="text"
          className="rounded-lg h-10 w-full bg-[#373737] text-white p-5 outline-none"
          placeholder="Enter text to generate QR code"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <textarea
          className=" rounded-lg h-full w-full p-5 outline-none bg-[#373737] text-white"
          id="qr_to_text"
        />
        <div className="flex gap-5">
          <button
            className="mt-auto border border-gray-800 rounded-full pl-2 pt-2 pr-2 pb-2 cursor-pointer bg-gray-900"
            onClick={togglePaintLayer}
          >
            <PaintRoller color="white" />
          </button>
          <button
            className="mt-auto border border-gray-800 rounded-full pl-2 pt-2 pr-2 pb-2 cursor-pointer bg-gray-900"
            onClick={handleClick}
          >
            <SendHorizontal color="white" />
          </button>
        </div>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} width={"268px"} height={"500px"} />
        {donwloadable && (
          <button
            className="absolute top-[400px] left-[58px] w-[150px] h-10 bg-red-300 rounded-full flex items-center gap-2 pl-5 cursor-pointer"
            onClick={downloadQR}
          >
            <Download />
            Download
          </button>
        )}
        {/* <button
          className="absolute top-[390px] left-[58px] w-[150px] h-10 bg-red-300 rounded-full flex items-center gap-2 pl-5 cursor-pointer"
          onClick={() => !shareBox && toggleShare()}
        >
          <Forward />
          Share
        </button>
        <dialog open={shareBox} className="flex justify-self-center px-10 py-5 ">
        hello
        </dialog> */}
      </div>
      <dialog open={paintLayer}>
        <label htmlFor="light-color">Dark Color</label>
        <input type="color" id="light-color" />
        <label htmlFor="dark-color">Light Color</label>
        <input
          type="color"
          id="dark-color"
          onChange={(e) => {
            handleDarkColorChange(e.target.value);
          }}
        />
      </dialog>
    </>
  );
};

export default QRCodeGenerator;
