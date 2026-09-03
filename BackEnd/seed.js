const mongoose = require('mongoose');
require('dotenv').config();

// Import model DIRECTLY (not with destructuring)
const User = require('./src/models/User');

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('✅ Cleared existing users');

    // Create admin user - password will be hashed by pre-save hook
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@bms.com',
      password: 'admin123',
      role: 'admin',
      employeeId: 1,
      status: 'active',
      permissions: ['all'],
    });
    console.log('✅ Admin user created:', admin.email);

    // Create super admin
    const superAdmin = await User.create({
      name: 'Super Admin',
      email: 'superadmin@bms.com',
      password: 'super123',
      role: 'super_admin',
      employeeId: 1,
      status: 'active',
      permissions: ['all'],
    });
    console.log('✅ Super Admin user created:', superAdmin.email);

    // Create lead manager
    const leadManager = await User.create({
      name: 'Sara Khan',
      email: 'sara@bms.com',
      password: 'sara123',
      role: 'lead_manager',
      employeeId: 2,
      status: 'active',
      permissions: ['manage_leads', 'view_tasks', 'mark_attendance'],
    });
    console.log('✅ Lead Manager user created:', leadManager.email);

    // Create employee
    const employee = await User.create({
      name: 'Usman Malik',
      email: 'usman@bms.com',
      password: 'usman123',
      role: 'employee',
      employeeId: 3,
      status: 'active',
      permissions: ['view_tasks', 'mark_attendance', 'view_attendance'],
    });
    console.log('✅ Employee user created:', employee.email);

    // Create another employee
    const employee2 = await User.create({
      name: 'Fatima Ali',
      email: 'fatima@bms.com',
      password: 'fatima123',
      role: 'employee',
      employeeId: 4,
      status: 'active',
      permissions: ['view_tasks', 'mark_attendance', 'view_attendance'],
    });
    console.log('✅ Employee user created:', employee2.email);

    console.log('\n🎉 Users seeded successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('Admin: admin@bms.com / admin123');
    console.log('Super Admin: superadmin@bms.com / super123');
    console.log('Lead Manager: sara@bms.com / sara123');
    console.log('Employee: usman@bms.com / usman123');
    console.log('Employee: fatima@bms.com / fatima123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

seedUsers();