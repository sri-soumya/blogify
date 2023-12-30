const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createUserToken } = require("../services/auth");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },

  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
  next();
});

userSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email });
    if (!user) throw new Error("Invalid user");
    const salt = user.salt;
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    if (hashedPassword !== user.password) throw new Error("Invalid password");
    const token = createUserToken(user);
    return token;
  }
);

const User = mongoose.model("users", userSchema);

module.exports = User;
