/*
  # Populate team members with actual data

  1. Team Members
    - Insert actual team member data with LinkedIn profiles
    - Set proper display order and active status
  2. Data
    - Real LinkedIn URLs provided
    - Consistent email format
    - Professional descriptions
*/

-- Clear existing data and insert actual team members
DELETE FROM team_members;

INSERT INTO team_members (name, role, specialization, description, image_url, github_url, linkedin_url, email, display_order, is_active) VALUES
(
  'Aditya Parulekar',
  'AI&DS Student',
  'TSEC, Mumbai',
  'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  '#',
  'https://www.linkedin.com/in/adityaparulekar/',
  'aditya.parulekar@student.tsec.in',
  1,
  true
),
(
  'Harsh Patel',
  'AI&DS Student',
  'TSEC, Mumbai',
  'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.',
  'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400',
  '#',
  'https://www.linkedin.com/in/harsh-patel79871/',
  'harsh.patel@student.tsec.in',
  2,
  true
),
(
  'Atharva Vichare',
  'AI&DS Student',
  'TSEC, Mumbai',
  'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.',
  'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
  '#',
  'https://www.linkedin.com/in/atharva-s-vichare/',
  'atharva.vichare@student.tsec.in',
  3,
  true
),
(
  'Sairaj Vinayagamoorthy',
  'AI&DS Student',
  'TSEC, Mumbai',
  'Final year AI&DS student at Thadomal Shahani Engineering College, Mumbai.',
  'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=400',
  '#',
  'https://www.linkedin.com/in/sairaj-vinayagamoorthy-34a86a2b5/',
  'sairaj.vinayagamoorthy@student.tsec.in',
  4,
  true
);