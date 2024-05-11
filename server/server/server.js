const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express();
let bcrypt = require('bcryptjs');
const cors = require('cors'); // Import the cors package
// const { Company } = require('./models/Company');
// const { Court } = require('./models/Court');
// const { CourtRervation} = require('./models/CourtReservationSchema');
const CoachApi = require('./apis/CoachApis');
const CompanyApi = require('./apis/CompanyApis');
const UserApi = require('./apis/UserApi');

const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE', 
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json())


app.get('/', (req, res) => {
    res.send('Successful response.');
});

CoachApi(app);
CompanyApi(app);
UserApi(app);


const start = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://Test:RKsoo9GzjNXA74xc@cluster0.qfije12.mongodb.net/");
        app.listen(3000, () => console.log("Server started on port 3000"));
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};


start();




// // AUTHENTICATION ROUTES
// app.post('/register', async (req, res) => {
//     console.log(req.body);
//     const existingUser = await User.findOne({ email: req.body.email })
//     if (existingUser) {
//         console.log("EXISTS")
//         return res.status(401).send({ "message": "Email already exists" })
//     }
//     else {
//         const salt = await bcrypt.genSalt(10);
//         const password = await bcrypt.hash(req.body.password, salt);
//         const newUser = new User({
//             name: req.body.name,
//             email: req.body.email,
//             password: password,
//             phone: req.body.phone,
//             role: req.body.role,
//         });
//         await newUser.save();
//         return res.send({ email: req.body.email });

//     }
// });
// app.post('/login', async (req, res) => {
//     const existingUser = await User.findOne({ email: req.body.email })
//     if (existingUser) {
//         const isValidPassword = await bcrypt.compare(req.body.password, existingUser.password)
//         if (isValidPassword) {
//             return res.send({ existingUser })
//         } else {
//             return res.status(401).send({ "message": "Invalid Password" })
//         }
//     }
//     else {
//         console.log("INVALID")
//         return res.status(401).send({ "message": "Invalid email." })
//     }
// })

// //COMPANY ROUTES
// app.post('/createCompany', async (req, res) => {
//     const existingCompany = await Company.findOne({ name: req.body.name })
//     if (existingCompany) {
//         return res.send({ "message": "Company already exists" })
//     }
//     else {
//         const newCompany = new Company({
//             name: req.body.name,
//             phone: req.body.phone,
//             owner_id: req.body.owner_id
//         })
//         await newCompany.save()
//         return res.send({ "message": "Company successfully created" })
//     }
// })


// app.get("/Companies", async (req, res) => {
//     console.log('here')
//     const allCompanies = await Company.find().populate('owner_id');
//     return res.send({ "Companies": allCompanies })
// })
// app.get("/users", async (req, res) => {
//     const allUsers = await User.find();
//     return res.send({ "users": allUsers })
// });
// app.get("/Courts", async (req, res) => {
//     const allCourts = await Court.find();
//     return res.send({ "courts": allCourts })
// });
// app.get("/Coaches", async (req, res) => {
//     const allCoaches = await Coach.find();
//     return res.send({ "Coaches": allCoaches })
// });
// app.get("/Court Reservations", async (req, res) => {
//     const allCourtReservations = await CourtRervation.find();
//     return res.send({ "Court Reservations": allCourtReservations })
// });


// //Court Routes
// app.post('/createCourt', async (req, res) => {
//     const existingCourt = await Court.findOne({ name: req.body.name })
//     if (existingCourt) {
//         return res.send({ "message": "Court already exists" })
//     }
//     else {
//         const newCourt = new Court({
//             name: req.body.name,
//             phone: req.body.phone,
//             company: req.body.company,
//             reservations: req.body.reservations,
//             location: req.body.location
//         })
//         await newCourt.save()
//         return res.send({ "message": "Court successfully created" })
//     }
// })

