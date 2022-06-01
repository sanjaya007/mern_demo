const mongoose = require("mongoose");

const dbConfig = {
  URL: "mongodb://localhost:27017/mern_practice",
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};

const dbConnection = async () => {
  try {
    await mongoose.connect(dbConfig.URL, dbConfig.options);
    console.log("Databse connection successfull !!");
  } catch (error) {
    console.log(error);
  }
};

dbConnection();
