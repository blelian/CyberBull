import "./globals.css";
import MovingBackground from "@/components/MovingBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CyberBull",
  description: "CyberBull — encryption, scanning, sniffing",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative min-h-screen bg-black text-white">
        {/* Moving background behind all content */}
        <MovingBackground className="fixed inset-0 -z-10 pointer-events-none" />

        {/* Main content */}
        <div className="page-container flex flex-col min-h-screen relative z-10">
          <Navbar />
          <main className="flex-1 container-responsive pt-8 pb-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
