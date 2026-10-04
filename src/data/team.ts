import saiPhoto from "@/assets/team/sai-charan-gupta.jpeg";
import tanojPhoto from "@/assets/team/pudi-tanoj.jpeg";
import mundlapatiVenkateshPhoto from "@/assets/team/mundlapati-venkatesh.jpeg";
import kranthikumarPhoto from "@/assets/team/kranthi-kumar.jpeg";
import saitejabandiPhoto from "@/assets/team/sai-teja-bandi.jpeg";
import tarakreddyPhoto from "@/assets/team/tarak-reddy.jpeg";
import karikalyanPhoto from "@/assets/team/kari-kalyan.jpeg";
import mindranasomubabuPhoto from "@/assets/team/mindrana-somubabu.jpeg";
import manyamtharunkumarPhoto from "@/assets/team/manyam-tharun-kumar.jpeg";
import majjimadhavigayathriPhoto from "@/assets/team/majji-madhavi-gayathri.jpeg";
import majjidivyaPhoto from "@/assets/team/majji-divya.jpeg";
import sravanisankarapuPhoto from "@/assets/team/sravani-sankarapu.jpeg";


export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo?: string;
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
    origin: "Guntur, Andhra Pradesh",
    shortBio:
      "Founder of DSC Society, committed to environmental protection and community development.",
    biography:
      "D. Sai Charan Gupta is the founding member of Dharitree Samrakshana Chaitanyam Society and a Research Scholar at Acharya Nagarjuna University. Having completed his Master's degrees in Social Work and Sociology, he possesses a strong understanding of social issues, community development, and grassroots engagement. His professional and social involvement includes working in tribal regions, particularly through initiatives associated with ITDA Paderu, where he gained valuable exposure to the challenges, livelihoods, and socio-economic realities of tribal communities. Having previously served as the ABVP State Joint Secretary, Andhra Pradesh, he brings extensive experience in student leadership, organizational activities, and social engagement. Driven by a deep commitment to environmental conservation and community welfare, he established DSC Society with a vision to promote environmental awareness and sustainable living.",
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
    shortBio:
      "Committed to environmental awareness and community participation.",
    biography:
      "RamaKanth is a member of Dharitree Samrakshana Chaitanyam Society, contributing to its commitment to environmental awareness and community participation. His detailed professional and academic profile is pending verification.",
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
    origin: "Anakapalle, Visakhapatnam",
    shortBio:
      "Research Scholar | Historian | Environmental Advocate | Youth & Community Activist",
    biography:
      "Pudi Tanoj hails from Anakapalle, Visakhapatnam, and is a Research Scholar at Acharya Nagarjuna University, pursuing research on the historical significance of Masulipatnam Port, maritime trade, industries, and sustainable use of renewable resources. He holds a postgraduate degree from the University of Hyderabad and completed his graduation at Andhra University, where he actively participated in NSS and student-led initiatives. With a keen interest in history, environmental conservation, wildlife protection, and sustainable development, he is passionate about connecting academic knowledge with community action. As a member of Dharitree Samrakshana Chaitanyam Society, he is committed to encouraging youth participation, promoting environmental awareness, supporting conservation initiatives, and contributing to broader social development. Through his academic experience and community engagement, he aspires to inspire young people to become responsible contributors to an inclusive, sustainable, and environmentally conscious society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "majji-divya",
    name: "Majji Divya",
    role: "Member",
    photo: majjidivyaPhoto,
    origin: "Anakapalle, Andhra Pradesh",
    shortBio:
      "Research Scholar | Environmental Enthusiast",
    biography:
      "Majji Divya, originally from Anakapalle, Visakhapatnam, is a Research Scholar at GITAM with a strong passion for environmental conservation, research, and community engagement. She completed her B.Sc. and M.Sc. from the Central Tribal University of Andhra Pradesh (CTUAP), where she developed a keen interest in nature, sustainability, and environmental responsibility. ThroughDharitree Samrakshana Chaitanyam Society, she actively works to promote environmental awareness, encourage sustainable practices, and inspire communities to protect and preserve our natural heritage for future generations.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "mundlapati-venkatesh",
    name: "Mundlapati Venkatesh",
    role: "Member",
    photo: mundlapatiVenkateshPhoto,
    origin: "Piduguralla, Guntur District, Andhra Pradesh",
    shortBio:
      "Engineer | Advocate | Farmer | Social Worker",
    biography:
      "Mundlapati Venkatesh hails from Piduguralla, Guntur District, Andhra Pradesh, and holds a B.Tech in Electrical and Electronics Engineering from JNTU Kakinada and an LL.B. from Adikavi Nannaya University. He currently practices as an Advocate at the Guntur Bar, with a strong commitment to justice and public service. Apart from his legal profession, he is actively involved in farming, social work, and content writing, reflecting his interest in agriculture, rural development, and community welfare. Through Dharitree Samrakshana Chaitanyam Society, he aspires to contribute to legal awareness, social empowerment, sustainable development, and community welfare, while encouraging individuals to participate in positive social change.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "kranthi-kumar",
    name: "V. Kranthi Kumar",
    role: "Member",
    photo: kranthikumarPhoto,
    origin: "Vijayawada, Andhra Pradesh",
    shortBio:
      "Ph.D. Research Scholar | Social Work Professional | Social Development Advocate",
    biography:
      "V. Kranthi Kumar is a Social Work professional and Ph.D. Research Scholar at Acharya Nagarjuna University, holding a Master of Social Work (MSW). With a strong interest in social research, inclusive education, rehabilitation, and community development, he is committed to addressing social challenges and improving the lives of vulnerable and marginalized communities. As a member of Dharitree Samrakshana Chaitanyam Society, he aspires to connect academic knowledge with practical social initiatives, promote equality and empowerment, and contribute towards building an inclusive, sustainable, and socially responsible society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "sai-teja-bandi",
    name: "Sai Teja Bandi",
    role: "Member",
    photo: saitejabandiPhoto,
    origin: "Annavaram, Andhra Pradesh",
    shortBio:
      "Ph.D. Research Scholar | Project Management | Data Analysis | Social Development",
    biography:
      "Sai Teja Bandi is a Research Scholar in Sociology and holds an Integrated M.A. in Sociology from Pondicherry University. With interests in project management, data analysis, and social development, he is committed to understanding community needs and promoting meaningful social change. Through Dharitree Samrakshana Chaitanyam Society, he contributes to project planning, community surveys, data analysis, and reporting to support effective social initiatives. He is passionate about community welfare, environmental conservation, sustainable practices, and inclusive development, aspiring to connect research with practical action for a better and more responsible society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "majji-madhavi-gayathri",
    name: "Majji Madhavi Gayathri",
    role: "Member",
    photo: majjimadhavigayathriPhoto,
    origin: "Anakapalle, Andhra Pradesh",
    shortBio:
      "Oceanographer | Subject Expert Manager | Environmental Advocate.",
    biography:
      "Majji Madhavi Gayathri, originally from Anakapalle, Visakhapatnam, holds an M.Sc. from IIT Bhubaneswar and a B.Sc. from the Central University of Andhra Pradesh (CUTAP). With a strong academic foundation in oceanography and environmental sciences, she currently serves as a Subject Expert Manager at GIS Vassal Labs, where she contributes her expertise to government projects related to oceanography and environmental applications.Passionate about environmental conservation and sustainable development, she works toward bridging scientific knowledge with meaningful community action. Through Dharitree Samrakshana Chaitanyam Society, she is committed to fostering environmental awareness, promoting sustainable practices, and inspiring communities to protect and preserve our oceans, ecosystems, and natural heritage for future generations.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },
  
  {
    id: "tarak-reddy",
    name: "Tarak Reddy",
    role: "Member",
    photo: tarakreddyPhoto,
    origin: "Guntur, Andhra Pradesh",
    shortBio:
      "Entrepreneur | Emerging Advocate | Social Development Enthusiast",
    biography:
      "Tarak Reddy hails from Guntur, Andhra Pradesh, and is an entrepreneur and emerging advocate with a strong interest in social development, community empowerment, and sustainable progress. Combining an entrepreneurial outlook with a growing understanding of the legal field, he believes that meaningful societal transformation requires innovation, inclusivity, and collective responsibility. As a member of Dharitree Samrakshana Chaitanyam Society, he is enthusiastic about contributing to initiatives spanning environmental conservation, healthcare awareness, youth empowerment, skill development, tribal welfare, and sustainable livelihoods. He aspires to utilize his entrepreneurial spirit and legal aspirations to support community-driven initiatives, encourage social participation, and contribute towards building an inclusive, empowered, and sustainable society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "budi-satyanarayana",
    name: "Budi Satyanarayana",
    role: "Member",
    origin: "Bobbili, Vizianagaram District, Andhra Pradesh",
    shortBio:
      "Young Entrepreneur | Environmental Enthusiast",
    biography:
      "Budi Satyanarayana hails from Bobbili, Vizianagaram District, Andhra Pradesh, and is a young entrepreneur driven by a strong passion for environmental conservation and social development. With an entrepreneurial mindset and a commitment to positive change, he believes that innovation, community participation, and responsible living are essential for building a sustainable future. Through his association with Dharitree Samrakshana Chaitanyam Society, he is committed to promoting environmental awareness, encouraging sustainable practices, and contributing to community-driven initiatives for a greener future.",
    interests: [
      "Environmental Conservation",
      "Entrepreneurship",
      "Community Development",
      "Sustainable Living",
    ],
  },

  {
    id: "guntaka-kushankara-reddy",
    name: "Guntaka Kushankara Reddy",
    role: "Member",
    origin: "Andhra Pradesh",
    shortBio:
      "Telugu Pandit | Environmental Enthusiast",
    biography:
      "Hailing from a village near the ecologically rich Nallamala forest, Guntaka Kushankara Reddy carries a deep appreciation for nature and its invaluable role in sustaining life. A Telugu Pandit by profession, he combines his love for language, cultural values, and social responsibility with a strong passion for environmental conservation. His connection to rural life and the natural surroundings of the Nallamala region has shaped his belief in living harmoniously with nature. Through Dharitree Samrakshana Chaitanyam Society, he is committed to promoting environmental awareness, encouraging sustainable practices, and inspiring communities to protect the natural heritage we must preserve for future generations.",
    interests: [
      "Environmental Conservation",
      "Telugu Language and Literature",
      "Cultural Values",
      "Sustainable Living",
      "Community Awareness",
    ],
  },

  {
    id: "kari-kalyan",
    name: "Kari Kalyan",
    role: "Member",
    photo: karikalyanPhoto,
    origin: "Srikakulam, Andhra Pradesh",
    shortBio:
      "Public Administration Professional | Social Contributor",
    biography:
      "Kari Kalyan holds a Master's degree in Public Administration and hails from Amavariputuka village, Srikakulam District, Andhra Pradesh. Currently serving in the Endowments Department, he has a keen interest in public administration, community welfare, and social responsibility. Beyond his professional commitments, he possesses a deep passion for environmental conservation and believes that protecting nature is fundamental to ensuring a sustainable future. As a member of Dharitree Samrakshana Chaitanyam Society, he is enthusiastic about promoting environmental awareness, encouraging responsible practices, and contributing to community-driven initiatives. Through his association with the society, he aspires to combine his administrative understanding with his commitment to environmental protection and inspire collective action towards a greener and more sustainable society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "mindrana-somubabu",
    name: "Mindrana Sombabu",
    role: "Member",
    photo: mindranasomubabuPhoto,
    origin: "Srikakulam, Andhra Pradesh",
    shortBio:
      "Ph.D. Research Scholar | Mathematician | Social Development Enthusiast",
    biography:
      "Mindrana Sombabu hails from Srikakulam District, Andhra Pradesh, and holds an M.Sc. in Mathematics. He is currently a Research Scholar in the Department of Mathematics at Acharya Nagarjuna University, Guntur, pursuing his Ph.D. With a strong academic foundation and an interest in knowledge-driven social progress, he believes that education, awareness, and community participation are essential for building a better society. As a member of Dharitree Samrakshana Chaitanyam Society, he is enthusiastic about contributing to initiatives in environmental conservation, healthcare awareness, youth empowerment, skill development, tribal welfare, and sustainable community development. Through his academic perspective and commitment to social responsibility, he aspires to encourage learning, collective action, and inclusive development for a more sustainable and empowered society.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

  {
    id: "manyam-tharun-kumar",
    name: "Manyam Tharun Kumar",
    role: "Member",
    photo: manyamtharunkumarPhoto,
    origin: "Mangalagiri, Andhra Pradesh",
    shortBio:
      "Law Student | Young Entrepreneur | Social Responsibility Advocate",
    biography:
      "Manyam Tharun Kumar is currently pursuing B.A., LL.B. (Hons.) and hails from Atmakur village, Mangalagiri Mandal, Guntur District, Andhra Pradesh. With a keen interest in law and its potential to bring meaningful social change, he believes that legal awareness and civic responsibility are essential for building an equitable society. Beyond academics, he holds a deep appreciation for nature and environmental conservation, recognizing that protecting the environment is a shared responsibility. Through his association with Dharitree Samrakshana Chaitanyam Society, he aspires to combine his legal knowledge with environmental consciousness, contribute to community welfare, and inspire sustainable practices for a greener and more responsible future.",
    interests: [
      "Environmental Conservation",
      "Community Development",
      "Sustainable Living",
      "Public Administration",
    ],
  },

    {
    id: "sravani-sankarapu",
    name: "Sravani Sankarapu",
    role: "Member",
    photo: sravanisankarapuPhoto,
    origin: "Andhra Pradesh",
    shortBio:
      "M.Sc. Anthropology | Research Professional | Environmental Volunteer",
    biography:
      "Sravani Sankarapu holds a Master’s degree in Anthropology and has experience in research and community-oriented projects. She is keen to work towards environmental conservation and social well-being, with a particular interest in sustainable living, waste management, nature protection, and creating awareness among communities. She believes that protecting the environment is a shared responsibility and that consistent, community-driven efforts can bring meaningful change. Through her association with Dharitree Samrakshana Chaitanyam Society, she hopes to learn, participate, and contribute towards building a cleaner, greener, and more sustainable future.",
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
    shortBio:
      "Contributing towards environmental protection and sustainable community initiatives.",
    biography:
      "Bharath is a member of Dharitree Samrakshana Chaitanyam Society, with an interest in environmental protection and sustainable community initiatives. His detailed academic and professional profile is pending verification.",
    interests: [
      "Environmental Protection",
      "Social Responsibility",
    ],
  },
];
