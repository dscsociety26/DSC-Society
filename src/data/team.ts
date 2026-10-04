```tsx
import saiPhoto from "@/assets/team/sai-charan-gupta.jpeg";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
  qualification: string;
  currentWork: string;
  origin?: string;
  shortBio: string;
  biography: string;
  interests: string[];
}

export const team: TeamMember[] = [
  {
    id: "sai-charan-gupta",
    name: "D. Sai Charan Gupta",
    role: "Founder & President",
    photo: saiPhoto,
    qualification: "Add verified educational qualification",
    currentWork: "Add current professional position",
    origin: "Andhra Pradesh",
    shortBio:
      "Founder of DSC Society, committed to environmental protection and community development.",
    biography:
      "D. Sai Charan Gupta is the Founder and President of Dharitree Samrakshana Chaitanyam Society. Driven by a commitment to environmental conservation and social responsibility, he works towards building awareness about plastic reduction, sustainable living, and community participation. Through DSC Society, he aims to encourage youth leadership and transform environmental awareness into practical grassroots initiatives.",
    interests: [
      "Environmental Protection",
      "Youth Leadership",
      "Community Development",
      "Sustainability",
    ],
  },
  {
    id: "kari-kalyan",
    name: "Kari Kalyan",
    role: "Member",
    qualification: "Master's Degree in Public Administration",
    currentWork: "Currently working in the Endowments Department",
    origin: "Amavariputuka village, Srikakulam district",
    shortBio:
      "Public administration postgraduate with a strong passion for environmental conservation.",
    biography:
      "Kari Kalyan holds a Master's degree in Public Administration and hails from Amavariputuka village in Srikakulam district, Andhra Pradesh. His passion for environmental protection and community welfare inspired him to become a member of Dharitree Samrakshana Chaitanyam Society. Through his association with DSC, he aims to contribute to environmental awareness, sustainable practices, and grassroots community initiatives.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },
  {
    id: "ramakanth",
    name: "RamaKanth",
    role: "Member",
    qualification: "Add educational qualification",
    currentWork: "Add current professional position",
    shortBio:
      "Committed to environmental awareness and community participation.",
    biography:
      "Add the verified detailed biography of RamaKanth here.",
    interests: [
      "Environmental Awareness",
      "Community Service",
    ],
  },
  {
    id: "bharath",
    name: "Bharath",
    role: "Member",
    qualification: "Add educational qualification",
    currentWork: "Add current professional position",
    shortBio:
      "Contributing towards environmental protection and sustainable community initiatives.",
    biography:
      "Add the verified detailed biography of Bharath here.",
    interests: [
      "Environmental Protection",
      "Social Responsibility",
    ],
  },
];
```
