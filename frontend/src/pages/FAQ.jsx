import { useState } from "react";

const faqData = [
  {
    question: "Kako mogu preuzeti svoj nalaz?",
    answer:
      "Nalaz možete preuzeti lično kod svog doktora ili, ukoliko je omogućeno, putem online preuzimanja na e-mail adresu kojom ste registrovani."
  },
  {
    question: "Šta znači status 'Obrada u toku'?",
    answer:
      "Ovaj status znači da je vaš nalaz još uvijek u procesu obrade i trenutno nije dostupan za preuzimanje."
  },
  {
    question: "Šta znači status 'Nalaz spreman za preuzimanje'?",
    answer:
      "Nalaz je završen i spreman. Možete ga preuzeti kod svog doktora ili poslati zahtjev za online preuzimanje."
  },
  {
    question: "Kome se mogu obratiti za dodatnu pomoć?",
    answer:
      "Za dodatnu pomoć možete se obratiti osoblju zdravstvene ustanove ili kontaktirati tehničku podršku."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      style={{
        padding: "20px",
        color: "white",
        background: "#3a3485",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif"
      }}
    >
      <button
        onClick={() => window.history.back()}
        style={{
          padding: "10px 26px",
          borderRadius: "30px",
          border: "2px solid white",
          background: "transparent",
          color: "white",
          fontSize: "1rem",
          cursor: "pointer"
        }}
      >
        Nazad
      </button>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img
          src="/Slike/Logo-KCUS_featured.png"
          alt="Logo"
          style={{
            maxWidth: "200px",
            width: "100%",
            height: "auto",
            marginBottom: "-40px"
          }}
        />
      </div>

      <h1 style={{ textAlign: "center", fontSize: "0.8rem" }}>
        INFORMACIONI SISTEM
      </h1>

      <hr
        style={{
          border: "2px solid white",
          width: "80%",
          margin: "20px auto"
        }}
      />

      <h1 style={{ textAlign: "center", marginTop: "20px" }}>
        Često postavljana pitanja (FAQ)
      </h1>

      {/* FAQ LIST */}
      <div
        style={{
          maxWidth: "800px",
          margin: "40px auto",
          display: "flex",
          flexDirection: "column",
          gap: "15px"
        }}
      >
        {faqData.map((item, index) => (
          <div
            key={index}
            style={{
              border: "3px solid white",
              borderRadius: "25px",
              overflow: "hidden"
            }}
          >
            {/* QUESTION */}
            <div
              onClick={() => toggle(index)}
              style={{
                padding: "18px 24px",
                cursor: "pointer",
                fontSize: "1.1rem",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              {item.question}
              <span style={{ fontSize: "1.5rem" }}>
                {openIndex === index ? "−" : "+"}
              </span>
            </div>

            {/* ANSWER */}
            {openIndex === index && (
              <div
                style={{
                  background: "white",
                  color: "#3a3485",
                  padding: "18px 24px",
                  fontSize: "1rem"
                }}
              >
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
