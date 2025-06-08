// app/layout.tsx
import './globals.css'; // ¡Esta línea es crucial!

// ... el resto de tu código
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html>
        <body>{children}</body>
        </html>
    );
}