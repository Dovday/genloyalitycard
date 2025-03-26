"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Check } from "lucide-react"
import JsBarcode from "jsbarcode"
import { toPng } from "html-to-image"

export function LoyaltyCardGenerator() {
  const [brandName, setBrandName] = useState("STORE")
  const [barcodeNumber, setBarcodeNumber] = useState("1234567890123")
  const [cardColor, setCardColor] = useState("#3b82f6")
  const [isDarkText, setIsDarkText] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "downloading" | "success">("idle")
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const barcodeRef = useRef<SVGSVGElement>(null)

  const textColor = isDarkText ? "#1f2937" : "#ffffff"

  useEffect(() => {
    if (barcodeRef.current && barcodeNumber) {
      try {
        JsBarcode(barcodeRef.current, barcodeNumber, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: false,
          margin: 0,
        })
      } catch (error) {
        console.error("Invalid barcode value", error)
      }
    }
  }, [barcodeNumber])

  const downloadCard = async () => {
    if (cardRef.current) {
      try {
        setDownloadStatus("downloading")
        const dataUrl = await toPng(cardRef.current, { quality: 0.95 })

        // Convert base64 to blob
        const response = await fetch(dataUrl)
        const blob = await response.blob()

        // Create file from blob
        const file = new File([blob], `${brandName.toLowerCase().replace(/\s+/g, "-")}-card.png`, { type: 'image/png' })

        // Use native sharing on iOS/mobile, fallback to download on desktop
        if (navigator.share && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
          try {
            await navigator.share({
              files: [file],
              title: 'Save Loyalty Card',
            })
          } catch (err) {
            // Fallback to creating object URL if share fails
            const blobUrl = URL.createObjectURL(blob)
            window.location.href = blobUrl
            URL.revokeObjectURL(blobUrl)
          }
        } else {
          // Traditional download for desktop
          const blobUrl = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.download = `${brandName.toLowerCase().replace(/\s+/g, "-")}-card.png`
          link.href = blobUrl
          link.click()
          URL.revokeObjectURL(blobUrl)
        }

        setDownloadStatus("success")

        // Reset status after 2 seconds
        setTimeout(() => {
          setDownloadStatus("idle")
        }, 2000)
      } catch (error) {
        console.error("Error generating image", error)
        setDownloadStatus("idle")
      }
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {previewUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white p-4 rounded-lg shadow-xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col items-center gap-4">
              <img src={previewUrl} alt="Card Preview" className="w-full h-auto rounded-lg" />
              <Button onClick={() => setPreviewUrl(null)} variant="outline" className="w-full">
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="brand-name">Card Name</Label>
            <Input
              id="brand-name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="Enter card name"
              maxLength={20}
            />
          </div>

          <div>
            <Label htmlFor="barcode-number">Barcode Number</Label>
            <Input
              id="barcode-number"
              value={barcodeNumber}
              onChange={(e) => setBarcodeNumber(e.target.value)}
              placeholder="Enter barcode number"
              pattern="[0-9]*"
              maxLength={13}
            />
            <p className="text-xs text-gray-500 mt-1">Enter a valid numeric barcode (e.g., 1234567890123)</p>
          </div>

          {/* Redesigned inline settings for color and text */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="card-color" className="block mb-2">
                Card Header Color
              </Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="card-color"
                  type="color"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="w-12 h-8"
                />
                <span className="text-sm text-gray-500">{cardColor}</span>
              </div>
            </div>

            <div>
              <Label htmlFor="text-color" className="block mb-2">
                Text Color
              </Label>
              <div className="flex items-center gap-2">
                <Switch id="text-color" checked={isDarkText} onCheckedChange={setIsDarkText} />
                <div
                  className="w-6 h-6 rounded-full border"
                  style={{
                    backgroundColor: textColor,
                    borderColor: isDarkText ? "#e5e7eb" : "#1f2937",
                  }}
                ></div>
                <span className="text-sm text-gray-500">{isDarkText ? "Dark" : "Light"}</span>
              </div>
            </div>
          </div>

          <Button
            onClick={downloadCard}
            className="w-full mt-4 bg-black text-white hover:bg-black/90"
            disabled={downloadStatus === "downloading"}
            variant={downloadStatus === "success" ? "outline" : "default"}
          >
            {downloadStatus === "downloading" ? (
              "Generating..."
            ) : downloadStatus === "success" ? (
              <span className="flex items-center justify-center">
                Downloaded Successfully <Check className="ml-2 h-4 w-4" />
              </span>
            ) : (
              "Download Card"
            )}
          </Button>
        </div>

        <div className="flex items-center justify-center">
          <div ref={cardRef} className="w-[320px] h-[400px] bg-white rounded-lg shadow-xl overflow-hidden relative">
            {/* Header with gradient and subtle pattern */}
            <div
              className="h-[120px] relative"
              style={{
                background: `linear-gradient(135deg, ${cardColor} 0%, ${cardColor} 100%)`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Subtle pattern overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: "radial-gradient(circle at 20px 20px, white 2px, transparent 0)",
                  backgroundSize: "40px 40px",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <h2 className="text-3xl font-bold" style={{ color: textColor }}>
                  {brandName}
                </h2>
              </div>
            </div>

            {/* Barcode section with improved styling */}
            <div className="flex flex-col items-center justify-center p-8 pt-12 bg-white">
              <div className="mb-4 p-2 bg-white rounded-md">
                <svg ref={barcodeRef} className="w-full"></svg>
              </div>
              <p className="text-2xl font-mono mt-2">{barcodeNumber}</p>
            </div>

            {/* Card shine effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
              }}
            ></div>
          </div>
        </div>
      </div>

      <Card className="p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Enter your card name (will appear in the card header)</li>
          <li>Enter a barcode number</li>
          <li>Customize the card header color and text color for better contrast</li>
          <li>Click "Download Card" to save your digital card as a PNG image</li>
        </ol>
      </Card>
    </div>
  )
}
