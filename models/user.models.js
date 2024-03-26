const { Schema, model } = require('mongoose')
const { createHmac, randomBytes } = require('crypto');

const userSchema = new Schema({
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
        default: './public/images/user-avatar.png',
    },
    role: {
        type: String,
        enum: ['ADMIN', 'USER'],
        default: "USER",
    }
    
}, {timestamps: true})

userSchema.pre("save", function(next) {
    const user = this;

    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    console.log("sale", salt);
    const hashedPassword = createHmac('sha256', salt).update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
})

userSchema.static("matchPassword",async function(email, password) {   // matchPassword is name of the function
    const user = await this.findOne({ email });
    if (!user) throw new Error("User not Found!")
    
    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest("hex");

    if (hashedPassword !== userProvidedHash) 
        throw new Error("Incorrect password");

    return { ...userProvidedHash, password: undefined, salt: undefined }; 
})

const User = model('User', userSchema);

module.exports = User;