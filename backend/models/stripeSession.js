import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
    id :{ type: String , required: true, unique: true},
    payment_status:{ type: String , required: true},
}
);

const Sessions = mongoose.model('StripeSessions' , sessionSchema);
export default Sessions;