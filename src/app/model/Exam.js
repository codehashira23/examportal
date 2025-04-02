import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctOption: {
    type: Number,
    required: true,
    min: 0
  },
  marks: {
    type: Number,
    required: true,
    min: 1
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  instructions: String,
  rules: String,
  maxMarks: {
    type: Number,
    required: true,
    min: 1
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questionSetId: {
    type: String,
    required: true
  },
  scheduled: {
    type: Boolean,
    default: false,
    index: true
  },
  scheduledAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
examSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  console.log(`Saving exam ${this._id}, scheduled=${this.scheduled}`);
  next();
});

// Pre hook for updateOne and findOneAndUpdate to ensure updatedAt is set
examSchema.pre(['updateOne', 'findOneAndUpdate'], function(next) {
  console.log('Running pre-update hook');
  this.set({ updatedAt: new Date() });
  next();
});

// Static method to schedule or unschedule an exam
examSchema.statics.toggleSchedule = async function(examId, scheduled) {
  console.log(`Toggle schedule for exam ${examId} to ${scheduled}`);
  
  try {
    const updateData = {
      scheduled: scheduled,
      scheduledAt: scheduled ? new Date() : null,
      updatedAt: new Date()
    };
    
    console.log('Update data:', updateData);
    
    // Direct database operation to debug issues
    const result = await this.collection.updateOne(
      { _id: new mongoose.Types.ObjectId(examId) },
      { $set: updateData }
    );
    
    console.log('Update result from direct collection call:', result);
    
    // Fetch and return the updated exam
    if (result.matchedCount > 0) {
      const exam = await this.findById(examId);
      console.log(`After update, exam ${examId} scheduled=${exam.scheduled}`);
      return exam;
    }
    
    return null;
  } catch (error) {
    console.error('Error in toggleSchedule:', error);
    throw error;
  }
};

// Ensure MongoDB has the updated schema
mongoose.models = {};

const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

export default Exam; 