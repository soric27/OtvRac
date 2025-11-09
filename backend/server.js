const { Parser: Json2CsvParser } = require("json2csv");
const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); 

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("."));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Spojeno na MongoDB Atlas"))
  .catch(err => console.error("Greška pri spajanju:", err));

app.get("/api/klubovi", async (req, res) => {
  try {
    const { text, field } = req.query;
    const collection = mongoose.connection.db.collection("klubovi");

    const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

   
    const stringFields = ["Naziv", "Grad", "Država", "Sport", "Liga", "Stadion_dvorana"];
    
    const numericFields = ["Godina_osnutka", "Kapacitet", "Naslovi_prvaka"];

    let filter = {};

    if (text && text.trim() !== "") {
      const safe = escapeRegex(text.trim());
      const regex = new RegExp(safe, "i");

      if (field) {
       
        if (numericFields.includes(field)) {
          const num = Number(text);
          return res.json({
            data: isNaN(num) ? [] : await collection.find({ [field]: num }).toArray()
          });
        }

        if (field === "Trener" || field === "Glavni_trener") {
          filter = {
            $or: [
              { "Glavni_trener.Ime": regex },
              { "Glavni_trener.Prezime": regex }
            ]
          };
        } else if (field === "Igrači" || field === "Igraci") {
          filter = {
            Igrači: {
              $elemMatch: {
                $or: [
                  { Ime: regex },
                  { Prezime: regex },
                  { Pozicija: regex }
                ]
              }
            }
          };
        } else if (stringFields.includes(field)) {
          filter = { [field]: regex };
        } else {
          
          return res.json({ data: [] });
        }

      } else {
       
        filter = {
          $or: [
            
            ...stringFields.map(f => ({ [f]: regex })),
           
            { "Glavni_trener.Ime": regex },
            { "Glavni_trener.Prezime": regex },
            
            {
              Igrači: {
                $elemMatch: {
                  $or: [
                    { Ime: regex },
                    { Prezime: regex },
                    { Pozicija: regex }
                  ]
                }
              }
            }
            
          ]
        };
      }
    }

    const data = await collection.find(filter).limit(200).toArray();
    res.json({ data });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Greška pri pretraživanju podataka" });
  }
});


app.get('/download/json', async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection('klubovi').find({}).toArray();
    res.setHeader('Content-Disposition', 'attachment; filename="klubovi.json"');
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    res.status(500).send('Greška pri generiranju JSON datoteke');
  }
});

app.get('/download/csv', async (req, res) => {
  try {
    const data = await mongoose.connection.db.collection('klubovi').find({}).toArray();

    const flattened = data.map(d => ({
      Naziv: d.Naziv || '',
      Grad: d.Grad || '',
      Država: d.Država || '',
      Liga: d.Liga || '',
      Sport: d.Sport || '',
      Godina_osnutka: d.Godina_osnutka || '',
      Stadion_dvorana: d.Stadion_dvorana || '',
      Kapacitet: d.Kapacitet || '',
      Naslovi_prvaka: d.Naslovi_prvaka || '',
      Glavni_trener: d.Glavni_trener
        ? `${d.Glavni_trener.Ime || ''} ${d.Glavni_trener.Prezime || ''}`.trim()
        : '',
      Igraci: Array.isArray(d.Igrači)
        ? d.Igrači.map(i => `${i.Ime || ''} ${i.Prezime || ''} (${i.Pozicija || ''})`).join('; ')
        : ''
    }));

    const fields = Object.keys(flattened[0] || {});
    const parser = new Json2CsvParser({ fields });
    const csv = parser.parse(flattened);

    res.setHeader('Content-Disposition', 'attachment; filename="klubovi.csv"');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Greška pri generiranju CSV datoteke');
  }
});


async function getFilteredData(req) {
  const { text, field } = req.query;
  const collection = mongoose.connection.db.collection("klubovi");

  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const stringFields = ["Naziv", "Grad", "Država", "Sport", "Liga", "Stadion_dvorana"];
  const numericFields = ["Godina_osnutka", "Kapacitet", "Naslovi_prvaka"];

  let filter = {};

  if (text && text.trim() !== "") {
    const safe = escapeRegex(text.trim());
    const regex = new RegExp(safe, "i");

    if (field) {
      if (numericFields.includes(field)) {
        const num = Number(text);
        if (!isNaN(num)) filter[field] = num;
      } else if (field === "Trener" || field === "Glavni_trener") {
        filter = { $or: [{ "Glavni_trener.Ime": regex }, { "Glavni_trener.Prezime": regex }] };
      } else if (field === "Igrači" || field === "Igraci") {
        filter = {
          Igrači: {
            $elemMatch: { $or: [{ Ime: regex }, { Prezime: regex }, { Pozicija: regex }] }
          }
        };
      } else {
        filter[field] = regex;
      }
    } else {
      filter = {
        $or: [
          ...stringFields.map(f => ({ [f]: regex })),
          { "Glavni_trener.Ime": regex },
          { "Glavni_trener.Prezime": regex },
          {
            Igrači: {
              $elemMatch: {
                $or: [
                  { Ime: regex },
                  { Prezime: regex },
                  { Pozicija: regex }
                ]
              }
            }
          }
        ]
      };
    }
  }

  return await collection.find(filter).toArray();
}

app.get("/export/json", async (req, res) => {
  try {
    const data = await getFilteredData(req);
    res.setHeader("Content-Disposition", "attachment; filename=klubovi.json");
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
    res.status(500).send("Greška pri exportu JSON-a");
  }
});

app.get("/export/csv", async (req, res) => {
  try {
    const data = await getFilteredData(req);

    const flattened = data.map(d => ({
      Naziv: d.Naziv || "",
      Grad: d.Grad || "",
      Država: d.Država || "",
      Liga: d.Liga || "",
      Sport: d.Sport || "",
      Godina_osnutka: d.Godina_osnutka || "",
      Stadion_dvorana: d.Stadion_dvorana || "",
      Kapacitet: d.Kapacitet || "",
      Naslovi_prvaka: d.Naslovi_prvaka || "",
      Glavni_trener: d.Glavni_trener
        ? `${d.Glavni_trener.Ime || ""} ${d.Glavni_trener.Prezime || ""}`.trim()
        : "",
      Igrači: Array.isArray(d.Igrači)
        ? d.Igrači.map(i => `${i.Ime || ""} ${i.Prezime || ""} (${i.Pozicija || ""})`).join("; ")
        : ""
    }));

    const fields = Object.keys(flattened[0] || {});
    const parser = new Json2CsvParser({ fields });
    const csv = parser.parse(flattened);

    res.setHeader("Content-Disposition", "attachment; filename=klubovi.csv");
    res.setHeader("Content-Type", "text/csv");
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send("Greška pri exportu CSV-a");
  }
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server radi na http://localhost:${PORT}`));

