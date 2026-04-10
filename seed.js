const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User").default; // Wait, TypeScript might need ts-node or just use pure mongodb driver.
