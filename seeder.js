const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');

// load env variables
dotenv.config({ path: './config/config.env' });

// load models
const Home = require('./models/Home');

// connect db
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// read json files
const homes = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/AB_NYC.json`, 'utf-8')
);

// import data to db
const importData = async () => {
  try {
    await Home.create(homes);
    console.log('Data Imported successfully...'.green.inverse);
    process.exit();
  } catch (err) {
    console.error();
  }
};

// delete data from db
const deleteData = async () => {
  try {
    await Home.deleteMany();
    console.log('Data Destroyed!!!'.red.inverse);
    process.exit();
  } catch (err) {
    console.error();
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
