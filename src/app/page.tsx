import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function Home() {
  
  return (
    <div>
      <input className="border border-white rounded-full h-10 w-70 p-5" id="qr_to_text" />
      <QRCodeGenerator/>
    </div>
  );
}
