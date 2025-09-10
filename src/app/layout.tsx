export const metadata = {
  title: 'Project Coulson',
  description: 'Filscap Data Dictionary',
  icons: {
    icon: '/favicon-panda.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
