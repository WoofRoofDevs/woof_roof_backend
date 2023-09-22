import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { RequestLoggerModel } from "./models/RequestLogger";
import { Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";
import { ShelterModel } from "./models/Shelter";
import { AnimalModel } from "./models/Pet";
import { json } from "stream/consumers";

const app = express();

app.use(cors());

app.post("/shelters", express.json(), async (req: Request, res: Response) => {
  try {
    const shelter = new ShelterModel({
      name: req.body.name,
      location: req.body.location,
      creatorUid: uuidv4(),
      numberOfAnimals: req.body.numberOfAnimals,
      numberOfSeats: req.body.numberOfSeats,
    });

    const newShelter = await shelter.save();
    res.json(newShelter);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Shelter wasn`t created" });
  }
});

app.get("/shelters", express.json(), async (req: Request, res: Response) => {
  try {
    const getAll = await ShelterModel.find({});
    res.json(getAll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get(
  "/shelters/:shelterId",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const shelterId = req.params.shelterId;

      const findOne = await ShelterModel.findById(shelterId);
      res.json(findOne);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);

app.set("trust proxy", true);

app.get("/", async (req: Request, res: Response) => {
  const requestDate = new Date();

  try {
    const { hostname } = req;

    if (hostname !== "localhost") {
      const fetch_res = await fetch(`https://ipapi.co/${req.ip}/json/`);
      const fetch_data = await fetch_res.json();

      await RequestLoggerModel.create({
        city: fetch_data.city,
        country: fetch_data.country,
        country_code: fetch_data.country_code,
        country_name: fetch_data.country_name,
        ip: fetch_data.ip,
        region: fetch_data.region,
        requestDate,
        timezone: fetch_data.timezone,
        utc_offset: fetch_data.utc_offset,
      });
    }

    const logs = await RequestLoggerModel.find({})
      .sort("-requestDate")
      .limit(10)
      .exec();
    res.send(JSON.stringify(logs, null, 2));
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.listen(3000, async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://woofroofdevs:DdIJoff8s3GzJ1kN@production0.fqbksqf.mongodb.net/?retryWrites=true&w=majority",
    );
    console.log("DB connected");
  } catch {
    console.log("cant connect  DB");
  }
  console.log("Application started on port 3000!");
});
