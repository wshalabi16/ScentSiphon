import mongoose from 'mongoose';

export async function mongooseConnect() {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection.asPromise();
    } else {
        const uri = process.env.MONGODB_URI;

        try {
            await mongoose.connect(uri, {
                serverSelectionTimeoutMS: 5000,  // Fail fast if can't connect
                socketTimeoutMS: 45000,
            });
            console.log('✅ MongoDB connected successfully');
            return mongoose.connection;
        } catch (error) {
            console.error('❌ MongoDB connection error:', error.message);
            throw new Error(`Database connection failed: ${error.message}`);
        }
    }
}