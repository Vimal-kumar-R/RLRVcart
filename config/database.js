// const mongoose = require('mongoose'); // Import mongoose
// const connectDatabase = () => {
//     const db = process.env.DB_DATABASE || 'mongodb://127.0.0.1:5000/RLRVcart';
    
//     console.log('DB_LOCAL_URI:', process.env.DB_DATABASE); // Debugging line
//     mongoose.connect(db, {   
//     }).then(con => {
//         console.log(`MongoDB is connected to the host: ${con.connection.host}`);
//     }).catch(error => {
//         console.error('Database connection error:', error);
//     });
// };
// module.exports = connectDatabase;

const mongoose = require('mongoose'); // Import mongoose
require('dotenv').config(); // Load environment variables

const connectDatabase = () => {
    const db = process.env.DB_DATABASE || 'mongodb://127.0.0.1:27017/RLRVcart';

    console.log('DB_LOCAL_URI:', db); // Debugging line
    mongoose
        .connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then((con) => {
            console.log(`MongoDB connected successfully to host: ${con.connection.host}`);
        })
        .catch((error) => {
            console.error('Database connection error:', error.message);
            process.exit(1); // Exit process with failure
        });

    // Event listeners for connection status
    mongoose.connection.on('error', (err) => {
        console.error(`Database error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
        console.log('Database connection lost');
    });
};

module.exports = connectDatabase;

