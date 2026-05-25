const base = import.meta.env.BASE_URL;

export default function Chip8Emulator() {
return (
    <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
    <iframe
        src={`${base}chip8-emulator/indexchip8.html`}
        width="680"
        height="380"
        style={{ border: "none" }}
        title="CHIP-8 Emulator"
    />
    </div>
);
}

