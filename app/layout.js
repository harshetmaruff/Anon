import "./../styles/globals.css";

export const metadata = {
  title: "Anon — Simple, private conversations",
  description: "Ephemeral anonymous chat. No registration required.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
