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
      <body>
        <MovingBackground />
        <div className="page-container min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 container-responsive pt-6 pb-6">
            <div className="mx-auto md:max-w-3xl">
              {children}
            </div>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
