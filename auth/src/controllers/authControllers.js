const bycrypt = require("bcryptjs");

// temp memory
const users = [];
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
