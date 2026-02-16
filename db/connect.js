import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("Vérifier le fichier .env");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connecté');
    } catch (error) {
        console.error('Erreur de connexion à MongoDB :', error.message);
        process.exit(1);
    }       
};

export default connectDB;