import React, { useState, useMemo } from "react";
import { Search, ShoppingCart, Plus, Minus, MapPin, Clock, ChevronLeft, Check, X, Menu, Zap } from "lucide-react";

const CATEGORIES = [
  { id: "produce", name: "Fresh produce", icon: "🍎" },
  { id: "bakery", name: "Bakery", icon: "🍞" },
  { id: "dairy", name: "Dairy & eggs", icon: "🥛" },
  { id: "meat", name: "Meat & poultry", icon: "🍗" },
  { id: "pantry", name: "Pantry", icon: "🥫" },
  { id: "beverages", name: "Beverages", icon: "🧃" },
  { id: "snacks", name: "Snacks", icon: "🍪" },
  { id: "household", name: "Household", icon: "🧻" },
];

const PRODUCTS = [
  { id: 1, name: "Bananas, 1kg", cat: "produce", price: 21.99, unit: "per bag", icon: "🍌" },
  { id: 2, name: "Avocados, loose", cat: "produce", price: 12.99, unit: "each", icon: "🥑" },
  { id: 3, name: "Baby tomatoes, 200g", cat: "produce", price: 24.99, unit: "punnet", icon: "🍅" },
  { id: 4, name: "Baby spinach, 100g", cat: "produce", price: 19.99, unit: "bag", icon: "🥬" },
  { id: 5, name: "White bread loaf", cat: "bakery", price: 18.49, unit: "700g", icon: "🍞" },
  { id: 6, name: "Croissants x6", cat: "bakery", price: 34.99, unit: "pack", icon: "🥐" },
  { id: 7, name: "Free-range eggs x18", cat: "dairy", price: 54.99, unit: "tray", icon: "🥚" },
  { id: 8, name: "Full cream milk, 2L", cat: "dairy", price: 32.99, unit: "bottle", icon: "🥛" },
  { id: 9, name: "Cheddar cheese, 400g", cat: "dairy", price: 68.99, unit: "block", icon: "🧀" },
  { id: 10, name: "Chicken breasts, 1kg", cat: "meat", price: 89.99, unit: "pack", icon: "🍗" },
  { id: 11, name: "Beef mince, 500g", cat: "meat", price: 64.99, unit: "pack", icon: "🥩" },
  { id: 12, name: "Basmati rice, 2kg", cat: "pantry", price: 74.99, unit: "bag", icon: "🍚" },
  { id: 13, name: "Peanut butter, 400g", cat: "pantry", price: 42.99, unit: "jar", icon: "🥜" },
  { id: 14, name: "Spaghetti, 500g", cat: "pantry", price: 16.99, unit: "pack", icon: "🍝" },
  { id: 15, name: "Orange juice, 1.5L", cat: "beverages", price: 29.99, unit: "bottle", icon: "🧃" },
  { id: 16, name: "Sparkling water x6", cat: "beverages", price: 39.99, unit: "pack", icon: "💧" },
  { id: 17, name: "Rooibos tea, 80s", cat: "beverages", price: 27.99, unit: "box", icon: "🫖" },
  { id: 18, name: "Salted chips, 125g", cat: "snacks", price: 22.99, unit: "packet", icon: "🍟" },
  { id: 19, name: "Dark chocolate, 100g", cat: "snacks", price: 24.99, unit: "bar", icon: "🍫" },
  { id: 20, name: "Toilet paper x9", cat: "household", price: 79.99, unit: "roll pack", icon: "🧻" },
  { id: 21, name: "Dish soap, 750ml", cat: "household", price: 26.99, unit: "bottle", icon: "🧴" },
  { id: 22, name: "Laundry powder, 2kg", cat: "household", price: 94.99, unit: "box", icon: "🧺" },
];

const SLOTS = [
  { id: "express", label: "Express", detail: "Arrives in 45 min", fee: 35 },
  { id: "s1", label: "Today", detail: "16:00 – 17:00", fee: 15 },
  { id: "s2", label: "Today", detail: "18:00 – 19:00", fee: 15 },
  { id: "s3", label: "Tomorrow", detail: "09:00 – 10:00", fee: 0 },
];

const PAY_METHODS = [
  { id: "card", label: "Debit or credit card" },
  { id: "eft", label: "Instant EFT" },
  { id: "cod", label: "Cash on delivery" },
];

