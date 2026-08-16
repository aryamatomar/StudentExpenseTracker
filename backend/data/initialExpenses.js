/**
 * Initial Realistic Seed Data for Student Expense Tracker
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
    amount: 145.50,
    category: "Education",
    date: daysAgo(2),
    description: "Data Structures and Linear Algebra physical copies from university bookstore.",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    _id: "exp_002",
    title: "Weekly Grocery Restock",
    amount: 68.20,
    category: "Food",
    date: daysAgo(3),
    description: "Oat milk, eggs, pasta, fresh fruits, vegetables, and chicken breast.",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    _id: "exp_003",
    title: "Monthly Student Metro Pass",
    amount: 45.00,
    category: "Transport",
    date: daysAgo(5),
    description: "Unlimited subway and bus transit pass for campus commuting.",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    _id: "exp_004",
    title: "Campus Cafe Latte & Bagel",
    amount: 7.80,
    category: "Food",
    date: daysAgo(1),
    description: "Morning breakfast study session before 9 AM physics lecture.",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    _id: "exp_005",
    title: "Dorm Room Desk Lamp & Organizer",
    amount: 32.99,
    category: "Shopping",
    date: daysAgo(7),
    description: "LED adjustable lamp with USB charging port and pencil organizer.",
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    _id: "exp_006",
    title: "Spotify Student Subscription",
    amount: 5.99,
    category: "Entertainment",
    date: daysAgo(10),
    description: "Monthly discounted student bundle with Hulu included.",
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    _id: "exp_007",
    title: "Dorm Laundry Cards & Detergent",
    amount: 18.50,
    category: "Other",
    date: daysAgo(4),
    description: "Laundry detergent pods and 10 washer/dryer cycles refill.",
    createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 86400000).toISOString()
  },
  {
    _id: "exp_008",
    title: "Late Night Pizza Study Group",
    amount: 24.00,
    category: "Food",
    date: daysAgo(6),
    description: "Split large pizza with hackathon project teammates.",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 86400000).toISOString()
  },
  {
    _id: "exp_009",
    title: "Weekend Movie IMAX Ticket",
    amount: 16.50,
    category: "Entertainment",
    date: daysAgo(8),
    description: "Student discount evening ticket for new sci-fi release.",
    createdAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 86400000).toISOString()
  },
  {
    _id: "exp_010",
    title: "Engineering Graphing Notebooks & Pens",
    amount: 14.25,
    category: "Education",
    date: daysAgo(12),
    description: "Pack of 3 grid spiral notebooks and fine-point gel pens.",
    createdAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 86400000).toISOString()
  },
  {
    _id: "exp_011",
    title: "Mobile Phone Prepaid Student Plan",
    amount: 25.00,
    category: "Other",
    date: daysAgo(14),
    description: "Monthly 15GB high-speed 5G data plan.",
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 14 * 86400000).toISOString()
  },
  {
    _id: "exp_012",
    title: "Uber Ride from Train Station",
    amount: 19.80,
    category: "Transport",
    date: daysAgo(15),
    description: "Late arrival ride back to campus residence hall.",
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 86400000).toISOString()
  }
];

module.exports = initialExpenses;
