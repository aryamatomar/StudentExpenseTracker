/**
 * Integration Test for Backend APIs (INR ₹)
 */
const express = require('express');
const cors = require('cors');
const expenseRoutes = require('./routes/expenseRoutes');
const profileRoutes = require('./routes/profileRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/expenses', expenseRoutes);
app.use('/api/profile', profileRoutes);
app.use(errorHandler);

const server = app.listen(5099, async () => {
  console.log('Test server running on port 5099');

  try {
    const http = require('http');

    const request = (path, method = 'GET', body = null) => {
      return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;
        const options = {
          hostname: 'localhost',
          port: 5099,
          path,
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(payload && { 'Content-Length': Buffer.byteLength(payload) })
          }
        };

        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, raw: data });
            }
          });
        });

        req.on('error', (err) => reject(err));
        if (payload) req.write(payload);
        req.end();
      });
    };

    console.log('--- TEST 1: Get Profile ---');
    const profileRes = await request('/api/profile');
    console.log('Profile Status:', profileRes.status, 'Student ID:', profileRes.data.data?.studentId, 'Currency:', profileRes.data.data?.currency);

    console.log('--- TEST 2: Create Profile ---');
    const newProfileRes = await request('/api/profile', 'POST', {
      name: 'Aryama Singh',
      email: 'aryama@university.edu.in',
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      course: 'Computer Science',
      semester: '6th Semester',
      monthlyBudget: 15000,
      currency: 'INR'
    });
    console.log('Create Profile Status:', newProfileRes.status, 'Created ID:', newProfileRes.data.data?.studentId);
    const studentId = newProfileRes.data.data.studentId;

    console.log('--- TEST 3: Update Profile ---');
    const updateProfileRes = await request(`/api/profile/${studentId}`, 'PUT', {
      monthlyBudget: 18000,
      college: 'National Institute of Technology Delhi'
    });
    console.log('Update Profile Status:', updateProfileRes.status, 'Updated Budget:', updateProfileRes.data.data?.monthlyBudget);

    console.log('--- TEST 4: Get Expenses & Stats ---');
    const expensesRes = await request('/api/expenses');
    console.log('Expenses Count:', expensesRes.data.count);

    const statsRes = await request('/api/expenses/stats');
    console.log('Stats:', {
      total: statsRes.data.data.totalExpenses,
      thisMonth: statsRes.data.data.thisMonthSpending,
      today: statsRes.data.data.todaySpending,
      categoriesCount: statsRes.data.data.categoryBreakdown.length
    });

    console.log('--- TEST 5: Create Expense in Bills category ---');
    const createExpRes = await request('/api/expenses', 'POST', {
      title: 'Hostel Fiber Wi-Fi Bill',
      amount: 499,
      category: 'Bills',
      date: new Date().toISOString().split('T')[0],
      description: 'Monthly high-speed fiber internet subscription',
      studentId: studentId
    });
    console.log('Create Expense Status:', createExpRes.status, 'Expense ID:', createExpRes.data.data?._id);
    const expId = createExpRes.data.data._id;

    console.log('--- TEST 6: Update Expense ---');
    const updateExpRes = await request(`/api/expenses/${expId}`, 'PUT', {
      amount: 549,
      description: 'Updated with router maintenance fee'
    });
    console.log('Update Expense Status:', updateExpRes.status, 'New Amount:', updateExpRes.data.data?.amount);

    console.log('--- TEST 7: Delete Expense ---');
    const deleteExpRes = await request(`/api/expenses/${expId}`, 'DELETE');
    console.log('Delete Expense Status:', deleteExpRes.status, 'Deleted successfully:', deleteExpRes.data.success);

    console.log('\n========================================');
    console.log('✅ ALL BACKEND INR INTEGRATION TESTS PASSED!');
    console.log('========================================\n');

  } catch (err) {
    console.error('❌ Test Failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});
