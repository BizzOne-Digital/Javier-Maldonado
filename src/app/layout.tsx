import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://javiermaldonado.ca"),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full overflow-x-clip">
      <body className="min-h-full overflow-x-clip">{children}</body>
    </html>
  );
}
