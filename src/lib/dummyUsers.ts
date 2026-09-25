// Curated 245 Local Registered Users in Boisar
// Surnames and areas reflect Boisar, Palghar & Tarapur MIDC residents

export interface RegisteredUserRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  joinedDate: string;
  lastLogin?: string;
  status: string;
}

const FIRST_NAMES = [
  'Rahul', 'Pooja', 'Amit', 'Sneha', 'Deepak', 'Neha', 'Sachin', 'Priya', 
  'Vikram', 'Anjali', 'Rohan', 'Kavita', 'Suresh', 'Swati', 'Manoj', 'Ritu', 
  'Nilesh', 'Sunita', 'Ganesh', 'Meena', 'Ajay', 'Varsha', 'Kunal', 'Rashmi', 
  'Prashant', 'Deepali', 'Santosh', 'Divya', 'Mahesh', 'Monika', 'Rajesh', 'Shweta', 
  'Sunil', 'Komal', 'Abhishek', 'Jyoti', 'Chetan', 'Pallavi', 'Sanjay', 'Aarti',
  'Vishal', 'Preeti', 'Dinesh', 'Sonali', 'Ashok', 'Seema', 'Jitendra', 'Alka',
  'Prakash', 'Bhavna'
];

const SURNAMES = [
  'Patil', 'Gharat', 'Raut', 'Tare', 'More', 'Tamore', 'Sankhe', 'Vartak', 
  'Pagdhare', 'Dubey', 'Sharma', 'Mishra', 'Gupta', 'Yadav', 'Thakur', 'Singh', 
  'Chaudhary', 'Mehta', 'Shah', 'Jadhav', 'Kadam', 'Sawant', 'Bhoir', 'Pawar', 
  'Chavan', 'Koli', 'Mhatre', 'Deshmukh', 'Shinde', 'Bhandari', 'Dhangar', 'Gaikwad',
  'Kulkarni', 'Joshi', 'Tiwari', 'Pandey', 'Verma', 'Sonar', 'Sutar', 'Lohar'
];

const ROLES = [
  'Registered Citizen',
  'Registered Citizen',
  'Registered Citizen',
  'Verified Resident',
  'Local Resident',
  'Registered Citizen'
];

// Seeded pseudorandom generator for consistent deterministic outputs
function pseudoRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generate245DummyUsers(): RegisteredUserRecord[] {
  const users: RegisteredUserRecord[] = [];
  const baseTime = new Date('2026-09-20T10:00:00Z').getTime();

  for (let i = 1; i <= 245; i++) {
    const fIdx = Math.floor(pseudoRandom(i * 17) * FIRST_NAMES.length);
    const sIdx = Math.floor(pseudoRandom(i * 31) * SURNAMES.length);
    const firstName = FIRST_NAMES[fIdx];
    const lastName = SURNAMES[sIdx];
    const name = `${firstName} ${lastName}`;

    // Realistic Boisar Indian mobile numbers
    const prefix = ['9820', '9892', '9765', '9833', '9158', '9028', '8879', '8446', '7021', '9324'][i % 10];
    const suffixNum = 100000 + ((i * 3479 + 54321) % 900000);
    const phone = `${prefix}${suffixNum}`.slice(0, 10);

    const emailDomain = ['gmail.com', 'yahoo.com', 'outlook.com', 'gmail.com', 'rediffmail.com'][i % 5];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i % 99 || ''}@${emailDomain}`;

    // Joined date spread across the past 240 days
    const daysAgo = Math.floor(pseudoRandom(i * 43) * 240) + 1;
    const joinDateObj = new Date(baseTime - daysAgo * 24 * 60 * 60 * 1000);
    const joinedDate = joinDateObj.toISOString().split('T')[0];

    const role = ROLES[i % ROLES.length];

    users.push({
      id: 900000 + i,
      name,
      phone,
      email,
      role,
      joinedDate,
      lastLogin: new Date(baseTime - Math.floor(pseudoRandom(i * 19) * 15) * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Active'
    });
  }

  return users;
}

export const DUMMY_REGISTERED_USERS_245 = generate245DummyUsers();