function currency(n) {
  return "R" + n.toFixed(2);
}

export default function TrolleyApp() {
  const [view, setView] = useState("shop");
  const [activeCat, setActiveCat] = useState("produce");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [slot, setSlot] = useState("express");
  const [payMethod, setPayMethod] = useState("card");

  const cartCount = useMemo(() => Object.values(cart).reduce((a, b) => a + b, 0), [cart]);
  const cartItems = useMemo(
    () => Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === Number(id)), qty })).filter((i) => i.qty > 0),
    [cart]
  );
  const subtotal = useMemo(() => cartItems.reduce((s, i) => s + i.price * i.qty, 0), [cartItems]);
  const deliveryFee = SLOTS.find((s) => s.id === slot)?.fee ?? 0;
  const total = subtotal + (subtotal > 0 ? deliveryFee : 0);

  function addToCart(id, delta) {
    setCart((c) => {
      const next = { ...c, [id]: Math.max(0, (c[id] || 0) + delta) };
      return next;
    });
  }

  const filtered = PRODUCTS.filter((p) => {
    const matchesCat = p.cat === activeCat;
    const matchesQuery = query.trim() === "" || p.name.toLowerCase().includes(query.toLowerCase());
    return query.trim() ? matchesQuery : matchesCat;
  });

  const styles = {
    forest: "#1F4D3A",
    forestDeep: "#14332A",
    zest: "#F2A63A",
    zestDeep: "#D98A1E",
    ink: "#16241C",
    paper: "#F3F4EE",
    line: "#E1DFD3",
  };

  return (
    <div style={{ fontFamily: "'Work Sans', sans-serif", background: styles.paper, minHeight: "100vh", color: styles.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Work+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .disp { font-family: 'Space Grotesk', sans-serif; }
        .catchip { transition: transform 0.15s ease, background 0.15s ease; }
        .catchip:active { transform: scale(0.96); }
        .card { transition: border-color 0.15s ease; }
        .card:hover { border-color: ${styles.forest}; }
        .btn-add { transition: background 0.15s ease; }
        .btn-add:active { transform: scale(0.94); }
        ::-webkit-scrollbar { height: 6px; width: 6px; }
        ::-webkit-scrollbar-thumb { background: ${styles.line}; border-radius: 4px; }
      `}</style>

      {/* Top bar */}
      <header style={{ background: styles.forest, color: "#fff", padding: "14px 20px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 16 }}>
          <div className="disp" style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, display: "flex", alignItems: "center", gap: 6 }}>
            <span>🛒</span> Trolley
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, opacity: 0.9, borderLeft: "1px solid rgba(255,255,255,0.25)", paddingLeft: 16 }}>
            <MapPin size={14} />
            <span>Deliver to Melville, Johannesburg</span>
          </div>
          <div style={{ flex: 1, position: "relative", maxWidth: 420, marginLeft: "auto" }}>
            <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", opacity: 0.6 }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for milk, bread, snacks..."
              style={{
                width: "100%",
                padding: "9px 12px 9px 36px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            style={{
              background: styles.zest,
              color: styles.forestDeep,
              border: "none",
              borderRadius: 8,
              padding: "9px 14px",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              position: "relative",
            }}
          >
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span style={{ background: styles.forestDeep, color: "#fff", borderRadius: 999, fontSize: 11, padding: "1px 6px", marginLeft: 2 }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {view === "shop" && (
        <>
          {/* Speed banner */}
          <div style={{ background: styles.forestDeep, color: "#EFE9DA", padding: "10px 20px" }}>
            <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
              <Zap size={14} color={styles.zest} />
              Order in the next <strong style={{ color: styles.zest }}>12 minutes</strong> for delivery within 45 minutes.
            </div>
          </div>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
            {/* Category rail */}
            <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 8, marginBottom: 20 }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className="catchip"
                  onClick={() => {
                    setActiveCat(c.id);
                    setQuery("");
                  }}
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 16px",
                    borderRadius: 999,
                    border: `1.5px solid ${activeCat === c.id && !query ? styles.forest : styles.line}`,
                    background: activeCat === c.id && !query ? styles.forest : "#fff",
                    color: activeCat === c.id && !query ? "#fff" : styles.ink,
                    fontSize: 13.5,
                    fontWeight: 600,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 16 }}>{c.icon}</span>
                  {c.name}
                </button>
              ))}
            </div>

            <h2 className="disp" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
              {query.trim() ? `Results for "${query}"` : CATEGORIES.find((c) => c.id === activeCat)?.name}
            </h2>
            <p style={{ fontSize: 13.5, color: "#5B5B54", marginBottom: 18 }}>{filtered.length} items</p>

            {/* Product grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
              {filtered.map((p) => {
                const qty = cart[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className="card"
                    style={{
                      background: "#fff",
                      border: `1px solid ${styles.line}`,
                      borderRadius: 10,
                      padding: 14,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <div style={{ fontSize: 40, textAlign: "center", marginBottom: 10 }}>{p.icon}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: "#8A8A80", marginBottom: 10 }}>{p.unit}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                      <span className="disp" style={{ fontSize: 16, fontWeight: 700 }}>
                        {currency(p.price)}
                      </span>
                      {qty === 0 ? (
                        <button
                          className="btn-add"
                          onClick={() => addToCart(p.id, 1)}
                          style={{
                            background: styles.forest,
                            color: "#fff",
                            border: "none",
                            borderRadius: 7,
                            padding: "7px 12px",
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, background: styles.forest, borderRadius: 7, padding: "4px 6px" }}>
                          <button onClick={() => addToCart(p.id, -1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" }}>
                            <Minus size={15} />
                          </button>
                          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, minWidth: 14, textAlign: "center" }}>{qty}</span>
                          <button onClick={() => addToCart(p.id, 1)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", display: "flex" }}>
                            <Plus size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {view === "checkout" && (
        <CheckoutView
          styles={styles}
          cartItems={cartItems}
          subtotal={subtotal}
          slot={slot}
          setSlot={setSlot}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          deliveryFee={deliveryFee}
          total={total}
          onBack={() => {
            setView("shop");
            setCartOpen(true);
          }}
          onPlaceOrder={() => setView("tracking")}
        />
      )}

      {view === "tracking" && (
        <TrackingView
          styles={styles}
          total={total}
          slotLabel={SLOTS.find((s) => s.id === slot)}
          onDone={() => {
            setCart({});
            setView("shop");
          }}
        />
      )}

      {/* Cart drawer */}
      {cartOpen && view === "shop" && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(20,20,15,0.4)", zIndex: 50, display: "flex", justifyContent: "flex-end" }} onClick={() => setCartOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", width: 380, maxWidth: "90vw", height: "100%", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: 18, borderBottom: `1px solid ${styles.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 className="disp" style={{ fontSize: 18, fontWeight: 600 }}>
                Your trolley
              </h3>
              <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: 18 }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: "center", color: "#8A8A80", marginTop: 60 }}>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>🛒</div>
                  <p style={{ fontSize: 14 }}>Your trolley is empty. Add items to get started.</p>
                </div>
              ) : (
                cartItems.map((i) => (
                  <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <div style={{ fontSize: 26 }}>{i.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600 }}>{i.name}</div>
                      <div style={{ fontSize: 12, color: "#8A8A80" }}>{currency(i.price)} each</div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: styles.paper, borderRadius: 7, padding: "3px 6px" }}>
                      <button onClick={() => addToCart(i.id, -1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                        <Minus size={14} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: 13, minWidth: 12, textAlign: "center" }}>{i.qty}</span>
                      <button onClick={() => addToCart(i.id, 1)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cartItems.length > 0 && (
              <div style={{ padding: 18, borderTop: `1px solid ${styles.line}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                  <span style={{ color: "#5B5B54" }}>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>{currency(subtotal)}</span>
                </div>
                <button
                  onClick={() => {
                    setCartOpen(false);
                    setView("checkout");
                  }}
                  style={{
                    width: "100%",
                    background: styles.zest,
                    color: styles.forestDeep,
                    border: "none",
                    borderRadius: 8,
                    padding: "13px",
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: "pointer",
                    marginTop: 6,
                  }}
                >
                  Go to checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckoutView({ styles, cartItems, subtotal, slot, setSlot, payMethod, setPayMethod, deliveryFee, total, onBack, onPlaceOrder }) {
  return (
    <div style={{ maxWidth: 620, margin: "0 auto", padding: "24px 20px" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: styles.forest, marginBottom: 16, fontWeight: 600 }}>
        <ChevronLeft size={16} /> Back to trolley
      </button>
      <h2 className="disp" style={{ fontSize: 24, fontWeight: 600, marginBottom: 20 }}>
        Checkout
      </h2>

      <Section title="Delivery address" styles={styles}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <MapPin size={18} color={styles.forest} style={{ marginTop: 2 }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>14 Main Road, Melville</div>
            <div style={{ fontSize: 13, color: "#8A8A80" }}>Johannesburg, 2109</div>
          </div>
        </div>
      </Section>

      <Section title="Delivery time" styles={styles}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {SLOTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSlot(s.id)}
              style={{
                textAlign: "left",
                padding: 12,
                borderRadius: 8,
                border: `1.5px solid ${slot === s.id ? styles.forest : styles.line}`,
                background: slot === s.id ? "#EEF3EA" : "#fff",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700 }}>
                {s.id === "express" && <Zap size={13} color={styles.zestDeep} />}
                {s.label}
              </div>
              <div style={{ fontSize: 12.5, color: "#5B5B54", marginTop: 2 }}>{s.detail}</div>
              <div style={{ fontSize: 12.5, color: "#5B5B54" }}>{s.fee === 0 ? "Free" : currency(s.fee)}</div>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Payment method" styles={styles}>
        {PAY_METHODS.map((m) => (
          <label key={m.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer", fontSize: 14 }}>
            <input type="radio" checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} />
            {m.label}
          </label>
        ))}
      </Section>

      <Section title="Order summary" styles={styles}>
        {cartItems.map((i) => (
          <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6, color: "#3A3A34" }}>
            <span>
              {i.qty} × {i.name}
            </span>
            <span>{currency(i.price * i.qty)}</span>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${styles.line}`, marginTop: 10, paddingTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 4 }}>
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 8 }}>
            <span>Delivery fee</span>
            <span>{deliveryFee === 0 ? "Free" : currency(deliveryFee)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
            <span>Total</span>
            <span>{currency(total)}</span>
          </div>
        </div>
      </Section>

      <button
        onClick={onPlaceOrder}
        disabled={cartItems.length === 0}
        style={{
          width: "100%",
          background: cartItems.length === 0 ? "#CFCFC4" : styles.zest,
          color: styles.forestDeep,
          border: "none",
          borderRadius: 8,
          padding: 15,
          fontSize: 15,
          fontWeight: 700,
          cursor: cartItems.length === 0 ? "not-allowed" : "pointer",
          marginTop: 6,
        }}
      >
        Place order · {currency(total)}
      </button>
    </div>
  );
}

