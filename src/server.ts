import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { RequestLoggerModel } from "./models/RequestLogger";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { authenticateUser } from "./controller/authenticateUser";
import cors from "cors";
import { UserModel } from "./models/User";

import { v4 as uuidv4 } from "uuid";
import { ShelterModel } from "./models/Shelter";
import { AnimalModel } from "./models/Pet";
import { json } from "stream/consumers";

const app = express();

app.use(cors());
app.use(cookieParser());

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

app.post("/animals", express.json(), async (req: Request, res: Response) => {
  try {
    const animal = new AnimalModel({
      name: req.body.name,
      type: req.body.type,
      gender: req.body.gender,
      shelterSettlmentDate: req.body.shelterSettlmentDate,
      adoptionDate: req.body.adoptionDate,
      weight: req.body.weight,
      stats: req.body.stats,
      description: req.body.description,
      avatarUrl: req.body.avatarUrl,
      mediaGallery: req.body.mediaFile,
      birthDate: req.body.birthDate,
      vaccinations: req.body.vaccinations,
      sterilization: req.body.sterilization,
    });

    const newAnimal = await animal.save();
    res.json(newAnimal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Animal wasn`t added" });
  }
});

app.get("/animals", express.json(), async (req: Request, res: Response) => {
  try {
    const getAll = await AnimalModel.find({});
    res.json(getAll);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Can`t get shelters" });
  }
});

app.get(
  "/animals/:animalId",
  express.json(),
  async (req: Request, res: Response) => {
    try {
      const animalId = req.params.animalId;

      const findOne = await AnimalModel.findById(animalId);
      res.json(findOne);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },
);

app.set("trust proxy", true);

// app.use(express.static(path.join(__dirname, "../build")));
// app.use(
//   bodyParser.urlencoded({
//     extended: true,
//   }),
// );
// app.use(bodyParser.json());

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

app.post("/login/user", async (req: Request, res: Response) => {
  const client = new OAuth2Client(
    "986596562250-855lo49lur6ihrgrr80lokqqdd9dqinp.apps.googleusercontent.com",
  );
  const { jwtToken } = req.body;

  try {
    // Check if passed token is valid
    const ticket = await client.verifyIdToken({
      idToken: jwtToken,
      audience:
        "986596562250-855lo49lur6ihrgrr80lokqqdd9dqinp.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).send({
        error: "Invalid token payload",
      });
      return;
    }

    const { name: displayName, email, sub: uid, picture: photoURL } = payload;

    const loginToken = jwt.sign({ email }, "your-secret-key-here", {
      expiresIn: "1h",
    });

    await UserModel.findOneAndUpdate(
      {
        email,
        uid,
      },
      {
        displayName,
        photoURL,
      },
      {
        upsert: true,
      },
    );

    res
      .status(200)
      .cookie("login", loginToken, { expires: new Date(Date.now() + 360000) })
      .send({
        success: true,
      });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

app.get("/user/authenticated/getAll", authenticateUser, async (req, res) => {
  //authenticateUser is the middleware where we check if the use is valid/loggedin
  try {
    const data = await UserModel.find({});
    res.status(200).send({
      users: data,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

app.get("/logout/user", async (req, res) => {
  //logout function
  try {
    res.clearCookie("login").send({
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
  }
});

app.get("/user/checkLoginStatus", authenticateUser, async (req, res) => {
  //check if user is logged in already
  try {
    res.status(200).send({
      success: true,
    });
  } catch (e) {
    res.status(500).send({
      error: e,
    });
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
