export default function Cooler({
  setCoolerInventory,
  coolerInventory,
  setWallet,
}) {
  let USDollar = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  function sellSingleFish(final_cost, index) {
    setWallet((prevWallet) => parseFloat((prevWallet + final_cost).toFixed(2)));
    setCoolerInventory((prevInventory) =>
      prevInventory.filter((_, i) => i !== index)
    );
  }

  function sellAll() {
    let total_cost = 0;
    coolerInventory.map((item) => {
      total_cost += item.final_cost;
    });
    setWallet((prevWallet) => parseFloat((prevWallet + total_cost).toFixed(2)));
    setCoolerInventory([]);
  }

  return (
    <div id="cooler-menu">
      <ul className="cooler-list">
        {coolerInventory.map((item, index) => (
          <li className="cooler-listing" key={index}>
            <p>{item.name}</p>
            <p>{item.size}</p>
            <p>{USDollar.format(item.final_cost)}</p>
            <button onClick={() => sellSingleFish(item.final_cost, index)}>
              sell
            </button>
          </li>
        ))}
        <button onClick={() => sellAll()}>Sell All</button>
      </ul>
    </div>
  );
}