function Section({ title, children, styles }) {
  return (
    <div style={{ background: "#fff", border: `1px solid ${styles.line}`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#8A8A80", textTransform: "none", marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

function TrackingView({ styles, total, slotLabel, onDone }) {
  const steps = [
    { label: "Order placed", done: true },
    { label: "Naledi is packing your order", done: true },
    { label: "On the way", done: false },
    { label: "Delivered", done: false },
  ];
  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: styles.forest, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
        <Check size={30} color="#fff" />
      </div>
      <h2 className="disp" style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>
        Order confirmed
      </h2>
      <p style={{ fontSize: 14, color: "#5B5B54", marginBottom: 24 }}>
        {slotLabel?.id === "express" ? "Arriving in about 45 minutes" : `Arriving ${slotLabel?.label.toLowerCase()}, ${slotLabel?.detail}`}
      </p>

      <div style={{ background: "#fff", border: `1px solid ${styles.line}`, borderRadius: 12, padding: 20, textAlign: "left" }}>
        {steps.map((s, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: idx < steps.length - 1 ? 18 : 0 }}>
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: s.done ? styles.forest : "#EDEDE3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {s.done && <Check size={13} color="#fff" />}
            </div>
            <span style={{ fontSize: 14, fontWeight: s.done ? 600 : 400, color: s.done ? styles.ink : "#8A8A80" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginTop: 20, padding: "0 4px" }}>
        <span style={{ color: "#5B5B54" }}>Total paid</span>
        <span style={{ fontWeight: 700 }}>{total ? "R" + total.toFixed(2) : "R0.00"}</span>
      </div>

      <button
        onClick={onDone}
        style={{
          marginTop: 24,
          background: styles.forest,
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "12px 24px",
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Back to shopping
      </button>
    </div>
  );
}
