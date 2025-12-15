import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [40, 40],
});

export default function HotelMap({ lat, lng, name, address }) {
    const [open, setOpen] = useState(false);

    if (!lat || !lng)
        return <p className="text-gray-500 italic">Không có dữ liệu vị trí khách sạn.</p>;

    return (
        <>
            {/* ===== Small Map Preview ===== */}
            <div className="mt-6 relative">
                <div className="w-full h-72 rounded-xl overflow-hidden shadow-md border">
                    <MapContainer
                        center={[lat, lng]}
                        zoom={14}
                        scrollWheelZoom={false}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={[lat, lng]} icon={customIcon}>
                            <Popup>
                                <strong>{name}</strong>
                                <br />
                                {address}
                            </Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {/* Button open big map */}
                <button
                    onClick={() => setOpen(true)}
                    className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-sm shadow hover:bg-white"
                >
                    Xem bản đồ lớn
                </button>
            </div>

            {/* ===== Fullscreen Map Modal ===== */}
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white w-[90vw] h-[85vh] rounded-xl shadow-xl relative overflow-hidden">

                        {/* Close Button */}
                        <button
                            onClick={() => setOpen(false)}
                            className="absolute top-3 right-3 bg-white shadow px-3 py-1 rounded-md z-50"
                        >
                            ✕
                        </button>

                        <MapContainer
                            center={[lat, lng]}
                            zoom={15}
                            scrollWheelZoom={true}
                            style={{ width: "100%", height: "100%" }}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Marker position={[lat, lng]} icon={customIcon}>
                                <Popup>
                                    <strong>{name}</strong>
                                    <br />
                                    {address}
                                </Popup>
                            </Marker>
                        </MapContainer>
                    </div>
                </div>
            )}
        </>
    );
}
