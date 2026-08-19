/**
 * Initial Realistic Seed Data for Student Expense Tracker (in Indian Rupees INR ₹)
 * Allows immediate out-of-the-box operation and visual testing without requiring MongoDB setup.
 */

// Helper to generate dynamic dates relative to current date
const daysAgo = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
};

const initialExpenses = [
  {
    _id: "exp_001",
    title: "Semester CS & Math Textbooks",
    amount: 1850,
    category: "Education",
    date: daysAgo(2),
    description: "Data Structures and Discrete Mathematics physical copies from campus bookstore.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: "exp_002",
    title: "Weekly Grocery Restock",
    amount: 1450,
    category: "Food",
    date: daysAgo(3),
    description: "Milk, eggs, oats, snacks, fresh fruits, vegetables, and pantry essentials.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: "exp_003",
    title: "Monthly Student Metro / Bus Pass",
    amount: 650,
    category: "Transport",
    date: daysAgo(5),
    description: "Unlimited monthly smart card transit pass for campus daily commute.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: "exp_004",
    title: "Campus Canteen Chai & Samosa",
    amount: 120,
    category: "Food",
    date: daysAgo(1),
    description: "Break snack session between lab experiments and lecture.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    _id: "exp_005",
    title: "Dorm Study Lamp & Organizer",
    amount: 799,
    category: "Shopping",
    date: daysAgo(7),
    description: "LED adjustable desk lamp and stationery organizer tray.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    _id: "exp_006",
    title: "Spotify Premium Student Plan",
    amount: 66,
    category: "Entertainment",
    date: daysAgo(10),
    description: "Monthly student discounted music streaming subscription.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: "exp_007",
    title: "Hostel Wi-Fi & Electricity Bill Share",
    amount: 500,
    category: "Bills",
    date: daysAgo(4),
    description: "Split monthly broadband connection bill with room partners.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    _id: "exp_008",
    title: "Weekend Study Group Dinner",
    amount: 680,
    category: "Food",
    date: daysAgo(6),
    description: "Dinner treat with project team members after hackathon submission.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    _id: "exp_009",
    title: "Weekend Movie Ticket",
    amount: 320,
    category: "Entertainment",
    date: daysAgo(8),
    description: "Student concession evening show ticket at nearby mall.",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    _id: "exp_010",
    title: "Lab Practical Files & Spiral Notebooks",
    amount: 280,
    category: "Education",
    date: daysAgo(12),
    description: "Set of 3 spiral ruled registers, chart paper, and gel pens.",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    _id: "exp_011",
    title: "Mobile 5G Unlimited Prepaid Plan",
    amount: 299,
    category: "Bills",
    date: daysAgo(14),
    description: "Monthly 28-day 2GB/day high speed mobile data recharge.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    _id: "exp_012",
    title: "Health & First Aid Vitamins",
    amount: 380,
    category: "Health",
    date: daysAgo(15),
    description: "Multivitamins, pain relief spray, and basic medical supplies.",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

module.exports = initialExpenses;
