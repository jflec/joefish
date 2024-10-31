import { useState, useRef, useEffect } from "react";
import { fishWeight } from "./fishWeight";
import Image from "next/image";
import Shop from "./shop";
import Cooler from "./cooler";

export default function Home() {
  const [casting, setCasting] = useState(false);
  const [height, setHeight] = useState(100);
  const [castRating, setCastRating] = useState(0);
  const [casted, setCasted] = useState(false);
  const [coolerInventory, setCoolerInventory] = useState([]);
  const [fishCaught, setFishCaught] = useState({});
  const [wallet, setWallet] = useState(0);
  const [shopActive, setShopActive] = useState(false);
  const [coolerActive, setCoolerActive] = useState(false);
  const [tempCastRating, setTempCastRating] = useState(0);

  const castStrength = useRef(0);

  useEffect(() => {
    let intervalId;
    if (casting) {
      castStrength.current = 0;
      setCastRating(0);
      let peak = false;
      intervalId = setInterval(() => {
        castStrength.current = peak
          ? Math.max(0, castStrength.current - 2)
          : Math.min(100, castStrength.current + 2);
        peak =
          castStrength.current >= 100
            ? true
            : castStrength.current <= 0
              ? false
              : peak;
        setHeight(100 - castStrength.current);
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [casting]);

  useEffect(() => {
    let intervalId;
    if (casted) {
      intervalId = setInterval(() => {
        if (Math.random() * 1000 <= castRating) {
          setCasted(false);
          const recentlyCaught = fishingLogic();
          setHeight(100);
          setCoolerInventory((prev) => [...prev, recentlyCaught]);
          setFishCaught(recentlyCaught);
        }
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [casted, castRating]);

  function windUp() {
    setCasting(true);
    setFishCaught({});
  }

  function cast() {
    setCasting(false);
    const rating = getCastRating();
    setCastRating(rating);
    setTempCastRating(rating);
    setCasted(true);
  }

  function getCastRating() {
    if (castStrength.current >= 90) return 4;
    if (castStrength.current >= 70) return 3;
    if (castStrength.current >= 40) return 2;
    return 1;
  }

  function fishingLogic() {
    const totalRarity = fishWeight.reduce(
      (sum, entry) => sum + entry.rarity,
      0
    );
    const randomValue = Math.random() * totalRarity;
    let accumulatedRarity = 0;

    for (const entry of fishWeight) {
      accumulatedRarity += entry.rarity;
      if (randomValue < accumulatedRarity) {
        const size = getWeightedRandomSize();
        const cost = calculateCostBySize(size, entry.base_value);
        return { ...entry, size, final_cost: cost };
      }
    }
  }

  function getWeightedRandomSize() {
    const sizes = [
      "Tiny",
      "Tiny",
      "Tiny",
      "Tiny",
      "Tiny",
      "Tiny",
      "Tiny",
      "Small",
      "Small",
      "Small",
      "Small",
      "Small",
      "Small",
      "Normal",
      "Normal",
      "Normal",
      "Normal",
      "Normal",
      "Normal",
      "Large",
      "Large",
      "Large",
      "Giant",
    ];
    return sizes[Math.floor(Math.random() * sizes.length)];
  }

  function calculateCostBySize(size, baseValue) {
    const sizeCostMapping = {
      Tiny: baseValue * 0.5,
      Small: baseValue * 0.75,
      Normal: baseValue,
      Large: baseValue * 1.25,
      Giant: baseValue * 2,
    };
    return sizeCostMapping[size] || 0;
  }

  return (
    <div id="main">
      {fishCaught.name && (
        <p className="fish-notification">
          You caught a{" "}
          <strong>
            {fishCaught.size} {fishCaught.name}!
          </strong>
        </p>
      )}
      <div className="button-rating">
        {tempCastRating > 0 && (
          <p className="cast-rating-notification">
            {tempCastRating === 4
              ? "Perfect!"
              : tempCastRating === 3
                ? "Great!"
                : tempCastRating === 2
                  ? "Good!"
                  : "Okay!"}
          </p>
        )}
        <button className="cast-button" onClick={casting ? cast : windUp}>
          <Image
            className="cast-button-image"
            src="/rod_inactive.svg"
            alt="Button Image"
            width={512}
            height={512}
          />
          <Image
            style={{
              clipPath: `polygon(0 ${height}%, 100% ${height}%, 100% 100%, 0% 100%)`,
            }}
            className="cast-button-image"
            src="/rod_active.svg"
            alt="Button Image"
            width={512}
            height={512}
          />
        </button>
      </div>

      <div id="footer">
        <p>
          <strong>${wallet}</strong>
        </p>
        <button onClick={() => setShopActive((prev) => !prev)}>shop</button>
        <button onClick={() => setCoolerActive((prev) => !prev)}>cooler</button>
        <button onClick={() => console.log(coolerInventory)}>debug</button>
      </div>
      {shopActive && <Shop wallet={wallet} />}
      {coolerActive && (
        <Cooler
          coolerInventory={coolerInventory}
          setWallet={setWallet}
          setCoolerInventory={setCoolerInventory}
        />
      )}
    </div>
  );
}
