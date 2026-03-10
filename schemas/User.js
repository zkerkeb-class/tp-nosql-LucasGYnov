import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    favorites: [{ type: Number }] 
});

userSchema.pre('save', async function () { 
    if (!this.isModified('password')) return; 
    
    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw error;
    }
});

export default mongoose.model('User', userSchema);