// // Court Reservation Routes
// app.post('/createCourtReservation', async (req, res) => {
//     const existingCourtReservation = await CourtRervation.findOne({ name: req.body.name })
//     if (existingCourtReservation) {
//         return res.send({ "message": "Court is already reserved" })
//     }
//     else {
//         const newCourtReservation = new CourtRervation({
//             name: req.body.name,
//             phone: req.body.phone,
//             court_id: req.body.court_id,
//             time: req.body.time
//         })
//         await newCourtReservation.save()
//         return res.send({ "message": "Court Reservation successfully created" })
//     }
// })

// //Coach Routes
// app.post('/createCoach', async (req, res) => {
//     const existingCoach = await Coach.findOne({ name: req.body.name })
//     if (existingCourt) {
//         return res.send({ "message": "Coach already exists" })
//     }
//     else {
//         const newCoach = new Coach({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//             phone: req.body.phone,

//         })
//         await newCourt.save()
//         return res.send({ "message": "Court successfully created" })
//     }
// })


// // Coach Schema
// const { Coach } = require("./models/CoachSchema");

// // Coach Registration
// app.post('/registerCoach', async (req, res) => {
//     try {
//         const existingCoach = await Coach.findOne({ email: req.body.email });
//         if (existingCoach) {
//             return res.send({ message: "Email already exists" });
//         }
//         const newCoach = new Coach({
//             name: req.body.name,
//             email: req.body.email,
//             password: req.body.password,
//             phone: req.body.phone,
//             // Other coach properties
//         });
//         await newCoach.save();
//         return res.send({ message: "Coach registered successfully" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });




// // Court Reservation Confirmation
// app.put('/confirmCourtReservation/:court_id', async (req, res) => {
//     try {
//         const courtRervation = await CourtRervation.findById(req.params.court_id);
//         if (!courtRervation) {
//             return res.status(404).send({ error: "Reservation not found" });
//         }
//         courtRervation.status = "Confirmed";
//         await courtRervation.save();
//         return res.send({ message: "Reservation confirmed successfully" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// // Court Reservation Cancellation
// app.delete('/cancelCourtReservation/:court_id', async (req, res) => {
//     try {
//         const CourtRervation = await CourtRervation.findById(req.params.court_Id);
//         if (!CourtRervation) {
//             return res.status(404).send({ error: "Reservation not found" });
//         }
//         await CourtRervation.remove();
//         return res.send({ message: "Reservation cancelled successfully" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });



// // Update User Profile
// app.put('/updateProfile/:userId', async (req, res) => {
//     try {
//         const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
//         if (!user) {
//             return res.status(404).send({ error: "User not found" });
//         }
//         return res.send({ message: "User profile updated successfully", user });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// // Delete User Profile
// app.delete('/deleteProfile/:userId', async (req, res) => {
//     try {
//         const user = await User.findByIdAndRemove(req.params.userId);
//         if (!user) {
//             return res.status(404).send({ error: "User not found" });
//         }
//         return res.send({ message: "User profile deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });



// // Search and Filter Courts
// app.get('/searchCourts', async (req, res) => {
//     try {
//         const { location, amenities } = req.query;
//         let query = {};
//         if (location) {
//             query.location = location;
//         }
//         if (amenities) {
//             query.amenities = { $in: amenities.split(',') };
//         }
//         const courts = await Court.find(query);
//         return res.send({ courts });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });


// // Admin Dashboard - Get All Users
// app.get('/admin/users', async (req, res) => {
//     try {
//         const users = await User.find();
//         return res.send({ users });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// // Admin Dashboard - Get All Coaches
// app.get('/admin/coaches', async (req, res) => {
//     try {
//         const coaches = await Coach.find();
//         return res.send({ coaches });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// // Admin Dashboard - Get All Courts
// app.get('/admin/courts', async (req, res) => {
//     try {
//         const courts = await Court.find();
//         return res.send({ courts });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// // Admin Dashboard - Get All Bookings
// app.get('/admin/CourtReservations', async (req, res) => {
//     try {
//         const courtRervation = await CourtRervation.find();
//         return res.send({ courtRervation });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });

// // Admin Dashboard - Get All Companies
// app.get('/admin/companies', async (req, res) => {
//     try {
//         const companies = await Company.find();
//         return res.send({ companies });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ error: "Internal Server Error" });
//     }
// });
