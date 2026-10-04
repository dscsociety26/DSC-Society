import saiPhoto from "@/assets/team/sai-charan-gupta.jpeg";
import tanojPhoto from "@/assets/team/pudi-tanoj.jpeg";


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
    qualification: "Research Scholar",
    currentWork: "Social Work Professional | Research Scholar | Community Development Advocate",
    origin: "Guntur,Andhra Pradesh",
    shortBio:
      "Founder of DSC Society, committed to environmental protection and community development.",
    biography:
      "D. Sai Charan Gupta is the Founding Member of Dharitree Samrakshana Chaitanyam Society and a Research Scholar at Acharya Nagarjuna University. Having completed his Master’s degrees in Social Work and Sociology, he possesses a strong understanding of social issues, community development, and grassroots engagement. His professional and social involvement includes working in tribal regions, particularly through initiatives associated with ITDA Paderu, where he gained valuable exposure to the challenges, livelihoods, and socio-economic realities of tribal communities. Having previously served as the ABVP State Joint Secretary, Andhra Pradesh, he brings extensive experience in student leadership, organizational activities, and social engagement. Driven by a deep commitment to environmental conservation and community welfare, he established DSC Society with a vision to promote environmental awareness, sustainable living.",
    interests: [
      "Environmental Protection",
      "Youth Leadership",
      "Community Development",
      "Sustainability",
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
    id: "pudi-tanoj",
    name: "Pudi Tanoj",
    role: "Member",
    photo: tanojPhoto,
    qualification: "Research Scholar",
    currentWork: "Scholar",
    origin: "Amavariputuka village, Srikakulam district",
    shortBio:
      "Research Scholar | Historian | Environmental Advocate | Youth & Community Activist",
    biography:
      "Pudi Tanoj hails from Anakapalle, Visakhapatnam, and is a Research Scholar at Acharya Nagarjuna University, pursuing research on the historical significance of Masulipatnam Port, maritime trade, industries, and sustainable use of renewable resources. He holds a postgraduate degree from the University of Hyderabad and completed his graduation at Andhra University, where he actively participated in NSS and student-led initiatives. With a keen interest in history, environmental conservation, wildlife protection, and sustainable development, he is passionate about connecting academic knowledge with community action. As a member of Dharitree Samrakshana Chaitanya Society (DSC Society), he is committed to encouraging youth participation, promoting environmental awareness, supporting conservation initiatives, and contributing to broader social development. Through his academic experience and community engagement, he aspires to inspire young people to become responsible contributors to an inclusive, sustainable, and environmentally conscious society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
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
