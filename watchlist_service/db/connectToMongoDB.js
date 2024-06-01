import mogoose from 'mongoose';



const connectToMongoDB = async () => {
    try {
        const connection = await mogoose.connect(process.env.DB_URL);
        console.log('MongoDB connected : ', connection.connection.host);
    }
    catch (error) {
        console.log('Error connecting to MongoDB : ', error);
    }
}

export default connectToMongoDB;