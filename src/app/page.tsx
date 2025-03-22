import QRCodeGenerator from "@/components/QRCodeGenerator";

export default function Home() {
  return (
    <div className="flex w-screen h-screen items-center justify-evenly">
      <QRCodeGenerator />
    </div>
  );
}
