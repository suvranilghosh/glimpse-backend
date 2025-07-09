import { PrismaClient } from "./generated/prisma";
import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface SearchFilters {
  source?: string;
  interestLevel?: string;
  status?: string;
  leadName?: {
    contains: string;
    mode: "insensitive";
  };
}

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).json({ message: "UP" });
});

// --------------------------Leads--------------------------------

// Post leads
app.post("/leads", async (req, res) => {
  try {
    const { data } = req.body;
    const sanitizedData = data.map((row: { leadId: string }) => {
      return {
        ...row,
        leadId: parseInt(row.leadId),
      };
    });
    const result = await prisma.leads.createMany({
      data: sanitizedData,
      skipDuplicates: true,
    });

    res.json({ success: true, inserted: result.count });
  } catch (err) {
    console.error("Error inserting leads:", err);
    res.status(500).json({ error: "Failed to insert leads" });
  }
});

//Get All (filtered) leads
app.get("/leads", async (req, res) => {
  const { source, interestLevel, status, page, limit, searchQuery } = req.query;

  // Check for filters Source, Interest Level, Status. "" refers to option 'All'
  const searchFilters: SearchFilters = {};
  if (source && source !== "") searchFilters.source = source as string;
  if (interestLevel && interestLevel !== "")
    searchFilters.interestLevel = interestLevel as string;
  if (status && status !== "") searchFilters.status = status as string;

  // Partial string match on 'name'
  if (searchQuery) {
    searchFilters.leadName = {
      contains: searchQuery as string,
      mode: "insensitive",
    };
  }

  // Parse pagination values with defaults
  const pageNum = parseInt(page as string) || 1;
  const limitNum = parseInt(limit as string) || 20;

  // Calculate skip and take
  const skip = (pageNum - 1) * limitNum;
  const take = limitNum;

  try {
    const data = await prisma.leads.findMany({
      where: searchFilters,
      skip,
      take,
    });

    const total = await prisma.leads.count({ where: searchFilters });

    res.json({
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get leads" });
  }
});

// app.get("/leads/sort");

//---------------------------Auth----------------------------------

//Register
app.post("/register", async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName)
    res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) res.status(409).json({ error: "User already exists" });

  // hash password and create creds entry
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, firstName, lastName },
  });

  res.status(201).json({ message: "User created", user });
});

//Login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        res.status(401).json({ error: "Invalid email or password" });

      //JWT token sign-in set to expire in 1d
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1d",
      });
      res.json({
        token,
        user: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    }
  } catch (err) {
    res.status(500).json({ error: "Login failed", details: err });
  }
});

//----------------------------Server--------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
