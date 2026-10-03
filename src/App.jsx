import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { FiDownload, FiCopy, FiCheck, FiX, FiMoon, FiSun } from "react-icons/fi";
import { BsQrCode } from "react-icons/bs";
import { DotPattern } from "./components/dot_pattern";
import { cn } from "cn";

function SimpleQRGenerator() {
  const [inputText, setInputText] = useState("");
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [tab, setTab] = useState("text"); // "text" or "email"

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [encryption, setEncryption] = useState("WPA");

  const handleDownload = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const pngUrl = canvas
      .toDataURL("image/png")
      .replace("image/png", "image/octet-stream");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    link.click();
  };

  const handleCopy = async () => {
    try {
      const qrValue =
        tab === "email"
          ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
          : inputText;
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("copy failed", err);
    }
  };

  const handleClear = () => {
    setInputText("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  const qrValue =
    tab === "email"
      ? `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
      : tab === "wifi" ? `WIFI:T:${encryption};S:${ssid};P:${password};;` : inputText;

  return (
    <div className={darkMode ? "dark min-h-screen" : "min-h-screen"}>
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        <DotPattern
      glow={false}
      width={24}
      height={24}
      className={cn(
        "absolute inset-0 opacity-100 pointer-events-none -z-10",
        "[mask-image:radial-gradient(800px_circle_at_center,black,transparent)] dark:[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
      )}
    />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-300 to-indigo-300 dark:from-black dark:to-black dark:opacity-90 opacity-70 pointer-events-none -z-20" />
        <div className="relative w-full max-w-md p-8 bg-gray-300 dark:bg-gray-800 rounded-3xl shadow-lg hover:shadow-2xl flex flex-col items-center transition-all duration-400">
          
          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="self-end mb-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          {/* Header */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-18 h-18 flex items-center justify-center rounded-full bg-gradient-to-br from-gray-500 to-black mb-2">
              <BsQrCode className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
              QR Code Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Generate QR codes for text, URLs, or emails.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-3 mb-5">
            <button
              onClick={() => setTab("text")}
              className={`px-4 py-2 rounded-lg ${tab === "text" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}
            >
              Text / URL / Number
            </button>
            <button
              onClick={() => setTab("email")}
              className={`px-4 py-2 rounded-lg ${tab === "email" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}
            >
              Email
            </button>
            <button 
            onClick={()=>setTab("wifi")} 
            className={`px-4 py-2 rounded-lg ${tab === "wifi" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 dark:text-gray-300"}`}>
              WiFi
            </button>
          </div>

          {/* Input Fields */}
          {tab === "email" ? (
            <div className="flex flex-col gap-3 w-full mb-5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Recipient Email"
                className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-blue-400 outline-none"
              />
              
            </div>
          ): tab === "wifi" ? (
            <div className="flex flex-col gap-3 w-full mb-5">
              <input
                type="text"
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                placeholder="Wi-Fi SSID"
                className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              />
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wi-Fi Password"
                className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              />
              <select
                value={encryption}
                onChange={(e) => setEncryption(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          ) : (
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type Text or URL"
              className="w-full mb-5 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-sm transition"
            />
          )}

          {/* QR Preview */}
          <div className="mb-5 flex items-center justify-center w-full">
            <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm flex items-center justify-center p-4 min-h-[200px] w-full">
              {qrValue.trim() ? (
                <QRCodeCanvas value={qrValue} size={200} className="rounded" />
              ) : (
                <BsQrCode className="w-16 h-16 mb-2 text-gray-300 dark:text-gray-500" />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex sm:flex-row flex-col w-full gap-3 mb-2">
            <button
              onClick={handleDownload}
              disabled={!qrValue.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
            >
              <FiDownload /> Download
            </button>

            <button
              onClick={handleCopy}
              disabled={!qrValue.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition"
            >
              {copied ? <FiCheck className="w-4 h-4 text-green-500" /> : <FiCopy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy"}
            </button>

            <button
              onClick={handleClear}
              disabled={!qrValue.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
            >
              <FiX /> Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SimpleQRGenerator;
