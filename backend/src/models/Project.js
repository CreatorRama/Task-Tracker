import  mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a project name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user cannot have more than 4 projects
ProjectSchema.statics.checkProjectLimit = async function(userId) {
  const count = await this.countDocuments({ user: userId });
  console.log(count)
  
  console.log("oi");
  return count < 4;
};

export default  mongoose.model('Project', ProjectSchema);