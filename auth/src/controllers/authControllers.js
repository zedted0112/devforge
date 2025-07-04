const bycrypt = require("bcryptjs");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");
const redisClient = require("../config/db");

// temp memory
const users = [];

// user signup
exports.signupUser = async (req, res) => {

  try {
    console.log("Incoming signup :",req.body);

    const { name, email, password } = req.body;
    
    //checks
    if(!name || !email  || !password){
        return res.status(400).json({
            message:'Missing fields'
        });

    }
    
    //check if user already exits
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {

      return res.status(400).json({
        message: "User already exists",
      });
    }
      

      console.log("Hashing Password...");

      //Hash the password
      const hashedPassword = await bycrypt.hash(password, 10);
      console.log("password hashed");
      const newUser = {
        id: users.length + 1,
        name,
        email,
        password: hashedPassword,
        role: "user",
      };

      users.push(newUser);
      res.status(201).json({
        message: "signup succesful",
        user: {
          id: newUser.id,
          email: newUser.email,
        },
      });
    
  } catch (err) {
    console.error("signup error:", err);
    res.status(500).json({
      message: "Server error during signup",
    });
  }
};


//user login \\

exports.loginUser =async (req,res) =>{
console.log ("Incoming login :", req.body);
try{


const {email ,password}=req.body;

// find user
const user = users.find(u => u.email ===email);
if(!user){
    return res.status(400).json({
        message:"Invalid user please sign up"
    });
}

//password verification

const isMatch = await bcrypt.compare(password,user.password);
if(!isMatch){
    return res.status(400).json({
        message:"Invalid password"
    });
}

// Jwt token generation

const payload ={id:user.id , email , role :user.role};
const accessToken = generateAccessToken(payload);
const refreshToken = generateRefreshToken(payload);

// store refersh token in Redis
await redisClient.set(  `refresh : ${user.id}`,refreshToken,{
    EX:7 * 24 * 60 * 60
});

//return tokens
res.status(200).json({
    message: "login successful",
    accessToken,
    refreshToken,
    user:{
        id:user.id ,
        email: user.email,

    }
});

}

catch (err){

    console.error("Login error ",err);
    res.status(500).json({
        message:"Server error during login "
    });


}


};
