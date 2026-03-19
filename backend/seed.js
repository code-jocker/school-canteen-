const mongoose = require('mongoose');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['superadmin', 'dean-admin', 'canteen'], default: 'canteen' },
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('✓ Cleared existing users');

    // Create users
    const users = [
      { name: 'Super Admin', email: 'admin@kageyo.rw', password: 'admin123', role: 'superadmin' },
      { name: 'Dean of Discipline', email: 'dean@kageyo.rw', password: 'dean123', role: 'dean-admin' },
      { name: 'Canteen Staff', email: 'canteen@kageyo.rw', password: 'canteen123', role: 'canteen' }
    ];

    for (const userData of users) {
      const user = await User.create(userData);
      console.log(`✓ Created user: ${user.email} (${user.role})`);
    }

    console.log('\n=== LOGIN CREDENTIALS ===');
    console.log('Super Admin: admin@kageyo.rw / admin123');
    console.log('Dean:        dean@kageyo.rw / dean123');
    console.log('Canteen:     canteen@kageyo.rw / canteen123');
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedUsers();
