import "../styles/page.css";
import "../styles/reset.css";
import "../styles/shop.css";
import "../styles/bag.css";
import "../styles/cooler.css";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <main className={roboto.className}>
      <Component {...pageProps} />
    </main>
  );
}
